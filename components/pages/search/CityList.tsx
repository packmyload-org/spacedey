'use client';

import { ChevronRight } from 'lucide-react';
import { getAvailableCities } from '@/lib/cities';

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

  return (
    <div className="z-10 bg-brand-page-bg p-6 pt-20">
      <h1 className="font-semibold text-2xl mb-3 capitalize">
        Explore self storage facilities
      </h1>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {filteredAvailableCities.length > 0 ? (
          filteredAvailableCities.map((city) => (
            <button
              key={city.name}
              onClick={() => onSelectCity(city.name)}
              className={`w-full flex gap-2 items-center px-6 py-4 font-serif cursor-pointer border-b border-gray-300 last:border-b-0 text-left transition-colors ${
                selectedCity === city.name
                  ? 'bg-blue-50 text-brand-dark-blue'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="flex-1">{city.name}</span>
              <ChevronRight className="w-6 h-6 flex-shrink-0" />
            </button>
          ))
        ) : searchQuery ? (
          <div className="text-center py-8 text-gray-500 px-6">
            <p className="mb-2">No available cities found matching &quot;{searchQuery}&quot;</p>
            <p className="text-sm text-gray-400">
              Search for any city to see if it&apos;s coming soon!
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 px-6">
            <p>Start typing to search for cities</p>
          </div>
        )}
      </div>
    </div>
  );
}