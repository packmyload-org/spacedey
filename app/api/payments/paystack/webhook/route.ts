import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import { PaymentBillingType, PaymentProvider, PaymentStatus, type PaymentBookingAllocation } from '@/lib/db/entities/Payment';
import { applySuccessfulPayment, fetchPaymentByReference } from '@/lib/services/paymentProcessing';
import {
  processEmailNotificationsByIds,
  queueOrderConfirmationNotifications,
} from '@/lib/services/emailNotifications';
import { BOOKING_RELATION_SELECT, mapBooking, mapPayment } from '@/lib/db/mappers';
import { asJson } from '@/lib/supabase/json';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

type PaystackWebhookEvent = {
  event?: string;
  data?: Record<string, unknown>;
};

function hasValidSignature(rawBody: string, signature: string | null) {
  if (!PAYSTACK_SECRET_KEY || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(signature, 'utf8')
  );
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function getNestedString(object: Record<string, unknown> | undefined, key: string) {
  return object ? getString(object[key]) : null;
}

function matchesRecurringGroup({
  booking,
  planCode,
  customerCode,
  customerEmail,
  subscriptionCode,
}: {
  booking: Booking;
  planCode: string | null;
  customerCode: string | null;
  customerEmail: string | null;
  subscriptionCode: string | null;
}) {
  const paystackMetadata = booking.billingMetadata?.paystack;
  if (booking.billingMetadata?.billingType !== PaymentBillingType.RECURRING || !paystackMetadata) {
    return false;
  }

  if (subscriptionCode && paystackMetadata.subscriptionCode === subscriptionCode) {
    return true;
  }

  const planMatches = planCode && paystackMetadata.planCode === planCode;
  const customerCodeMatches = customerCode && paystackMetadata.customerCode === customerCode;
  const customerEmailMatches = customerEmail && paystackMetadata.customerEmail === customerEmail;

  return Boolean(planMatches && (customerCodeMatches || customerEmailMatches));
}

export async function POST(req: Request) {
  const appUrl = new URL(req.url).origin;
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  if (!hasValidSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, message: 'Invalid Paystack signature' }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as PaystackWebhookEvent;
    const eventName = event.event;
    const data = event.data ?? {};
    const supabase = createAdminClient();

    if (eventName === 'subscription.create') {
      const customer = (data.customer as Record<string, unknown> | undefined) ?? undefined;
      const plan = (data.plan as Record<string, unknown> | undefined) ?? undefined;
      const subscriptionCode = getString(data.subscription_code)
        || getNestedString((data.subscription as Record<string, unknown> | undefined) ?? undefined, 'subscription_code');
      const customerCode = getNestedString(customer, 'customer_code') || getString(data.customer_code);
      const customerEmail = getNestedString(customer, 'email') || getString(data.email);
      const planCode = getNestedString(plan, 'plan_code') || getString(data.plan_code);

      if (!subscriptionCode) {
        return NextResponse.json({ ok: true, message: 'Ignored subscription event without subscription code' });
      }

      const { data: candidateRows } = await supabase
        .from('bookings')
        .select('*')
        .in('status', [BookingStatus.PENDING, BookingStatus.PARTIAL, BookingStatus.ACTIVE]);

      const matchingBookings = (candidateRows ?? [])
        .map((row) => mapBooking(row))
        .filter((booking) => matchesRecurringGroup({
          booking,
          planCode,
          customerCode,
          customerEmail,
          subscriptionCode,
        }));

      for (const booking of matchingBookings) {
        await supabase
          .from('bookings')
          .update({
            billingMetadata: {
              ...(booking.billingMetadata ?? {}),
              paystack: {
                ...(booking.billingMetadata?.paystack ?? {}),
                customerCode: customerCode ?? booking.billingMetadata?.paystack?.customerCode,
                customerEmail: customerEmail ?? booking.billingMetadata?.paystack?.customerEmail,
                planCode: planCode ?? booking.billingMetadata?.paystack?.planCode,
                subscriptionCode,
              },
            },
          })
          .eq('id', booking.id);
      }

      return NextResponse.json({ ok: true, updatedBookings: matchingBookings.length });
    }

    if (eventName !== 'charge.success') {
      return NextResponse.json({ ok: true, message: 'Event ignored' });
    }

    const reference = getString(data.reference);
    if (!reference) {
      return NextResponse.json({ ok: true, message: 'Ignored charge without reference' });
    }

    const existingPayment = await fetchPaymentByReference(reference);

    if (existingPayment?.status === PaymentStatus.SUCCESS) {
      return NextResponse.json({ ok: true, message: 'Payment already processed' });
    }

    if (existingPayment?.status === PaymentStatus.FAILED) {
      return NextResponse.json({ ok: true, message: 'Late success ignored for failed payment' });
    }

    if (existingPayment) {
      const updatedBookings = await applySuccessfulPayment({
        payment: existingPayment,
        providerData: event,
      });

      const notificationIds = await queueOrderConfirmationNotifications({
        source: 'payments/paystack-webhook-existing',
        appUrl,
        emails: updatedBookings.map(({ booking, invoice }) => ({
          to: booking.user!.email,
          firstName: booking.user!.firstName,
          siteName: booking.site!.name,
          invoiceNumber: invoice.invoiceNumber,
          amountPaid: Number(invoice.total),
          currency: invoice.currency,
          billingType: PaymentBillingType.RECURRING,
        })),
      });
      await processEmailNotificationsByIds(notificationIds);

      return NextResponse.json({ ok: true, processedBookings: updatedBookings.length });
    }

    const customer = (data.customer as Record<string, unknown> | undefined) ?? undefined;
    const plan = (data.plan as Record<string, unknown> | undefined) ?? undefined;
    const subscription = (data.subscription as Record<string, unknown> | undefined) ?? undefined;
    const customerCode = getNestedString(customer, 'customer_code') || getString(data.customer_code);
    const customerEmail = getNestedString(customer, 'email') || getString(data.email);
    const planCode = getNestedString(plan, 'plan_code') || getString(data.plan_code);
    const subscriptionCodeFromEvent = getNestedString(subscription, 'subscription_code') || getString(data.subscription_code);

    const { data: candidateRows } = await supabase
      .from('bookings')
      .select(BOOKING_RELATION_SELECT)
      .in('status', [BookingStatus.PENDING, BookingStatus.PARTIAL, BookingStatus.ACTIVE]);

    const matchingBookings = (candidateRows ?? [])
      .map((row) => mapBooking(row))
      .filter((booking) => matchesRecurringGroup({
        booking,
        planCode,
        customerCode,
        customerEmail,
        subscriptionCode: subscriptionCodeFromEvent,
      }));

    if (matchingBookings.length === 0) {
      return NextResponse.json({ ok: true, message: 'No matching recurring bookings found' });
    }

    const bookingAllocations: PaymentBookingAllocation[] = matchingBookings.map((booking) => ({
      bookingId: booking.id,
      amount: Number(booking.billingMetadata?.paystack?.allocationAmount ?? booking.monthlyRate),
    }));

    const primaryBooking = matchingBookings[0];
    const { data: recurringPaymentRow, error: paymentError } = await supabase
      .from('payments')
      .insert({
        bookingId: primaryBooking.id,
        userId: primaryBooking.userId ?? primaryBooking.user?.id,
        provider: PaymentProvider.PAYSTACK,
        providerReference: reference,
        amount: bookingAllocations.reduce((sum, allocation) => sum + allocation.amount, 0),
        status: PaymentStatus.PENDING,
        metadata: asJson({
          data,
          verification: event,
          bookingIds: matchingBookings.map((booking) => booking.id),
          bookingAllocations,
          checkoutSource: 'recurring',
          paymentMode: 'monthly',
          billingType: PaymentBillingType.RECURRING,
          billingInterval: 'monthly',
          monthsCovered: 1,
          recurringDurationMonths: primaryBooking.billingMetadata?.recurringDurationMonths,
          paystackPlanCode: planCode ?? primaryBooking.billingMetadata?.paystack?.planCode,
          paystackPlanName: getNestedString(plan, 'name') ?? primaryBooking.billingMetadata?.paystack?.planName,
        }),
      })
      .select('*, booking:bookings(*), user:users(*)')
      .single();

    if (paymentError) {
      throw paymentError;
    }

    const recurringPayment = mapPayment(recurringPaymentRow);
    const updatedBookings = await applySuccessfulPayment({
      payment: recurringPayment,
      providerData: event,
    });

    const notificationIds = await queueOrderConfirmationNotifications({
      source: 'payments/paystack-webhook-recurring',
      appUrl,
      emails: updatedBookings.map(({ booking, invoice }) => ({
        to: booking.user!.email,
        firstName: booking.user!.firstName,
        siteName: booking.site!.name,
        invoiceNumber: invoice.invoiceNumber,
        amountPaid: Number(invoice.total),
        currency: invoice.currency,
        billingType: PaymentBillingType.RECURRING,
      })),
    });
    await processEmailNotificationsByIds(notificationIds);

    return NextResponse.json({ ok: true, processedBookings: updatedBookings.length });
  } catch (error: unknown) {
    console.error('Paystack webhook error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
