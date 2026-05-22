import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PaymentBillingType, PaymentBookingAllocation, PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import {
  DEFAULT_RECURRING_DURATION_MONTHS,
  normalizeRecurringDurationMonths,
} from '@/lib/billing/config';
import { BookingStatus } from '@/lib/db/entities/Booking';
import { expireStalePendingBookings } from '@/lib/services/bookingLifecycle';
import { getPaymentMethodStatuses } from '@/lib/services/paymentMethodSettings';
import { mapBooking } from '@/lib/db/mappers';

interface InitializePaymentBody {
  bookingId?: string;
  bookingIds?: string[];
  bookingAllocations?: PaymentBookingAllocation[];
  provider?: PaymentProvider;
  amount?: number;
  checkoutSource?: 'cart' | 'direct' | 'bookings';
  paymentMode?: 'monthly' | 'full';
  monthsCovered?: number;
  billingType?: PaymentBillingType;
  recurringDurationMonths?: number;
}

function normalizeAllocations(body: InitializePaymentBody): PaymentBookingAllocation[] {
  if (Array.isArray(body.bookingAllocations) && body.bookingAllocations.length > 0) {
    return body.bookingAllocations
      .filter((allocation) => allocation?.bookingId && Number(allocation.amount) > 0)
      .map((allocation) => ({
        bookingId: allocation.bookingId,
        amount: Number(allocation.amount),
      }));
  }

  if (body.bookingId && Number(body.amount) > 0) {
    return [{ bookingId: body.bookingId, amount: Number(body.amount) }];
  }

  return [];
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as InitializePaymentBody;
    const { provider, paymentMode, monthsCovered, checkoutSource } = body;
    const billingType = body.billingType === PaymentBillingType.RECURRING
      ? PaymentBillingType.RECURRING
      : PaymentBillingType.ONE_TIME;
    const recurringDurationMonths = billingType === PaymentBillingType.RECURRING
      ? normalizeRecurringDurationMonths(body.recurringDurationMonths) ?? DEFAULT_RECURRING_DURATION_MONTHS
      : undefined;
    const bookingAllocations = normalizeAllocations(body);
    const bookingIds = bookingAllocations.map((allocation) => allocation.bookingId);
    const paymentAmount = Number(body.amount);

    if (bookingAllocations.length === 0) {
      return NextResponse.json({ ok: false, message: 'At least one booking allocation is required' }, { status: 400 });
    }

    if (!provider) {
      return NextResponse.json({ ok: false, message: 'Payment provider is required' }, { status: 400 });
    }

    if (!paymentAmount || paymentAmount <= 0) {
      return NextResponse.json({ ok: false, message: 'Invalid payment amount' }, { status: 400 });
    }

    const expectedAmount = bookingAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    if (Math.abs(expectedAmount - paymentAmount) > 0.01) {
      return NextResponse.json({ ok: false, message: 'Payment amount must match the sum of booking allocations' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, env.jwt.secret) as { userId: string };
    const userId = decoded.userId;
    const supabase = createAdminClient();

    const paymentMethods = await getPaymentMethodStatuses();
    const selectedMethod = paymentMethods.find((method) => method.provider === provider);
    await expireStalePendingBookings();

    if (!selectedMethod?.enabled) {
      return NextResponse.json({ ok: false, message: `${selectedMethod?.label ?? provider} is currently disabled by the admin.` }, { status: 403 });
    }

    if (!selectedMethod?.configured) {
      return NextResponse.json({ ok: false, message: `${selectedMethod.label} is not configured yet.` }, { status: 400 });
    }

    const { data: bookingRows, error: bookingsError } = await supabase
      .from('bookings')
      .select('*, user:users(*)')
      .in('id', bookingIds)
      .eq('userId', userId);

    if (bookingsError) {
      throw bookingsError;
    }

    const bookings = (bookingRows ?? []).map((row) => mapBooking(row));

    if (bookings.length !== bookingIds.length) {
      return NextResponse.json({ ok: false, message: 'One or more bookings were not found' }, { status: 404 });
    }

    const bookingMap = new Map(bookings.map((booking) => [booking.id, booking]));
    const primaryBooking = bookingMap.get(bookingIds[0]);

    if (!primaryBooking?.user) {
      return NextResponse.json({ ok: false, message: 'Primary booking not found' }, { status: 404 });
    }

    const bookingBillingTypes = new Set(bookings.map((booking) => booking.billingMetadata?.billingType ?? PaymentBillingType.ONE_TIME));
    if (bookingBillingTypes.size > 1) {
      return NextResponse.json({ ok: false, message: 'Selected bookings must use the same billing type' }, { status: 400 });
    }

    for (const allocation of bookingAllocations) {
      const booking = bookingMap.get(allocation.bookingId);
      if (!booking) {
        return NextResponse.json({ ok: false, message: 'One or more bookings were not found' }, { status: 404 });
      }

      if (![BookingStatus.PENDING, BookingStatus.PARTIAL].includes(booking.status)) {
        return NextResponse.json({ ok: false, message: 'Only pending bookings with an outstanding balance can be charged' }, { status: 400 });
      }

      const outstandingAmount = roundCurrency(Math.max(Number(booking.totalAmount) - Number(booking.amountPaid), 0));
      if (outstandingAmount <= 0) {
        return NextResponse.json({ ok: false, message: 'One or more bookings no longer have an outstanding balance' }, { status: 400 });
      }

      if (Math.abs(roundCurrency(Number(allocation.amount)) - outstandingAmount) > 0.01) {
        return NextResponse.json({ ok: false, message: 'Payment amount must match the booking balance due' }, { status: 400 });
      }
    }

    const recurringEndsAt = typeof primaryBooking.billingMetadata?.recurringEndDate === 'string'
      ? primaryBooking.billingMetadata.recurringEndDate
      : null;

    const reference = `SPDC-${primaryBooking.id.split('-')[0].toUpperCase()}-${Date.now()}`;
    const requestOrigin = new URL(req.url).origin;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin;
    const callbackUrl = new URL('/payment/callback', appUrl).toString();

    let providerResponse;
    let paystackPlan: Awaited<ReturnType<typeof paystack.ensureMonthlyPlan>> | null = null;
    let flutterwavePlan: Awaited<ReturnType<typeof flutterwave.ensureMonthlyPlan>> | null = null;

    if (provider === PaymentProvider.PAYSTACK) {
      if (!paystack.isConfigured()) {
        return NextResponse.json({ ok: false, message: 'Paystack is not configured yet' }, { status: 400 });
      }
      paystackPlan = billingType === PaymentBillingType.RECURRING
        ? await paystack.ensureMonthlyPlan(paymentAmount)
        : null;

      providerResponse = await paystack.initializePayment(
        primaryBooking.user.email,
        paymentAmount,
        reference,
        callbackUrl,
        billingType === PaymentBillingType.RECURRING
          ? {
              planCode: paystackPlan?.planCode,
              invoiceLimit: recurringDurationMonths,
              channels: ['card'],
              metadata: {
                checkoutSource: checkoutSource ?? 'direct',
                paymentMode: paymentMode ?? 'monthly',
                billingType,
                billingInterval: 'monthly',
                recurringDurationMonths,
                recurringEndsAt,
              },
            }
          : {}
      );
    } else if (provider === PaymentProvider.FLUTTERWAVE) {
      if (!flutterwave.isConfigured()) {
        return NextResponse.json({ ok: false, message: 'Flutterwave is not configured yet' }, { status: 400 });
      }
      flutterwavePlan = billingType === PaymentBillingType.RECURRING
        ? await flutterwave.ensureMonthlyPlan(paymentAmount, recurringDurationMonths ?? DEFAULT_RECURRING_DURATION_MONTHS)
        : null;
      providerResponse = await flutterwave.initializePayment(
        primaryBooking.user.email,
        paymentAmount,
        reference,
        callbackUrl,
        billingType === PaymentBillingType.RECURRING
          ? {
              paymentPlanId: flutterwavePlan?.paymentPlanId,
              paymentOptions: 'card',
              meta: {
                checkoutSource: checkoutSource ?? 'direct',
                paymentMode: paymentMode ?? 'monthly',
                billingType,
                billingInterval: 'monthly',
                recurringDurationMonths,
                recurringEndsAt,
              },
            }
          : {}
      );
    } else {
      return NextResponse.json({ ok: false, message: 'Invalid payment provider' }, { status: 400 });
    }

    const { error: paymentError } = await supabase.from('payments').insert({
      bookingId: primaryBooking.id,
      userId: primaryBooking.userId ?? primaryBooking.user.id,
      provider,
      providerReference: reference,
      amount: paymentAmount,
      status: PaymentStatus.PENDING,
      metadata: {
        ...providerResponse,
        bookingIds,
        bookingAllocations,
        checkoutSource: checkoutSource ?? 'direct',
        paymentMode: paymentMode ?? 'monthly',
        billingType,
        billingInterval: 'monthly',
        monthsCovered: monthsCovered ?? 1,
        recurringDurationMonths,
        recurringEndsAt,
        paystackPlanCode: provider === PaymentProvider.PAYSTACK && billingType === PaymentBillingType.RECURRING
          ? paystackPlan?.planCode
          : undefined,
        paystackPlanName: provider === PaymentProvider.PAYSTACK && billingType === PaymentBillingType.RECURRING
          ? paystackPlan?.planName
          : undefined,
        flutterwavePaymentPlanId: provider === PaymentProvider.FLUTTERWAVE && billingType === PaymentBillingType.RECURRING
          ? flutterwavePlan?.paymentPlanId
          : undefined,
        flutterwavePaymentPlanName: provider === PaymentProvider.FLUTTERWAVE && billingType === PaymentBillingType.RECURRING
          ? flutterwavePlan?.paymentPlanName
          : undefined,
      },
    });

    if (paymentError) {
      throw paymentError;
    }

    const paymentInitializedAt = new Date().toISOString();
    for (const booking of bookings) {
      await supabase
        .from('bookings')
        .update({
          billingMetadata: {
            ...(booking.billingMetadata ?? {}),
            pendingPaymentReference: reference,
            pendingPaymentInitializedAt: paymentInitializedAt,
          },
        })
        .eq('id', booking.id);
    }

    return NextResponse.json({
      ok: true,
      authorizationUrl: provider === PaymentProvider.PAYSTACK
        ? providerResponse.data.authorization_url
        : providerResponse.data.link,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Initialize payment error:', error);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
