import 'reflect-metadata';
import { connectTypeORM, disconnectTypeORM } from '@/lib/db';
import {
  processPendingEmailNotifications,
  queueBookingExpirationNotifications,
  queueInvoiceReminderNotifications,
  queueWeeklyNewsletterDigestNotifications,
} from '@/lib/services/emailNotifications';

async function main() {
  await connectTypeORM();

  const bookingNotificationIds = await queueBookingExpirationNotifications();
  const invoiceNotificationIds = await queueInvoiceReminderNotifications();
  const digestNotificationIds = await queueWeeklyNewsletterDigestNotifications();
  const processed = await processPendingEmailNotifications(200);

  console.log('Email automation run complete', {
    queuedBookingNotifications: bookingNotificationIds.length,
    queuedInvoiceNotifications: invoiceNotificationIds.length,
    queuedDigestNotifications: digestNotificationIds.length,
    processed: processed.length,
  });
}

main()
  .catch((error) => {
    console.error('Email automation run failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectTypeORM();
  });
