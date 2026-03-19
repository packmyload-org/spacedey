import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { connectTypeORM } from '@/lib/db';
import Invoice, { InvoiceStatus } from '@/lib/db/entities/Invoice';
import { PaymentBillingType } from '@/lib/db/entities/Payment';
import {
  processEmailNotificationsByIds,
  queueOrderConfirmationNotifications,
  queueReminderNotification,
} from '@/lib/services/emailNotifications';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const { id } = await params;

    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    const dataSource = await connectTypeORM();
    const invoiceRepo = dataSource.getRepository(Invoice);
    const invoice = await invoiceRepo.findOne({
      where: { id },
      relations: ['user', 'booking', 'booking.site'],
    });

    if (!invoice) {
      return NextResponse.json(
        { ok: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const appUrl = new URL(request.url).origin;
    const eventKeySuffix = `${invoice.id}:${Date.now()}`;
    let notificationIds: string[] = [];
    const billingTypeValue = invoice.booking?.billingMetadata?.billingType;
    const billingType =
      billingTypeValue === PaymentBillingType.RECURRING
        ? PaymentBillingType.RECURRING
        : billingTypeValue === PaymentBillingType.ONE_TIME
          ? PaymentBillingType.ONE_TIME
          : undefined;

    if (invoice.status === InvoiceStatus.PAID) {
      notificationIds = await queueOrderConfirmationNotifications({
        source: `admin-resend-${eventKeySuffix}`,
        appUrl,
        emails: [
          {
            to: invoice.user.email,
            firstName: invoice.user.firstName,
            siteName: invoice.booking?.site?.name || 'Spacedey storage',
            invoiceNumber: invoice.invoiceNumber,
            amountPaid: Number(invoice.total),
            currency: invoice.currency,
            billingType,
          },
        ],
      });
    } else {
      const isOverdue = invoice.status === InvoiceStatus.OVERDUE;
      const reminderId = await queueReminderNotification({
        eventKey: `admin-invoice-reminder:${eventKeySuffix}`,
        recipientEmail: invoice.user.email,
        recipientName: invoice.user.firstName,
        subject: isOverdue ? 'Your Spacedey invoice is overdue' : 'Your Spacedey invoice is due soon',
        intro: `Hi ${invoice.user.firstName || 'there'}, invoice ${invoice.invoiceNumber} for ${invoice.booking?.site?.name || 'your storage booking'} needs your attention.`,
        body: [
          `Amount: ${new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: invoice.currency,
            maximumFractionDigits: 2,
          }).format(Number(invoice.total))}.`,
          `Due date: ${invoice.dueDate.toLocaleDateString('en-NG')}.`,
          isOverdue
            ? 'This invoice is now overdue. Please review payment as soon as possible.'
            : 'This invoice is coming due soon. Please review it before the deadline.',
        ],
        ctaLabel: 'View invoices',
        ctaUrl: `${appUrl}/invoices`,
      });
      notificationIds = [reminderId];
    }

    const results = await processEmailNotificationsByIds(notificationIds);
    const failed = results.find((result) => result.status !== 'sent');

    if (failed) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invoice email could not be resent.',
          notificationResults: results,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Invoice email resent successfully.',
      notificationResults: results,
    });
  } catch (error) {
    console.error('Admin invoice resend error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
