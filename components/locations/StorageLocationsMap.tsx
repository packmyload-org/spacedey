'use client';

import React, { useEffect, useMemo } from 'react';
import { env } from '@/config';
import Link from "next/link";
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';

interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
}

interface StorageMapSectionProps {
  locations?: MapLocation[];
  mapHeight?: string;
}

// Handler to fit bounds or center map based on locations
function MapHandler({ locations }: { locations: MapLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !locations.length) return;

    if (locations.length === 1) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
      map.setZoom(12);
    } else {
      const bounds = new (globalThis as any).google.maps.LatLngBounds();
      locations.forEach(loc => {
        bounds.extend({ lat: loc.lat, lng: loc.lng });
      });
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  return null;
}

const StorageMapSection: React.FC<StorageMapSectionProps> = ({
  locations = [],
  mapHeight = '600px'
}) => {
  const defaultLocations: MapLocation[] = useMemo(() => [
    { lat: 6.5244, lng: 3.3792, name: 'Lagos' },
    { lat: 9.0765, lng: 7.3986, name: 'Abuja' },
    { lat: 12.0022, lng: 8.6753, name: 'Kano' },
    { lat: 7.3775, lng: 3.9470, name: 'Ibadan' },
    { lat: 4.8156, lng: 7.0498, name: 'Port Harcourt' },
    { lat: 5.6350, lng: 5.6037, name: 'Benin City' },
    { lat: 9.9281, lng: 8.8906, name: 'Jos' },
    { lat: 6.4969, lng: 7.5519, name: 'Enugu' },
    { lat: 10.4904, lng: 7.6277, name: 'Kaduna' },
    { lat: 6.5897, lng: 3.3474, name: 'Abeokuta' }
  ], []);

  const displayLocations = locations.length > 0 ? locations : defaultLocations;
  const apiKey = env.googleMaps.apiKey;

  return (
    <div>
      <h2 className="text-center capitalize text-blue-900 text-3xl lg:text-4xl font-bold">
        Storage in your neighborhood
      </h2>
      
      <hr className="h-[3px] w-[50px] mt-6 mb-10 lg:mb-[72px] mx-auto bg-orange-500 border-0" />
      
      <div className="w-full lg:px-20" style={{ height: mapHeight }}>
        <div className="h-full relative overflow-hidden bg-gray-200 rounded-lg">
          {/* If API key not present, keep the placeholder */}
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={{ lat: 6.5244, lng: 3.3792 }} // Initial center, will be updated by MapHandler
                defaultZoom={4}
                disableDefaultUI={true}
                className="w-full h-full"
                mapId="storage-locations-map"
              >
                {displayLocations.map((loc, idx) => (
                  <Marker
                    key={`${loc.name}-${idx}`}
                    position={{ lat: loc.lat, lng: loc.lng }}
                    title={loc.name}
                  />
                ))}
                <MapHandler locations={displayLocations} />
              </Map>
            </APIProvider>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400"
                  width="64"
                  height="64"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-gray-600 text-lg">Map will be displayed here</p>
                <p className="text-gray-500 text-sm mt-2">{displayLocations.length} locations available</p>
                <p className="text-xs text-gray-500 mt-3">
                  ⚠️ Google Maps API key not set. Create a <code>.env.local</code> with <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the map.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <div className="flex justify-center my-10">
        <Link href="/search">
          <button
            type="button"
            className="px-7 py-3 border-1 border-blue-600 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors"
          >
            Search Storage Units Near Me
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StorageMapSection;