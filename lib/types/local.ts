/**
 * Local types for storage application
 * Shared frontend API types for the current relational data model
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
  units?: StorageUnit[];
}

export type StorageUnitStatus =
  | 'available'
  | 'reserved'
  | 'occupied'
  | 'blocked'
  | 'maintenance';

export interface StorageUnit {
  id: string;
  unitNumber: string;
  status: StorageUnitStatus;
  label?: string;
  note?: string;
  unitTypeId: string;
  siteId: string;
}

export interface Site {
  id: string;
  name: string;
  code: string;
  about?: string;
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
  units?: StorageUnit[];
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
  units?: ApiStorageUnit[];
}

export interface ApiStorageUnit {
  id: string;
  unitNumber: string;
  status: StorageUnitStatus;
  label?: string;
  note?: string;
  unitTypeId: string;
}

export interface ApiSite {
  id: string;
  name: string;
  code: string;
  about?: string;
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
  units?: ApiStorageUnit[];
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
