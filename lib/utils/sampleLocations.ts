export type Pricing = { size: string; originalPrice: string; currentPrice: string };

export interface LocationDetail {
  city: string;
  name: string;
  address: string;
  hours: string;
  about: string;
  image: string;
  pricing: Pricing[];
}

export const SAMPLE_PRICING: Pricing[] = [
  { size: "Small (6' x 8')", originalPrice: "7200", currentPrice: "5004.00" },
  { size: "Medium (5' x 9')", originalPrice: "6800", currentPrice: "4706.00" },
  { size: "Large (18' x 9')", originalPrice: "24300", currentPrice: "17001.00" },
];

// Centralized location details - single source of truth
export const LOCATION_DETAILS: Record<string, LocationDetail> = {
  Lagos: {
    city: 'Lagos',
    name: 'Spacedey - Lagos',
    address: '9/11 Kudirat Abiola Way, Oregun, Ikeja 100271, Lagos',
    hours: '6am - 10pm',
    about: 'Store business inventory, household overflow, and move-in items in a secure Lagos location with quick access from Ikeja and the rest of the mainland.',
    image: '/images/Lagos.jpg',
    pricing: SAMPLE_PRICING,
  },
  Abuja: {
    city: 'Abuja',
    name: 'Spacedey - Abuja',
    address: 'Central Business District, Abuja, FCT',
    hours: '6am - 10pm',
    about: 'A flexible storage option for homes, teams, and growing businesses in Abuja, with convenient access from the city centre.',
    image: '/images/Abuja.jpeg',
    pricing: SAMPLE_PRICING,
  },
  Kano: {
    city: 'Kano',
    name: 'Spacedey - Kano',
    address: 'Kano Business District, Kano',
    hours: '6am - 10pm',
    about: 'Reliable self-storage in Kano for retail stock, household items, and seasonal overflow, designed to keep access simple and secure.',
    image: '/images/Kano.png',
    pricing: SAMPLE_PRICING,
  },
  Ibadan: {
    city: 'Ibadan',
    name: 'Spacedey - Ibadan',
    address: 'Ibadan Commercial Area, Ibadan',
    hours: '6am - 10pm',
    about: 'An easy storage base for households and business owners in Ibadan who need extra room without moving far from their neighborhood.',
    image: '/images/Ibadan.jpg',
    pricing: SAMPLE_PRICING,
  },
  'Port Harcourt': {
    city: 'Port Harcourt',
    name: 'Spacedey - Port Harcourt',
    address: 'Port Harcourt Business Hub, Rivers State',
    hours: '6am - 10pm',
    about: 'Keep equipment, archives, and personal belongings protected in Port Harcourt with a location built for convenient recurring access.',
    image: '/images/ph.jpg',
    pricing: SAMPLE_PRICING,
  },
  'Benin City': {
    city: 'Benin City',
    name: 'Spacedey - Benin City',
    address: 'GRA Commercial Hub, Benin City, Edo',
    hours: '6am - 10pm',
    about: 'A practical storage option in Benin City for growing families, business inventory, and anything else that needs a secure extra room.',
    image: '/images/BeninCity.jpg',
    pricing: SAMPLE_PRICING,
  },
  Jos: {
    city: 'Jos',
    name: 'Spacedey - Jos',
    address: 'Rayfield Commercial District, Jos, Plateau',
    hours: '6am - 10pm',
    about: 'Use this Jos location for personal storage, business supplies, and short-term overflow when you need more space close to home.',
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
  },
  Enugu: {
    city: 'Enugu',
    name: 'Spacedey - Enugu',
    address: 'Independence Layout, Enugu',
    hours: '6am - 10pm',
    about: 'Secure, accessible storage in Enugu for moving seasons, renovation overflow, and the day-to-day needs of growing households and teams.',
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
  },
  Kaduna: {
    city: 'Kaduna',
    name: 'Spacedey - Kaduna',
    address: 'Barnawa Business District, Kaduna',
    hours: '6am - 10pm',
    about: 'A dependable Kaduna storage site for equipment, documents, stock, and personal belongings that need a clean, protected home.',
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
  },
  Abeokuta: {
    city: 'Abeokuta',
    name: 'Spacedey - Abeokuta',
    address: 'Oke-Ilewo Commercial Area, Abeokuta, Ogun',
    hours: '6am - 10pm',
    about: 'Extra room for Abeokuta homes and businesses, with storage options that make it easier to stay organized without losing access.',
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
  },
};

export const SAMPLE_CITIES = Object.keys(LOCATION_DETAILS);

// Get location details by city name
export function getLocationDetails(cityName: string): LocationDetail {
  if (!cityName) {
    return {
      city: 'Unknown',
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
    city: extractedCity,
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
