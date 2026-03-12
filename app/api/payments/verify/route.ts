import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Payment, { PaymentBillingType, PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { isRecurringBilling } from '@/lib/billing/config';
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
            const recurringEnabled = isRecurringBilling({
                billingType: payment.metadata?.billingType,
                legacyPaymentMode: payment.metadata?.paymentMode,
                provider: payment.provider,
            });
            const billingType = recurringEnabled ? PaymentBillingType.RECURRING : (payment.metadata?.billingType ?? PaymentBillingType.ONE_TIME);
            return NextResponse.json({
                ok: true,
                message: 'Payment already verified',
                checkoutSource: payment.metadata?.checkoutSource ?? 'direct',
                paymentMode: payment.metadata?.paymentMode ?? 'monthly',
                billingType,
                recurringDurationMonths: payment.metadata?.recurringDurationMonths,
                recurringEndsAt: payment.metadata?.recurringEndsAt ?? payment.booking.endDate?.toISOString() ?? null,
                recurringEnabled,
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
            const recurringEnabled = isRecurringBilling({
                billingType: payment.metadata?.billingType,
                legacyPaymentMode: payment.metadata?.paymentMode,
                provider: payment.provider,
            });
            const billingType = recurringEnabled ? PaymentBillingType.RECURRING : (payment.metadata?.billingType ?? PaymentBillingType.ONE_TIME);

            return NextResponse.json({
                ok: true,
                message: 'Payment verified',
                bookingStatus: primaryBooking?.status,
                amountPaid: primaryBooking?.amountPaid,
                checkoutSource: payment.metadata?.checkoutSource ?? 'direct',
                paymentMode: payment.metadata?.paymentMode ?? 'monthly',
                billingType,
                recurringDurationMonths: payment.metadata?.recurringDurationMonths,
                recurringEndsAt: payment.metadata?.recurringEndsAt ?? primaryBooking?.endDate?.toISOString() ?? null,
                recurringEnabled,
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
