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

  const content = activeCity ? (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onClearSelection}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#1642F0] hover:bg-[#F5F8FF] hover:ring-2 hover:ring-[#1642F0]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1642F0] active:ring-2 active:ring-[#1642F0]/30"
        >
          <ChevronLeft className="h-4 w-4" />
          All
        </button>
        <button
          type="button"
          onClick={() => onSelectState(activeStateName)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#1642F0] hover:bg-[#F5F8FF] hover:ring-2 hover:ring-[#1642F0]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1642F0] active:ring-2 active:ring-[#1642F0]/30"
        >
          {activeStateName}
        </button>
        <div className="rounded-lg border border-[#1642F0] bg-blue-50 px-4 py-2 text-sm font-semibold text-[#1642F0]">
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
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#1642F0] hover:bg-[#F5F8FF] hover:ring-2 hover:ring-[#1642F0]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1642F0] active:ring-2 active:ring-[#1642F0]/30"
        >
          <ChevronLeft className="h-4 w-4" />
          All
        </button>
        <div className="rounded-lg border border-[#1642F0] bg-blue-50 px-4 py-2 text-sm font-semibold text-[#1642F0]">
          {activeStateName}
        </div>
      </div>

      {visibleCities.length > 0 ? (
        visibleCities.map((city) => (
          <button
            key={`${activeStateName}-${city.name}`}
            type="button"
            onClick={() => onSelectCity(activeStateName, city.name)}
            className="w-full flex gap-2 items-center rounded-lg border border-gray-300 px-6 py-4 text-left text-gray-700 transition-all hover:border-[#1642F0] hover:bg-[#F5F8FF] hover:ring-2 hover:ring-[#1642F0]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1642F0] active:border-[#1642F0] active:ring-2 active:ring-[#1642F0]/30"
          >
            <span className="flex-1 font-medium">{city.name}</span>
            <span className="text-sm text-gray-500 mr-2">
              {formatSiteCount(city.sites.length)}
            </span>
            <ChevronRight className="w-6 h-6 flex-shrink-0" />
          </button>
        ))
      ) : (
        <div className="rounded-lg border border-gray-300 px-6 py-8 text-center text-gray-500">
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
            className="w-full flex gap-2 items-center rounded-lg border border-gray-300 px-6 py-4 text-left text-gray-700 transition-all hover:border-[#1642F0] hover:bg-[#F5F8FF] hover:ring-2 hover:ring-[#1642F0]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1642F0] active:border-[#1642F0] active:ring-2 active:ring-[#1642F0]/30"
          >
            <span className="flex-1 font-medium">{state.name}</span>
            <span className="text-sm text-gray-500 mr-2">
              {formatSiteCount(state.siteCount)}
            </span>
            <ChevronRight className="w-6 h-6 flex-shrink-0" />
          </button>
        ))
      ) : (
        <div className="rounded-lg border border-gray-300 px-6 py-8 text-center text-gray-500">
          <p className="mb-2">No states or sites found.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="z-10 flex h-full min-h-0 flex-col bg-white px-6 pb-6 pt-4">
      <h1 className="mb-5 text-2xl font-semibold capitalize">
        Explore self storage sites
      </h1>
      <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto pr-1">
        {content}
      </div>
    </div>
  );
}
