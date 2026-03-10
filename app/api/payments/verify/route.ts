import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import Payment, { PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { generateInvoice } from '@/lib/services/invoicing';

export async function POST(req: Request) {
    try {
        const { reference, provider, transactionId } = await req.json();

        const dataSource = await connectTypeORM();
        const bookingRepo = dataSource.getRepository(Booking);
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
            return NextResponse.json({ ok: true, message: 'Payment already verified' });
        }

        // 2. Verify with Provider
        let isSuccessful = false;
        let providerData;

        if (payment.provider === PaymentProvider.PAYSTACK) {
            providerData = await paystack.verifyPayment(reference);
            isSuccessful = providerData.data.status === 'success';
        } else if (payment.provider === PaymentProvider.FLUTTERWAVE) {
            providerData = await flutterwave.verifyPayment(transactionId || payment.metadata?.data?.id);
            isSuccessful = providerData.data.status === 'successful';
        }

        // 3. Update status and Increment amountPaid
        if (isSuccessful) {
            payment.status = PaymentStatus.SUCCESS;
            payment.metadata = { ...payment.metadata, verification: providerData };

            // Update booking balance
            const booking = await bookingRepo.findOne({
                where: { id: payment.booking.id },
                relations: ['site', 'unitType', 'user']
            });

            if (booking) {
                booking.amountPaid = Number(booking.amountPaid) + Number(payment.amount);

                // A booking becomes active once the joining fee and first month are covered.
                const activationThreshold = Number(booking.registrationFee) + Number(booking.monthlyRate);

                if (booking.amountPaid >= activationThreshold) {
                    booking.status = BookingStatus.ACTIVE;
                } else if (booking.amountPaid > 0) {
                    booking.status = BookingStatus.PARTIAL;
                }

                await bookingRepo.save(booking);
                await generateInvoice(dataSource, payment);
            }

            await paymentRepo.save(payment);

            return NextResponse.json({
                ok: true,
                message: 'Payment verified',
                bookingStatus: booking?.status,
                amountPaid: booking?.amountPaid
            });
        } else {
            payment.status = PaymentStatus.FAILED;
            await paymentRepo.save(payment);
            return NextResponse.json({ ok: false, message: 'Payment verification failed' });
        }

    } catch (error: any) {
        console.error('Verify payment error:', error);
        return NextResponse.json({ ok: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
}
