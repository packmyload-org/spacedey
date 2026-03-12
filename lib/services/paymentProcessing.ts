import { In, type DataSource } from 'typeorm';
import Booking, { BookingBillingMetadata, BookingStatus } from '@/lib/db/entities/Booking';
import Payment, { PaymentBillingType, PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { isRecurringBilling } from '@/lib/billing/config';
import { generateInvoice } from '@/lib/services/invoicing';

interface ProviderPayloadShape {
  data?: {
    authorization?: {
      authorization_code?: string;
      reusable?: boolean;
      signature?: string;
    };
    customer?: {
      customer_code?: string;
      email?: string;
    };
    subscription?: {
      subscription_code?: string;
    };
    payment_plan?: number | string;
    payment_plan_id?: number | string;
    payment_plan_name?: string;
    flw_plan?: number | string;
    subscription_id?: number | string;
    tx_ref?: string;
    subscription_code?: string;
    [key: string]: unknown;
  };
}

function normalizeIdentifier(value: number | string | null | undefined) {
  if (value === null || typeof value === 'undefined') {
    return null;
  }

  return String(value);
}

export function getPaymentAllocations(payment: Payment) {
  const storedAllocations = payment.metadata?.bookingAllocations;

  if (Array.isArray(storedAllocations) && storedAllocations.length > 0) {
    return storedAllocations
      .filter((allocation): allocation is { bookingId: string; amount: number } => (
        Boolean(allocation?.bookingId) && Number(allocation.amount) > 0
      ))
      .map((allocation) => ({
        bookingId: allocation.bookingId,
        amount: Number(allocation.amount),
      }));
  }

  return [
    {
      bookingId: payment.booking.id,
      amount: Number(payment.amount),
    },
  ];
}

function mergeRecurringBillingMetadata({
  booking,
  payment,
  providerData,
  allocationAmount,
}: {
  booking: Booking;
  payment: Payment;
  providerData?: ProviderPayloadShape;
  allocationAmount: number;
}) {
  const currentMetadata = (booking.billingMetadata ?? {}) as BookingBillingMetadata;
  const recurringBilling = isRecurringBilling({
    billingType: payment.metadata?.billingType,
    legacyPaymentMode: payment.metadata?.paymentMode,
    provider: payment.provider,
  });

  if (!recurringBilling) {
    return {
      ...currentMetadata,
      billingType: (payment.metadata?.billingType ?? currentMetadata.billingType ?? PaymentBillingType.ONE_TIME) as BookingBillingMetadata['billingType'],
      billingInterval: 'monthly' as const,
      recurringDurationMonths: payment.metadata?.recurringDurationMonths ?? currentMetadata.recurringDurationMonths,
      recurringEndDate: currentMetadata.recurringEndDate ?? null,
    } satisfies BookingBillingMetadata;
  }

  if (payment.provider === PaymentProvider.FLUTTERWAVE) {
    const existingFlutterwave = currentMetadata.flutterwave ?? {};
    const payloadData = providerData?.data ?? {};
    const customer = payloadData.customer ?? {};
    const paymentPlanId = normalizeIdentifier(
      payloadData.payment_plan
      ?? payloadData.payment_plan_id
      ?? payloadData.flw_plan
      ?? payment.metadata?.flutterwavePaymentPlanId
      ?? existingFlutterwave.paymentPlanId
    );
    const subscriptionId = normalizeIdentifier(payloadData.subscription_id ?? existingFlutterwave.subscriptionId);

    return {
      ...currentMetadata,
      billingType: PaymentBillingType.RECURRING as BookingBillingMetadata['billingType'],
      billingInterval: 'monthly' as const,
      recurringDurationMonths: payment.metadata?.recurringDurationMonths ?? currentMetadata.recurringDurationMonths,
      recurringEndDate: currentMetadata.recurringEndDate ?? null,
      flutterwave: {
        ...existingFlutterwave,
        allocationAmount,
        customerEmail: customer.email?.toLowerCase() ?? existingFlutterwave.customerEmail,
        lastSuccessfulReference: payloadData.tx_ref ?? payment.providerReference,
        paymentPlanId: paymentPlanId ?? undefined,
        paymentPlanName: payment.metadata?.flutterwavePaymentPlanName ?? payloadData.payment_plan_name ?? existingFlutterwave.paymentPlanName,
        subscriptionId: subscriptionId ?? undefined,
      },
    } satisfies BookingBillingMetadata;
  }

  if (payment.provider !== PaymentProvider.PAYSTACK) {
    return {
      ...currentMetadata,
      billingType: PaymentBillingType.RECURRING as BookingBillingMetadata['billingType'],
      billingInterval: 'monthly' as const,
      recurringDurationMonths: payment.metadata?.recurringDurationMonths ?? currentMetadata.recurringDurationMonths,
      recurringEndDate: currentMetadata.recurringEndDate ?? null,
    } satisfies BookingBillingMetadata;
  }

  const existingPaystack = currentMetadata.paystack ?? {};
  const payloadData = providerData?.data ?? {};
  const authorization = payloadData.authorization ?? {};
  const customer = payloadData.customer ?? {};
  const subscriptionCode = payloadData.subscription?.subscription_code
    || payloadData.subscription_code
    || existingPaystack.subscriptionCode;

  return {
    ...currentMetadata,
    billingType: PaymentBillingType.RECURRING as BookingBillingMetadata['billingType'],
    billingInterval: 'monthly' as const,
    recurringDurationMonths: payment.metadata?.recurringDurationMonths ?? currentMetadata.recurringDurationMonths,
    recurringEndDate: currentMetadata.recurringEndDate ?? null,
    paystack: {
      ...existingPaystack,
      allocationAmount,
      authorizationCode: authorization.authorization_code ?? existingPaystack.authorizationCode,
      authorizationReusable: authorization.reusable ?? existingPaystack.authorizationReusable,
      authorizationSignature: authorization.signature ?? existingPaystack.authorizationSignature,
      customerCode: customer.customer_code ?? existingPaystack.customerCode,
      customerEmail: customer.email ?? existingPaystack.customerEmail,
      lastSuccessfulReference: payment.providerReference,
      planCode: payment.metadata?.paystackPlanCode ?? existingPaystack.planCode,
      planName: payment.metadata?.paystackPlanName ?? existingPaystack.planName,
      subscriptionCode,
      invoiceLimit: payment.metadata?.recurringDurationMonths ?? existingPaystack.invoiceLimit,
    },
  } satisfies BookingBillingMetadata;
}

export async function applySuccessfulPayment({
  dataSource,
  payment,
  providerData,
}: {
  dataSource: DataSource;
  payment: Payment;
  providerData?: ProviderPayloadShape;
}) {
  const bookingRepo = dataSource.getRepository(Booking);
  const paymentRepo = dataSource.getRepository(Payment);
  const bookingAllocations = getPaymentAllocations(payment);
  const bookingIds = bookingAllocations.map((allocation) => allocation.bookingId);
  const bookings = await bookingRepo.find({
    where: { id: In(bookingIds) },
    relations: ['site', 'unitType', 'user'],
  });
  const bookingsById = new Map(bookings.map((booking) => [booking.id, booking]));
  const updatedBookings: Booking[] = [];

  payment.status = PaymentStatus.SUCCESS;
  payment.metadata = { ...payment.metadata, verification: providerData ?? payment.metadata?.verification };

  for (const allocation of bookingAllocations) {
    const booking = bookingsById.get(allocation.bookingId);
    if (!booking) {
      continue;
    }

    booking.amountPaid = Number(booking.amountPaid) + Number(allocation.amount);

    const activationThreshold = Number(booking.totalAmount);
    if (booking.amountPaid >= activationThreshold) {
      booking.status = BookingStatus.ACTIVE;
    } else if (booking.amountPaid > 0) {
      booking.status = BookingStatus.PARTIAL;
    }

    booking.billingMetadata = mergeRecurringBillingMetadata({
      booking,
      payment,
      providerData,
      allocationAmount: Number(allocation.amount),
    });

    await bookingRepo.save(booking);
    await generateInvoice(dataSource, payment, {
      bookingId: booking.id,
      amount: allocation.amount,
    });
    updatedBookings.push(booking);
  }

  await paymentRepo.save(payment);

  return updatedBookings;
}
