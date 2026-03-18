import { cache } from 'react';
import { connectTypeORM } from '@/lib/db';
import Site from '@/lib/db/entities/Site';
import { StorageUnitStatus } from '@/lib/db/entities/StorageUnit';
import { calculateMonthlyStorageRate, formatStorageUnitLabel } from '@/lib/pricing/storagePricing';
import { getLocationDetails } from '@/lib/utils/sampleLocations';
import { toLocationSlug } from '@/lib/utils/locationSeo';
import { getSiteCity, getSiteState } from '@/lib/utils/siteLocations';

export interface LocationSiteSummary {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  image: string;
  about: string;
  contactPhone: string;
  contactEmail: string;
  totalUnitTypes: number;
  totalUnits: number;
  availableUnits: number;
  minMonthlyPrice: number | null;
  maxMonthlyPrice: number | null;
  unitTypeLabels: string[];
  updatedAt: Date;
}

export interface CityLandingData {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  description: string;
  image: string;
  sites: LocationSiteSummary[];
  totalSites: number;
  totalUnitTypes: number;
  totalUnits: number;
  totalAvailableUnits: number;
  minMonthlyPrice: number | null;
  maxMonthlyPrice: number | null;
  unitTypeLabels: string[];
}

export interface StateLandingData {
  name: string;
  slug: string;
  description: string;
  image: string;
  sites: LocationSiteSummary[];
  cities: Array<{
    name: string;
    slug: string;
    totalSites: number;
    totalAvailableUnits: number;
  }>;
  totalSites: number;
  totalUnitTypes: number;
  totalUnits: number;
  totalAvailableUnits: number;
  minMonthlyPrice: number | null;
  maxMonthlyPrice: number | null;
  unitTypeLabels: string[];
}

