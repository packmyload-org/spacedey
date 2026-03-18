import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import {
  processEmailNotificationsByIds,
  queueAlertNotifications,
  queueReminderNotification,
  queueWeeklyNewsletterDigestNotifications,
} from '@/lib/services/emailNotifications';

type NotificationRequest = {
  type?: 'alert' | 'reminder' | 'digest';
  category?: 'monitoring' | 'billing' | 'security' | 'invoicing';
  subject?: string;
  message?: string;
  recipientEmails?: string[];
  scheduledFor?: string;
  eventKey?: string;
  intro?: string;
  body?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
};

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as NotificationRequest | null;
    if (!body?.type) {
      return NextResponse.json({ ok: false, error: 'Notification type is required.' }, { status: 400 });
    }

    const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : undefined;

    if (body.type === 'alert') {
      if (!body.category || !body.subject || !body.message || !body.eventKey) {
        return NextResponse.json(
          { ok: false, error: 'Category, subject, message, and eventKey are required for alerts.' },
          { status: 400 }
        );
      }

      const queued = await queueAlertNotifications({
        category: body.category,
        subject: body.subject,
        message: body.message,
        eventKey: body.eventKey,
        scheduledFor,
        recipientEmails: body.recipientEmails,
      });

      const processed = !scheduledFor
        ? await processEmailNotificationsByIds(queued.map((notification) => notification.id))
        : [];
      return NextResponse.json({ ok: true, queued: queued.length, processed });
    }

    if (body.type === 'reminder') {
      if (!body.subject || !body.intro || !body.eventKey || !body.recipientEmails?.length) {
        return NextResponse.json(
          { ok: false, error: 'Subject, intro, eventKey, and recipientEmails are required for reminders.' },
          { status: 400 }
        );
      }

      const queuedIds = await Promise.all(body.recipientEmails.map((recipientEmail) => queueReminderNotification({
        eventKey: `${body.eventKey}:${recipientEmail.toLowerCase()}`,
        recipientEmail,
        subject: body.subject as string,
        intro: body.intro as string,
        body: Array.isArray(body.body) ? body.body : [],
        ctaLabel: body.ctaLabel,
        ctaUrl: body.ctaUrl,
        scheduledFor,
      })));

      const processed = !scheduledFor ? await processEmailNotificationsByIds(queuedIds) : [];
      return NextResponse.json({ ok: true, queued: queuedIds.length, processed });
    }

    const queuedIds = await queueWeeklyNewsletterDigestNotifications(new Date(), { force: true });
    const processed = await processEmailNotificationsByIds(queuedIds);
    return NextResponse.json({ ok: true, queued: queuedIds.length, processed });
  } catch (error) {
    console.error('Admin notifications error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
