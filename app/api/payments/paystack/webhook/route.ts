import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { In } from 'typeorm';
import { connectTypeORM } from '@/lib/db';
import Booking, { BookingStatus } from '@/lib/db/entities/Booking';
import Payment, { PaymentProvider, PaymentStatus, type PaymentBookingAllocation } from '@/lib/db/entities/Payment';
import { applySuccessfulPayment } from '@/lib/services/paymentProcessing';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

type PaystackWebhookEvent = {
  event?: string;
  data?: Record<string, unknown>;
};

function hasValidSignature(rawBody: string, signature: string | null) {
  if (!PAYSTACK_SECRET_KEY || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(signature, 'utf8')
  );
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function getNestedString(object: Record<string, unknown> | undefined, key: string) {
  return object ? getString(object[key]) : null;
}

function matchesRecurringGroup({
  booking,
  planCode,
  customerCode,
  customerEmail,
  subscriptionCode,
}: {
  booking: Booking;
  planCode: string | null;
  customerCode: string | null;
  customerEmail: string | null;
  subscriptionCode: string | null;
}) {
  const paystackMetadata = booking.billingMetadata?.paystack;
  if (!paystackMetadata) {
    return false;
  }

  if (subscriptionCode && paystackMetadata.subscriptionCode === subscriptionCode) {
    return true;
  }

  const planMatches = planCode && paystackMetadata.planCode === planCode;
  const customerCodeMatches = customerCode && paystackMetadata.customerCode === customerCode;
  const customerEmailMatches = customerEmail && paystackMetadata.customerEmail === customerEmail;

  return Boolean(planMatches && (customerCodeMatches || customerEmailMatches));
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  if (!hasValidSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, message: 'Invalid Paystack signature' }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as PaystackWebhookEvent;
    const eventName = event.event;
    const data = event.data ?? {};
    const dataSource = await connectTypeORM();
    const bookingRepo = dataSource.getRepository(Booking);
    const paymentRepo = dataSource.getRepository(Payment);

    if (eventName === 'subscription.create') {
      const customer = (data.customer as Record<string, unknown> | undefined) ?? undefined;
      const plan = (data.plan as Record<string, unknown> | undefined) ?? undefined;
      const subscriptionCode = getString(data.subscription_code)
        || getNestedString((data.subscription as Record<string, unknown> | undefined) ?? undefined, 'subscription_code');
      const customerCode = getNestedString(customer, 'customer_code') || getString(data.customer_code);
      const customerEmail = getNestedString(customer, 'email') || getString(data.email);
      const planCode = getNestedString(plan, 'plan_code') || getString(data.plan_code);

      if (!subscriptionCode) {
        return NextResponse.json({ ok: true, message: 'Ignored subscription event without subscription code' });
      }

      const candidateBookings = await bookingRepo.find({
        where: { status: In([BookingStatus.PENDING, BookingStatus.PARTIAL, BookingStatus.ACTIVE]) },
      });

      const matchingBookings = candidateBookings.filter((booking) => matchesRecurringGroup({
        booking,
        planCode,
        customerCode,
        customerEmail,
        subscriptionCode,
      }));

      for (const booking of matchingBookings) {
        booking.billingMetadata = {
          ...(booking.billingMetadata ?? {}),
          paystack: {
            ...(booking.billingMetadata?.paystack ?? {}),
            customerCode: customerCode ?? booking.billingMetadata?.paystack?.customerCode,
            customerEmail: customerEmail ?? booking.billingMetadata?.paystack?.customerEmail,
            planCode: planCode ?? booking.billingMetadata?.paystack?.planCode,
            subscriptionCode,
          },
        };
        await bookingRepo.save(booking);
      }

      return NextResponse.json({ ok: true, updatedBookings: matchingBookings.length });
    }

    if (eventName !== 'charge.success') {
      return NextResponse.json({ ok: true, message: 'Event ignored' });
    }

    const reference = getString(data.reference);
    if (!reference) {
      return NextResponse.json({ ok: true, message: 'Ignored charge without reference' });
    }

    const existingPayment = await paymentRepo.findOne({
      where: { providerReference: reference },
      relations: ['booking', 'user'],
    });

    if (existingPayment?.status === PaymentStatus.SUCCESS) {
      return NextResponse.json({ ok: true, message: 'Payment already processed' });
    }

    if (existingPayment) {
      const updatedBookings = await applySuccessfulPayment({
        dataSource,
        payment: existingPayment,
        providerData: event,
      });

      return NextResponse.json({ ok: true, processedBookings: updatedBookings.length });
    }

    const customer = (data.customer as Record<string, unknown> | undefined) ?? undefined;
    const plan = (data.plan as Record<string, unknown> | undefined) ?? undefined;
    const subscription = (data.subscription as Record<string, unknown> | undefined) ?? undefined;
    const customerCode = getNestedString(customer, 'customer_code') || getString(data.customer_code);
    const customerEmail = getNestedString(customer, 'email') || getString(data.email);
    const planCode = getNestedString(plan, 'plan_code') || getString(data.plan_code);
    const subscriptionCode = getNestedString(subscription, 'subscription_code') || getString(data.subscription_code);

    const candidateBookings = await bookingRepo.find({
      where: { status: In([BookingStatus.PENDING, BookingStatus.PARTIAL, BookingStatus.ACTIVE]) },
      relations: ['site', 'unitType', 'user'],
    });

    const matchingBookings = candidateBookings.filter((booking) => matchesRecurringGroup({
      booking,
      planCode,
      customerCode,
      customerEmail,
      subscriptionCode,
    }));

    if (matchingBookings.length === 0) {
      return NextResponse.json({ ok: true, message: 'No matching recurring bookings found' });
    }

    const bookingAllocations: PaymentBookingAllocation[] = matchingBookings.map((booking) => ({
      bookingId: booking.id,
      amount: Number(booking.billingMetadata?.paystack?.allocationAmount ?? booking.monthlyRate),
    }));

    const recurringPayment = paymentRepo.create({
      booking: matchingBookings[0],
      user: matchingBookings[0].user,
      provider: PaymentProvider.PAYSTACK,
      providerReference: reference,
      amount: bookingAllocations.reduce((sum, allocation) => sum + allocation.amount, 0),
      status: PaymentStatus.PENDING,
      metadata: {
        data,
        verification: event,
        bookingIds: matchingBookings.map((booking) => booking.id),
        bookingAllocations,
        checkoutSource: 'recurring',
        paymentMode: 'monthly',
        monthsCovered: 1,
        paystackPlanCode: planCode ?? matchingBookings[0].billingMetadata?.paystack?.planCode,
        paystackPlanName: getNestedString(plan, 'name') ?? matchingBookings[0].billingMetadata?.paystack?.planName,
      },
    });

    await paymentRepo.save(recurringPayment);
    const updatedBookings = await applySuccessfulPayment({
      dataSource,
      payment: recurringPayment,
      providerData: event,
    });

    return NextResponse.json({ ok: true, processedBookings: updatedBookings.length });
  } catch (error: unknown) {
    console.error('Paystack webhook error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
