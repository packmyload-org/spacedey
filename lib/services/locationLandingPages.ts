import { cache } from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { mapSite } from '@/lib/db/mappers';
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
  state
}: { state: string}) {
  const description = `Affordable, Secure Storage facilities, Compare and reserve facilities in ${state? state : "Lagos"} and across Nigeria for personal items and moving support`
  return description;
}

function getUnitTypeId(unit: { unitType?: { id: string } | null; unitTypeId?: string | null }) {
  if (unit.unitType?.id) {
    return unit.unitType.id;
  }

  return unit.unitTypeId ?? null;
}

export const listLocationSites = cache(async (): Promise<LocationSiteSummary[]> => {
  const supabase = createAdminClient();
  const { data: siteRows, error } = await supabase
    .from('sites')
    .select('*, unit_types(*), storage_units(*)')
    .order('updatedAt', { ascending: false })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (siteRows ?? []).map((row) => {
    const site = mapSite(row);
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
      const unitsForType = units.filter((unit) => getUnitTypeId(unit) === unitType.id);

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

function buildCityLandingPages(sites: LocationSiteSummary[]): CityLandingData[] {
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
          state:name,
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
}

function buildStateLandingPages(cityPages: CityLandingData[]): StateLandingData[] {
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
}

export const listCityLandingPages = cache(async (): Promise<CityLandingData[]> => {
  const sites = await listLocationSites();
  return buildCityLandingPages(sites);
});

export const listStateLandingPages = cache(async (): Promise<StateLandingData[]> => {
  const cityPages = await listCityLandingPages();
  return buildStateLandingPages(cityPages);
});

export const getLocationLandingPages = cache(async () => {
  const cityPages = await listCityLandingPages();
  return {
    cityPages,
    statePages: buildStateLandingPages(cityPages),
  };
});

export async function getCityLandingPageBySlug(slug: string) {
  const cityPages = await listCityLandingPages();
  return cityPages.find((page) => page.slug === slug) ?? null;
}

export async function getStateLandingPageBySlug(slug: string) {
  const statePages = await listStateLandingPages();
  return statePages.find((page) => page.slug === slug) ?? null;
}
