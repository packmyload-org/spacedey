export type Pricing = { size: string; originalPrice: string; currentPrice: string };

export interface LocationDetail {
  code: string;
  city: string;
  state: string;
  name: string;
  address: string;
  hours: string;
  about: string;
  image: string;
  pricing: Pricing[];
  legacyCodes?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const SAMPLE_PRICING: Pricing[] = [
  { size: "Small (6' x 8')", originalPrice: "7200", currentPrice: "5004.00" },
  { size: "Medium (5' x 9')", originalPrice: "6800", currentPrice: "4706.00" },
  { size: "Large (18' x 9')", originalPrice: "24300", currentPrice: "17001.00" },
];

// Centralized location details - single source of truth
export const LOCATION_DETAILS: Record<string, LocationDetail> = {
  Lekki: {
    code: 'lekki',
    city: 'Lekki',
    state: 'Lagos',
    name: 'Spacedey - Lekki',
    address: 'Admiralty Way, Lekki, Lagos',
    hours: '6am - 10pm',
    about: 'Store household overflow, retail inventory, and move-in essentials in a secure Lekki facility with easy access from the island corridor.',
    image: '/images/Lagos.jpg',
    pricing: SAMPLE_PRICING,
    coordinates: { lat: 6.4433, lng: 3.5359 },
  },
  Ikeja: {
    code: 'ikeja',
    city: 'Ikeja',
    state: 'Lagos',
    name: 'Spacedey - Ikeja',
    address: '9/11 Kudirat Abiola Way, Oregun, Ikeja, Lagos',
    hours: '6am - 10pm',
    about: 'A flexible storage hub for homes, teams, and growing businesses in Ikeja, with convenient access from the mainland commercial core.',
    image: '/images/Lagos.jpg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Lagos'],
    coordinates: { lat: 6.6018, lng: 3.3515 },
  },
  Surulere: {
    code: 'surulere',
    city: 'Surulere',
    state: 'Lagos',
    name: 'Spacedey - Surulere',
    address: 'Bode Thomas Street, Surulere, Lagos',
    hours: '6am - 10pm',
    about: 'A practical Surulere location for personal storage, business stock, and extra room you need close to home.',
    image: '/images/Lagos.jpg',
    pricing: SAMPLE_PRICING,
    coordinates: { lat: 6.4991, lng: 3.3539 },
  },
  Maitama: {
    code: 'maitama',
    city: 'Maitama',
    state: 'Abuja',
    name: 'Spacedey - Maitama',
    address: 'Maitama District, Maitama, Abuja',
    hours: '6am - 10pm',
    about: 'Secure storage in Maitama for premium residential needs, office overflow, and flexible business access in Abuja.',
    image: '/images/Abuja.jpeg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Abuja'],
    coordinates: { lat: 9.0849, lng: 7.4954 },
  },
  Garki: {
    code: 'garki',
    city: 'Garki',
    state: 'Abuja',
    name: 'Spacedey - Garki',
    address: 'Area 11, Garki, Abuja',
    hours: '6am - 10pm',
    about: 'An accessible Garki storage site for households, teams, and frequent-access business inventory in the city centre.',
    image: '/images/Abuja.jpeg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Kano-North'],
    coordinates: { lat: 9.0313, lng: 7.4913 },
  },
  Kano: {
    code: 'kano',
    city: 'Kano',
    state: 'Kano',
    name: 'Spacedey - Kano',
    address: 'Kano Business District, Kano, Kano',
    hours: '6am - 10pm',
    about: 'Reliable self-storage in Kano for retail stock, household items, and seasonal overflow, designed to keep access simple and secure.',
    image: '/images/Kano.png',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Kano'],
    coordinates: { lat: 12.0022, lng: 8.5920 },
  },
  Ibadan: {
    code: 'ibadan',
    city: 'Ibadan',
    state: 'Oyo',
    name: 'Spacedey - Ibadan',
    address: 'Bodija Commercial Area, Ibadan, Oyo',
    hours: '6am - 10pm',
    about: 'An easy storage base for households and business owners in Ibadan who need extra room without moving far from their neighborhood.',
    image: '/images/Ibadan.jpg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Ibadan'],
    coordinates: { lat: 7.3775, lng: 3.9470 },
  },
  'Port Harcourt': {
    code: 'port-harcourt',
    city: 'Port Harcourt',
    state: 'Rivers',
    name: 'Spacedey - Port Harcourt',
    address: 'Port Harcourt Business Hub, Port Harcourt, Rivers',
    hours: '6am - 10pm',
    about: 'Keep equipment, archives, and personal belongings protected in Port Harcourt with a location built for convenient recurring access.',
    image: '/images/ph.jpg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Port Harcourt'],
    coordinates: { lat: 4.8156, lng: 7.0498 },
  },
  'Benin City': {
    code: 'benin-city',
    city: 'Benin City',
    state: 'Edo',
    name: 'Spacedey - Benin City',
    address: 'GRA Commercial Hub, Benin City, Edo',
    hours: '6am - 10pm',
    about: 'A practical storage option in Benin City for growing families, business inventory, and anything else that needs a secure extra room.',
    image: '/images/BeninCity.jpg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Benin City'],
    coordinates: { lat: 6.335, lng: 5.6037 },
  },
  Jos: {
    code: 'jos',
    city: 'Jos',
    state: 'Plateau',
    name: 'Spacedey - Jos',
    address: 'Rayfield Commercial District, Jos, Plateau',
    hours: '6am - 10pm',
    about: 'Use this Jos location for personal storage, business supplies, and short-term overflow when you need more space close to home.',
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Jos'],
    coordinates: { lat: 9.8965, lng: 8.8583 },
  },
  Enugu: {
    code: 'enugu',
    city: 'Enugu',
    state: 'Enugu',
    name: 'Spacedey - Enugu',
    address: 'Independence Layout, Enugu, Enugu',
    hours: '6am - 10pm',
    about: 'Secure, accessible storage in Enugu for moving seasons, renovation overflow, and the day-to-day needs of growing households and teams.',
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Enugu'],
    coordinates: { lat: 6.4599, lng: 7.5489 },
  },
  Kaduna: {
    code: 'kaduna',
    city: 'Kaduna',
    state: 'Kaduna',
    name: 'Spacedey - Kaduna',
    address: 'Barnawa Business District, Kaduna, Kaduna',
    hours: '6am - 10pm',
    about: 'A dependable Kaduna storage site for equipment, documents, stock, and personal belongings that need a clean, protected home.',
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Kaduna'],
    coordinates: { lat: 10.5105, lng: 7.4165 },
  },
  Abeokuta: {
    code: 'abeokuta',
    city: 'Abeokuta',
    state: 'Ogun',
    name: 'Spacedey - Abeokuta',
    address: 'Oke-Ilewo Commercial Area, Abeokuta, Ogun',
    hours: '6am - 10pm',
    about: 'Extra room for Abeokuta homes and businesses, with storage options that make it easier to stay organized without losing access.',
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
    legacyCodes: ['Abeokuta'],
    coordinates: { lat: 7.1475, lng: 3.3619 },
  },
};

