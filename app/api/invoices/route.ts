import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { INVOICE_RELATION_SELECT, mapInvoice } from '@/lib/db/mappers';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { env } from '@/config/env';

type InvoiceTokenPayload = jwt.JwtPayload & {
  userId?: string;
  role?: string;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, env.jwt.secret) as InvoiceTokenPayload;
    const userId = decoded.userId;
    const userRole = decoded.role;

    if (!userId) {
      return NextResponse.json({ ok: false, message: 'Invalid authentication token' }, { status: 401 });
    }

    const supabase = createAdminClient();
    let query = supabase
      .from('invoices')
      .select(INVOICE_RELATION_SELECT)
      .order('createdAt', { ascending: false });

    if (userRole !== 'admin') {
      query = query.eq('userId', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const invoices = (data ?? []).map((row) => mapInvoice(row));

    return NextResponse.json({ ok: true, invoices });
  } catch (error) {
    console.error('Fetch invoices error:', error);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
