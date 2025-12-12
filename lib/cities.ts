// City data structure with availability status
export type CityStatus = 'available' | 'comingSoon';

export interface City {
  name: string;
  status: CityStatus;
  // Optional: Add launch date, region, etc. in the future
  launchDate?: string;
}

// Available cities - only these cities have active service
// All other Nigerian cities will show "coming soon" in MapView
export const CITIES: City[] = [
  { name: 'Lagos', status: 'available' },
  { name: 'Abuja', status: 'available' },
  { name: 'Kano', status: 'available' },
  { name: 'Ibadan', status: 'available' },
  { name: 'Port Harcourt', status: 'available' },
  { name: 'Benin City', status: 'available' },
  { name: 'Jos', status: 'available' },
  { name: 'Enugu', status: 'available' },
  { name: 'Kaduna', status: 'available' },
  { name: 'Abeokuta', status: 'available' },
];

// Helper functions
export const getAvailableCities = (): City[] => {
  return CITIES.filter(city => city.status === 'available');
};

export const getComingSoonCities = (): City[] => {
  return CITIES.filter(city => city.status === 'comingSoon');
};

export const getCityNames = (status?: CityStatus): string[] => {
  if (status) {
    return CITIES.filter(city => city.status === status).map(city => city.name);
  }
  return CITIES.map(city => city.name);
};

export const getCityByName = (name: string): City | undefined => {
  return CITIES.find(city => city.name.toLowerCase() === name.toLowerCase());
};

export const isCityAvailable = (name: string): boolean => {
  const city = getCityByName(name);
  return city?.status === 'available';
};

