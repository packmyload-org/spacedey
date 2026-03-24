import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { listAdminInvoices } from '@/lib/services/adminInvoices';

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const invoices = await listAdminInvoices();

    return NextResponse.json({
      ok: true,
      invoices,
    });
  } catch (error) {
    console.error('Admin invoices list error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
