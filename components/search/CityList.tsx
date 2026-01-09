'use client';

import { ChevronRight } from 'lucide-react';
import { getAvailableCities } from '@/lib/cities';
import LocationCard from '@/components/Home/LocationCard';
import SAMPLE_LOCATIONS from '@/lib/sampleLocations';

interface CityListProps {
  searchQuery: string;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export default function CityList({
  searchQuery,
  selectedCity,
  onSelectCity,
}: CityListProps) {
  const availableCities = getAvailableCities();
  const filteredAvailableCities = availableCities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Resolve city sample data from centralized source or fall back to a basic shape
  const getCityData = (cityName: string) => {
    const found = SAMPLE_LOCATIONS.find((s) => s.city === cityName);
    if (found) {
      return {
        name: `Spacedey - ${found.city}`,
        address: found.address,
        hours: found.hours,
        pricing: found.pricing,
        imageUrl: found.imageUrl,
      };
    }

    return {
      name: `Spacedey - ${cityName}`,
      address: `123 Storage Lane, ${cityName}, NG`,
      hours: '6am - 10pm',
      pricing: SAMPLE_LOCATIONS[0].pricing,
    };
  };

  return (
    <div className="z-10 bg-brand-page-bg p-6 pt-20">
      <h1 className="font-semibold text-2xl mb-3 capitalize">
        Explore self storage facilities
      </h1>

      {/* If a city is selected, show only that city's card with a back control */}
      {selectedCity ? (
        (() => {
          const city = availableCities.find((c) => c.name === selectedCity);
          const data = city ? getCityData(city.name) : getCityData(selectedCity);
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectCity('')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to list
                </button>
                <h2 className="text-lg font-semibold">{selectedCity}</h2>
              </div>

              <div>
                <LocationCard
                  name={data.name}
                  address={data.address}
                  hours={data.hours}
                  pricing={data.pricing}
                  onBook={() => console.log(`Booking at ${selectedCity}`)}
                />
              </div>
            </div>
          );
        })()
      ) : (
        /* No city selected: show list. Only render cards under each city when there's a search query. */
        <div className="space-y-4">
          {filteredAvailableCities.length > 0 ? (
            filteredAvailableCities.map((city) => (
              <div key={city.name} className="space-y-2">
                <button
                  onClick={() => onSelectCity(city.name)}
                  className={`w-full flex gap-2 items-center px-6 py-4 cursor-pointer border rounded-lg text-left transition-colors ${
                    selectedCity === city.name
                      ? 'bg-blue-50 text-brand-dark-blue border-blue-300'
                      : 'hover:bg-gray-50 text-gray-700 border-gray-300'
                  }`}
                >
                  <span className="flex-1 font-medium">{city.name}</span>
                  <ChevronRight className="w-6 h-6 flex-shrink-0" />
                </button>

                {/* Show small reservation card only when searching */}
                {searchQuery ? (
                  <div className="px-2">
                    <LocationCard
                      name={getCityData(city.name).name}
                      address={getCityData(city.name).address}
                      hours={getCityData(city.name).hours}
                      pricing={getCityData(city.name).pricing}
                      onBook={() => console.log(`Booking at ${city.name}`)}
                    />
                  </div>
                ) : null}
              </div>
            ))
          ) : searchQuery ? (
            <div className="text-center py-8 text-gray-500 px-6 border border-gray-300 rounded-lg">
              <p className="mb-2">No available cities found matching &quot;{searchQuery}&quot;</p>
              <p className="text-sm text-gray-400">
                Search for any city to see if it&apos;s coming soon!
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 px-6 border border-gray-300 rounded-lg">
              <p>Start typing to search for cities</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}