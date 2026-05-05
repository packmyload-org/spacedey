import type { Metadata } from 'next';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import SiteDetails from "@/components/locations/SiteDetails";
import { notFound } from 'next/navigation';
import { calculateMonthlyStorageRate } from '@/lib/pricing/storagePricing';
import { expireStalePendingBookings } from '@/lib/services/bookingLifecycle';
import { buildPageMetadata, serializeJsonLd, toAbsoluteUrl } from '@/lib/seo';
import { getSiteCity, getSiteState } from '@/lib/utils/siteLocations';

async function getSiteByIdFromDB(siteId: string) {
  try {
    const appDataSource = await connectTypeORM();
    await expireStalePendingBookings(appDataSource);
    const repo = appDataSource.getRepository(Site);
    const site = await repo.findOne({ where: { id: siteId }, relations: ['unitTypes', 'units', 'units.unitType'] });
    return site;
  } catch (error) {
    console.error(`Failed to fetch site ${siteId}`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ siteId: string }> }
): Promise<Metadata> {
  const { siteId } = await params;
  const site = await getSiteByIdFromDB(siteId);

  if (!site) {
    return {
      title: 'Storage Location',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const city = getSiteCity({ city: site.city ?? undefined, address: site.address });
  const state = getSiteState({ state: site.state ?? undefined, address: site.address });
  const locationLabel = [city, state].filter(Boolean).join(', ');
  const availableUnits = (site.unitTypes || []).reduce((count, unitType) => (
    count + Number(unitType.availableCount || 0)
  ), 0);

  return buildPageMetadata({
    title: `${site.name} Self Storage${locationLabel ? ` in ${locationLabel}` : ''}`,
    description:
      site.about?.trim() ||
      `Explore ${site.name}${locationLabel ? ` in ${locationLabel}` : ''}, compare available storage units, and reserve secure self storage online with Spacedey.`,
    path: `/locations/${site.id}`,
    image: site.image,
    keywords: [
      site.name.toLowerCase(),
      city ? `self storage ${city.toLowerCase()}` : 'self storage nigeria',
      state ? `storage facility ${state.toLowerCase()}` : 'storage facility nigeria',
      city ? `storage units in ${city.toLowerCase()}` : 'storage units nigeria',
      availableUnits > 0 ? 'available storage units' : 'secure storage facility',
    ],
  });
}

export default async function SiteDetailsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const site = await getSiteByIdFromDB(siteId);

  if (!site) {
    return notFound();
  }

  const siteUnits = site.units || [];
  const city = getSiteCity({ city: site.city ?? undefined, address: site.address });
  const state = getSiteState({ state: site.state ?? undefined, address: site.address });
  const pageUrl = toAbsoluteUrl(`/locations/${site.id}`);
  const availableUnitCount = siteUnits.filter((unit) => unit.status === 'available').length;

  const siteData = {
    id: site.id,
    name: site.name,
    code: site.code,
    about: site.about || undefined,
    image: site.image || undefined,
    address: {
      street: site.address || undefined,
    },
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

      return ({
        id: ut.id,
        name: ut.name,
        code: ut.id,
        price: calculateMonthlyStorageRate({ width: ut.width, depth: ut.depth, unit: ut.unit }),
        dimensions: { width: ut.width, depth: ut.depth, height: 0, unit: ut.unit },
        description: ut.description,
        availableCount: (unitsForType.length > 0)
          ? unitsForType.filter((unit) => unit.status === 'available').length
          : ut.availableCount,
        siteId: site.id,
        units: unitsForType.map((unit) => ({
            id: unit.id,
            unitNumber: unit.unitNumber,
            status: unit.status,
            label: unit.label || undefined,
            note: unit.note || undefined,
            unitTypeId: ut.id,
            siteId: site.id,
          })),
      });
    }),
    units: siteUnits.map((unit) => ({
      id: unit.id,
      unitNumber: unit.unitNumber,
      status: unit.status,
      label: unit.label || undefined,
      note: unit.note || undefined,
      unitTypeId: unit.unitType?.id || '',
      siteId: site.id,
    })),
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
  };
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description:
      site.about ||
      `Storage facility${city ? ` in ${city}` : ''}${state ? `, ${state}` : ''}.`,
    url: pageUrl,
    image: site.image ? [site.image] : undefined,
    telephone: site.contactPhone || undefined,
    email: site.contactEmail || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: city || undefined,
      addressRegion: state || undefined,
      addressCountry: 'NG',
    },
    geo: (site.lat ?? site.latitude) && (site.lng ?? site.longitude)
      ? {
          '@type': 'GeoCoordinates',
          latitude: site.lat ?? site.latitude,
          longitude: site.lng ?? site.longitude,
        }
      : undefined,
    areaServed: [city, state].filter(Boolean),
    numberOfEmployees: undefined,
    makesOffer: availableUnitCount > 0
      ? {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            name: 'Self storage unit rental',
          },
        }
      : undefined,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Locations',
        item: toAbsoluteUrl('/locations'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: site.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <SiteDetails site={siteData} />
    </main>
  );
}