export const SAMPLE_CITIES = Object.keys(LOCATION_DETAILS);

// Get location details by city name
export function getLocationDetails(cityName: string): LocationDetail {
  if (!cityName) {
    return {
      code: 'unknown',
      city: 'Unknown',
      state: 'Unknown',
      name: 'Spacedey Location',
      address: '123 Main St, City',
      hours: '6am - 10pm',
      about: 'A secure Spacedey location designed to give you flexible extra room for personal belongings, business inventory, and move-in overflow.',
      image: '/images/LocationHero.jpg',
      pricing: SAMPLE_PRICING,
    };
  }

  // Extract city name from "Spacedey - CityName" format if needed
  const extractedCity = cityName.includes(' - ')
    ? cityName.split(' - ')[1].trim()
    : cityName.trim();

  // Try exact match first
  const exactMatch = LOCATION_DETAILS[extractedCity];
  if (exactMatch) return exactMatch;

  // Try case-insensitive match
  const caseInsensitiveMatch = Object.values(LOCATION_DETAILS).find(
    (loc) => loc.city.toLowerCase() === extractedCity.toLowerCase()
  );
  if (caseInsensitiveMatch) return caseInsensitiveMatch;

  // Fallback
  return {
    code: extractedCity.toLowerCase().replace(/\s+/g, '-'),
    city: extractedCity,
    state: 'Unknown',
    name: `Spacedey - ${extractedCity}`,
    address: '123 Main St, City',
    hours: '6am - 10pm',
    about: `A secure storage location in ${extractedCity} designed for household overflow, business inventory, and flexible extra space whenever you need it.`,
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
  };
}

// Legacy function for backward compatibility
export function makeLocationData(city: string) {
  const details = getLocationDetails(city);
  return {
    name: details.name,
    address: details.address,
    hours: details.hours,
    pricing: details.pricing,
    imageUrl: details.image,
  };
}
