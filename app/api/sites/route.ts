import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapSite } from '@/lib/db/mappers';
import { ApiSite, ApiSitesResponse } from '@/lib/types/local';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { calculateMonthlyStorageRate } from '@/lib/pricing/storagePricing';
import { expireStalePendingBookings } from '@/lib/services/bookingLifecycle';

export async function GET() {
  try {
    await expireStalePendingBookings();
    const supabase = createAdminClient();
    const { data: siteRows, error } = await supabase
      .from('sites')
      .select('*, unit_types(*), storage_units(*, unit_type:unit_types(*))');

    if (error) {
      throw error;
    }

    const apiSites: ApiSite[] = (siteRows ?? []).map((row) => {
      const site = mapSite(row);
      const siteUnits = site.units ?? [];

      return {
        id: site.id.toString(),
        name: site.name,
        code: site.code,
        city: site.city || undefined,
        state: site.state || undefined,
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
              amount: calculateMonthlyStorageRate({ width: ut.width, depth: ut.depth, unit: ut.unit }),
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

    return NextResponse.json({ ok: true, sites: apiSites } satisfies ApiSitesResponse & { ok: true });
  } catch (error: unknown) {
    console.error('API Route /api/sites Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
