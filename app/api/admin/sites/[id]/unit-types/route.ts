import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapUnitType } from '@/lib/db/mappers';
import { requireAdmin } from '@/lib/auth/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      width,
      depth,
      unit,
      priceAmount,
      priceCurrency,
      priceOriginalAmount,
      description,
      availableCount,
    } = body;

    if (!name || width === undefined || depth === undefined || priceAmount === undefined) {
      return NextResponse.json(
        { ok: false, error: 'Name, width, depth, and price are required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (siteError) {
      throw siteError;
    }

    if (!site) {
      return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
    }

    const { data: newUnitRow, error: insertError } = await supabase
      .from('unit_types')
      .insert({
        name,
        width,
        depth,
        unit: unit || 'ft',
        priceAmount,
        priceCurrency: priceCurrency || 'NGN',
        priceOriginalAmount,
        description,
        availableCount: availableCount || 0,
        siteId: id,
      })
      .select('*')
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      { ok: true, unitType: mapUnitType(newUnitRow) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create unit type error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
