import { LOCATION_DETAILS } from '@/lib/utils/sampleLocations';

export interface SeedUnitType {
  name: string;
  width: number;
  depth: number;
  unit: string;
  priceAmount: number;
  priceOriginalAmount?: number;
  description: string;
  availableCount: number;
}

export interface SeedSite {
  name: string;
  code: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  lat: number;
  lng: number;
  measuringUnit: string;
  image: string;
  about: string;
  registrationFee: number;
  annualDues: number;
}

const DEFAULT_CONTACT_PHONE = '+234123456789';
const DEFAULT_CONTACT_EMAIL = 'info@spacedey.com';
const DEFAULT_MEASURING_UNIT = 'ft';
const DEFAULT_REGISTRATION_FEE = 30000;
const DEFAULT_ANNUAL_DUES = 35000;
const DEFAULT_AVAILABLE_COUNT = 5;

const SMALL_DESCRIPTION =
  'About the size of a hall closet or small walk-in closet, these storage units are ideal for seasonal items, boxes, and small household overflow.';
const MEDIUM_DESCRIPTION =
  'About the size of a small bedroom, these storage units work well for the contents of a one-bedroom apartment or a compact office setup.';
const LARGE_DESCRIPTION =
  'About the size of a one-car garage, these storage units fit larger household moves, renovation overflow, and business inventory.';

const SITE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Lagos: { lat: 6.5244, lng: 3.3792 },
  Abuja: { lat: 9.0765, lng: 7.3986 },
  Kano: { lat: 12.0022, lng: 8.592 },
  Ibadan: { lat: 7.3775, lng: 3.947 },
  'Port Harcourt': { lat: 4.8156, lng: 7.0498 },
  'Benin City': { lat: 6.335, lng: 5.6037 },
  Jos: { lat: 9.8965, lng: 8.8583 },
  Enugu: { lat: 6.4599, lng: 7.5489 },
  Kaduna: { lat: 10.5105, lng: 7.4165 },
  Abeokuta: { lat: 7.1475, lng: 3.3619 },
};

const SITE_ADDRESSES: Record<string, string> = {
  Lagos: '9/11 Kudirat Abiola Way, Ikeja, Lagos',
  Abuja: 'Central Business District, Abuja',
  Kano: 'Kano Business District, Kano',
  Ibadan: 'Ibadan Commercial Area, Ibadan',
  'Port Harcourt': 'Port Harcourt Business Hub, Port Harcourt',
  'Benin City': 'GRA Commercial Hub, Benin City, Edo',
  Jos: 'Rayfield Commercial District, Jos, Plateau',
  Enugu: 'Independence Layout, Enugu',
  Kaduna: 'Barnawa Business District, Kaduna',
  Abeokuta: 'Oke-Ilewo Commercial Area, Abeokuta, Ogun',
};

export const STORAGE_UNIT_TYPES: SeedUnitType[] = [
  {
    name: '3 x 5',
    width: 3,
    depth: 5,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: 5004,
    priceOriginalAmount: 7200,
    description: SMALL_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '5 x 5',
    width: 5,
    depth: 5,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: 5004,
    priceOriginalAmount: 7200,
    description: SMALL_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '5 x 10',
    width: 5,
    depth: 10,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: 5004,
    priceOriginalAmount: 7200,
    description: SMALL_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '6 x 10',
    width: 6,
    depth: 10,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: 4706,
    priceOriginalAmount: 6800,
    description: MEDIUM_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '10 x 10',
    width: 10,
    depth: 10,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: 4706,
    priceOriginalAmount: 6800,
    description: MEDIUM_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '10 x 15',
    width: 10,
    depth: 15,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: 17001,
    priceOriginalAmount: 24300,
    description: LARGE_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '10 x 20',
    width: 10,
    depth: 20,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: 17001,
    priceOriginalAmount: 24300,
    description: LARGE_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
];

export const STORAGE_SITES: SeedSite[] = Object.values(LOCATION_DETAILS).map((detail) => {
  const coordinates = SITE_COORDINATES[detail.city];

  return {
    name: detail.name,
    code: detail.city,
    address: SITE_ADDRESSES[detail.city] ?? detail.address,
    contactPhone: DEFAULT_CONTACT_PHONE,
    contactEmail: DEFAULT_CONTACT_EMAIL,
    lat: coordinates?.lat ?? 6.5244,
    lng: coordinates?.lng ?? 3.3792,
    measuringUnit: DEFAULT_MEASURING_UNIT,
    image: detail.image,
    about: detail.about,
    registrationFee: DEFAULT_REGISTRATION_FEE,
    annualDues: DEFAULT_ANNUAL_DUES,
  };
});

STORAGE_SITES.push({
  name: 'Spacedey - Kano North',
  code: 'Kano-North',
  address: 'Zoo Road Commercial Corridor, Kano',
  contactPhone: DEFAULT_CONTACT_PHONE,
  contactEmail: DEFAULT_CONTACT_EMAIL,
  lat: 12.0154,
  lng: 8.5611,
  measuringUnit: DEFAULT_MEASURING_UNIT,
  image: '/images/Kano.png',
  about: 'A second Kano location for higher-capacity business storage, move-in overflow, and fast access from the northern commercial corridor.',
  registrationFee: DEFAULT_REGISTRATION_FEE,
  annualDues: DEFAULT_ANNUAL_DUES,
});

export function getStorageUnitSeedKey(unitType: Pick<SeedUnitType, 'name' | 'width' | 'depth' | 'unit'>): string {
  return [unitType.name, unitType.width, unitType.depth, unitType.unit].join(':');
}
