export type LocalizedString = {
  [key: string]: string; // e.g. "en": "Title"
};

export interface AdminUnitTypeQueryParams {
  limit?: number;
  offset?: number;
  cursor?: string;
  updatedAfter?: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.SSSZ
  ids?: string | string[];
  siteId?: string;
  groupId?: string;
  tagIds?: string;
  labels?: string;
  search?: string;
  include?: string | string[]; // 'site' or 'customFields'
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
}

export interface ApiUnitType {
  id: string;
  name: string;
  dimensions: {
    width: number;
    depth: number;
    unit: string; // e.g., 'ft' or 'm'
  };
  price: {
    amount: number;
    currency: string;
    originalAmount?: number; // For promos
  };
  description?: string;
  availableCount: number;
}

export interface ApiSite {
  id: string;
  name: string;
  code: string;
  image: string;
  address: string;
  contact: {
    phone: string;
    email: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  unitTypes: ApiUnitType[];
}

export interface ApiSitesResponse {
  sites: ApiSite[];
}

export interface StoreganiseUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface StoreganiseAuthResponse {
  accessToken: string;
  user: StoreganiseUser;
}

export interface StoreganiseSiteAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface StoreganiseTag {
  id: string;
  name: string;
  color?: string;
}

export interface StoreganiseProduct {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  price: number;
  image?: string;
  type?: string;
  trackInventory?: boolean;
  inventory?: number;
  maxQuantity?: number;
}

export interface StoreganiseUnitType {
  id: string;
  title: LocalizedString;
  code: string;
  price: number;
  width: number;
  depth: number;
  height: number;
  area: number;
  description?: LocalizedString;
  availableCount?: number; 
  unitTypeGroupId?: string;
  tags?: StoreganiseTag[];
  [key: string]: unknown;
}

export interface StoreganiseUnitTypeGroup {
  id: string;
  title: LocalizedString;
  order?: number;
}

export interface StoreganiseSite {
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  code: string;
  image?: string;
  address?: StoreganiseSiteAddress;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  unitTypes?: StoreganiseUnitType[];
  unitTypeGroups?: StoreganiseUnitTypeGroup[];
  products?: StoreganiseProduct[];
  measure?: string;
  availability?: unknown;
  sitemap?: StoreganiseSitemap;
}

export interface StoreganiseSettingsResponse {
  sites: StoreganiseSite[];
}

export interface StoreganiseUnit {
  id: string;
  name: string;
  siteId: string;
  unitTypeId: string;
  status: string;
  price: number;
}

export interface StoreganiseSitemap {
  id?: string;
  siteId?: string;
  svg?: string; // Often sitemaps are returned as SVG content or similar
  [key: string]: unknown;
}
