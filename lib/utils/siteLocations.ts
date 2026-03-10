import { ApiSite, ApiUnitType } from '@/lib/types/local';

export const KNOWN_CITIES = [
  'Lekki',
  'Ikeja',
  'Surulere',
  'Maitama',
  'Garki',
  'Port Harcourt',
  'Benin City',
  'Abeokuta',
  'Enugu',
  'Kaduna',
  'Ibadan',
  'Kano',
  'Jos',
  'Abuja',
  'Lagos',
];

export function extractCityFromAddress(address: string): string {
  const normalizedAddress = address.toLowerCase();
  const exactCity = KNOWN_CITIES.find((city) => normalizedAddress.includes(city.toLowerCase()));

  if (exactCity) {
    return exactCity;
  }

  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }

  return parts[0] || '';
}

export function extractStateFromAddress(address: string): string {
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const nonCountryParts = parts.filter((part) => part.toLowerCase() !== 'nigeria');

  return nonCountryParts[nonCountryParts.length - 1] || '';
}

export function getSiteCity(site: Pick<ApiSite, 'city' | 'address'>): string {
  return site.city?.trim() || extractCityFromAddress(site.address);
}

export function getSiteState(site: Pick<ApiSite, 'state' | 'address'>): string {
  return site.state?.trim() || extractStateFromAddress(site.address);
}

export function cityMatchesSite(site: Pick<ApiSite, 'address' | 'code' | 'city'>, city: string): boolean {
  const normalizedCity = city.trim().toLowerCase();

  if (!normalizedCity) {
    return true;
  }

  return (
    site.code.toLowerCase() === normalizedCity ||
    getSiteCity(site).toLowerCase() === normalizedCity
  );
}

export function stateMatchesSite(site: Pick<ApiSite, 'address' | 'state'>, state: string): boolean {
  const normalizedState = state.trim().toLowerCase();

  if (!normalizedState) {
    return true;
  }

  return getSiteState(site).toLowerCase() === normalizedState;
}

export function resolveStateFromQuery(
  query: string,
  sites: Pick<ApiSite, 'name' | 'code' | 'city' | 'state' | 'address'>[]
): string | null {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return null;
  }

  for (const site of sites) {
    const siteState = getSiteState(site);

    if (siteState && siteState.toLowerCase() === normalizedQuery) {
      return siteState;
    }
  }

  for (const site of sites) {
    const siteState = getSiteState(site);
    const siteCity = getSiteCity(site);

    if (
      siteState &&
      (siteCity.toLowerCase() === normalizedQuery ||
        site.name.toLowerCase() === normalizedQuery ||
        site.code.toLowerCase() === normalizedQuery)
    ) {
      return siteState;
    }
  }

  for (const site of sites) {
    const siteState = getSiteState(site);
    const siteCity = getSiteCity(site);

    if (
      siteState &&
      (siteState.toLowerCase().includes(normalizedQuery) ||
        siteCity.toLowerCase().includes(normalizedQuery) ||
        site.name.toLowerCase().includes(normalizedQuery))
    ) {
      return siteState;
    }
  }

  return null;
}

export function formatSiteCount(count: number): string {
  return `${count} site${count === 1 ? '' : 's'}`;
}

export function sortAlphabetically(values: string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export function formatUnitDimensions(dimensions: ApiUnitType['dimensions']): string {
  const { width, depth, unit } = dimensions;
  return `${width} x ${depth} ${unit}`;
}
