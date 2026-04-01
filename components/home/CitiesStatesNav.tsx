"use client";

import React, { useState } from 'react';
import Link from "next/link";
interface CitiesStatesNavProps {
  cities: string[];
  states: string[];
}

export default function CitiesStatesNav({
  cities,
  states,
}: Readonly<CitiesStatesNavProps>) {
  const [activeTab, setActiveTab] = useState('cities');

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
