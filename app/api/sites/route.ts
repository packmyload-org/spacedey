// app/api/sites/route.ts
import { NextResponse } from 'next/server';
import { connectTypeORM, AppDataSource } from '@/lib/db/typeorm';
import Site from '@/lib/db/entities/Site';
import UnitType from '@/lib/db/entities/UnitType';
import { ApiSite, ApiSitesResponse } from '@/lib/types/local';

export async function GET() {
  try {
    await connectTypeORM();
    const repo = AppDataSource.getRepository(Site);
    const sites = await repo.find({ relations: ['unitTypes'] });

    const apiSites: ApiSite[] = sites.map((site) => ({
      id: site._id.toString(),
      name: site.name,
      code: site.code,
      image: site.image || '',
      address: site.address,
      contact: {
        phone: site.contact.phone,
        email: site.contact.email,
      },
      coordinates: {
        lat: site.coordinates.lat,
        lng: site.coordinates.lng,
      },
      unitTypes: (site.unitTypes || []).map((ut: any) => ({
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
        availableCount: ut.availableCount,
      })),
    }));

    const response: ApiSitesResponse & { ok: true } = { ok: true, sites: apiSites };
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('API Route /api/sites Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
