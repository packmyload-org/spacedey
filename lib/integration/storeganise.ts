import axios, { AxiosRequestConfig, AxiosError } from 'axios';
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
const APP_SCOPE = 'user';
const ADMIN_SCOPE = 'admin' as const;


export class StoreganiseError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'StoreganiseError';
  }
}

function withScope(endpoint: string, scope: 'admin' | 'user' = APP_SCOPE): string {
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${separator}scope=${scope}`;
}

/**
 * Generic fetch wrapper for Storeganise API using Axios.
 * Handles authentication, error parsing, and base URL.
 */
async function storeganiseFetch<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {

  if (!API_BASE_URL) {
    console.error('Storeganise Error: STOREGANISE_API_URL is not defined');
    throw new Error('STOREGANISE_API_URL is not defined in environment variables.');
  }

  const url = API_BASE_URL.replace(/\/$/, '') + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);


  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (API_KEY && !headers['Authorization']) {
    headers['Authorization'] = `ApiKey ${API_KEY}`;
  }

  try {
    const response = await axios({
      url,
      timeout: 15000,
      ...options,
      headers,
    });

    const data = response.data;
    console.log(`[Storeganise] Success: ${url}`, Array.isArray(data) ? `Items: ${data.length}` : 'Object received');
    return data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      const statusText = axiosError.response?.statusText || 'Unknown Error';
      
      console.error(`[Storeganise] API Error Response: ${status} ${statusText}`);
      
      let errorMessage = `API Error: ${status} ${statusText}`;
      const errorData = axiosError.response?.data;

      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        errorMessage = String((errorData as { message: unknown }).message);
      }

      console.error(`Storeganise Request Failed: ${url} -> ${status}`, errorData);
      throw new StoreganiseError(status, errorMessage, errorData);
    }
    
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
  return storeganiseFetch<StoreganiseAuthResponse>(withScope('/auth/token'), {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'X-Requested-With': 'XMLHttpRequest',
    }
  });
}

/**
 * Fetches the authenticated user's profile.
 * Docs: GET /v1/user
 */
export async function getUserProfile(accessToken: string): Promise<StoreganiseUser> {
  return storeganiseFetch<StoreganiseUser>('/user', {
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
  return storeganiseFetch<StoreganiseSite[]>(withScope('/sites', ADMIN_SCOPE));
}

/**
 * Fetches specific site details including unit types.
 * Docs: GET /v1/sites/:siteId?include=unitTypes
 */
export async function getSiteDetails(siteId: string): Promise<StoreganiseSite> {
  return storeganiseFetch<StoreganiseSite>(withScope(`/sites/${siteId}?include=unitTypes`, ADMIN_SCOPE));
}

/**
 * Fetches unit types for a specific site.
 * Docs: GET /v1/sites/:siteId/unit-types
 */
export async function getUnitTypes(siteId: string): Promise<StoreganiseUnitType[]> {
  return storeganiseFetch<StoreganiseUnitType[]>(withScope(`/sites/${siteId}/unit-types`, ADMIN_SCOPE));
}

/**
 * Fetches individual units for a site.
 * Docs: GET /v1/sites/:siteId/units
 */
export async function getUnits(siteId: string): Promise<StoreganiseUnit[]> {
  return storeganiseFetch<StoreganiseUnit[]>(withScope(`/sites/${siteId}/units`, ADMIN_SCOPE));
}

/**
 * Fetches the sitemap (facility map) for a specific site.
 * Docs: GET /v1/sites/:siteId/sitemap
 */
export async function getSiteSitemap(siteId: string): Promise<StoreganiseSitemap> {
  return storeganiseFetch<StoreganiseSitemap>(withScope(`/sites/${siteId}/sitemap`, ADMIN_SCOPE), { method: 'GET' });
}

/**
 * Creates a new user account.
 * Docs: POST /v1/users
 */
export async function createUser(params: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  recaptchaResponse?: string;
}): Promise<StoreganiseUser> {
  // Build the request data, excluding empty recaptchaResponse
  const data: Record<string, unknown> = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    password: params.password,
  };
  
  // Only include recaptchaResponse if it's provided and not empty
  if (params.recaptchaResponse && params.recaptchaResponse.trim()) {
    data.recaptchaResponse = params.recaptchaResponse;
  }

  return storeganiseFetch<StoreganiseUser>(withScope('/users'), {
    method: 'POST',
    data,
  });
}

/**
 * Sends a reset password email.
 * Docs: POST /v1/auth/forgot-password
 */
export async function sendResetPasswordToken(email: string): Promise<unknown> {
  return storeganiseFetch(withScope('/auth/forgot-password'), {
    method: 'POST',
    data: { email },
  });
}

/**
 * Resets a password using the token emailed to the user.
 * Docs: POST /v1/auth/reset-password
 */
export async function resetPassword(params: {
  token: string;
  email: string;
  password: string;
}): Promise<unknown> {
  return storeganiseFetch('/auth/reset-password', {
    method: 'POST',
    data: params,
  });
}
