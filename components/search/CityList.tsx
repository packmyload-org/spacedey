'use client';

import { ChevronRight } from 'lucide-react';
import LocationCard from '@/components/home/LocationCard';
import { ApiSite } from '@/lib/types/local';
import { useMemo } from 'react';

interface CityListProps {
  searchQuery: string;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  sites: ApiSite[];
}

// Helper to map site to LocationCard props
// Moved outside component to avoid recreation on re-renders
const getSiteProps = (site: ApiSite) => {
  // Map unit types to pricing format
  const pricing = (site.unitTypes || [])
    .slice(0, 3)
    .map((ut) => ({
      size: ut.name, // e.g. "10x10 ft"
      originalPrice: (
        ut.price.originalAmount || ut.price.amount * 1.2
      ).toFixed(0),
      currentPrice: ut.price.amount.toFixed(0),
    }));

  return {
    name: site.name,
    address: site.address,
    hours: '8am - 6pm',
    image: site.image,
    pricing,
    detailsLink: `/locations/${site.id}`,
  };
};

export default function CityList({
  searchQuery,
  selectedCity,
  onSelectCity,
  sites,
}: Readonly<CityListProps>) {
  const citiesData = useMemo(() => {
    const map = new Map<string, ApiSite[]>();
    sites.forEach((site) => {
      // Extract city from address: "Street, City, State" -> "City"
      const parts = site.address.split(',').map(p => p.trim());
      const city = parts.length >= 2 ? parts[parts.length - 2] : (parts[0] || 'Unknown');

      if (!map.has(city)) {
        map.set(city, []);
      }
      map.get(city)?.push(site);
    });
    return Array.from(map.entries()).map(([cityName, citySites]) => ({
      name: cityName,
      sites: citySites,
    }));
  }, [sites]);

  const filteredCities = useMemo(() => {
    if (!searchQuery) return citiesData;
    const lowerQuery = searchQuery.toLowerCase();
    return citiesData.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.sites.some((s) => s.name.toLowerCase().includes(lowerQuery))
    );
  }, [citiesData, searchQuery]);

  const activeCityData = useMemo(() => {
    if (selectedCity) {
      return citiesData.find((city) => city.name === selectedCity);
    }
    if (
      searchQuery &&
      filteredCities.length === 1 &&
      filteredCities[0].sites.length <= 1
    ) {
      return filteredCities[0];
    }
    return null;
  }, [selectedCity, citiesData, searchQuery, filteredCities]);

  // If we have active data but no manual selection, it's auto-selected
  const isAutoSelected = !selectedCity && !!activeCityData;

  return (
    <div className="z-10 bg-brand-page-bg p-6 pt-20">
      <h1 className="font-semibold text-2xl mb-3 capitalize">
        Explore self storage facilities
      </h1>

      {/* If a city is selected (manually or auto), show sites in that city */}
      {activeCityData ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 -y-2">
            {!isAutoSelected && (
              <button
                onClick={() => onSelectCity(activeCityData.name)}
                className="w-full flex gap-2 items-center px-6 py-4 cursor-pointer border rounded-lg text-left hover:bg-gray-50 text-gray-700 border-gray-300 transition-colors"
              >

                <span className="flex-1 font-medium">{activeCityData.name}</span>
                <span className="text-sm text-gray-500 mr-2">
                  {activeCityData.sites.length} locations
                </span>
                <ChevronRight className="w-6 h-6 flex-shrink-0" />
              </button>
            )}
          </div>

          <div className="space-y-6">
            {activeCityData.sites.map((site) => (
              <LocationCard
                key={site.id}
                {...getSiteProps(site)}
                onBook={() => console.log(`Booking at ${site.name}`)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* No city selected: show list of cities */
        <div className="space-y-4">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <div key={city.name} className="space-y-2">
                <button
                  onClick={() => onSelectCity(city.name)}
                  className="w-full flex gap-2 items-center px-6 py-4 cursor-pointer border rounded-lg text-left hover:bg-gray-50 text-gray-700 border-gray-300 transition-colors"
                >
                  <span className="flex-1 font-medium">{city.name}</span>
                  <span className="text-sm text-gray-500 mr-2">
                    {city.sites.length} locations
                  </span>
                  <ChevronRight className="w-6 h-6 flex-shrink-0" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 px-6 border border-gray-300 rounded-lg">
              <p className="mb-2">No available cities found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
