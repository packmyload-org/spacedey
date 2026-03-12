import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Booking from '@/lib/db/entities/Booking';
import Payment, { PaymentBookingAllocation, PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { In } from 'typeorm';

interface InitializePaymentBody {
    bookingId?: string;
    bookingIds?: string[];
    bookingAllocations?: PaymentBookingAllocation[];
    provider?: PaymentProvider;
    amount?: number;
    checkoutSource?: 'cart' | 'direct' | 'bookings';
    paymentMode?: 'monthly' | 'full';
    monthsCovered?: number;
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

export async function POST(req: Request) {
    try {
        const body = await req.json() as InitializePaymentBody;
        const { provider, paymentMode, monthsCovered, checkoutSource } = body;
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

        // 3. Initialize provider payment using the requested installment/full amount
        const reference = `SPDC-${primaryBooking.id.split('-')[0].toUpperCase()}-${Date.now()}`;
        const requestOrigin = new URL(req.url).origin;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin;
        const callbackUrl = new URL('/payment/callback', appUrl).toString();

        let providerResponse;
        let paystackPlan: Awaited<ReturnType<typeof paystack.ensureMonthlyPlan>> | null = null;
        if (provider === PaymentProvider.PAYSTACK) {
            if (!paystack.isConfigured()) {
                return NextResponse.json({ ok: false, message: 'Paystack is not configured yet' }, { status: 400 });
            }
            const effectivePaymentMode = paymentMode ?? 'monthly';
            paystackPlan = effectivePaymentMode === 'monthly'
                ? await paystack.ensureMonthlyPlan(paymentAmount)
                : null;

            providerResponse = await paystack.initializePayment(
                primaryBooking.user.email,
                paymentAmount,
                reference,
                callbackUrl,
                effectivePaymentMode === 'monthly'
                    ? {
                        planCode: paystackPlan?.planCode,
                        channels: ['card'],
                        metadata: {
                            checkoutSource: checkoutSource ?? 'direct',
                            paymentMode: effectivePaymentMode,
                        },
                    }
                    : {}
            );
        } else if (provider === PaymentProvider.FLUTTERWAVE) {
            if (!flutterwave.isConfigured()) {
                return NextResponse.json({ ok: false, message: 'Flutterwave is not configured yet' }, { status: 400 });
            }
            providerResponse = await flutterwave.initializePayment(primaryBooking.user.email, paymentAmount, reference, callbackUrl);
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
                paymentMode: provider === PaymentProvider.PAYSTACK ? (paymentMode ?? 'monthly') : paymentMode,
                monthsCovered: monthsCovered ?? 1,
                paystackPlanCode: provider === PaymentProvider.PAYSTACK && (paymentMode ?? 'monthly') === 'monthly'
                    ? paystackPlan?.planCode
                    : undefined,
                paystackPlanName: provider === PaymentProvider.PAYSTACK && (paymentMode ?? 'monthly') === 'monthly'
                    ? paystackPlan?.planName
                    : undefined,
            }
        });

        await paymentRepo.save(payment);

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
