"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function CitiesStatesNav() {
  const [activeTab, setActiveTab] = useState('cities');

  // Major Nigerian cities (common/popular selections)
  const cities = [
  'Lekki',
  'Ikeja',
  'Surulere',
  'Maitama',
  'Garki',
  'Kano',
  'Ibadan',
  'Port Harcourt',
  'Benin City',
  'Jos',
  'Enugu',
  'Kaduna',
  'Abeokuta',
  ];

  // Nigerian states + Federal Capital Territory (FCT)
  const states = [
  'Lagos',
  'Abuja',
  'Kano',
  'Oyo',
  'Rivers',
  'Edo',
  'Plateau',
  'Enugu',
  'Kaduna',
  'Ogun',
  ];

  return (
    <div className="bg-gray-50 min-h-full px-10 p-8">
    
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
                <Link 
                  key={city} 
                  href={`/search?city=${encodeURIComponent(city)}`}
                  className="text-blue-900 font-semibold text-lg hover:underline"
                >
                  {city}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-x-8 gap-y-6">
            {states.map((state) => (
              <Link 
                key={state} 
                href={`/search?state=${encodeURIComponent(state)}`}
                className="text-blue-900 font-semibold text-lg hover:underline"
              >
                {state}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
