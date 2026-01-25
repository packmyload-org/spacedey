import { 
  StoreganiseSite, 
  StoreganiseUnit, 
  StoreganiseUnitType, 
  StoreganiseAuthResponse, 
  StoreganiseUser,
  StoreganiseSitemap
} from '@/lib/types/storeganise';

const API_BASE_URL = process.env.STOREGANISE_API_URL;
const API_KEY = process.env.STOREGANISE_API_KEY;

export class StoreganiseError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'StoreganiseError';
  }
}

/**
 * Generic fetch wrapper for Storeganise API.
 * Handles authentication, error parsing, and base URL.
 */
async function storeganiseFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    console.error('Storeganise Error: STOREGANISE_API_URL is not defined');
    throw new Error('STOREGANISE_API_URL is not defined in environment variables.');
  }

  const url = API_BASE_URL.replace(/\/$/, '') + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
  
  console.log(`[Storeganise] Fetching: ${url}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Only add API_KEY if Authorization is not already provided (e.g. Basic or Bearer)
  if (API_KEY && !headers['Authorization']) {
    headers['Authorization'] = `Api ${API_KEY}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      console.error(`[Storeganise] API Error Response: ${response.status} ${response.statusText}`);
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      let errorData = null;
      
      try {
        errorData = await response.json();
        console.error('[Storeganise] Error Data:', JSON.stringify(errorData, null, 2));
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        console.error('[Storeganise] Could not parse error JSON');
      }
     
      console.error(`Storeganise Request Failed: ${url} -> ${response.status}`, errorData);
      throw new StoreganiseError(response.status, errorMessage, errorData);
    }

    const data = await response.json();
    console.log(`[Storeganise] Success: ${url}`, Array.isArray(data) ? `Items: ${data.length}` : 'Object received');
    return data;
  } catch (error) {
    if (error instanceof StoreganiseError) throw error;
    console.error(`Storeganise API call failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Authenticates a user and returns an access token.
 * Docs: POST /v1/auth/token
 */
export async function authenticateUser(email: string, password: string): Promise<StoreganiseAuthResponse> {
  const credentials = Buffer.from(`${email}:${password}`).toString('base64');
  return storeganiseFetch<StoreganiseAuthResponse>('/auth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  });
}

/**
 * Fetches the authenticated user's profile.
 * Docs: GET /v1/auth/userinfo
 */
export async function getUserProfile(accessToken: string): Promise<StoreganiseUser> {
  return storeganiseFetch<StoreganiseUser>('/auth/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
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
  return storeganiseFetch<StoreganiseSite>(`/sites/${siteId}?include=unitTypes,sitemap`);
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

/**
 * Fetches the sitemap (facility map) for a specific site.
 * Docs: GET /v1/sites/:siteId/sitemap
 */
export async function getSiteSitemap(siteId: string): Promise<StoreganiseSitemap> {
  return storeganiseFetch<StoreganiseSitemap>(`/sites/${siteId}/sitemap`, {
    method: 'GET'
  });
}
