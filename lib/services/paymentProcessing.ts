import { In, type DataSource } from 'typeorm';
import Booking, { BookingBillingMetadata, BookingStatus } from '@/lib/db/entities/Booking';
import Payment, { PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
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
    subscription_code?: string;
    [key: string]: unknown;
  };
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

function mergePaystackRecurringMetadata({
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
  if (payment.provider !== PaymentProvider.PAYSTACK || payment.metadata?.paymentMode !== 'monthly') {
    return booking.billingMetadata;
  }

  const currentMetadata = (booking.billingMetadata ?? {}) as BookingBillingMetadata;
  const existingPaystack = currentMetadata.paystack ?? {};
  const payloadData = providerData?.data ?? {};
  const authorization = payloadData.authorization ?? {};
  const customer = payloadData.customer ?? {};
  const subscriptionCode = payloadData.subscription?.subscription_code
    || payloadData.subscription_code
    || existingPaystack.subscriptionCode;

  return {
    ...currentMetadata,
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

    booking.billingMetadata = mergePaystackRecurringMetadata({
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
