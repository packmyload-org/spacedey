"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { LOCATION_DETAILS } from '@/lib/utils/sampleLocations';
import type { ApiSite } from '@/lib/types/local';

const fallbackCities = Object.values(LOCATION_DETAILS).map((detail) => detail.city);
const fallbackStates = Array.from(new Set(Object.values(LOCATION_DETAILS).map((detail) => detail.state)));

export default function CitiesStatesNav() {
  const [activeTab, setActiveTab] = useState('cities');
<<<<<<< HEAD
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
=======
  const [cities, setCities] = useState<string[]>(fallbackCities);
  const [states, setStates] = useState<string[]>(fallbackStates);
>>>>>>> feat/custom-integration

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sites');
        const data = await res.json();
        if (data.ok && data.sites) {
          const uniqueCities = new Set<string>();
          const uniqueStates = new Set<string>();

<<<<<<< HEAD
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
=======
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
>>>>>>> feat/custom-integration
      }
    }
    fetchData();
  }, []);

  return (
<<<<<<< HEAD
    <div className="bg-gray-50 min-h-full px-4 py-8">

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-16 border border-gray-200">

        {/* Navigation tabs */}
        <div className="flex gap-8 mb-8">
=======
    <section className="bg-gray-50 min-h-full px-10 p-8">
      <div className="max-w-7xl">
        <div className="mb-8 flex gap-8">
>>>>>>> feat/custom-integration
          <button
            onClick={() => setActiveTab('cities')}
            className={`font-semibold text-2xl pb-2 ${activeTab === 'cities'
              ? 'text-blue-600 border-b-4 border-blue-600'
<<<<<<< HEAD
              : 'text-gray-700 hover:text-blue-600'
=======
              : 'text-black hover:text-blue-600'
>>>>>>> feat/custom-integration
              } transition-colors`}
          >
            Cities
          </button>
          <button
            onClick={() => setActiveTab('states')}
            className={`font-semibold text-2xl pb-2 ${activeTab === 'states'
              ? 'text-blue-600 border-b-4 border-blue-600'
<<<<<<< HEAD
              : 'text-gray-700 hover:text-blue-600'
=======
              : 'text-black hover:text-blue-600'
>>>>>>> feat/custom-integration
              } transition-colors`}
          >
            States
          </button>
        </div>

<<<<<<< HEAD
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
=======
        {activeTab === 'cities' ? (
          <div className="flex flex-wrap gap-x-8 gap-y-6">
            {cities.length === 0 ? (
              <p className="text-gray-400 italic">No cities listed yet.</p>
            ) : (
              cities.map((city) => (
                <Link
                  key={city}
                  href={`/search?city=${encodeURIComponent(city)}`}
                  className="text-lg font-semibold text-blue-900 hover:underline"
                >
                  {city}
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-8 gap-y-6">
>>>>>>> feat/custom-integration
            {states.length === 0 ? (
              <p className="text-gray-400 italic">No states listed yet.</p>
            ) : (
              states.map((state) => (
                <Link
                  key={state}
                  href={`/search?state=${encodeURIComponent(state)}`}
<<<<<<< HEAD
                  className="text-blue-900 font-semibold text-lg hover:underline min-w-fit"
=======
                  className="text-lg font-semibold text-blue-900 hover:underline"
>>>>>>> feat/custom-integration
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
