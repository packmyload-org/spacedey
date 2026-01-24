export type Pricing = { size: string; originalPrice: string; currentPrice: string };

export interface LocationDetail {
  city: string;
  name: string;
  address: string;
  hours: string;
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
    image: '/images/Lagos.jpg',
    pricing: SAMPLE_PRICING,
  },
  Abuja: {
    city: 'Abuja',
    name: 'Spacedey - Abuja',
    address: 'Central Business District, Abuja, FCT',
    hours: '6am - 10pm',
    image: '/images/Abuja.jpeg',
    pricing: SAMPLE_PRICING,
  },
  Kano: {
    city: 'Kano',
    name: 'Spacedey - Kano',
    address: 'Kano Business District, Kano',
    hours: '6am - 10pm',
    image: '/images/Kano.png',
    pricing: SAMPLE_PRICING,
  },
  Ibadan: {
    city: 'Ibadan',
    name: 'Spacedey - Ibadan',
    address: 'Ibadan Commercial Area, Ibadan',
    hours: '6am - 10pm',
    image: '/images/Ibadan.jpg',
    pricing: SAMPLE_PRICING,
  },
  'Port Harcourt': {
    city: 'Port Harcourt',
    name: 'Spacedey - Port Harcourt',
    address: 'Port Harcourt Business Hub, Rivers State',
    hours: '6am - 10pm',
    image: '/images/ph.jpg',
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
    image: '/images/LocationHero.jpg',
    pricing: SAMPLE_PRICING,
  };
}

// Legacy function for backward compatibility
export function makeLocationData(city: string, idx = 0) {
  const details = getLocationDetails(city);
  return {
    name: details.name,
    address: details.address,
    hours: details.hours,
    pricing: details.pricing,
    imageUrl: details.image,
  };
}

