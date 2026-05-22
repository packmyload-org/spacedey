import { createAdminClient } from '@/lib/supabase/admin';
import {
  mapBooking,
  mapInvoice,
  BOOKING_RELATION_SELECT,
  INVOICE_RELATION_SELECT,
} from '@/lib/db/mappers';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import Invoice, { InvoiceStatus } from '@/lib/db/entities/Invoice';
import NewsletterSubscriber from '@/lib/db/entities/NewsletterSubscriber';
import EmailNotification, {
  EmailNotificationKind,
  EmailNotificationStatus,
} from '@/lib/db/entities/EmailNotification';
import { listPublishedBlogPosts } from '@/lib/services/blogPosts';
import { sendBillingSuccessEmail, sendDirectEmail } from '@/lib/email/resend';
import { resolveInvoiceLinkedUser } from '@/lib/services/invoiceUsers';
import type { PaymentBillingType } from '@/lib/db/entities/Payment';
import { resolveAppUrl } from '@/lib/utils/appUrl';
import { asJson } from '@/lib/supabase/json';
import { parseDate, parseRequiredDate } from '@/lib/db/row';

const ALERT_RECIPIENTS = (process.env.ALERT_NOTIFICATION_EMAILS || '')
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);
const APP_URL = resolveAppUrl();
const EMAIL_LOGO_URL = `${APP_URL}/apple-icon.png`;

