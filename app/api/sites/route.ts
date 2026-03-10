// app/api/sites/route.ts
import { NextResponse } from 'next/server';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import { ApiSite, ApiSitesResponse } from '@/lib/types/local';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';

export async function GET() {
  try {
    const appDataSource = await connectTypeORM();
    const repo = appDataSource.getRepository(Site);
    const sites = await repo.find({ relations: ['unitTypes', 'units', 'units.unitType'] });
    const apiSites: ApiSite[] = sites.map((site) => {
      const siteUnits = site.units || [];

      return {
        id: site.id.toString(),
        name: site.name,
        code: site.code,
        about: site.about || '',
        image: site.image || '',
        address: site.address,
        contact: {
          phone: site.contactPhone || '',
          email: site.contactEmail || '',
        },
        coordinates: {
          lat: site.lat ?? site.latitude ?? 0,
          lng: site.lng ?? site.longitude ?? 0,
        },
        unitTypes: (site.unitTypes || []).map((ut) => {
          const unitsForType = siteUnits.filter((unit) => unit.unitType?.id === ut.id);
          const availableCount = unitsForType.length > 0
            ? unitsForType.filter((unit) => unit.status === StorageUnitStatus.AVAILABLE).length
            : ut.availableCount;

          return {
            id: ut.id,
            name: ut.name,
            dimensions: {
              width: ut.width,
              depth: ut.depth,
              unit: ut.unit,
            },
            price: {
              amount: ut.priceAmount,
              currency: ut.priceCurrency,
              originalAmount: ut.priceOriginalAmount,
            },
            description: ut.description,
            availableCount,
            units: unitsForType.map((unit) => ({
              id: unit.id,
              unitNumber: unit.unitNumber,
              status: unit.status,
              label: unit.label || undefined,
              note: unit.note || undefined,
              unitTypeId: ut.id,
            })),
          };
        }),
        units: siteUnits.map((unit) => ({
          id: unit.id,
          unitNumber: unit.unitNumber,
          status: unit.status,
          label: unit.label || undefined,
          note: unit.note || undefined,
          unitTypeId: unit.unitType?.id || '',
        })),
      };
    });

    const response: ApiSitesResponse & { ok: true } = { ok: true, sites: apiSites };
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('API Route /api/sites Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
