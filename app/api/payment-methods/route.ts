import { NextResponse } from 'next/server';
import {
  getDefaultPaymentProvider,
  getPaymentMethodStatuses,
} from '@/lib/services/paymentMethodSettings';

export async function GET() {
  try {
    const methods = await getPaymentMethodStatuses();

    return NextResponse.json({
      ok: true,
      methods,
      defaultProvider: getDefaultPaymentProvider(methods),
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
