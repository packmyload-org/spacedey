import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Payment, { PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { applySuccessfulPayment } from '@/lib/services/paymentProcessing';

export async function POST(req: Request) {
    try {
        const { reference, transactionId } = await req.json();

        const dataSource = await connectTypeORM();
        const paymentRepo = dataSource.getRepository(Payment);

        // 1. Find the pending payment
        const payment = await paymentRepo.findOne({
            where: { providerReference: reference },
            relations: ['booking', 'user']
        });

        if (!payment) {
            return NextResponse.json({ ok: false, message: 'Payment record not found' }, { status: 404 });
        }

        if (payment.status === PaymentStatus.SUCCESS) {
            return NextResponse.json({
                ok: true,
                message: 'Payment already verified',
                checkoutSource: payment.metadata?.checkoutSource ?? 'direct',
                paymentMode: payment.metadata?.paymentMode ?? 'monthly',
                recurringEnabled: payment.provider === PaymentProvider.PAYSTACK && payment.metadata?.paymentMode === 'monthly',
            });
        }

        // 2. Verify with Provider
        let isSuccessful = false;
        let providerData;

        if (payment.provider === PaymentProvider.PAYSTACK) {
            providerData = await paystack.verifyPayment(reference);
            isSuccessful = providerData.data.status === 'success';
        } else if (payment.provider === PaymentProvider.FLUTTERWAVE) {
            const providerTransactionId = transactionId || String(payment.metadata?.data?.id || '');

            // Ensure the transaction ID is a simple, well-formed identifier before using it in a URL path.
            const transactionIdPattern = /^[A-Za-z0-9_-]{1,128}$/;
            if (!providerTransactionId || !transactionIdPattern.test(providerTransactionId)) {
                return NextResponse.json(
                    { ok: false, message: 'Invalid Flutterwave transaction ID' },
                    { status: 400 }
                );
            }

            providerData = await flutterwave.verifyPayment(providerTransactionId);
            isSuccessful = providerData.data.status === 'successful';
        }

        // 3. Update status and Increment amountPaid
        if (isSuccessful) {
            const updatedBookings = await applySuccessfulPayment({
                dataSource,
                payment,
                providerData,
            });
            const primaryBooking = updatedBookings[0];

            return NextResponse.json({
                ok: true,
                message: 'Payment verified',
                bookingStatus: primaryBooking?.status,
                amountPaid: primaryBooking?.amountPaid,
                checkoutSource: payment.metadata?.checkoutSource ?? 'direct',
                paymentMode: payment.metadata?.paymentMode ?? 'monthly',
                recurringEnabled: payment.provider === PaymentProvider.PAYSTACK && payment.metadata?.paymentMode === 'monthly',
                processedBookings: updatedBookings.map((booking) => ({
                    bookingId: booking.id,
                    status: booking.status,
                    amountPaid: booking.amountPaid,
                })),
            });
        } else {
            payment.status = PaymentStatus.FAILED;
            await paymentRepo.save(payment);
            return NextResponse.json({ ok: false, message: 'Payment verification failed' });
        }

    } catch (error: unknown) {
        console.error('Verify payment error:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ ok: false, message }, { status: 500 });
    }
}
