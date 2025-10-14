'use client';

import { useEffect, useRef, useState } from 'react';

interface MapViewProps {
  selectedCity: string;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number; price: number }> = {
  Lagos: { lat: 6.5244, lng: 3.3792, price: 45.99 },
  Abuja: { lat: 9.0578, lng: 7.4951, price: 49.5 },
  Kano: { lat: 12.0022, lng: 8.5919, price: 42.75 },
  Ibadan: { lat: 7.3775, lng: 3.9470, price: 39.99 },
  'Port Harcourt': { lat: 4.8156, lng: 7.0498, price: 44.5 },
  'Benin City': { lat: 6.3349, lng: 5.6037, price: 41.25 },
  Jos: { lat: 9.8965, lng: 8.8583, price: 38.99 },
  Enugu: { lat: 6.5246, lng: 7.5086, price: 40.0 },
  Kaduna: { lat: 10.5105, lng: 7.4165, price: 43.75 },
  Abeokuta: { lat: 7.1604, lng: 3.3481, price: 37.99 },
};

export default function MapView({ selectedCity }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentLocation = selectedCity && CITY_COORDINATES[selectedCity]
    ? CITY_COORDINATES[selectedCity]
    : CITY_COORDINATES['Lagos'];

  useEffect(() => {
    if (!selectedCity || !mapContainer.current) return;

    setIsLoading(true);
    // Simulate map loading
    const timer = setTimeout(() => setIsLoading(false), 500);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  return (
    <div
      ref={mapContainer}
      className="hidden lg:block w-1/2 max-h-[calc(100vh-82px)] bg-gray-200 relative"
      id="map-view"
    >
      <div className="h-full flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-6xl mb-4">🗺️</div>
          {isLoading ? (
            <>
              <p className="text-gray-600 mb-2">Loading map...</p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700 font-semibold mb-2">
                {selectedCity ? `${selectedCity} Storage` : 'Select a city to view'}
              </p>
              {selectedCity && (
                <div className="space-y-2 text-sm text-gray-600">
                  {currentLocation ? (
                    <>
                      <p>📍 Latitude: {currentLocation.lat.toFixed(4)}</p>
                      <p>📍 Longitude: {currentLocation.lng.toFixed(4)}</p>
                      <p className="text-brand-dark-blue font-bold">
                        Starting at ${currentLocation.price}/month
                      </p>
                    </>
                  ) : (
                    <p>Location data not available.</p>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-4">
                🔄 Google Maps integration coming soon
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}