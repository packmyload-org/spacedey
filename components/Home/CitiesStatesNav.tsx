"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { LOCATION_DETAILS } from '@/lib/utils/sampleLocations';
import type { ApiSite } from '@/lib/types/local';

const fallbackCities = Array.from(new Set(Object.values(LOCATION_DETAILS).map((detail) => detail.city)));
const fallbackStates = Array.from(new Set(Object.values(LOCATION_DETAILS).map((detail) => detail.state)));

export default function CitiesStatesNav() {
  const [activeTab, setActiveTab] = useState('cities');
  const [cities, setCities] = useState<string[]>(fallbackCities);
  const [states, setStates] = useState<string[]>(fallbackStates);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sites');
        const data = await res.json();

        if (data.ok && data.sites) {
          const uniqueCities = new Set<string>();
          const uniqueStates = new Set<string>();

          data.sites.forEach((site: ApiSite) => {
            if (site.city) {
              uniqueCities.add(site.city);
            }

            if (site.state) {
              uniqueStates.add(site.state);
            }
          });

          if (uniqueCities.size > 0) {
            setCities(Array.from(uniqueCities));
          }

          if (uniqueStates.size > 0) {
            setStates(Array.from(uniqueStates));
          }
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="bg-gray-50 min-h-full px-4 py-8">
      <div className="max-w-7xl mx-auto rounded-lg border border-gray-200 bg-white p-16 shadow-lg">
        <div className="mb-8 flex gap-8">
          <button
            onClick={() => setActiveTab('cities')}
            className={`font-semibold text-2xl pb-2 ${activeTab === 'cities'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-gray-700 hover:text-blue-600'
              } transition-colors`}
          >
            Cities
          </button>
          <button
            onClick={() => setActiveTab('states')}
            className={`font-semibold text-2xl pb-2 ${activeTab === 'states'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-gray-700 hover:text-blue-600'
              } transition-colors`}
          >
            States
          </button>
        </div>

        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-6 w-24 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : activeTab === 'cities' ? (
          <div className="flex max-h-96 flex-wrap gap-x-12 gap-y-6 overflow-y-auto">
            {cities.length === 0 ? (
              <p className="italic text-gray-400">No cities listed yet.</p>
            ) : (
              cities.map((city) => (
                <Link
                  key={city}
                  href={`/search?city=${encodeURIComponent(city)}`}
                  className="min-w-fit text-lg font-semibold text-blue-900 hover:underline"
                >
                  {city}
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="flex max-h-96 flex-wrap gap-x-12 gap-y-6 overflow-y-auto">
            {states.length === 0 ? (
              <p className="italic text-gray-400">No states listed yet.</p>
            ) : (
              states.map((state) => (
                <Link
                  key={state}
                  href={`/search?state=${encodeURIComponent(state)}`}
                  className="min-w-fit text-lg font-semibold text-blue-900 hover:underline"
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
