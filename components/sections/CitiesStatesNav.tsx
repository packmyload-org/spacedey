"use client";

import React, { useState } from 'react';

export default function CitiesStatesNav() {
  const [activeTab, setActiveTab] = useState('cities');

  const cities = [
    'Atlanta', 'Boston', 'Brooklyn', 'Culver City', 'Los Angeles', 
    'New York', 'Oakland', 'Queens', 'San Francisco', 'Seattle', 'Walnut Creek'
  ];

  const states = [
    'California', 'District of Columbia', 'Georgia', 'Massachusetts', 
    'New York', 'Washington'
  ];

  return (
    <div className="bg-gray-50 min-h-full px-10 p-8">
      <hr />
      <div className="max-w-7xl">
    
        {/* Navigation tabs */}
        <div className="flex gap-8 mb-8">
          <button 
            onClick={() => setActiveTab('cities')}
            className={`font-semibold text-2xl pb-2 ${
              activeTab === 'cities' 
                ? 'text-blue-600 border-b-4 border-blue-600' 
                : 'text-gray-700 hover:text-blue-600'
            } transition-colors`}
          >
            Cities
          </button>
          <button 
            onClick={() => setActiveTab('states')}
            className={`font-semibold text-2xl pb-2 ${
              activeTab === 'states' 
                ? 'text-blue-600 border-b-4 border-blue-600' 
                : 'text-gray-700 hover:text-blue-600'
            } transition-colors`}
          >
            States
          </button>
        </div>

        {/* Content */}
        {activeTab === 'cities' ? (
          <>
            <div className="flex flex-wrap gap-x-8 gap-y-6">
              {cities.map((city) => (
                <a key={city} href="#" className="text-blue-900 font-semibold text-lg hover:underline">
                  {city}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <a href="#" className="text-blue-900 font-semibold text-lg hover:underline">
                Washington, DC
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-x-8 gap-y-6">
            {states.map((state) => (
              <a key={state} href="#" className="text-blue-900 font-semibold text-lg hover:underline">
                {state}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}