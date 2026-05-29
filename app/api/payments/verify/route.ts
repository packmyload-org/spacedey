import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { BookingStatus } from '@/lib/db/entities/Booking';
import { PaymentBillingType, PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { syncUnitTypeAvailability } from '@/lib/db/storageUnits';
import { withPgTransaction } from '@/lib/db/transaction';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import {
  applySuccessfulPayment,
  fetchPaymentByReference,
  getPaymentAllocations,
} from '@/lib/services/paymentProcessing';
import {
  processEmailNotificationsByIds,
  queueOrderConfirmationNotifications,
} from '@/lib/services/emailNotifications';
import { BOOKING_RELATION_SELECT, mapBooking } from '@/lib/db/mappers';
import type { PoolClient } from 'pg';

async function releaseFailedPendingBookings(payment: Awaited<ReturnType<typeof fetchPaymentByReference>>) {
  if (!payment) {
    return;
  }

  const bookingAllocations = getPaymentAllocations(payment);
  const bookingIds = bookingAllocations.map((allocation) => allocation.bookingId);

  if (bookingIds.length === 0) {
    return;
  }

  await withPgTransaction(async (client: PoolClient) => {
    const { rows } = await client.query(
      `SELECT row_to_json(booking) AS booking
       FROM (
         SELECT b.*,
           (SELECT row_to_json(su) FROM storage_units su WHERE su.id = b."storageUnitId") AS storage_unit,
           (SELECT row_to_json(ut) FROM unit_types ut WHERE ut.id = b."unitTypeId") AS unit_type
         FROM bookings b
         WHERE b.id = ANY($1::uuid[])
       ) booking`,
      [bookingIds]
    );

    for (const row of rows) {
      const booking = mapBooking(row.booking);
      const ownsCurrentHold = booking.billingMetadata?.pendingPaymentReference === payment.providerReference;
      if (!ownsCurrentHold || booking.status !== BookingStatus.PENDING || Number(booking.amountPaid) > 0 || !booking.storageUnit) {
        continue;
      }

      if (booking.storageUnit.id) {
        await client.query(
          `UPDATE storage_units SET status = $1, "updatedAt" = now() WHERE id = $2 AND status = $3`,
          [StorageUnitStatus.AVAILABLE, booking.storageUnit.id, StorageUnitStatus.RESERVED]
        );
      }

      await client.query(
        `UPDATE bookings
         SET status = $1,
             "billingMetadata" = $2::jsonb,
             "updatedAt" = now()
         WHERE id = $3`,
        [
          BookingStatus.CANCELLED,
          JSON.stringify({
            ...(booking.billingMetadata ?? {}),
            pendingPaymentReference: undefined,
            pendingPaymentInitializedAt: undefined,
          }),
          booking.id,
        ]
      );
    }
  });

  const supabase = createAdminClient();
  const syncedUnitTypeIds = new Set<string>();

  for (const bookingId of bookingIds) {
    const { data: bookingRow } = await supabase
      .from('bookings')
      .select('unitTypeId')
      .eq('id', bookingId)
      .maybeSingle();

    const unitTypeId = bookingRow?.unitTypeId;
    if (unitTypeId && !syncedUnitTypeIds.has(unitTypeId)) {
      await syncUnitTypeAvailability(unitTypeId);
      syncedUnitTypeIds.add(unitTypeId);
    }
  }
}

export async function POST(req: Request) {
  try {
    const appUrl = new URL(req.url).origin;
    const { reference, transactionId } = await req.json();
    const payment = await fetchPaymentByReference(reference);

    if (!payment) {
      return NextResponse.json({ ok: false, message: 'Payment record not found' }, { status: 404 });
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      const recurringEnabled = payment.metadata?.billingType === PaymentBillingType.RECURRING
        || payment.metadata?.paymentMode === 'monthly';
      const billingType = recurringEnabled ? PaymentBillingType.RECURRING : (payment.metadata?.billingType ?? PaymentBillingType.ONE_TIME);
      return NextResponse.json({
        ok: true,
        message: 'Payment already verified',
        checkoutSource: payment.metadata?.checkoutSource ?? 'direct',
        paymentMode: payment.metadata?.paymentMode ?? 'monthly',
        billingType,
        recurringDurationMonths: payment.metadata?.recurringDurationMonths,
        recurringEndsAt: payment.metadata?.recurringEndsAt ?? payment.booking?.endDate?.toISOString() ?? null,
        recurringEnabled,
      });
    }

    if (payment.status === PaymentStatus.FAILED) {
      return NextResponse.json({
        ok: false,
        message: 'This payment attempt is no longer valid. Please start checkout again.',
      }, { status: 409 });
    }

    let isSuccessful = false;
    let providerData;

    if (payment.provider === PaymentProvider.PAYSTACK) {
      providerData = await paystack.verifyPayment(reference);
      isSuccessful = providerData.data.status === 'success';
    } else if (payment.provider === PaymentProvider.FLUTTERWAVE) {
      const providerTransactionId = transactionId || String(payment.metadata?.data?.id || '');
      const transactionIdPattern = /^[A-Za-z0-9_-]{1,128}$/;

      if (!providerTransactionId || !transactionIdPattern.test(providerTransactionId)) {
        return NextResponse.json(
          { ok: false, message: 'Invalid Flutterwave transaction ID' },
          { status: 400 }
        );
      }

      providerData = await flutterwave.verifyPayment(providerTransactionId);
      isSuccessful = providerData.data.status === 'successful';
    }

    if (isSuccessful) {
      const updatedBookings = await applySuccessfulPayment({
        payment,
        providerData,
      });
      const primaryBooking = updatedBookings[0]?.booking;
      const recurringEnabled = payment.metadata?.billingType === PaymentBillingType.RECURRING
        || payment.metadata?.paymentMode === 'monthly';
      const billingType = recurringEnabled ? PaymentBillingType.RECURRING : (payment.metadata?.billingType ?? PaymentBillingType.ONE_TIME);

      const notificationIds = await queueOrderConfirmationNotifications({
        source: 'payments/verify',
        appUrl,
        emails: updatedBookings.map(({ booking, invoice }) => ({
          to: booking.user!.email,
          firstName: booking.user!.firstName,
          siteName: booking.site!.name,
          invoiceNumber: invoice.invoiceNumber,
          amountPaid: Number(invoice.total),
          currency: invoice.currency,
          billingType,
        })),
      });
      await processEmailNotificationsByIds(notificationIds);

      return NextResponse.json({
        ok: true,
        message: 'Payment verified',
        bookingStatus: primaryBooking?.status,
        amountPaid: primaryBooking?.amountPaid,
        checkoutSource: payment.metadata?.checkoutSource ?? 'direct',
        paymentMode: payment.metadata?.paymentMode ?? 'monthly',
        billingType,
        recurringDurationMonths: payment.metadata?.recurringDurationMonths,
        recurringEndsAt: payment.metadata?.recurringEndsAt ?? primaryBooking?.endDate?.toISOString() ?? null,
        recurringEnabled,
        processedBookings: updatedBookings.map(({ booking }) => ({
          bookingId: booking.id,
          status: booking.status,
          amountPaid: booking.amountPaid,
        })),
      });
    }

    const supabase = createAdminClient();
    await supabase.from('payments').update({ status: PaymentStatus.FAILED }).eq('id', payment.id);
    await releaseFailedPendingBookings(payment);
    return NextResponse.json({ ok: false, message: 'Payment verification failed' });
  } catch (error: unknown) {
    console.error('Verify payment error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
