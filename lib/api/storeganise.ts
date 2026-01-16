import { StoreganiseSite } from '@/lib/interfaces/StoreganiseSite';
import { StoreganiseUnit } from '@/lib/interfaces/StoreganiseUnit';
import { StoreganiseUnitType } from '@/lib/interfaces/StoreganiseUnitType';
const API_BASE_URL = process.env.STOREGANISE_API_URL;

const API_KEY = process.env.STOREGANISE_API_KEY;

class StoreganiseError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'StoreganiseError';
  }
}

async function storeganiseFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = API_BASE_URL + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  
  if (API_KEY) {
    headers['Authorization'] = `Api ${API_KEY}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (e) {
        console.debug(e)
        // Failed to parse error body, use default message
      }
      
      console.error(`Storeganise Request Failed: ${url} -> ${response.status}`);
      throw new StoreganiseError(response.status, `${errorMessage} (URL: ${url})`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof StoreganiseError) throw error;
    console.error(`Storeganise API call failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetches all sites.
 * Docs: GET /v1/sites
 */
export async function getSites(): Promise<StoreganiseSite[]> {
  return storeganiseFetch<StoreganiseSite[]>('/sites');
}

/**
 * Fetches specific site details including unit types.
 * Docs: GET /v1/sites/:siteId?include=unitTypes
 */
export async function getSiteDetails(siteId: string): Promise<StoreganiseSite> {
  return storeganiseFetch<StoreganiseSite>(`/sites/${siteId}?include=unitTypes`);
}

/**
 * Fetches unit types for a specific site.
 * Docs: GET /v1/sites/:siteId/unit-types
 */
export async function getUnitTypes(siteId: string): Promise<StoreganiseUnitType[]> {
  return storeganiseFetch<StoreganiseUnitType[]>(`/sites/${siteId}/unit-types`);
}

/**
 * Fetches individual units for a site.
 * Docs: GET /v1/sites/:siteId/units
 */
export async function getUnits(siteId: string): Promise<StoreganiseUnit[]> {
  return storeganiseFetch<StoreganiseUnit[]>(`/sites/${siteId}/units`);
}