type OrderConfirmationPayload = {
  firstName: string;
  siteName: string;
  invoiceNumber: string;
  amountPaid: number;
  currency: string;
  billingType?: PaymentBillingType;
  appUrl?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderEmailHtml(args: {
  title: string;
  eyebrow?: string;
  intro: string;
  body: string[];
  bodyHtml?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}) {
  const body = args.bodyHtml || args.body.map((paragraph) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#465577;">${escapeHtml(paragraph)}</p>`).join('');
  const cta = args.ctaLabel && args.ctaUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 0;"><tr><td align="center" style="border-radius:999px;background-color:#1642f0;"><a href="${escapeHtml(args.ctaUrl)}" style="display:inline-block;padding:16px 24px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(args.ctaLabel)}</a></td></tr></table>`
    : '';
  const eyebrow = args.eyebrow || 'Spacedey update';
  const footerNote = args.footerNote || 'This is a transactional email from Spacedey.';

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7ff;margin:0;padding:24px 0;font-family:Arial,Helvetica,sans-serif;color:#102a72;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 16px 40px rgba(16,42,114,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#1642f0 0%,#0f2b82 100%);padding:40px 32px 32px;text-align:left;">
                <img
                  src="${escapeHtml(EMAIL_LOGO_URL)}"
                  alt="Spacedey"
                  width="144"
                  style="display:block;width:144px;max-width:100%;height:auto;"
                />
                <div style="margin-top:18px;display:inline-block;padding:8px 14px;border-radius:999px;background-color:rgba(255,255,255,0.14);font-size:12px;letter-spacing:1.8px;font-weight:700;text-transform:uppercase;color:#ffffff;">
                  ${escapeHtml(eyebrow)}
                </div>
                <h1 style="margin:18px 0 10px;font-size:34px;line-height:1.15;font-weight:800;color:#ffffff;">
                  ${escapeHtml(args.title)}
                </h1>
                <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.88);">
                  ${escapeHtml(args.intro)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 20px;">
                ${body}
                ${cta}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;border-top:1px solid #edf1ff;">
                <p style="margin:0;font-size:12px;line-height:1.7;color:#8a96b5;">
                  ${escapeHtml(footerNote)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function renderEmailText(args: {
  title: string;
  intro: string;
  body: string[];
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  return [
    args.title,
    '',
    args.intro,
    '',
    ...args.body,
    args.ctaLabel && args.ctaUrl ? '' : '',
    args.ctaLabel && args.ctaUrl ? `${args.ctaLabel}: ${args.ctaUrl}` : '',
  ].filter(Boolean).join('\n');
}

async function queueNotification(args: {
  eventKey: string;
  kind: EmailNotificationKind;
  recipientEmail: string;
  recipientName?: string | null;
  subject: string;
  payload: Record<string, unknown>;
  scheduledFor?: Date;
}) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from('email_notifications')
    .select('*')
    .eq('eventKey', args.eventKey)
    .maybeSingle();

  if (existing) {
    return mapEmailNotificationRow(existing);
  }

  const { data: notification, error } = await supabase
    .from('email_notifications')
    .insert({
      eventKey: args.eventKey,
      kind: args.kind,
      status: EmailNotificationStatus.PENDING,
      recipientEmail: args.recipientEmail.toLowerCase(),
      recipientName: args.recipientName ?? null,
      subject: args.subject,
      payload: asJson(args.payload),
      scheduledFor: (args.scheduledFor ?? new Date()).toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapEmailNotificationRow(notification);
}

function mapEmailNotificationRow(row: {
  id: string;
  eventKey: string;
  kind: string;
  status: string;
  recipientEmail: string;
  recipientName: string | null;
  subject: string;
  payload: import('@/lib/supabase/database.types').Json | null;
  scheduledFor: string | null;
  sentAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}): EmailNotification {
  const notification = new EmailNotification();
  notification.id = row.id;
  notification.eventKey = row.eventKey;
  notification.kind = row.kind as EmailNotificationKind;
  notification.status = row.status as EmailNotificationStatus;
  notification.recipientEmail = row.recipientEmail;
  notification.recipientName = row.recipientName;
  notification.subject = row.subject;
  notification.payload = (row.payload ?? {}) as Record<string, unknown>;
  notification.scheduledFor = parseRequiredDate(row.scheduledFor ?? row.createdAt);
  notification.sentAt = parseDate(row.sentAt);
  notification.failureReason = row.failureReason;
  notification.createdAt = parseRequiredDate(row.createdAt);
  notification.updatedAt = parseRequiredDate(row.updatedAt);
  return notification;
}

export async function queueOrderConfirmationNotifications(args: {
  source: string;
  appUrl?: string | null;
  emails: Array<{
    to: string;
    firstName: string;
    siteName: string;
    invoiceNumber: string;
    amountPaid: number;
    currency: string;
    billingType?: PaymentBillingType;
  }>;
}) {
  const queued = await Promise.all(args.emails.map((email) => queueNotification({
    eventKey: `order-confirmation:${args.source}:${email.invoiceNumber}:${email.to.toLowerCase()}`,
    kind: EmailNotificationKind.ORDER_CONFIRMATION,
    recipientEmail: email.to,
    recipientName: email.firstName,
    subject: 'Your Spacedey order is confirmed',
    payload: {
      ...email,
      appUrl: resolveAppUrl(args.appUrl),
    },
  })));

  return queued.map((notification) => notification.id);
}

export async function queueAlertNotifications(args: {
  category: 'monitoring' | 'billing' | 'security' | 'invoicing';
  subject: string;
  message: string;
  eventKey: string;
  scheduledFor?: Date;
  recipientEmails?: string[];
}) {
  const recipients = (args.recipientEmails?.length ? args.recipientEmails : ALERT_RECIPIENTS)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const kindMap = {
    monitoring: EmailNotificationKind.ALERT_MONITORING,
    billing: EmailNotificationKind.ALERT_BILLING,
    security: EmailNotificationKind.ALERT_SECURITY,
    invoicing: EmailNotificationKind.ALERT_INVOICING,
  } as const;

  return Promise.all(recipients.map((email) => queueNotification({
    eventKey: `${args.eventKey}:${email}`,
    kind: kindMap[args.category],
    recipientEmail: email,
    subject: args.subject,
    payload: { message: args.message },
    scheduledFor: args.scheduledFor,
  })));
}

export async function queueReminderNotification(args: {
  eventKey: string;
  recipientEmail: string;
  recipientName?: string | null;
  subject: string;
  intro: string;
  body: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  scheduledFor?: Date;
}) {
  const notification = await queueNotification({
    eventKey: args.eventKey,
    kind: EmailNotificationKind.REMINDER,
    recipientEmail: args.recipientEmail,
    recipientName: args.recipientName,
    subject: args.subject,
    payload: {
      intro: args.intro,
      body: args.body,
      ctaLabel: args.ctaLabel,
      ctaUrl: args.ctaUrl,
    },
    scheduledFor: args.scheduledFor,
  });

  return notification.id;
}

export async function queueBookingExpirationNotifications(now = new Date()) {
  const supabase = createAdminClient();
  const soonThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: bookingRows, error } = await supabase
    .from('bookings')
    .select(BOOKING_RELATION_SELECT)
    .in('status', [BookingStatus.ACTIVE, BookingStatus.PARTIAL])
    .lte('endDate', soonThreshold);

  if (error) {
    throw error;
  }

  const bookings = (bookingRows ?? []).map((row) => mapBooking(row));

  const queuedIds: string[] = [];

  for (const booking of bookings) {
    if (!booking.user?.email || !booking.site?.name) {
      continue;
    }

    if (!booking.endDate || booking.endDate < now) {
      const notification = await queueNotification({
        eventKey: `booking-expired:${booking.id}`,
        kind: EmailNotificationKind.BOOKING_EXPIRED,
        recipientEmail: booking.user.email,
        recipientName: booking.user.firstName,
        subject: 'Your Spacedey booking has ended',
        payload: {
          firstName: booking.user.firstName,
          siteName: booking.site.name,
          endDate: booking.endDate?.toISOString() ?? null,
          bookingsUrl: `${APP_URL}/bookings`,
        },
      });
      queuedIds.push(notification.id);
      continue;
    }

    const notification = await queueNotification({
      eventKey: `booking-expiring-7d:${booking.id}`,
      kind: EmailNotificationKind.BOOKING_EXPIRING,
      recipientEmail: booking.user.email,
      recipientName: booking.user.firstName,
      subject: 'Your Spacedey booking is ending soon',
      payload: {
        firstName: booking.user.firstName,
        siteName: booking.site.name,
        endDate: booking.endDate.toISOString(),
        bookingsUrl: `${APP_URL}/bookings`,
      },
    });
    queuedIds.push(notification.id);
  }

  return queuedIds;
}

export async function queueInvoiceReminderNotifications(now = new Date()) {
  const supabase = createAdminClient();
  const dueSoon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const nowIso = now.toISOString();

  const [{ data: dueSoonRows }, { data: overdueRows }] = await Promise.all([
    supabase
      .from('invoices')
      .select(INVOICE_RELATION_SELECT)
      .eq('status', InvoiceStatus.SENT)
      .lte('dueDate', dueSoon),
    supabase
      .from('invoices')
      .select(INVOICE_RELATION_SELECT)
      .eq('status', InvoiceStatus.OVERDUE)
      .lte('dueDate', nowIso),
  ]);

  const invoices = [
    ...(dueSoonRows ?? []),
    ...(overdueRows ?? []),
  ].map((row) => mapInvoice(row));

  const queuedIds: string[] = [];

  for (const invoice of invoices) {
    const user = resolveInvoiceLinkedUser(invoice.user);
    if (user.isFallback) {
      continue;
    }

    const overdue = invoice.status === InvoiceStatus.OVERDUE || invoice.dueDate <= now;
    const notification = await queueNotification({
      eventKey: `${overdue ? 'invoice-overdue' : 'invoice-due'}:${invoice.id}`,
      kind: overdue ? EmailNotificationKind.INVOICE_OVERDUE : EmailNotificationKind.INVOICE_DUE,
      recipientEmail: user.email,
      recipientName: user.firstName,
      subject: overdue ? 'Your Spacedey invoice is overdue' : 'Your Spacedey invoice is due soon',
      payload: {
        firstName: user.firstName,
        invoiceNumber: invoice.invoiceNumber,
        total: Number(invoice.total),
        currency: invoice.currency,
        dueDate: invoice.dueDate.toISOString(),
        siteName: invoice.booking?.site?.name || 'your storage booking',
        invoicesUrl: `${APP_URL}/invoices`,
      },
    });
    queuedIds.push(notification.id);
  }

  return queuedIds;
}

function getDigestWeekKey(date: Date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diffDays = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return `${date.getUTCFullYear()}-w${Math.floor(diffDays / 7) + 1}`;
}

export async function queueWeeklyNewsletterDigestNotifications(now = new Date(), options?: { force?: boolean }) {
  const todayUtcDay = now.getUTCDay();
  if (!options?.force && todayUtcDay !== 1) {
    return [];
  }

  const posts = (await listPublishedBlogPosts()).slice(0, 3);
  if (posts.length === 0) {
    return [];
  }

  const supabase = createAdminClient();
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .not('subscribedAt', 'is', null);

  if (error) {
    throw error;
  }

  const weekKey = getDigestWeekKey(now);
  const queued = await Promise.all((subscribers ?? []).map((subscriber) => queueNotification({
    eventKey: `newsletter-digest:${subscriber.email}:${weekKey}`,
    kind: EmailNotificationKind.NEWSLETTER_DIGEST,
    recipientEmail: subscriber.email,
    subject: 'This week on the Spacedey blog',
    payload: {
      posts: posts.map((post) => ({
        title: post.title,
        excerpt: post.excerpt,
        url: `${APP_URL}/blog/${post.slug}`,
      })),
      blogUrl: `${APP_URL}/blog`,
    },
  })));

  return queued.map((notification) => notification.id);
}

function isOrderConfirmationPayload(payload: Record<string, unknown>): payload is OrderConfirmationPayload {
  return typeof payload.firstName === 'string'
    && typeof payload.siteName === 'string'
    && typeof payload.invoiceNumber === 'string'
    && typeof payload.amountPaid === 'number'
    && typeof payload.currency === 'string';
}

async function deliverNotification(notification: EmailNotification) {
  switch (notification.kind) {
    case EmailNotificationKind.ORDER_CONFIRMATION: {
      if (!isOrderConfirmationPayload(notification.payload)) {
        throw new Error('Invalid order confirmation payload.');
      }

      const sent = await sendBillingSuccessEmail({
        to: notification.recipientEmail,
        firstName: notification.payload.firstName,
        siteName: notification.payload.siteName,
        invoiceNumber: notification.payload.invoiceNumber,
        amountPaid: notification.payload.amountPaid,
        currency: notification.payload.currency,
        billingType: notification.payload.billingType,
        appUrl: typeof notification.payload.appUrl === 'string' ? notification.payload.appUrl : undefined,
      });
      if (!sent) {
        throw new Error('Order confirmation email could not be sent.');
      }
      return;
    }
    case EmailNotificationKind.BOOKING_EXPIRING: {
      const endDate = String(notification.payload.endDate || '');
      await sendDirectEmail({
        to: notification.recipientEmail,
        subject: notification.subject,
        html: renderEmailHtml({
          title: 'Your booking ends soon',
          eyebrow: 'Booking reminder',
          intro: `Hi ${String(notification.payload.firstName || 'there')}, your booking at ${String(notification.payload.siteName || 'Spacedey')} is coming up on its end date.`,
          body: [
            `Current end date: ${endDate ? new Date(endDate).toLocaleDateString('en-NG') : 'Soon'}.`,
            'Review your booking and let us know if you need to renew, extend, or plan your move-out.',
          ],
          ctaLabel: 'View bookings',
          ctaUrl: String(notification.payload.bookingsUrl || `${APP_URL}/bookings`),
          footerNote: 'This reminder was sent because your Spacedey booking is nearing its end date.',
        }),
        text: renderEmailText({
          title: 'Your booking ends soon',
          intro: `Hi ${String(notification.payload.firstName || 'there')}, your booking at ${String(notification.payload.siteName || 'Spacedey')} is coming up on its end date.`,
          body: [
            `Current end date: ${endDate ? new Date(endDate).toLocaleDateString('en-NG') : 'Soon'}.`,
            'Review your booking and let us know if you need to renew, extend, or plan your move-out.',
          ],
          ctaLabel: 'View bookings',
          ctaUrl: String(notification.payload.bookingsUrl || `${APP_URL}/bookings`),
        }),
      });
      return;
    }
    case EmailNotificationKind.BOOKING_EXPIRED: {
      await sendDirectEmail({
        to: notification.recipientEmail,
        subject: notification.subject,
        html: renderEmailHtml({
          title: 'Your booking has ended',
          eyebrow: 'Booking update',
          intro: `Hi ${String(notification.payload.firstName || 'there')}, your booking at ${String(notification.payload.siteName || 'Spacedey')} has reached its end date.`,
          body: [
            'If you still need storage, review your account as soon as possible so we can help you plan the next step.',
          ],
          ctaLabel: 'View bookings',
          ctaUrl: String(notification.payload.bookingsUrl || `${APP_URL}/bookings`),
          footerNote: 'This update was sent because your Spacedey booking has reached its end date.',
        }),
        text: renderEmailText({
          title: 'Your booking has ended',
          intro: `Hi ${String(notification.payload.firstName || 'there')}, your booking at ${String(notification.payload.siteName || 'Spacedey')} has reached its end date.`,
          body: [
            'If you still need storage, review your account as soon as possible so we can help you plan the next step.',
          ],
          ctaLabel: 'View bookings',
          ctaUrl: String(notification.payload.bookingsUrl || `${APP_URL}/bookings`),
        }),
      });
      return;
    }
    case EmailNotificationKind.INVOICE_DUE:
    case EmailNotificationKind.INVOICE_OVERDUE: {
      const overdue = notification.kind === EmailNotificationKind.INVOICE_OVERDUE;
      await sendDirectEmail({
        to: notification.recipientEmail,
        subject: notification.subject,
        html: renderEmailHtml({
          title: overdue ? 'Invoice overdue' : 'Invoice due soon',
          eyebrow: overdue ? 'Billing alert' : 'Billing reminder',
          intro: `Hi ${String(notification.payload.firstName || 'there')}, invoice ${String(notification.payload.invoiceNumber || '')} for ${String(notification.payload.siteName || 'your booking')} needs your attention.`,
          body: [
            `Due date: ${new Date(String(notification.payload.dueDate || new Date().toISOString())).toLocaleDateString('en-NG')}.`,
            overdue ? 'This invoice is now overdue. Please review payment as soon as possible.' : 'This invoice is coming due soon. Review it before the deadline.',
          ],
          ctaLabel: 'View invoices',
          ctaUrl: String(notification.payload.invoicesUrl || `${APP_URL}/invoices`),
          footerNote: 'This is a billing notification related to your Spacedey storage account.',
        }),
        text: renderEmailText({
          title: overdue ? 'Invoice overdue' : 'Invoice due soon',
          intro: `Hi ${String(notification.payload.firstName || 'there')}, invoice ${String(notification.payload.invoiceNumber || '')} for ${String(notification.payload.siteName || 'your booking')} needs your attention.`,
          body: [
            `Due date: ${new Date(String(notification.payload.dueDate || new Date().toISOString())).toLocaleDateString('en-NG')}.`,
            overdue ? 'This invoice is now overdue. Please review payment as soon as possible.' : 'This invoice is coming due soon. Review it before the deadline.',
          ],
          ctaLabel: 'View invoices',
          ctaUrl: String(notification.payload.invoicesUrl || `${APP_URL}/invoices`),
        }),
      });
      return;
    }
    case EmailNotificationKind.ALERT_MONITORING:
    case EmailNotificationKind.ALERT_BILLING:
    case EmailNotificationKind.ALERT_SECURITY:
    case EmailNotificationKind.ALERT_INVOICING: {
      const message = String(notification.payload.message || '');
      await sendDirectEmail({
        to: notification.recipientEmail,
        subject: notification.subject,
        html: renderEmailHtml({
          title: notification.subject,
          eyebrow: 'System alert',
          intro: 'A Spacedey system alert was triggered.',
          body: [message],
          footerNote: 'This operational alert was sent from the Spacedey monitoring and notification system.',
        }),
        text: renderEmailText({
          title: notification.subject,
          intro: 'A Spacedey system alert was triggered.',
          body: [message],
        }),
      });
      return;
    }
    case EmailNotificationKind.NEWSLETTER_DIGEST: {
      const posts = Array.isArray(notification.payload.posts)
        ? notification.payload.posts as Array<{ title?: string; excerpt?: string; url?: string }>
        : [];

      const body = posts.map((post) => `${post.title || 'Spacedey update'}: ${post.excerpt || ''}`);
      const htmlPosts = posts.map((post) => `<li style="margin:0 0 14px;"><strong>${escapeHtml(post.title || 'Spacedey update')}</strong><br /><span>${escapeHtml(post.excerpt || '')}</span><br /><a href="${escapeHtml(post.url || APP_URL)}" style="color:#1642F0;">Read article</a></li>`).join('');
      await sendDirectEmail({
        to: notification.recipientEmail,
        subject: notification.subject,
        html: `
          ${renderEmailHtml({
            title: 'Fresh storage reads this week',
            eyebrow: 'Weekly digest',
            intro: 'A quick round-up from the Spacedey blog.',
            body: [],
            bodyHtml: `<ul style="padding-left:18px;margin:0 0 20px;">${htmlPosts}</ul>`,
            ctaLabel: 'Browse the blog',
            ctaUrl: String(notification.payload.blogUrl || `${APP_URL}/blog`),
            footerNote: 'You received this because you subscribed to Spacedey updates.',
          })}
        `,
        text: renderEmailText({
          title: 'Fresh storage reads this week',
          intro: 'A quick round-up from the Spacedey blog.',
          body,
          ctaLabel: 'Browse the blog',
          ctaUrl: String(notification.payload.blogUrl || `${APP_URL}/blog`),
        }),
      });
      return;
    }
    case EmailNotificationKind.REMINDER: {
      const body = Array.isArray(notification.payload.body)
        ? notification.payload.body.map((entry) => String(entry))
        : [];
      await sendDirectEmail({
        to: notification.recipientEmail,
        subject: notification.subject,
        html: renderEmailHtml({
          title: notification.subject,
          eyebrow: 'Reminder',
          intro: String(notification.payload.intro || 'A quick reminder from Spacedey.'),
          body,
          ctaLabel: typeof notification.payload.ctaLabel === 'string' ? notification.payload.ctaLabel : undefined,
          ctaUrl: typeof notification.payload.ctaUrl === 'string' ? notification.payload.ctaUrl : undefined,
          footerNote: 'This reminder was sent from your Spacedey account activity or preferences.',
        }),
        text: renderEmailText({
          title: notification.subject,
          intro: String(notification.payload.intro || 'A quick reminder from Spacedey.'),
          body,
          ctaLabel: typeof notification.payload.ctaLabel === 'string' ? notification.payload.ctaLabel : undefined,
          ctaUrl: typeof notification.payload.ctaUrl === 'string' ? notification.payload.ctaUrl : undefined,
        }),
      });
      return;
    }
  }
}

export async function processEmailNotificationsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const supabase = createAdminClient();
  const { data: notifications, error } = await supabase
    .from('email_notifications')
    .select('*')
    .in('id', ids);

  if (error) {
    throw error;
  }

  const results: Array<{ id: string; status: EmailNotificationStatus }> = [];

  for (const notification of notifications ?? []) {
    let status = notification.status as EmailNotificationStatus;
    let sentAt: string | null = notification.sentAt;
    let failureReason: string | null = notification.failureReason;

    try {
      await deliverNotification(mapEmailNotificationRow(notification));
      status = EmailNotificationStatus.SENT;
      sentAt = new Date().toISOString();
      failureReason = null;
    } catch (error) {
      status = EmailNotificationStatus.FAILED;
      failureReason = error instanceof Error ? error.message : String(error);
    }

    await supabase
      .from('email_notifications')
      .update({ status, sentAt, failureReason })
      .eq('id', notification.id);

    results.push({ id: notification.id, status });
  }

  return results;
}

export async function processPendingEmailNotifications(limit = 50) {
  const supabase = createAdminClient();
  const { data: notifications, error } = await supabase
    .from('email_notifications')
    .select('id')
    .eq('status', EmailNotificationStatus.PENDING)
    .lte('scheduledFor', new Date().toISOString())
    .order('scheduledFor', { ascending: true })
    .order('createdAt', { ascending: true })
    .limit(limit);

  if (error) {
    throw error;
  }

  return processEmailNotificationsByIds((notifications ?? []).map((notification) => notification.id));
}
