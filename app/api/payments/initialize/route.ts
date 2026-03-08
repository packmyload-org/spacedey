import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Booking from '@/lib/db/entities/Booking';
import Payment, { PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { env } from '@/config/env';

export async function POST(req: Request) {
    try {
        const { bookingId, provider, amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ ok: false, message: 'Invalid payment amount' }, { status: 400 });
        }

        // 1. Auth check
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, env.jwt.secret) as any;
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

        // 3. Initialize Provider Payment
        // For iFitness model, we use the custom 'amount' passed from frontend (incremental)
        const reference = `SPDC-${bookingId.split('-')[0].toUpperCase()}-${Date.now()}`;
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`;
        const paymentAmount = Number(amount);

        let providerResponse;
        if (provider === PaymentProvider.PAYSTACK) {
            providerResponse = await paystack.initializePayment(booking.user.email, paymentAmount, reference, callbackUrl);
        } else if (provider === PaymentProvider.FLUTTERWAVE) {
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

    } catch (error: any) {
        console.error('Initialize payment error:', error);
        return NextResponse.json({ ok: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}
