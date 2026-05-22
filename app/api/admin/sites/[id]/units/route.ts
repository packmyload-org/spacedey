import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapStorageUnit } from '@/lib/db/mappers';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { requireAdmin } from '@/lib/auth/admin';
import { syncUnitTypeAvailability } from '@/lib/db/storageUnits';

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
    const { unitNumber, unitTypeId, status, label, note } = body;

    if (!unitNumber || !unitTypeId) {
      return NextResponse.json(
        { ok: false, error: 'Unit number and unit type are required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const [{ data: site, error: siteError }, { data: unitType, error: unitTypeError }] =
      await Promise.all([
        supabase.from('sites').select('id').eq('id', id).maybeSingle(),
        supabase.from('unit_types').select('id, siteId').eq('id', unitTypeId).maybeSingle(),
      ]);

    if (siteError) {
      throw siteError;
    }
    if (unitTypeError) {
      throw unitTypeError;
    }

    if (!site) {
      return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
    }

    if (!unitType || unitType.siteId !== site.id) {
      return NextResponse.json(
        { ok: false, error: 'Unit type not found for this site' },
        { status: 404 }
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from('storage_units')
      .select('id')
      .eq('unitNumber', unitNumber)
      .eq('siteId', site.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Unit number already exists for this site.' },
        { status: 409 }
      );
    }

    const validStatus = Object.values(StorageUnitStatus).includes(status)
      ? status
      : StorageUnitStatus.AVAILABLE;

    const { data: createdRow, error: insertError } = await supabase
      .from('storage_units')
      .insert({
        unitNumber,
        status: validStatus,
        label: label || null,
        note: note || null,
        siteId: site.id,
        unitTypeId,
      })
      .select('*, unit_types(*)')
      .single();

    if (insertError) {
      throw insertError;
    }

    await syncUnitTypeAvailability(unitTypeId);

    return NextResponse.json(
      { ok: true, unit: mapStorageUnit(createdRow) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create storage unit error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
