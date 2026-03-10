import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Booking from '@/lib/db/entities/Booking';
import Payment, { PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { env } from '@/config/env';

interface InitializePaymentBody {
    bookingId?: string;
    provider?: PaymentProvider;
    amount?: number;
}

export async function POST(req: Request) {
    try {
        const { bookingId, provider, amount } = await req.json() as InitializePaymentBody;

        if (!bookingId) {
            return NextResponse.json({ ok: false, message: 'Booking is required' }, { status: 400 });
        }

        if (!provider) {
            return NextResponse.json({ ok: false, message: 'Payment provider is required' }, { status: 400 });
        }

        if (!amount || amount <= 0) {
            return NextResponse.json({ ok: false, message: 'Invalid payment amount' }, { status: 400 });
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

        // 2. Validate booking
        const booking = await bookingRepo.findOne({
            where: { id: bookingId, user: { id: userId } },
            relations: ['user']
        });

        if (!booking) {
            return NextResponse.json({ ok: false, message: 'Booking not found' }, { status: 404 });
        }

        // 3. Initialize provider payment using the requested installment/full amount
        const reference = `SPDC-${bookingId.split('-')[0].toUpperCase()}-${Date.now()}`;
        const requestOrigin = new URL(req.url).origin;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin;
        const callbackUrl = new URL('/payment/callback', appUrl).toString();
        const paymentAmount = Number(amount);

        let providerResponse;
        if (provider === PaymentProvider.PAYSTACK) {
            if (!paystack.isConfigured()) {
                return NextResponse.json({ ok: false, message: 'Paystack is not configured yet' }, { status: 400 });
            }
            providerResponse = await paystack.initializePayment(booking.user.email, paymentAmount, reference, callbackUrl);
        } else if (provider === PaymentProvider.FLUTTERWAVE) {
            if (!flutterwave.isConfigured()) {
                return NextResponse.json({ ok: false, message: 'Flutterwave is not configured yet' }, { status: 400 });
            }
            providerResponse = await flutterwave.initializePayment(booking.user.email, paymentAmount, reference, callbackUrl);
        } else {
            return NextResponse.json({ ok: false, message: 'Invalid payment provider' }, { status: 400 });
        }

        // 4. Record Pending Payment
        const payment = paymentRepo.create({
            booking,
            user: booking.user,
            provider,
            providerReference: reference,
            amount: paymentAmount,
            status: PaymentStatus.PENDING,
            metadata: providerResponse
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
