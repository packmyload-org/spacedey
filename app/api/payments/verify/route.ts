// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { reference } = await request.json();

        if (!reference) {
            return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            console.error('PAYSTACK_SECRET_KEY is not defined');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json();
            console.error('Paystack verification failed:', errorData);
            return NextResponse.json({ error: 'Payment verification failed', details: errorData }, { status: verifyResponse.status });
        }

        const data = await verifyResponse.json();

        if (data.data.status === 'success') {
            return NextResponse.json({
                status: 'success',
                reference: data.data.reference,
                amount: data.data.amount,
                message: 'Payment verified successfully',
                data: data.data
            });
        } else {
            return NextResponse.json({
                status: 'failed',
                message: 'Payment verification failed: ' + data.data.gateway_response,
            }, { status: 400 });
        }

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
