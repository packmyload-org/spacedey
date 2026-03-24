import { Resend } from 'resend';
import { generateActionToken } from '@/lib/auth/actionTokens';
import { PaymentBillingType } from '@/lib/db/entities/Payment';
import { resolveAppUrl } from '@/lib/utils/appUrl';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Spacedey <onboarding@resend.dev>';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'info@mailing.spacedey.com';

const RESEND_TEMPLATE_IDS = {
  signupVerification: 'email_verification',
  forgotPassword: 'reset-password',
  billingSuccess: 'billing-success',
  newsletterWelcome: 'newsletter-welcome',
} as const;

const EMAIL_SUBJECTS = {
  signupVerification: 'Verify your Spacedey account',
  forgotPassword: 'Reset your Spacedey password',
  billingSuccess: 'Your Spacedey payment was successful',
  newsletterWelcome: 'You are subscribed to Spacedey updates',
} as const;

type ResendTemplateKey =
  | 'signupVerification'
  | 'forgotPassword'
  | 'billingSuccess'
  | 'newsletterWelcome';
type TemplateVariables = Record<string, string | number>;

export interface BillingSuccessEmailArgs {
  to: string;
  firstName: string;
  siteName: string;
  invoiceNumber: string;
  amountPaid: number;
  currency: string;
  billingType?: PaymentBillingType;
  appUrl?: string | null;
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

export async function sendDirectEmail(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}) {
  const client = getResendClient();

  if (!client) {
    throw new Error('Resend is not configured.');
  }

  const { error } = await client.emails.send({
    from: args.from || RESEND_FROM_EMAIL,
    to: [args.to],
    subject: args.subject,
    html: args.html,
    text: args.text,
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
  appUrl?: string | null;
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

  const appUrl = resolveAppUrl(args.appUrl);
  const verificationUrl = `${appUrl}/auth/verify-email?token=${encodeURIComponent(token)}`;

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
  appUrl?: string | null;
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

  const appUrl = resolveAppUrl(args.appUrl);
  const resetUrl = `${appUrl}/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(args.email)}`;

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

function renderBillingSuccessEmail(args: {
  firstName: string;
  siteName: string;
  invoiceNumber: string;
  amountPaid: string;
  billingType: string;
  bookingsUrl: string;
  invoicesUrl: string;
}) {
  const intro = `Hi ${args.firstName || 'there'}, your Spacedey payment for ${args.siteName} has been confirmed.`;
  const summaryLines = [
    `Invoice: ${args.invoiceNumber}`,
    `Amount paid: ${args.amountPaid}`,
    `Billing type: ${args.billingType}`,
  ];

  return {
    html: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7ff;margin:0;padding:24px 0;font-family:Arial,Helvetica,sans-serif;color:#102a72;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 16px 40px rgba(16,42,114,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#1642f0 0%,#0f2b82 100%);padding:40px 32px 32px;text-align:left;">
                  <h1 style="margin:0 0 12px;font-size:32px;line-height:1.15;font-weight:800;color:#ffffff;">
                    Payment confirmed
                  </h1>
                  <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.88);">
                    ${intro}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#465577;">
                    We have recorded your payment successfully and attached it to your storage booking.
                  </p>
                  <div style="margin:0 0 24px;padding:18px 20px;border-radius:20px;background-color:#f8faff;border:1px solid #dce6ff;">
                    <p style="margin:0 0 8px;font-size:14px;line-height:1.8;color:#26407d;"><strong>Invoice:</strong> ${args.invoiceNumber}</p>
                    <p style="margin:0 0 8px;font-size:14px;line-height:1.8;color:#26407d;"><strong>Amount paid:</strong> ${args.amountPaid}</p>
                    <p style="margin:0;font-size:14px;line-height:1.8;color:#26407d;"><strong>Billing type:</strong> ${args.billingType}</p>
                  </div>
                  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 0;">
                    <tr>
                      <td align="center" style="border-radius:999px;background-color:#1642f0;">
                        <a href="${args.bookingsUrl}" style="display:inline-block;padding:16px 24px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">
                          View bookings
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:20px 0 0;font-size:14px;line-height:1.8;color:#465577;">
                    You can also review this in your billing history at
                    <a href="${args.invoicesUrl}" style="color:#1642f0;text-decoration:none;"> your invoices page</a>.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 32px 32px;border-top:1px solid #edf1ff;">
                  <p style="margin:0;font-size:12px;line-height:1.7;color:#8a96b5;">
                    This is a transactional email from Spacedey.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    text: [
      'Payment confirmed',
      '',
      intro,
      '',
      ...summaryLines,
      '',
      `View bookings: ${args.bookingsUrl}`,
      `View invoices: ${args.invoicesUrl}`,
      '',
      'This is a transactional email from Spacedey.',
    ].join('\n'),
  };
}

export async function sendBillingSuccessEmail(args: BillingSuccessEmailArgs) {
  const templateId = getTemplateId('billingSuccess');
  const appUrl = resolveAppUrl(args.appUrl);
  const amountPaid = formatCurrency(args.amountPaid, args.currency);
  const billingType = getBillingTypeLabel(args.billingType);
  const bookingsUrl = `${appUrl}/bookings`;
  const invoicesUrl = `${appUrl}/invoices`;
  const fallbackEmail = renderBillingSuccessEmail({
    firstName: args.firstName,
    siteName: args.siteName,
    invoiceNumber: args.invoiceNumber,
    amountPaid,
    billingType,
    bookingsUrl,
    invoicesUrl,
  });

  if (!isResendConfigured()) {
    return false;
  }

  if (templateId) {
    try {
      await sendEmail({
        to: args.to,
        subject: EMAIL_SUBJECTS.billingSuccess,
        templateId,
        variables: {
          firstName: args.firstName,
          siteName: args.siteName,
          invoiceNumber: args.invoiceNumber,
          amountPaid,
          billingType,
          bookingsUrl,
          invoicesUrl,
          supportEmail: SUPPORT_EMAIL,
        },
      });

      return true;
    } catch (error) {
      console.warn('Billing success template send failed, falling back to direct email.', {
        recipient: args.to,
        invoiceNumber: args.invoiceNumber,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await sendDirectEmail({
    to: args.to,
    subject: EMAIL_SUBJECTS.billingSuccess,
    html: fallbackEmail.html,
    text: fallbackEmail.text,
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

export async function sendNewsletterWelcomeEmail(args: {
  email: string;
  appUrl?: string | null;
}) {
  const templateId = getTemplateId('newsletterWelcome');

  if (!isResendConfigured('newsletterWelcome') || !templateId) {
    return false;
  }

  const appUrl = resolveAppUrl(args.appUrl);

  await sendEmail({
    to: args.email,
    subject: EMAIL_SUBJECTS.newsletterWelcome,
    templateId,
    variables: {
      email: args.email,
      blogUrl: `${appUrl}/blog`,
      supportEmail: SUPPORT_EMAIL,
    },
  });

  return true;
}
