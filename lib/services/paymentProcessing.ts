import Booking, { BookingBillingMetadata, BookingStatus } from '@/lib/db/entities/Booking';
import Payment, { PaymentBillingType, PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import Invoice from '@/lib/db/entities/Invoice';
import { isRecurringBilling } from '@/lib/billing/config';
import { generateInvoice } from '@/lib/services/invoicing';
import { createAdminClient } from '@/lib/supabase/admin';
import { withPgTransaction } from '@/lib/db/transaction';
import { BOOKING_RELATION_SELECT, mapBooking, mapPayment } from '@/lib/db/mappers';
import type { PoolClient } from 'pg';

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

  const bookingId = payment.booking?.id ?? payment.bookingId;
  if (!bookingId) {
    return [];
  }

  return [
    {
      bookingId,
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
      pendingPaymentReference: undefined,
      pendingPaymentInitializedAt: undefined,
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
      pendingPaymentReference: undefined,
      pendingPaymentInitializedAt: undefined,
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

  const existingPaystack = currentMetadata.paystack ?? {};
  const payloadData = providerData?.data ?? {};
  const customer = payloadData.customer ?? {};
  const authorization = payloadData.authorization ?? {};
  const subscriptionCode = normalizeIdentifier(
    payloadData.subscription_code
    ?? payloadData.subscription?.subscription_code
    ?? existingPaystack.subscriptionCode
  );

  return {
    ...currentMetadata,
    billingType: PaymentBillingType.RECURRING as BookingBillingMetadata['billingType'],
    billingInterval: 'monthly' as const,
    recurringDurationMonths: payment.metadata?.recurringDurationMonths ?? currentMetadata.recurringDurationMonths,
    recurringEndDate: currentMetadata.recurringEndDate ?? null,
    pendingPaymentReference: undefined,
    pendingPaymentInitializedAt: undefined,
    paystack: {
      ...existingPaystack,
      allocationAmount,
      authorizationCode: authorization.authorization_code ?? existingPaystack.authorizationCode,
      authorizationSignature: authorization.signature ?? existingPaystack.authorizationSignature,
      authorizationReusable: authorization.reusable ?? existingPaystack.authorizationReusable,
      customerCode: customer.customer_code ?? existingPaystack.customerCode,
      customerEmail: customer.email ?? existingPaystack.customerEmail,
      lastSuccessfulReference: payment.providerReference,
      planCode: payment.metadata?.paystackPlanCode ?? existingPaystack.planCode,
      planName: payment.metadata?.paystackPlanName ?? existingPaystack.planName,
      subscriptionCode: subscriptionCode ?? undefined,
      invoiceLimit: payment.metadata?.recurringDurationMonths ?? existingPaystack.invoiceLimit,
    },
  } satisfies BookingBillingMetadata;
}

async function loadBookingsByIds(client: PoolClient, bookingIds: string[]) {
  if (bookingIds.length === 0) {
    return [];
  }

  const { rows } = await client.query(
    `SELECT row_to_json(booking) AS booking
     FROM (
       SELECT b.*,
         (SELECT row_to_json(u) FROM users u WHERE u.id = b."userId") AS "user",
         (SELECT row_to_json(s) FROM sites s WHERE s.id = b."siteId") AS site,
         (SELECT row_to_json(ut) FROM unit_types ut WHERE ut.id = b."unitTypeId") AS unit_type,
         (SELECT row_to_json(su) FROM storage_units su WHERE su.id = b."storageUnitId") AS storage_unit
       FROM bookings b
       WHERE b.id = ANY($1::uuid[])
     ) booking`,
    [bookingIds]
  );

  return rows.map((row: { booking: Record<string, unknown> }) => mapBooking(row.booking as Parameters<typeof mapBooking>[0]));
}

export async function applySuccessfulPayment({
  payment,
  providerData,
}: {
  payment: Payment;
  providerData?: ProviderPayloadShape;
}) {
  const bookingAllocations = getPaymentAllocations(payment);
  const bookingIds = bookingAllocations.map((allocation) => allocation.bookingId);
  const supabase = createAdminClient();

  return withPgTransaction(async (client) => {
    const bookings = await loadBookingsByIds(client, bookingIds);
    const bookingsById = new Map(bookings.map((booking) => [booking.id, booking]));
    const updatedBookings: Array<{ booking: Booking; invoice: Invoice }> = [];

    const paymentMetadata = {
      ...payment.metadata,
      verification: providerData ?? payment.metadata?.verification,
    };

    await client.query(
      `UPDATE payments
       SET status = $1, metadata = $2::jsonb, "updatedAt" = now()
       WHERE id = $3`,
      [PaymentStatus.SUCCESS, JSON.stringify(paymentMetadata), payment.id]
    );

    for (const allocation of bookingAllocations) {
      const booking = bookingsById.get(allocation.bookingId);
      if (!booking || booking.status === BookingStatus.CANCELLED) {
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

      await client.query(
        `UPDATE bookings
         SET status = $1,
             "amountPaid" = $2,
             "billingMetadata" = $3::jsonb,
             "updatedAt" = now()
         WHERE id = $4`,
        [
          booking.status,
          booking.amountPaid,
          JSON.stringify(booking.billingMetadata),
          booking.id,
        ]
      );

      const invoice = await generateInvoice(supabase, payment, {
        bookingId: booking.id,
        amount: allocation.amount,
      });
      updatedBookings.push({ booking, invoice });
    }

    return updatedBookings;
  });
}

export async function fetchPaymentWithRelations(paymentId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*, booking:bookings(*), user:users(*)')
    .eq('id', paymentId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPayment(data) : null;
}

export async function fetchPaymentByReference(providerReference: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*, booking:bookings(*), user:users(*)')
    .eq('providerReference', providerReference)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPayment(data) : null;
}
