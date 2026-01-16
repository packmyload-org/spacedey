'use client';

import { ChevronRight } from 'lucide-react';
import LocationCard from '@/components/Home/LocationCard';
import { ApiSite } from '@/lib/interfaces/ApiSite';
import { useMemo } from 'react';

interface CityListProps {
  searchQuery: string;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  sites: ApiSite[];
}

export default function CityList({
  searchQuery,
  selectedCity,
  onSelectCity,
  sites,
}: CityListProps) {
  
  // Group sites by city
  const citiesData = useMemo(() => {
    const map = new Map<string, ApiSite[]>();
    
    sites.forEach(site => {
      // Assuming address is comma separated string: "Street, City, State"
      // We'll try to extract city from the address string if possible, or use a default
      const addressParts = site.address.split(',').map(p => p.trim());
      const city = addressParts.length > 1 ? addressParts[1] : (addressParts[0] || 'Unknown City');
      
      const normalizedCity = city.trim();
      if (!map.has(normalizedCity)) {
        map.set(normalizedCity, []);
      }
      map.get(normalizedCity)?.push(site);
    });
    
    return Array.from(map.entries()).map(([name, citySites]) => ({
      name,
      sites: citySites
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [sites]);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery) return citiesData;
    return citiesData.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sites.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [citiesData, searchQuery]);

  // Helper to map site to LocationCard props
  const getSiteProps = (site: ApiSite) => {
    // Map unit types to pricing format
    const pricing = (site.unitTypes || [])
      .slice(0, 3) 
      .map(ut => ({
        size: ut.name, // e.g. "10x10 ft"
        originalPrice: (ut.price.originalAmount || ut.price.amount * 1.2).toFixed(0),
        currentPrice: ut.price.amount.toFixed(0)
      }));

    return {
      name: site.name,
      address: site.address,
      hours: '8am - 6pm', 
      imageUrl: site.image,
      pricing,
      detailsLink: `/locations/${site.id}`,
    };
  };

  return (
    <div className="z-10 bg-brand-page-bg p-6 pt-20">
      <h1 className="font-semibold text-2xl mb-3 capitalize">
        Explore self storage facilities
      </h1>

      {/* If a city is selected, show sites in that city */}
      {selectedCity ? (
        (() => {
          const cityGroup = citiesData.find(c => c.name === selectedCity);
          
          if (!cityGroup) {
            return (
              <div className="space-y-4">
                 <button
                  onClick={() => onSelectCity('')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to list
                </button>
                <p>City not found.</p>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectCity('')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to list
                </button>
                <h2 className="text-lg font-semibold">{selectedCity} ({cityGroup.sites.length})</h2>
              </div>

              <div className="space-y-6">
                {cityGroup.sites.map(site => (
                  <LocationCard
                    key={site.id}
                    {...getSiteProps(site)}
                    onBook={() => console.log(`Booking at ${site.code}`)}
                  />
                ))}
              </div>
            </div>
          );
        })()
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
                  <span className="text-sm text-gray-500 mr-2">{city.sites.length} locations</span>
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