function buildPriceRange(values: number[]) {
  if (values.length === 0) {
    return {
      min: null,
      max: null,
    };
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function summarizeDescription({
  areaName,
  facilityCount,
  availableUnits,
  unitTypes,
  city,
  state,
}: {
  areaName: string;
  facilityCount: number;
  availableUnits: number;
  unitTypes: string[];
  city?: string;
  state?: string;
}) {
  const inventoryLine = facilityCount === 1
    ? `${areaName} currently has 1 active storage facility`
    : `${areaName} currently has ${facilityCount} active storage facilities`;
  const availabilityLine = availableUnits > 0
    ? `with ${availableUnits} units available for quick reservation`
    : 'with flexible unit options for households and businesses';
  const unitTypeLine = unitTypes.length > 0
    ? `across ${unitTypes.slice(0, 3).join(', ')} storage sizes.`
    : 'with options for personal, business, and moving storage.';
  const geographyLine = city && state
    ? `Use this page to compare self storage in ${city}, ${state}, view facility details, and choose the right unit online.`
    : state
      ? `Use this page to compare self storage options across ${state}, review city coverage, and choose the right unit online.`
      : `Use this page to compare storage options in ${areaName} and choose the right unit online.`;

  return `${inventoryLine} ${availabilityLine} ${unitTypeLine} ${geographyLine}`;
}

export const listLocationSites = cache(async (): Promise<LocationSiteSummary[]> => {
  const appDataSource = await connectTypeORM();
  const repo = appDataSource.getRepository(Site);
  const sites = await repo.find({
    relations: ['unitTypes', 'units', 'units.unitType'],
    order: {
      updatedAt: 'DESC',
      name: 'ASC',
    },
  });

  return sites.map((site) => {
    const city = getSiteCity({ city: site.city ?? undefined, address: site.address });
    const state = getSiteState({ state: site.state ?? undefined, address: site.address });
    const detailFallback = getLocationDetails(city || site.name);
    const unitTypes = site.unitTypes || [];
    const units = site.units || [];
    const unitTypeLabels = unitTypes.map((unitType) => formatStorageUnitLabel({
      width: unitType.width,
      depth: unitType.depth,
      unit: unitType.unit,
    }));
    const pricing = unitTypes.map((unitType) => (
      calculateMonthlyStorageRate({
        width: unitType.width,
        depth: unitType.depth,
        unit: unitType.unit,
      })
    ));
    const availableUnits = unitTypes.reduce((count, unitType) => {
      const unitsForType = units.filter((unit) => unit.unitType?.id === unitType.id);

      if (unitsForType.length > 0) {
        return count + unitsForType.filter((unit) => unit.status === StorageUnitStatus.AVAILABLE).length;
      }

      return count + Number(unitType.availableCount || 0);
    }, 0);
    const priceRange = buildPriceRange(pricing);

    return {
      id: site.id,
      name: site.name,
      code: site.code,
      address: site.address,
      city,
      state,
      image: site.image || detailFallback.image,
      about: site.about || detailFallback.about,
      contactPhone: site.contactPhone || '',
      contactEmail: site.contactEmail || '',
      totalUnitTypes: unitTypes.length,
      totalUnits: units.length,
      availableUnits,
      minMonthlyPrice: priceRange.min,
      maxMonthlyPrice: priceRange.max,
      unitTypeLabels: Array.from(new Set(unitTypeLabels)),
      updatedAt: site.updatedAt,
    };
  });
});

export const listCityLandingPages = cache(async (): Promise<CityLandingData[]> => {
  const sites = await listLocationSites();
  const grouped = new Map<string, LocationSiteSummary[]>();

  for (const site of sites) {
    if (!site.city) {
      continue;
    }

    const key = `${site.city}:::${site.state}`;
    const current = grouped.get(key) || [];
    current.push(site);
    grouped.set(key, current);
  }

  return Array.from(grouped.entries())
    .map(([key, citySites]) => {
      const [name, state] = key.split(':::');
      const prices = citySites.flatMap((site) => (
        [site.minMonthlyPrice, site.maxMonthlyPrice].filter((value): value is number => value !== null)
      ));
      const unitTypeLabels = Array.from(new Set(citySites.flatMap((site) => site.unitTypeLabels))).slice(0, 6);
      const detailFallback = getLocationDetails(name);

      return {
        name,
        slug: toLocationSlug(name),
        state,
        stateSlug: toLocationSlug(state),
        description: summarizeDescription({
          areaName: name,
          facilityCount: citySites.length,
          availableUnits: citySites.reduce((sum, site) => sum + site.availableUnits, 0),
          unitTypes: unitTypeLabels,
          city: name,
          state,
        }),
        image: citySites.find((site) => Boolean(site.image))?.image || detailFallback.image,
        sites: citySites.sort((left, right) => left.name.localeCompare(right.name)),
        totalSites: citySites.length,
        totalUnitTypes: citySites.reduce((sum, site) => sum + site.totalUnitTypes, 0),
        totalUnits: citySites.reduce((sum, site) => sum + site.totalUnits, 0),
        totalAvailableUnits: citySites.reduce((sum, site) => sum + site.availableUnits, 0),
        minMonthlyPrice: prices.length > 0 ? Math.min(...prices) : null,
        maxMonthlyPrice: prices.length > 0 ? Math.max(...prices) : null,
        unitTypeLabels,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
});

export const listStateLandingPages = cache(async (): Promise<StateLandingData[]> => {
  const cityPages = await listCityLandingPages();
  const grouped = new Map<string, CityLandingData[]>();

  for (const cityPage of cityPages) {
    const current = grouped.get(cityPage.state) || [];
    current.push(cityPage);
    grouped.set(cityPage.state, current);
  }

  return Array.from(grouped.entries())
    .map(([name, cities]) => {
      const sites = cities.flatMap((city) => city.sites);
      const prices = sites.flatMap((site) => (
        [site.minMonthlyPrice, site.maxMonthlyPrice].filter((value): value is number => value !== null)
      ));
      const unitTypeLabels = Array.from(new Set(sites.flatMap((site) => site.unitTypeLabels))).slice(0, 6);
      const detailFallback = getLocationDetails(cities[0]?.name || name);

      return {
        name,
        slug: toLocationSlug(name),
        description: summarizeDescription({
          areaName: `${name} State`,
          facilityCount: sites.length,
          availableUnits: sites.reduce((sum, site) => sum + site.availableUnits, 0),
          unitTypes: unitTypeLabels,
          state: name,
        }),
        image: sites.find((site) => Boolean(site.image))?.image || detailFallback.image,
        sites,
        cities: cities.map((city) => ({
          name: city.name,
          slug: city.slug,
          totalSites: city.totalSites,
          totalAvailableUnits: city.totalAvailableUnits,
        })),
        totalSites: sites.length,
        totalUnitTypes: sites.reduce((sum, site) => sum + site.totalUnitTypes, 0),
        totalUnits: sites.reduce((sum, site) => sum + site.totalUnits, 0),
        totalAvailableUnits: sites.reduce((sum, site) => sum + site.availableUnits, 0),
        minMonthlyPrice: prices.length > 0 ? Math.min(...prices) : null,
        maxMonthlyPrice: prices.length > 0 ? Math.max(...prices) : null,
        unitTypeLabels,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
});

export async function getCityLandingPageBySlug(slug: string) {
  const cityPages = await listCityLandingPages();
  return cityPages.find((page) => page.slug === slug) ?? null;
}

export async function getStateLandingPageBySlug(slug: string) {
  const statePages = await listStateLandingPages();
  return statePages.find((page) => page.slug === slug) ?? null;
}
