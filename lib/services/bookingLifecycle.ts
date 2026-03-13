import { LessThan, type DataSource } from 'typeorm';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import StorageUnit, { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { syncUnitTypeAvailability } from '@/lib/db/storageUnits';
import Payment, { PaymentStatus } from '@/lib/db/entities/Payment';
import { getPaymentAllocations } from '@/lib/services/paymentProcessing';

export const STALE_PENDING_BOOKING_MINUTES = 30;
export const STALE_INITIALIZED_PAYMENT_MINUTES = 24 * 60;

export async function expireStalePendingBookings(
  dataSource: DataSource,
  {
    olderThanMinutes = STALE_PENDING_BOOKING_MINUTES,
    initializedPaymentOlderThanMinutes = STALE_INITIALIZED_PAYMENT_MINUTES,
  }: {
    olderThanMinutes?: number;
    initializedPaymentOlderThanMinutes?: number;
  } = {}
) {
  const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);
  const touchedUnitTypeIds = new Set<string>();
  let expiredCount = 0;

  await dataSource.transaction(async (manager) => {
    const bookingRepo = manager.getRepository(Booking);
    const storageUnitRepo = manager.getRepository(StorageUnit);
    const staleBookings = await bookingRepo.find({
      where: {
        status: BookingStatus.PENDING,
        createdAt: LessThan(cutoff),
      },
      relations: ['storageUnit', 'unitType'],
    });

    for (const booking of staleBookings) {
      if (Number(booking.amountPaid) > 0) {
        continue;
      }

      if (typeof booking.billingMetadata?.pendingPaymentReference === 'string' && booking.billingMetadata.pendingPaymentReference.length > 0) {
        continue;
      }

      if (booking.storageUnit?.id) {
        const storageUnit = await storageUnitRepo.findOne({
          where: { id: booking.storageUnit.id },
          relations: ['unitType'],
        });

        if (storageUnit && storageUnit.status === StorageUnitStatus.RESERVED) {
          storageUnit.status = StorageUnitStatus.AVAILABLE;
          await storageUnitRepo.save(storageUnit);
        }
      }

      booking.status = BookingStatus.CANCELLED;
      await bookingRepo.save(booking);
      if (booking.unitType?.id) {
        touchedUnitTypeIds.add(booking.unitType.id);
      }
      expiredCount += 1;
    }
  });

  for (const unitTypeId of touchedUnitTypeIds) {
    await syncUnitTypeAvailability(dataSource, unitTypeId);
  }

  const staleInitializedPaymentCutoff = new Date(Date.now() - initializedPaymentOlderThanMinutes * 60 * 1000);
  const touchedInitializedUnitTypeIds = new Set<string>();
  let expiredInitializedPaymentCount = 0;

  await dataSource.transaction(async (manager) => {
    const paymentRepo = manager.getRepository(Payment);
    const bookingRepo = manager.getRepository(Booking);
    const storageUnitRepo = manager.getRepository(StorageUnit);
    const stalePayments = await paymentRepo.find({
      where: {
        status: PaymentStatus.PENDING,
        createdAt: LessThan(staleInitializedPaymentCutoff),
      },
      relations: ['booking'],
    });

    for (const payment of stalePayments) {
      payment.status = PaymentStatus.FAILED;
      await paymentRepo.save(payment);
      expiredInitializedPaymentCount += 1;

      const bookingAllocations = getPaymentAllocations(payment);
      const bookingIds = bookingAllocations.map((allocation) => allocation.bookingId);

      if (bookingIds.length === 0) {
        continue;
      }

      const bookings = await bookingRepo.find({
        where: bookingIds.map((id) => ({ id })),
        relations: ['storageUnit', 'unitType'],
      });

      for (const booking of bookings) {
        const ownsCurrentHold = booking.billingMetadata?.pendingPaymentReference === payment.providerReference;
        if (!ownsCurrentHold || booking.status !== BookingStatus.PENDING || Number(booking.amountPaid) > 0) {
          continue;
        }

        if (booking.storageUnit?.id) {
          const storageUnit = await storageUnitRepo.findOne({
            where: { id: booking.storageUnit.id },
            relations: ['unitType'],
          });

          if (storageUnit && storageUnit.status === StorageUnitStatus.RESERVED) {
            storageUnit.status = StorageUnitStatus.AVAILABLE;
            await storageUnitRepo.save(storageUnit);
          }
        }

        booking.billingMetadata = {
          ...(booking.billingMetadata ?? {}),
          pendingPaymentReference: undefined,
          pendingPaymentInitializedAt: undefined,
        };
        booking.status = BookingStatus.CANCELLED;
        await bookingRepo.save(booking);

        if (booking.unitType?.id) {
          touchedInitializedUnitTypeIds.add(booking.unitType.id);
        }
      }
    }
  });

  for (const unitTypeId of touchedInitializedUnitTypeIds) {
    await syncUnitTypeAvailability(dataSource, unitTypeId);
  }

  return {
    expiredCount,
    expiredInitializedPaymentCount,
  };
}
