import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { InvoiceStatus } from '@/lib/db/entities/Invoice';
import { getAdminInvoiceDetail } from '@/lib/services/adminInvoices';
import { PaymentBillingType } from '@/lib/db/entities/Payment';
import { resolveInvoiceLinkedUser } from '@/lib/services/invoiceUsers';
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

    const invoiceDetail = await getAdminInvoiceDetail(id);

    if (!invoiceDetail) {
      return NextResponse.json(
        { ok: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const user = resolveInvoiceLinkedUser({
      id: invoiceDetail.user.id,
      email: invoiceDetail.user.email,
      firstName: invoiceDetail.user.firstName,
      lastName: invoiceDetail.user.lastName,
    } as Parameters<typeof resolveInvoiceLinkedUser>[0]);

    if (user.isFallback) {
      return NextResponse.json(
        {
          ok: false,
          error: 'This invoice is linked to an unavailable account and cannot be resent.',
        },
        { status: 400 }
      );
    }

    const appUrl = new URL(request.url).origin;
    const eventKeySuffix = `${invoiceDetail.id}:${Date.now()}`;
    let notificationIds: string[] = [];
    const billingTypeValue = invoiceDetail.booking?.billingMetadata?.billingType;
    const billingType =
      billingTypeValue === PaymentBillingType.RECURRING
        ? PaymentBillingType.RECURRING
        : billingTypeValue === PaymentBillingType.ONE_TIME
          ? PaymentBillingType.ONE_TIME
          : undefined;

    if (invoiceDetail.status === InvoiceStatus.PAID) {
      notificationIds = await queueOrderConfirmationNotifications({
        source: `admin-resend-${eventKeySuffix}`,
        appUrl,
        emails: [
          {
            to: user.email,
            firstName: user.firstName,
            siteName: invoiceDetail.booking?.site?.name || 'Spacedey storage',
            invoiceNumber: invoiceDetail.invoiceNumber,
            amountPaid: Number(invoiceDetail.total),
            currency: invoiceDetail.currency,
            billingType,
          },
        ],
      });
    } else {
      const isOverdue = invoiceDetail.status === InvoiceStatus.OVERDUE;
      const reminderId = await queueReminderNotification({
        eventKey: `admin-invoice-reminder:${eventKeySuffix}`,
        recipientEmail: user.email,
        recipientName: user.firstName,
        subject: isOverdue ? 'Your Spacedey invoice is overdue' : 'Your Spacedey invoice is due soon',
        intro: `Hi ${user.firstName || 'there'}, invoice ${invoiceDetail.invoiceNumber} for ${invoiceDetail.booking?.site?.name || 'your storage booking'} needs your attention.`,
        body: [
          `Amount: ${new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: invoiceDetail.currency,
            maximumFractionDigits: 2,
          }).format(Number(invoiceDetail.total))}.`,
          `Due date: ${new Date(invoiceDetail.dueDate).toLocaleDateString('en-NG')}.`,
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
