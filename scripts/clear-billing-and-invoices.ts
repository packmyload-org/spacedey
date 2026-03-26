import 'reflect-metadata';
import { In } from 'typeorm';
import AppDataSource from './typeorm-data-source';
import Booking, { BookingStatus } from '../lib/db/entities/Booking';
import EmailNotification, { EmailNotificationKind } from '../lib/db/entities/EmailNotification';
import Invoice from '../lib/db/entities/Invoice';
import Payment from '../lib/db/entities/Payment';

const BILLING_NOTIFICATION_KINDS = [
  EmailNotificationKind.ORDER_CONFIRMATION,
  EmailNotificationKind.INVOICE_DUE,
  EmailNotificationKind.INVOICE_OVERDUE,
  EmailNotificationKind.ALERT_BILLING,
  EmailNotificationKind.ALERT_INVOICING,
] as const;

function shouldExecute() {
  return process.argv.includes('--yes');
}

async function main() {
  await AppDataSource.initialize();

  try {
    const invoiceRepo = AppDataSource.getRepository(Invoice);
    const paymentRepo = AppDataSource.getRepository(Payment);
    const bookingRepo = AppDataSource.getRepository(Booking);
    const emailNotificationRepo = AppDataSource.getRepository(EmailNotification);

    const [
      invoiceCount,
      paymentCount,
      bookingResetCount,
      notificationCount,
    ] = await Promise.all([
      invoiceRepo.count(),
      paymentRepo.count(),
      bookingRepo
        .createQueryBuilder('booking')
        .where('booking.amountPaid > 0')
        .orWhere('booking.billingMetadata IS NOT NULL')
        .orWhere('booking.status IN (:...statuses)', {
          statuses: [BookingStatus.ACTIVE, BookingStatus.PARTIAL],
        })
        .getCount(),
      emailNotificationRepo.count({
        where: {
          kind: In([...BILLING_NOTIFICATION_KINDS]),
        },
      }),
    ]);

    console.log('Billing cleanup preview');
    console.log(`- invoices to delete: ${invoiceCount}`);
    console.log(`- payments to delete: ${paymentCount}`);
    console.log(`- bookings to reset: ${bookingResetCount}`);
    console.log(`- billing notifications to delete: ${notificationCount}`);

    if (!shouldExecute()) {
      console.log('');
      console.log('No changes were made.');
      console.log('Run again with --yes to execute this destructive cleanup.');
      process.exit(0);
    }

    await AppDataSource.transaction(async (manager) => {
      await manager.createQueryBuilder().delete().from(Invoice).execute();
      await manager.createQueryBuilder().delete().from(Payment).execute();

      await manager
        .createQueryBuilder()
        .update(Booking)
        .set({
          amountPaid: 0,
          billingMetadata: null,
        })
        .where('amountPaid > 0')
        .orWhere('billingMetadata IS NOT NULL')
        .orWhere('status IN (:...statuses)', {
          statuses: [BookingStatus.ACTIVE, BookingStatus.PARTIAL],
        })
        .execute();

      await manager
        .createQueryBuilder()
        .update(Booking)
        .set({
          status: BookingStatus.PENDING,
        })
        .where('status IN (:...statuses)', {
          statuses: [BookingStatus.ACTIVE, BookingStatus.PARTIAL],
        })
        .execute();

      await manager.getRepository(EmailNotification).delete({
        kind: In([...BILLING_NOTIFICATION_KINDS]),
      });
    });

    console.log('');
    console.log('Billing and invoice data cleared successfully.');
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Failed to clear billing and invoice data:', error);
  process.exit(1);
});
