'use client';

import { ChevronRight } from 'lucide-react';

interface CityListProps {
  searchQuery: string;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

const CITIES = [
  'Lagos',
  'Abuja',
  'Kano',
  'Ibadan',
  'Port Harcourt',
  'Benin City',
  'Jos',
  'Enugu',
  'Kaduna',
  'Abeokuta',
];

export default function CityList({
  searchQuery,
  selectedCity,
  onSelectCity,
}: CityListProps) {
  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="z-10 bg-brand-page-bg p-6">
      <h1 className="font-semibold text-2xl mb-3 capitalize">
        Explore self storage facilities
      </h1>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <button
              key={city}
              onClick={() => onSelectCity(city)}
              className={`w-full flex gap-2 px-6 py-4 font-serif cursor-pointer border-b border-gray-300 last:border-b-0 text-left transition-colors ${
                selectedCity === city
                  ? 'bg-blue-50 text-brand-dark-blue'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="flex-1">{city}</span>
              <ChevronRight className="w-6 h-6 flex-shrink-0" />
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 px-6">
            No cities found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}