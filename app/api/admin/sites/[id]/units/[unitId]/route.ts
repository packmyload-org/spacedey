import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapStorageUnit } from '@/lib/db/mappers';
import type { Database } from '@/lib/supabase/database.types';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { requireAdmin } from '@/lib/auth/admin';
import { syncUnitTypeAvailability } from '@/lib/db/storageUnits';

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
      .from('storage_units')
      .select('id, unitTypeId')
      .eq('id', unitId)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Storage unit not found' }, { status: 404 });
    }

    const updates: Database['public']['Tables']['storage_units']['Update'] = {};

    if (body.unitNumber !== undefined) updates.unitNumber = body.unitNumber;
    if (body.label !== undefined) updates.label = body.label || null;
    if (body.note !== undefined) updates.note = body.note || null;
    if (body.status !== undefined && Object.values(StorageUnitStatus).includes(body.status)) {
      updates.status = body.status;
    }

    const { data: updatedRow, error: updateError } = await supabase
      .from('storage_units')
      .update(updates)
      .eq('id', unitId)
      .select('*, unit_types(*)')
      .single();

    if (updateError) {
      throw updateError;
    }

    if (existing.unitTypeId) {
      await syncUnitTypeAvailability(existing.unitTypeId);
    }

    return NextResponse.json({ ok: true, unit: mapStorageUnit(updatedRow) });
  } catch (error) {
    console.error('Update storage unit error:', error);
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
      .from('storage_units')
      .select('id, unitTypeId')
      .eq('id', unitId)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Storage unit not found' }, { status: 404 });
    }

    const unitTypeId = existing.unitTypeId;

    const { error: deleteError } = await supabase.from('storage_units').delete().eq('id', unitId);

    if (deleteError) {
      throw deleteError;
    }

    if (unitTypeId) {
      await syncUnitTypeAvailability(unitTypeId);
    }

    return NextResponse.json({ ok: true, message: 'Storage unit deleted successfully' });
  } catch (error) {
    console.error('Delete storage unit error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
