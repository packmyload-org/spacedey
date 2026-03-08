"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function CitiesStatesNav() {
  const [activeTab, setActiveTab] = useState('cities');
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sites');
        const data = await res.json();
        if (data.ok && data.sites) {
          const uniqueCities = new Set<string>();
          const uniqueStates = new Set<string>();

          data.sites.forEach((site: any) => {
            const parts = site.address.split(',').map((p: string) => p.trim());
            if (parts.length >= 2) {
              uniqueCities.add(parts[parts.length - 2]); // City
              uniqueStates.add(parts[parts.length - 1]); // State
            } else if (parts.length === 1) {
              uniqueStates.add(parts[0]);
            }
          });

          setCities(Array.from(uniqueCities));
          setStates(Array.from(uniqueStates));
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
    <div className="bg-gray-50 min-h-full px-4 py-8">

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-16 border border-gray-200">

        {/* Navigation tabs */}
        <div className="flex gap-8 mb-8">
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

        {/* Content */}
        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-6 w-24 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : activeTab === 'cities' ? (
          <>
            <div className="flex flex-wrap gap-x-12 gap-y-6 max-h-96 overflow-y-auto">
              {cities.length === 0 ? (
                <p className="text-gray-400 italic">No cities listed yet.</p>
              ) : (
                cities.map((city) => (
                  <Link
                    key={city}
                    href={`/search?city=${encodeURIComponent(city)}`}
                    className="text-blue-900 font-semibold text-lg hover:underline min-w-fit"
                  >
                    {city}
                  </Link>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-x-12 gap-y-6 max-h-96 overflow-y-auto">
            {states.length === 0 ? (
              <p className="text-gray-400 italic">No states listed yet.</p>
            ) : (
              states.map((state) => (
                <Link
                  key={state}
                  href={`/search?state=${encodeURIComponent(state)}`}
                  className="text-blue-900 font-semibold text-lg hover:underline min-w-fit"
                >
                  {state}
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
