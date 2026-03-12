'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import LocationCard from '@/components/home/LocationCard';
import { ApiSite } from '@/lib/types/local';
import {
  formatSiteCount,
  formatUnitDimensions,
  getSiteCity,
  getSiteState,
} from '@/lib/utils/siteLocations';

interface CityListProps {
  searchQuery: string;
  selectedState: string;
  selectedCity: string;
  onSelectState: (state: string) => void;
  onSelectCity: (state: string, city: string) => void;
  onClearSelection: () => void;
  sites: ApiSite[];
}

const getSiteProps = (site: ApiSite) => {
  return {
    name: site.name,
    address: site.address,
    hours: '8am - 6pm',
    image: site.image,
    units: (site.unitTypes || []).slice(0, 3).map((ut) => {
      const nextAvailableUnit = ut.units?.find((unit) => unit.status === 'available');

      return {
        id: nextAvailableUnit?.id || ut.id,
        siteId: site.id,
        unitTypeId: ut.id,
        storageUnitId: nextAvailableUnit?.id,
        name: ut.name,
        dimensionsLabel: formatUnitDimensions(ut.dimensions),
        originalPrice: (ut.price.originalAmount || ut.price.amount * 1.2).toFixed(0),
        currentPrice: ut.price.amount.toFixed(0),
        maxQuantity: ut.availableCount,
        availableCount: ut.availableCount,
      };
    }),
    detailsLink: `/locations/${site.id}`,
  };
};

export default function CityList({
  searchQuery,
  selectedState,
  selectedCity,
  onSelectState,
  onSelectCity,
  onClearSelection,
  sites,
}: Readonly<CityListProps>) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const stateGroups = useMemo(() => {
    const stateMap = new Map<string, Map<string, ApiSite[]>>();

    sites.forEach((site) => {
      const stateName = getSiteState(site) || 'Unknown state';
      const cityName = getSiteCity(site) || 'Unknown city';

      if (!stateMap.has(stateName)) {
        stateMap.set(stateName, new Map<string, ApiSite[]>());
      }

      const cityMap = stateMap.get(stateName)!;

      if (!cityMap.has(cityName)) {
        cityMap.set(cityName, []);
      }

      cityMap.get(cityName)?.push(site);
    });

    return Array.from(stateMap.entries())
      .map(([stateName, cityMap]) => {
        const cities = Array.from(cityMap.entries())
          .map(([cityName, citySites]) => ({
            name: cityName,
            sites: citySites,
          }))
          .sort((left, right) => left.name.localeCompare(right.name));

        return {
          name: stateName,
          cities,
          siteCount: cities.reduce((total, city) => total + city.sites.length, 0),
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [sites]);

  const filteredStates = useMemo(() => {
    if (!normalizedQuery) {
      return stateGroups;
    }

    return stateGroups.filter((state) => {
      return (
        state.name.toLowerCase().includes(normalizedQuery) ||
        state.cities.some((city) => {
          return (
            city.name.toLowerCase().includes(normalizedQuery) ||
            city.sites.some((site) => site.name.toLowerCase().includes(normalizedQuery))
          );
        })
      );
    });
  }, [normalizedQuery, stateGroups]);

  const activeState = useMemo(() => {
    if (selectedState) {
      return stateGroups.find((state) => state.name === selectedState) || null;
    }

    if (normalizedQuery && filteredStates.length === 1) {
      return filteredStates[0];
    }

    return null;
  }, [filteredStates, normalizedQuery, selectedState, stateGroups]);

  const activeStateName = activeState?.name ?? '';

  const visibleCities = useMemo(() => {
    if (!activeState) {
      return [];
    }

    if (!normalizedQuery || normalizedQuery === activeState.name.toLowerCase()) {
      return activeState.cities;
    }

    return activeState.cities.filter((city) => {
      return (
        city.name.toLowerCase().includes(normalizedQuery) ||
        city.sites.some((site) => site.name.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [activeState, normalizedQuery]);

  const activeCity = useMemo(() => {
    if (!activeState || !selectedCity) {
      return null;
    }

    return activeState.cities.find((city) => city.name === selectedCity) || null;
  }, [activeState, selectedCity]);

  return (
    <div className="z-10 bg-brand-page-bg p-6 pt-20">
      <h1 className="font-semibold text-2xl mb-3 capitalize">
        Explore self storage sites
      </h1>

      {activeCity ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              All
            </button>
            <button
              type="button"
              onClick={() => onSelectState(activeStateName)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {activeStateName}
            </button>
            <div className="rounded-lg border border-brand-blue bg-blue-50 px-4 py-2 text-sm font-semibold text-brand-blue">
              {activeCity.name}
            </div>
          </div>

          <div className="space-y-6">
            {activeCity.sites.map((site) => (
              <LocationCard
                key={site.id}
                {...getSiteProps(site)}
                onBook={() => console.log(`Booking at ${site.name}`)}
              />
            ))}
          </div>
        </div>
      ) : activeState ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              All
            </button>
            <div className="rounded-lg border border-brand-blue bg-blue-50 px-4 py-2 text-sm font-semibold text-brand-blue">
              {activeStateName}
            </div>
          </div>

          {visibleCities.length > 0 ? (
            visibleCities.map((city) => (
              <button
                key={`${activeStateName}-${city.name}`}
                type="button"
                onClick={() => onSelectCity(activeStateName, city.name)}
                className="w-full flex gap-2 items-center px-6 py-4 cursor-pointer border rounded-lg text-left hover:bg-gray-50 text-gray-700 border-gray-300 transition-colors"
              >
                <span className="flex-1 font-medium">{city.name}</span>
                <span className="text-sm text-gray-500 mr-2">
                  {formatSiteCount(city.sites.length)}
                </span>
                <ChevronRight className="w-6 h-6 flex-shrink-0" />
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 px-6 border border-gray-300 rounded-lg">
              <p className="mb-2">No cities found in {activeStateName}.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStates.length > 0 ? (
            filteredStates.map((state) => (
              <button
                key={state.name}
                type="button"
                onClick={() => onSelectState(state.name)}
                className="w-full flex gap-2 items-center px-6 py-4 cursor-pointer border rounded-lg text-left hover:bg-gray-50 text-gray-700 border-gray-300 transition-colors"
              >
                <span className="flex-1 font-medium">{state.name}</span>
                <span className="text-sm text-gray-500 mr-2">
                  {formatSiteCount(state.siteCount)}
                </span>
                <ChevronRight className="w-6 h-6 flex-shrink-0" />
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 px-6 border border-gray-300 rounded-lg">
              <p className="mb-2">No states or sites found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
