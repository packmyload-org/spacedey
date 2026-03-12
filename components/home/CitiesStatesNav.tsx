"use client";

import React, { useMemo, useState } from 'react';
import Link from "next/link";
import { useSitesData } from '@/contexts/SitesContext';
import { LOCATION_DETAILS } from '@/lib/utils/sampleLocations';
import { getUniqueSiteCities, getUniqueSiteStates } from '@/lib/utils/siteLocations';

const fallbackCities = Object.values(LOCATION_DETAILS).map((detail) => detail.city);
const fallbackStates = Array.from(new Set(Object.values(LOCATION_DETAILS).map((detail) => detail.state)));

export default function CitiesStatesNav() {
  const { sites } = useSitesData();
  const [activeTab, setActiveTab] = useState('cities');
  const cities = useMemo(() => {
    const nextCities = getUniqueSiteCities(sites);
    return nextCities.length > 0 ? nextCities : fallbackCities;
  }, [sites]);
  const states = useMemo(() => {
    const nextStates = getUniqueSiteStates(sites);
    return nextStates.length > 0 ? nextStates : fallbackStates;
  }, [sites]);

  return (
    <section className="bg-white min-h-full px-10 p-8">
      <div className="max-w-7xl">
        <div className="mb-8 flex gap-8">
          <button
            onClick={() => setActiveTab('cities')}
            className={`font-semibold text-2xl pb-2 ${activeTab === 'cities'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-black hover:text-blue-600'
              } transition-colors`}
          >
            Cities
          </button>
          <button
            onClick={() => setActiveTab('states')}
            className={`font-semibold text-2xl pb-2 ${activeTab === 'states'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-black hover:text-blue-600'
              } transition-colors`}
          >
            States
          </button>
        </div>

        {activeTab === 'cities' ? (
          <div className="flex flex-wrap gap-x-8 gap-y-6 text-blue-600">
            {cities.length === 0 ? (
              <p className="text-gray-400 italic">No cities listed yet.</p>
            ) : (
              cities.map((city) => (
                <Link
                  key={city}
                  href={`/search?city=${encodeURIComponent(city)}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {city}
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-8 text-blue-600 gap-y-6">
            {states.length === 0 ? (
              <p className="text-gray-400 italic">No states listed yet.</p>
            ) : (
              states.map((state) => (
                <Link
                  key={state}
                  href={`/search?state=${encodeURIComponent(state)}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {state}
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
