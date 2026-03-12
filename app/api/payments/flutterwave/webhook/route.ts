import { NextResponse } from 'next/server';
import { In } from 'typeorm';
import { connectTypeORM } from '@/lib/db';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import Payment, { PaymentBillingType, PaymentProvider, PaymentStatus, type PaymentBookingAllocation } from '@/lib/db/entities/Payment';
import { flutterwave } from '@/lib/services/flutterwave';
import { applySuccessfulPayment } from '@/lib/services/paymentProcessing';

const FLUTTERWAVE_SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH;

type FlutterwaveWebhookPayload = {
  event?: string;
  data?: {
    id?: number | string;
    status?: string;
    tx_ref?: string;
    payment_plan?: number | string;
    payment_plan_id?: number | string;
    flw_plan?: number | string;
    subscription_id?: number | string;
    customer?: {
      email?: string;
    };
    [key: string]: unknown;
  };
};

function hasValidHash(signature: string | null) {
  return Boolean(
    FLUTTERWAVE_SECRET_HASH
    && signature
    && signature === FLUTTERWAVE_SECRET_HASH
  );
}

function getPaymentPlanId(data: FlutterwaveWebhookPayload['data']) {
  return data?.payment_plan ?? data?.payment_plan_id ?? data?.flw_plan ?? null;
}

function normalizeId(value: number | string | null | undefined) {
  if (value === null || typeof value === 'undefined') {
    return null;
  }

  return String(value);
}

function matchesRecurringGroup(args: {
  booking: Booking;
  paymentPlanId: number | string | null;
  customerEmail: string | null;
  subscriptionId: number | string | null;
}) {
  const { booking } = args;

  if (booking.billingMetadata?.billingType !== PaymentBillingType.RECURRING) {
    return false;
  }

  const flutterwaveMetadata = booking.billingMetadata?.flutterwave;
  if (!flutterwaveMetadata) {
    return false;
  }

  if (normalizeId(args.subscriptionId) && normalizeId(flutterwaveMetadata.subscriptionId) === normalizeId(args.subscriptionId)) {
    return true;
  }

  if (!normalizeId(args.paymentPlanId)) {
    return false;
  }

  const planMatches = normalizeId(flutterwaveMetadata.paymentPlanId) === normalizeId(args.paymentPlanId);
  const emailMatches = Boolean(
    args.customerEmail
    && flutterwaveMetadata.customerEmail
    && flutterwaveMetadata.customerEmail.toLowerCase() === args.customerEmail.toLowerCase()
  );

  return Boolean(planMatches && emailMatches);
}

export async function POST(req: Request) {
  const signature = req.headers.get('verif-hash');
  if (!hasValidHash(signature)) {
    return NextResponse.json({ ok: false, message: 'Invalid Flutterwave signature' }, { status: 401 });
  }

  try {
    const event = await req.json() as FlutterwaveWebhookPayload;
    const data = event.data;

    if (!data || data.status !== 'successful') {
      return NextResponse.json({ ok: true, message: 'Event ignored' });
    }

    const reference = typeof data.tx_ref === 'string' ? data.tx_ref : null;
    const transactionId = data.id ? String(data.id) : null;
    if (!reference || !transactionId) {
      return NextResponse.json({ ok: true, message: 'Event ignored' });
    }

    const dataSource = await connectTypeORM();
    const paymentRepo = dataSource.getRepository(Payment);
    const bookingRepo = dataSource.getRepository(Booking);

    const verifiedPayment = await flutterwave.verifyPayment(transactionId);
    const verifiedData = verifiedPayment?.data ?? {};
    if (verifiedData.status !== 'successful') {
      return NextResponse.json({ ok: true, message: 'Verification ignored' });
    }

    const existingPayment = await paymentRepo.findOne({
      where: { providerReference: reference },
      relations: ['booking', 'user'],
    });

    if (existingPayment?.status === PaymentStatus.SUCCESS) {
      return NextResponse.json({ ok: true, message: 'Payment already processed' });
    }

    if (existingPayment?.status === PaymentStatus.FAILED) {
      return NextResponse.json({ ok: true, message: 'Late success ignored for failed payment' });
    }

    if (existingPayment) {
      const updatedBookings = await applySuccessfulPayment({
        dataSource,
        payment: existingPayment,
        providerData: verifiedPayment,
      });

      return NextResponse.json({ ok: true, processedBookings: updatedBookings.length });
    }

    const paymentPlanId = getPaymentPlanId(verifiedData);
    const customerEmail = typeof verifiedData.customer?.email === 'string' ? verifiedData.customer.email : null;
    const subscriptionId = verifiedData.subscription_id ?? null;

    const candidateBookings = await bookingRepo.find({
      where: { status: In([BookingStatus.PENDING, BookingStatus.PARTIAL, BookingStatus.ACTIVE]) },
      relations: ['site', 'unitType', 'user'],
    });

    const matchingBookings = candidateBookings.filter((booking) => matchesRecurringGroup({
      booking,
      paymentPlanId,
      customerEmail,
      subscriptionId,
    }));

    if (matchingBookings.length === 0) {
      return NextResponse.json({ ok: true, message: 'No matching recurring bookings found' });
    }

    const bookingAllocations: PaymentBookingAllocation[] = matchingBookings.map((booking) => ({
      bookingId: booking.id,
      amount: Number(booking.billingMetadata?.flutterwave?.allocationAmount ?? booking.monthlyRate),
    }));

    const recurringPayment = paymentRepo.create({
      booking: matchingBookings[0],
      user: matchingBookings[0].user,
      provider: PaymentProvider.FLUTTERWAVE,
      providerReference: reference,
      amount: bookingAllocations.reduce((sum, allocation) => sum + allocation.amount, 0),
      status: PaymentStatus.PENDING,
      metadata: {
        data: verifiedData,
        verification: verifiedPayment,
        bookingIds: matchingBookings.map((booking) => booking.id),
        bookingAllocations,
        checkoutSource: 'recurring',
        paymentMode: 'monthly',
        billingType: PaymentBillingType.RECURRING,
        billingInterval: 'monthly',
        monthsCovered: 1,
        recurringDurationMonths: matchingBookings[0].billingMetadata?.recurringDurationMonths,
        recurringEndsAt: matchingBookings[0].billingMetadata?.recurringEndDate ?? null,
        flutterwavePaymentPlanId: paymentPlanId ?? matchingBookings[0].billingMetadata?.flutterwave?.paymentPlanId,
        flutterwavePaymentPlanName: matchingBookings[0].billingMetadata?.flutterwave?.paymentPlanName,
      },
    });

    await paymentRepo.save(recurringPayment);

    const updatedBookings = await applySuccessfulPayment({
      dataSource,
      payment: recurringPayment,
      providerData: verifiedPayment,
    });

    return NextResponse.json({ ok: true, processedBookings: updatedBookings.length });
  } catch (error: unknown) {
    console.error('Flutterwave webhook error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
