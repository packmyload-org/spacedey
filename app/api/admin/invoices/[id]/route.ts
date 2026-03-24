import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getAdminInvoiceDetail } from '@/lib/services/adminInvoices';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const { id } = await params;

    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    const invoice = await getAdminInvoiceDetail(id);

    if (!invoice) {
      return NextResponse.json(
        { ok: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      invoice,
    });
  } catch (error) {
    console.error('Admin invoice detail error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
