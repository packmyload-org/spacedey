import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapUnitType } from '@/lib/db/mappers';
import type { Database } from '@/lib/supabase/database.types';
import { requireAdmin } from '@/lib/auth/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; unitId: string }> }
) {
  const { unitId } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const { data: existing, error: lookupError } = await supabase
      .from('unit_types')
      .select('id')
      .eq('id', unitId)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Unit type not found' }, { status: 404 });
    }

    const updates: Database['public']['Tables']['unit_types']['Update'] = {};

    if (body.name) updates.name = body.name;
    if (body.width !== undefined) updates.width = body.width;
    if (body.depth !== undefined) updates.depth = body.depth;
    if (body.unit) updates.unit = body.unit;
    if (body.priceAmount !== undefined) updates.priceAmount = body.priceAmount;
    if (body.priceCurrency) updates.priceCurrency = body.priceCurrency;
    if (body.priceOriginalAmount !== undefined) updates.priceOriginalAmount = body.priceOriginalAmount;
    if (body.description !== undefined) updates.description = body.description;
    if (body.availableCount !== undefined) updates.availableCount = body.availableCount;

    const { data: updatedRow, error: updateError } = await supabase
      .from('unit_types')
      .update(updates)
      .eq('id', unitId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true, unitType: mapUnitType(updatedRow) });
  } catch (error) {
    console.error('Update unit type error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; unitId: string }> }
) {
  const { unitId } = await params;
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.authorized) {
    return NextResponse.json(
      { ok: false, error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const supabase = createAdminClient();

    const { data: existing, error: lookupError } = await supabase
      .from('unit_types')
      .select('id')
      .eq('id', unitId)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Unit type not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase.from('unit_types').delete().eq('id', unitId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ ok: true, message: 'Unit type deleted successfully' });
  } catch (error) {
    console.error('Delete unit type error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
