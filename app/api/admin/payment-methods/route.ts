import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { PaymentProvider } from '@/lib/db/entities/Payment';
import {
  getDefaultPaymentProvider,
  getPaymentMethodStatuses,
  updatePaymentMethodStatuses,
} from '@/lib/services/paymentMethodSettings';

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const methods = await getPaymentMethodStatuses();

    return NextResponse.json({
      ok: true,
      methods,
      defaultProvider: getDefaultPaymentProvider(methods),
    });
  } catch (error) {
    console.error('Get payment method settings error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json() as {
      methods?: Array<{ provider?: PaymentProvider; enabled?: boolean }>;
    };

    if (!Array.isArray(body.methods) || body.methods.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'At least one payment method update is required.' },
        { status: 400 }
      );
    }

    const updates: Partial<Record<PaymentProvider, boolean>> = {};

    for (const method of body.methods) {
      if (!method?.provider || !Object.values(PaymentProvider).includes(method.provider)) {
        return NextResponse.json(
          { ok: false, error: 'Each payment method update must include a valid provider.' },
          { status: 400 }
        );
      }

      if (typeof method.enabled !== 'boolean') {
        return NextResponse.json(
          { ok: false, error: 'Each payment method update must include an enabled boolean.' },
          { status: 400 }
        );
      }

      updates[method.provider] = method.enabled;
    }

    const methods = await updatePaymentMethodStatuses(updates);

    return NextResponse.json({
      ok: true,
      methods,
      defaultProvider: getDefaultPaymentProvider(methods),
    });
  } catch (error) {
    console.error('Update payment method settings error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
