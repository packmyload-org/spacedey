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

export function cityMatchesSite(site: Pick<ApiSite, 'address' | 'code'>, city: string): boolean {
  const normalizedCity = city.trim().toLowerCase();

  if (!normalizedCity) {
    return true;
  }

  return (
    site.code.toLowerCase() === normalizedCity ||
    extractCityFromAddress(site.address).toLowerCase() === normalizedCity
  );
}

export function formatUnitDimensions(dimensions: ApiUnitType['dimensions']): string {
  const { width, depth, unit } = dimensions;
  return `${width} x ${depth} ${unit}`;
}
