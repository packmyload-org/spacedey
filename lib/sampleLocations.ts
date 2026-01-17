export type Pricing = { size: string; originalPrice: string; currentPrice: string };

export const SAMPLE_PRICING: Pricing[] = [
  { size: "S (6' x 8')", originalPrice: "7200", currentPrice: "5004.00" },
  { size: "M (5' x 9')", originalPrice: "6800", currentPrice: "4706.00" },
  { size: "L (18' x 9')", originalPrice: "24300", currentPrice: "17001.00" },
];

export const CITY_IMAGE_MAP: Record<string, string> = {
  Lagos: '/images/Lagos.jpg',
  Abuja: '/images/Abuja.jpeg',
  Kano: '/images/Kano.png',
  Ibadan: '/images/Ibadan.jpg',
  'Port Harcourt': '/images/ph.jpg',
};

export const SAMPLE_CITIES = Object.keys(CITY_IMAGE_MAP);

export function makeLocationData(city: string, idx = 0) {
  return {
    name: `Spacedey - ${city}`,
    address: `${100 + idx} Market St, ${city}`,
    hours: '6am - 10pm',
    pricing: SAMPLE_PRICING,
    imageUrl: CITY_IMAGE_MAP[city] ?? '/images/LocationHero.jpg',
  };
}

