import { LOCATION_DETAILS } from '@/lib/utils/sampleLocations';
import { calculateMonthlyStorageRate } from '@/lib/pricing/storagePricing';

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
  legacyCodes?: string[];
  city: string;
  state: string;
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

export const STORAGE_UNIT_TYPES: SeedUnitType[] = [
  {
    name: '3 x 5',
    width: 3,
    depth: 5,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: calculateMonthlyStorageRate({ width: 3, depth: 5, unit: DEFAULT_MEASURING_UNIT }),
    priceOriginalAmount: 7200,
    description: SMALL_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '5 x 5',
    width: 5,
    depth: 5,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: calculateMonthlyStorageRate({ width: 5, depth: 5, unit: DEFAULT_MEASURING_UNIT }),
    priceOriginalAmount: 7200,
    description: SMALL_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '5 x 10',
    width: 5,
    depth: 10,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: calculateMonthlyStorageRate({ width: 5, depth: 10, unit: DEFAULT_MEASURING_UNIT }),
    priceOriginalAmount: 7200,
    description: SMALL_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '6 x 10',
    width: 6,
    depth: 10,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: calculateMonthlyStorageRate({ width: 6, depth: 10, unit: DEFAULT_MEASURING_UNIT }),
    priceOriginalAmount: 6800,
    description: MEDIUM_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '10 x 10',
    width: 10,
    depth: 10,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: calculateMonthlyStorageRate({ width: 10, depth: 10, unit: DEFAULT_MEASURING_UNIT }),
    priceOriginalAmount: 6800,
    description: MEDIUM_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '10 x 15',
    width: 10,
    depth: 15,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: calculateMonthlyStorageRate({ width: 10, depth: 15, unit: DEFAULT_MEASURING_UNIT }),
    priceOriginalAmount: 24300,
    description: LARGE_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
  {
    name: '10 x 20',
    width: 10,
    depth: 20,
    unit: DEFAULT_MEASURING_UNIT,
    priceAmount: calculateMonthlyStorageRate({ width: 10, depth: 20, unit: DEFAULT_MEASURING_UNIT }),
    priceOriginalAmount: 24300,
    description: LARGE_DESCRIPTION,
    availableCount: DEFAULT_AVAILABLE_COUNT,
  },
];

export const STORAGE_SITES: SeedSite[] = Object.values(LOCATION_DETAILS).map((detail) => {
  return {
    name: detail.name,
    code: detail.code,
    legacyCodes: detail.legacyCodes,
    city: detail.city,
    state: detail.state,
    address: detail.address,
    contactPhone: DEFAULT_CONTACT_PHONE,
    contactEmail: DEFAULT_CONTACT_EMAIL,
    lat: detail.coordinates?.lat ?? 6.5244,
    lng: detail.coordinates?.lng ?? 3.3792,
    measuringUnit: DEFAULT_MEASURING_UNIT,
    image: detail.image,
    about: detail.about,
    registrationFee: DEFAULT_REGISTRATION_FEE,
    annualDues: DEFAULT_ANNUAL_DUES,
  };
});

export function getStorageUnitSeedKey(unitType: Pick<SeedUnitType, 'name' | 'width' | 'depth' | 'unit'>): string {
  return [unitType.name, unitType.width, unitType.depth, unitType.unit].join(':');
}
