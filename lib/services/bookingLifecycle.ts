import { createAdminClient } from '@/lib/supabase/admin';
import { BookingStatus } from '@/lib/db/entities/Booking';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { syncUnitTypeAvailability } from '@/lib/db/storageUnits';
import { PaymentStatus } from '@/lib/db/entities/Payment';
import { getPaymentAllocations } from '@/lib/services/paymentProcessing';
import { BOOKING_RELATION_SELECT, mapBooking, mapPayment } from '@/lib/db/mappers';

export const STALE_PENDING_BOOKING_MINUTES = 30;
export const STALE_INITIALIZED_PAYMENT_MINUTES = 24 * 60;

export async function expireStalePendingBookings({
  olderThanMinutes = STALE_PENDING_BOOKING_MINUTES,
  initializedPaymentOlderThanMinutes = STALE_INITIALIZED_PAYMENT_MINUTES,
}: {
  olderThanMinutes?: number;
  initializedPaymentOlderThanMinutes?: number;
} = {}) {
  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000).toISOString();
  const touchedUnitTypeIds = new Set<string>();
  let expiredCount = 0;

  const { data: staleBookingRows, error: staleBookingError } = await supabase
    .from('bookings')
    .select(BOOKING_RELATION_SELECT)
    .eq('status', BookingStatus.PENDING)
    .lt('createdAt', cutoff);

  if (staleBookingError) {
    throw staleBookingError;
  }

  for (const row of staleBookingRows ?? []) {
    const booking = mapBooking(row);

    if (Number(booking.amountPaid) > 0) {
      continue;
    }

    if (typeof booking.billingMetadata?.pendingPaymentReference === 'string' && booking.billingMetadata.pendingPaymentReference.length > 0) {
      continue;
    }

    if (booking.storageUnit?.id) {
      const { data: storageUnitRow } = await supabase
        .from('storage_units')
        .select('*')
        .eq('id', booking.storageUnit.id)
        .maybeSingle();

      if (storageUnitRow?.status === StorageUnitStatus.RESERVED) {
        await supabase
          .from('storage_units')
          .update({ status: StorageUnitStatus.AVAILABLE })
          .eq('id', storageUnitRow.id);
      }
    }

    await supabase
      .from('bookings')
      .update({ status: BookingStatus.CANCELLED })
      .eq('id', booking.id);

    if (booking.unitType?.id) {
      touchedUnitTypeIds.add(booking.unitType.id);
    }

    expiredCount += 1;
  }

  for (const unitTypeId of touchedUnitTypeIds) {
    await syncUnitTypeAvailability(unitTypeId);
  }

  const staleInitializedPaymentCutoff = new Date(
    Date.now() - initializedPaymentOlderThanMinutes * 60 * 1000
  ).toISOString();
  const touchedInitializedUnitTypeIds = new Set<string>();
  let expiredInitializedPaymentCount = 0;

  const { data: stalePaymentRows, error: stalePaymentError } = await supabase
    .from('payments')
    .select('*, booking:bookings(*)')
    .eq('status', PaymentStatus.PENDING)
    .lt('createdAt', staleInitializedPaymentCutoff);

  if (stalePaymentError) {
    throw stalePaymentError;
  }

  for (const row of stalePaymentRows ?? []) {
    const payment = mapPayment(row);

    await supabase
      .from('payments')
      .update({ status: PaymentStatus.FAILED })
      .eq('id', payment.id);

    expiredInitializedPaymentCount += 1;

    const bookingAllocations = getPaymentAllocations(payment);
    const bookingIds = bookingAllocations.map((allocation) => allocation.bookingId);

    if (bookingIds.length === 0) {
      continue;
    }

    const { data: bookingRows } = await supabase
      .from('bookings')
      .select(BOOKING_RELATION_SELECT)
      .in('id', bookingIds);

    for (const bookingRow of bookingRows ?? []) {
      const booking = mapBooking(bookingRow);
      const ownsCurrentHold = booking.billingMetadata?.pendingPaymentReference === payment.providerReference;

      if (!ownsCurrentHold || booking.status !== BookingStatus.PENDING || Number(booking.amountPaid) > 0) {
        continue;
      }

      if (booking.storageUnit?.id) {
        const { data: storageUnitRow } = await supabase
          .from('storage_units')
          .select('*')
          .eq('id', booking.storageUnit.id)
          .maybeSingle();

        if (storageUnitRow?.status === StorageUnitStatus.RESERVED) {
          await supabase
            .from('storage_units')
            .update({ status: StorageUnitStatus.AVAILABLE })
            .eq('id', storageUnitRow.id);
        }
      }

      await supabase
        .from('bookings')
        .update({
          status: BookingStatus.CANCELLED,
          billingMetadata: {
            ...(booking.billingMetadata ?? {}),
            pendingPaymentReference: undefined,
            pendingPaymentInitializedAt: undefined,
          },
        })
        .eq('id', booking.id);

      if (booking.unitType?.id) {
        touchedInitializedUnitTypeIds.add(booking.unitType.id);
      }
    }
  }

  for (const unitTypeId of touchedInitializedUnitTypeIds) {
    await syncUnitTypeAvailability(unitTypeId);
  }

  return {
    expiredCount,
    expiredInitializedPaymentCount,
  };
}
