import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import StorageUnit, { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
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
    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(StorageUnit);

    const unit = await repo.findOne({
      where: { id: unitId },
      relations: ['unitType'],
    });

    if (!unit) {
      return NextResponse.json({ ok: false, error: 'Storage unit not found' }, { status: 404 });
    }

    if (body.unitNumber !== undefined) unit.unitNumber = body.unitNumber;
    if (body.label !== undefined) unit.label = body.label || null;
    if (body.note !== undefined) unit.note = body.note || null;
    if (body.status !== undefined && Object.values(StorageUnitStatus).includes(body.status)) {
      unit.status = body.status;
    }

    await repo.save(unit);
    await syncUnitTypeAvailability(appDataSource, unit.unitType.id);

    return NextResponse.json({ ok: true, unit });
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
    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(StorageUnit);

    const unit = await repo.findOne({
      where: { id: unitId },
      relations: ['unitType'],
    });

    if (!unit) {
      return NextResponse.json({ ok: false, error: 'Storage unit not found' }, { status: 404 });
    }

    const unitTypeId = unit.unitType.id;
    await repo.remove(unit);
    await syncUnitTypeAvailability(appDataSource, unitTypeId);

    return NextResponse.json({ ok: true, message: 'Storage unit deleted successfully' });
  } catch (error) {
    console.error('Delete storage unit error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
