import { Resend } from 'resend';
import { generateActionToken } from '@/lib/auth/actionTokens';
import { PaymentBillingType } from '@/lib/db/entities/Payment';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Spacedey <onboarding@resend.dev>';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'info@spacedey.com';
const PUBLIC_APP_URL = process.env.PUBLIC_APP_URL || 'http://localhost:3000';

const RESEND_TEMPLATE_IDS = {
  signupVerification: 'email_verification',
  forgotPassword: 'reset-password',
  billingSuccess: 'billing-success',
} as const;

const EMAIL_SUBJECTS = {
  signupVerification: 'Verify your Spacedey account',
  forgotPassword: 'Reset your Spacedey password',
  billingSuccess: 'Your Spacedey payment was successful',
} as const;

type ResendTemplateKey = 'signupVerification' | 'forgotPassword' | 'billingSuccess';
type TemplateVariables = Record<string, string | number>;

export interface BillingSuccessEmailArgs {
  to: string;
  firstName: string;
  siteName: string;
  invoiceNumber: string;
  amountPaid: number;
  currency: string;
  billingType?: PaymentBillingType;
}

let resendClient: Resend | null = null;

function getResendClient() {
  if (!RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }

  return resendClient;
}

function getTemplateId(templateKey: ResendTemplateKey): string | null {
  return RESEND_TEMPLATE_IDS[templateKey] || null;
}

async function sendEmail(args: {
  to: string;
  subject: string;
  templateId: string;
  variables: TemplateVariables;
}) {
  const client = getResendClient();

  if (!client) {
    throw new Error('Resend is not configured.');
  }

  const { error } = await client.emails.send({
    from: RESEND_FROM_EMAIL,
    to: [args.to],
    subject: args.subject,
    template: {
      id: args.templateId,
      variables: args.variables,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to send email through Resend.');
  }
}

export function isResendConfigured(templateKey?: ResendTemplateKey) {
  const baseConfigured = Boolean(RESEND_API_KEY && RESEND_FROM_EMAIL);

  if (!baseConfigured) {
    return false;
  }

  if (!templateKey) {
    return true;
  }

  return Boolean(getTemplateId(templateKey));
}

export async function sendSignupVerificationEmail(args: {
  userId: string;
  email: string;
  firstName: string;
}) {
  const templateId = getTemplateId('signupVerification');

  if (!isResendConfigured('signupVerification') || !templateId) {
    return false;
  }

  const token = generateActionToken(
    {
      userId: args.userId,
      email: args.email,
      purpose: 'email_verification',
    },
    '24h'
  );

  const verificationUrl = `${PUBLIC_APP_URL}/auth/verify-email?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: args.email,
    subject: EMAIL_SUBJECTS.signupVerification,
    templateId,
    variables: {
      firstName: args.firstName,
      verificationUrl,
      supportEmail: SUPPORT_EMAIL,
    },
  });

  return true;
}

export async function sendForgotPasswordEmail(args: {
  userId: string;
  email: string;
  firstName: string;
}) {
  const templateId = getTemplateId('forgotPassword');

  if (!isResendConfigured('forgotPassword') || !templateId) {
    throw new Error('Resend forgot-password template is not configured.');
  }

  const token = generateActionToken(
    {
      userId: args.userId,
      email: args.email,
      purpose: 'password_reset',
    },
    '1h'
  );

  const resetUrl = `${PUBLIC_APP_URL}/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(args.email)}`;

  await sendEmail({
    to: args.email,
    subject: EMAIL_SUBJECTS.forgotPassword,
    templateId,
    variables: {
      firstName: args.firstName,
      resetUrl,
      supportEmail: SUPPORT_EMAIL,
    },
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getBillingTypeLabel(billingType: PaymentBillingType | undefined) {
  if (billingType === PaymentBillingType.RECURRING) {
    return 'Recurring';
  }

  return 'One-time';
}

export async function sendBillingSuccessEmail(args: BillingSuccessEmailArgs) {
  const templateId = getTemplateId('billingSuccess');

  if (!isResendConfigured('billingSuccess') || !templateId) {
    return false;
  }

  await sendEmail({
    to: args.to,
    subject: EMAIL_SUBJECTS.billingSuccess,
    templateId,
    variables: {
      firstName: args.firstName,
      siteName: args.siteName,
      invoiceNumber: args.invoiceNumber,
      amountPaid: formatCurrency(args.amountPaid, args.currency),
      billingType: getBillingTypeLabel(args.billingType),
      bookingsUrl: `${PUBLIC_APP_URL}/bookings`,
      invoicesUrl: `${PUBLIC_APP_URL}/invoices`,
      supportEmail: SUPPORT_EMAIL,
    },
  });

  return true;
}

export async function sendBillingSuccessEmailBatch(args: {
  emails: BillingSuccessEmailArgs[];
  source: string;
}) {
  const results = await Promise.allSettled(
    args.emails.map((email) => sendBillingSuccessEmail(email))
  );

  results.forEach((result, index) => {
    const email = args.emails[index];

    if (result.status === 'rejected') {
      const errorMessage = result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);

      console.error(`Billing success email failed (${args.source})`, {
        recipient: email.to,
        invoiceNumber: email.invoiceNumber,
        error: errorMessage,
      });
      return;
    }

    if (!result.value) {
      console.warn(`Billing success email skipped (${args.source})`, {
        recipient: email.to,
        invoiceNumber: email.invoiceNumber,
      });
    }
  });
}
