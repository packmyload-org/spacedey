import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

function getArg(index: number) {
  return String(process.argv[index] || '').trim();
}

async function main() {
  const recipient = getArg(2);
  const firstName = getArg(3) || 'Customer';

  if (!recipient) {
    console.error('Usage: pnpm email:test <recipient-email> [first-name]');
    process.exit(1);
  }

  const mail = await import('../lib/email/resend.js');

  await mail.sendSignupVerificationEmail({
    userId: 'test-user-email-verification',
    email: recipient,
    firstName,
  });

  await mail.sendForgotPasswordEmail({
    userId: 'test-user-reset-password',
    email: recipient,
    firstName,
  });

  await mail.sendBillingSuccessEmail({
    to: recipient,
    firstName,
    siteName: 'Spacedey Lagos Central',
    invoiceNumber: 'INV-TEST-001',
    amountPaid: 25000,
    currency: 'NGN',
  });

  console.log(`Sent signup verification, reset password, and billing success test emails to ${recipient}`);
}

main().catch((error) => {
  console.error('Failed to send test emails:', error);
  process.exit(1);
});
