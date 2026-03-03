// app/api/sites/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongo';
import Site from '@/lib/db/models/Site';
import UnitType from '@/lib/db/models/UnitType';
import { ApiSite, ApiSitesResponse, ApiErrorResponse } from '@/lib/types/local';

export async function GET() {
  try {
    await connectToDatabase();

    const sites = await Site.find().populate('unitTypes').exec();

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
        id: ut._id.toString(),
        name: ut.name,
        dimensions: {
          width: ut.dimensions.width,
          depth: ut.dimensions.depth,
          unit: ut.dimensions.unit,
        },
        price: {
          amount: ut.price.amount,
          currency: ut.price.currency,
          originalAmount: ut.price.originalAmount,
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
    const errorResponse: ApiErrorResponse = {
      error: errorMessage,
    };
    return NextResponse.json({ ok: false, ...errorResponse }, { status: 500 });
  }
}
