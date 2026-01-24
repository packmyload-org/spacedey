import { 
  LocalizedString, 
  StoreganiseSite, 
  ApiSite, 
  StoreganiseUnitType, 
  ApiUnitType 
} from '@/lib/types/storeganise';

/**
 * Extracts the string value from a LocalizedString object or returns the string itself if it's already a string.
 * Defaults to 'en' locale.
 */
export function getLocalizedValue(val: LocalizedString | string | undefined, locale: string = 'en'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[locale] || Object.values(val)[0] || '';
}

/**
 * Formats a price with the currency symbol.
 */
export function formatPrice(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function mapStoreganiseUnitTypeToApiUnitType(ut: StoreganiseUnitType): ApiUnitType {
  return {
    id: ut.id,
    name: getLocalizedValue(ut.title),
    dimensions: {
      width: ut.width,
      depth: ut.depth,
      unit: 'ft', // Assumption, as Storeganise usually defaults to something or it's in settings.
    },
    price: {
      amount: ut.price,
      currency: 'NGN', // Assumption or need source
    },
    description: getLocalizedValue(ut.description),
    availableCount: ut.availableCount || 0,
  };
}

export function mapStoreganiseSiteToApiSite(site: StoreganiseSite): ApiSite {
  const addressStr = site.address
    ? [site.address.street, site.address.city, site.address.state, site.address.country]
        .filter(Boolean)
        .join(', ')
    : '';

  return {
    id: site.id,
    name: getLocalizedValue(site.title),
    code: site.code,
    image: site.image || '',
    address: addressStr,
    contact: {
      phone: site.phone || '',
      email: site.email || '',
    },
    coordinates: {
      lat: site.lat || 0,
      lng: site.lng || 0,
    },
    unitTypes: (site.unitTypes || []).map(mapStoreganiseUnitTypeToApiUnitType),
  };
}
