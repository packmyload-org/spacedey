import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import Payment, { PaymentBillingType, PaymentProvider, PaymentStatus } from '@/lib/db/entities/Payment';
import { isRecurringBilling } from '@/lib/billing/config';
import StorageUnit, { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { syncUnitTypeAvailability } from '@/lib/db/storageUnits';
import { paystack } from '@/lib/services/paystack';
import { flutterwave } from '@/lib/services/flutterwave';
import { applySuccessfulPayment, getPaymentAllocations } from '@/lib/services/paymentProcessing';
import { In } from 'typeorm';

async function releaseFailedPendingBookings(payment: Payment) {
    const bookingAllocations = getPaymentAllocations(payment);
    const bookingIds = bookingAllocations.map((allocation) => allocation.bookingId);

    if (bookingIds.length === 0) {
        return;
    }

    const dataSource = await connectTypeORM();

    await dataSource.transaction(async (manager) => {
        const bookingRepo = manager.getRepository(Booking);
        const storageUnitRepo = manager.getRepository(StorageUnit);
        const bookings = await bookingRepo.find({
            where: { id: In(bookingIds) },
            relations: ['storageUnit', 'unitType'],
        });

        for (const booking of bookings) {
            const ownsCurrentHold = booking.billingMetadata?.pendingPaymentReference === payment.providerReference;
            if (!ownsCurrentHold || booking.status !== BookingStatus.PENDING || Number(booking.amountPaid) > 0 || !booking.storageUnit) {
                continue;
            }

            const storageUnit = await storageUnitRepo.findOne({
                where: { id: booking.storageUnit.id },
                relations: ['unitType'],
            });

            if (storageUnit && storageUnit.status === StorageUnitStatus.RESERVED) {
                storageUnit.status = StorageUnitStatus.AVAILABLE;
                await storageUnitRepo.save(storageUnit);
            }

            booking.billingMetadata = {
                ...(booking.billingMetadata ?? {}),
                pendingPaymentReference: undefined,
                pendingPaymentInitializedAt: undefined,
            };
            booking.status = BookingStatus.CANCELLED;
            await bookingRepo.save(booking);
        }
    });

    const syncedUnitTypeIds = new Set<string>();
    for (const bookingId of bookingIds) {
        const bookingRepo = dataSource.getRepository(Booking);
        const booking = await bookingRepo.findOne({
            where: { id: bookingId },
            relations: ['unitType'],
        });

        const unitTypeId = booking?.unitType?.id;
        if (unitTypeId && !syncedUnitTypeIds.has(unitTypeId)) {
            await syncUnitTypeAvailability(dataSource, unitTypeId);
            syncedUnitTypeIds.add(unitTypeId);
        }
    }
}

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

        if (payment.status === PaymentStatus.FAILED) {
            return NextResponse.json({
                ok: false,
                message: 'This payment attempt is no longer valid. Please start checkout again.',
            }, { status: 409 });
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
            await releaseFailedPendingBookings(payment);
            return NextResponse.json({ ok: false, message: 'Payment verification failed' });
        }

    } catch (error: unknown) {
        console.error('Verify payment error:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ ok: false, message }, { status: 500 });
    }
}
