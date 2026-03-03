/**
 * Local types for storage application
 * These replace the storeganise-specific types
 */
import { UserRole } from '@/lib/types/roles';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnitType {
  id: string;
  name: string;
  code: string;
  price: number;
  dimensions: {
    width: number;
    depth: number;
    height: number;
    unit: string;
  };
  description?: string;
  availableCount: number;
  siteId: string;
}

export interface Site {
  id: string;
  name: string;
  code: string;
  image?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  unitTypes?: UnitType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiUnitType {
  id: string;
  name: string;
  dimensions: {
    width: number;
    depth: number;
    unit: string;
  };
  price: {
    amount: number;
    currency: string;
    originalAmount?: number;
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

export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}
