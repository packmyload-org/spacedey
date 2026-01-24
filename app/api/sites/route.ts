// app/api/sites/route.ts
import { NextResponse } from 'next/server';
import { getSites } from '@/lib/api/storeganise';
import { ApiSite, ApiSitesResponse, ApiErrorResponse } from '@/lib/types/storeganise';
import { getLocalizedValue } from '@/lib/utils/storeganise';

export async function GET() {
  try {
    const rawSites = await getSites();

    const sites: ApiSite[] = rawSites.map((site) => {
      // Create a clean address string
      const addressParts = [];
      if (site.address) {
        if (site.address.street) addressParts.push(getLocalizedValue(site.address.street));
        if (site.address.city) addressParts.push(getLocalizedValue(site.address.city));
        if (site.address.state) addressParts.push(getLocalizedValue(site.address.state));
      }
      const addressString = addressParts.length > 0 
        ? addressParts.join(', ') 
        : 'Address not available';

      return {
        id: site.id,
        name: getLocalizedValue(site.title),
        code: site.code,
        image: site.image || '',
        address: addressString,
        contact: {
          phone: site.phone || '',
          email: site.email || '',
        },
        coordinates: {
          lat: site.lat || 0,
          lng: site.lng || 0,
        },
        unitTypes: (site.unitTypes || []).map((ut) => ({
          id: ut.id,
          name: getLocalizedValue(ut.title),
          dimensions: {
            width: ut.width,
            depth: ut.depth,
            unit: site.measure || 'ft',
          },
          price: {
            amount: ut.price,
            currency: 'NGN', // Assuming NGN for now, could be ut.currency if available
            originalAmount: ut.price * 1.2, // Mocking original price for promo
          },
          description: getLocalizedValue(ut.description),
          availableCount: ut.availableCount || 0,
        })),
      };
    });

    const response: ApiSitesResponse = { sites };
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('API Route /api/sites Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const errorResponse: ApiErrorResponse = {
      error: errorMessage,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
