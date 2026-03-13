import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Booking from '@/lib/db/entities/Booking';
import Payment, { PaymentBillingType, PaymentBookingAllocation, PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { In } from 'typeorm';
import {
    DEFAULT_RECURRING_DURATION_MONTHS,
    normalizeRecurringDurationMonths,
} from '@/lib/billing/config';
import { BookingStatus } from '@/lib/db/entities/Booking';
import { expireStalePendingBookings } from '@/lib/services/bookingLifecycle';

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
        return [
            {
                bookingId: body.bookingId,
                amount: Number(body.amount),
            },
        ];
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

        // 1. Auth check
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, env.jwt.secret) as { userId: string };
        const userId = decoded.userId;

        const dataSource = await connectTypeORM();
        const bookingRepo = dataSource.getRepository(Booking);
        const paymentRepo = dataSource.getRepository(Payment);
        await expireStalePendingBookings(dataSource);

        const bookings = await bookingRepo.find({
            where: { id: In(bookingIds), user: { id: userId } },
            relations: ['user']
        });

        if (bookings.length !== bookingIds.length) {
            return NextResponse.json({ ok: false, message: 'One or more bookings were not found' }, { status: 404 });
        }

        const bookingMap = new Map(bookings.map((booking) => [booking.id, booking]));
        const primaryBooking = bookingMap.get(bookingIds[0]);
        if (!primaryBooking) {
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
                return NextResponse.json({
                    ok: false,
                    message: 'Payment amount must match the booking balance due',
                }, { status: 400 });
            }
        }

        const recurringEndsAt = typeof primaryBooking.billingMetadata?.recurringEndDate === 'string'
            ? primaryBooking.billingMetadata.recurringEndDate
            : null;

        // 3. Initialize provider payment using the requested installment/full amount
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

        // 4. Record Pending Payment
        const payment = paymentRepo.create({
            booking: primaryBooking,
            user: primaryBooking.user,
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
            }
        });

        await paymentRepo.save(payment);
        const paymentInitializedAt = new Date().toISOString();
        await bookingRepo.save(bookings.map((booking) => ({
            ...booking,
            billingMetadata: {
                ...(booking.billingMetadata ?? {}),
                pendingPaymentReference: reference,
                pendingPaymentInitializedAt: paymentInitializedAt,
            },
        })));

        return NextResponse.json({
            ok: true,
            authorizationUrl: provider === PaymentProvider.PAYSTACK ? providerResponse.data.authorization_url : providerResponse.data.link
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.error('Initialize payment error:', error);
        return NextResponse.json({ ok: false, message }, { status: 500 });
    }
}
