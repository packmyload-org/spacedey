import { NextRequest, NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import UnitType from '@/lib/db/entities/UnitType';
import StorageUnit, { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
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

    const appDataSource = await connectTypeORM();
    const siteRepo = appDataSource.getRepository(Site);
    const unitTypeRepo = appDataSource.getRepository(UnitType);
    const storageUnitRepo = appDataSource.getRepository(StorageUnit);

    const [site, unitType] = await Promise.all([
      siteRepo.findOne({ where: { id } }),
      unitTypeRepo.findOne({ where: { id: unitTypeId }, relations: ['site'] }),
    ]);

    if (!site) {
      return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
    }

    if (!unitType || unitType.site.id !== site.id) {
      return NextResponse.json({ ok: false, error: 'Unit type not found for this site' }, { status: 404 });
    }

    const existing = await storageUnitRepo.findOne({
      where: {
        unitNumber,
        site: { id: site.id },
      },
      relations: ['site'],
    });

    if (existing) {
      return NextResponse.json({ ok: false, error: 'Unit number already exists for this site.' }, { status: 409 });
    }

    const validStatus = Object.values(StorageUnitStatus).includes(status)
      ? status
      : StorageUnitStatus.AVAILABLE;

    const storageUnit = storageUnitRepo.create({
      unitNumber,
      status: validStatus,
      label: label || null,
      note: note || null,
      site,
      unitType,
    });

    await storageUnitRepo.save(storageUnit);
    await syncUnitTypeAvailability(appDataSource, unitType.id);

    const createdUnit = await storageUnitRepo.findOne({
      where: { id: storageUnit.id },
      relations: ['unitType'],
    });

    return NextResponse.json({ ok: true, unit: createdUnit }, { status: 201 });
  } catch (error) {
    console.error('Create storage unit error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
