'use client';

import React, { useEffect, useRef, useState } from 'react';
import loadGoogleMaps from '../../lib/loadGoogleMaps';

interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
}

interface StorageMapSectionProps {
  locations?: MapLocation[];
  mapHeight?: string;
}

// Minimal interfaces for Google Maps objects used here
interface MapLike {
  setCenter(center: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
  fitBounds(bounds: unknown): void;
}

interface MarkerLike {
  setMap(map: MapLike | null): void;
  getPosition(): unknown;
}

const StorageMapSection: React.FC<StorageMapSectionProps> = ({
  locations = [],
  mapHeight = '600px'
}) => {
  const defaultLocations: MapLocation[] = [
    { lat: 40.68, lng: -73.96, name: 'New York' },
    { lat: 34.1461825, lng: -118.138288, name: 'Los Angeles' },
    { lat: 38.98, lng: -77.09, name: 'Washington DC' },
    { lat: 33.79, lng: -84.41, name: 'Georgia' },
    { lat: 37.79, lng: -122.41, name: 'San Francisco' },
    { lat: 47.6, lng: -122.33, name: 'Seattle' },
    { lat: 42.36, lng: -71.06, name: 'Massachusetts' }
  ];

  const displayLocations = locations.length > 0 ? locations : defaultLocations;
  const mapDomRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLike | null>(null);
  const markersRef = useRef<MarkerLike[]>([]);
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!mapDomRef.current) return;

    if (!apiKey) return; // keep placeholder if no key

    let mounted = true;
    async function init() {
      setMapsLoading(true);
      try {
        await loadGoogleMaps(apiKey!);

        if (!mounted || !mapDomRef.current) return;
        // runtime access to window.google
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gw = window as any;
        const bounds = new gw.google.maps.LatLngBounds();

        if (!mapRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mapRef.current = new gw.google.maps.Map(mapDomRef.current, {
            center: { lat: displayLocations[0].lat, lng: displayLocations[0].lng },
            zoom: 4,
            disableDefaultUI: true,
          }) as unknown as MapLike;
        }

        // Clear existing markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        // Add markers
        displayLocations.forEach((loc) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const marker = new gw.google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: mapRef.current as unknown as object,
            title: loc.name,
          }) as unknown as MarkerLike;
          markersRef.current.push(marker);
          bounds.extend((marker as unknown as { getPosition(): unknown }).getPosition());
        });

        if (displayLocations.length === 1) {
          mapRef.current.setCenter({ lat: displayLocations[0].lat, lng: displayLocations[0].lng });
          mapRef.current.setZoom(12);
        } else {
          mapRef.current.fitBounds(bounds);
        }
      } catch (e) {
        setMapsError(String(e ?? 'Failed to load Google Maps'));
      } finally {
        setMapsLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
      // clean markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  // Use a stable serialized key for location array to avoid complex deps
  }, [JSON.stringify(displayLocations), apiKey]);

  // loader delegated to lib/loadGoogleMaps

  return (
    <div>
      <h2 className="text-center capitalize text-blue-900 text-3xl lg:text-4xl font-bold">
        Storage in your neighborhood
      </h2>
      
      <hr className="h-[3px] w-[50px] mt-6 mb-10 lg:mb-[72px] mx-auto bg-orange-500 border-0" />
      
      <div className="w-full lg:px-20" style={{ height: mapHeight }}>
        <div className="h-full relative overflow-hidden bg-gray-200 rounded-lg">
          {/* If API key not present, keep the placeholder */}
          {!apiKey ? (
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
          ) : (
            <>
              <div ref={mapDomRef} className="absolute inset-0" />
              {mapsLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <div className="text-center bg-white/80 p-6 rounded-lg shadow">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              {mapsError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 p-6">
                  <div className="bg-white p-6 rounded-lg shadow text-center max-w-md">
                    <h3 className="text-lg font-semibold mb-2">Map unavailable</h3>
                    <p className="text-sm text-gray-700 mb-4">{mapsError}</p>
                    <p className="text-sm text-gray-600">This often means billing is not enabled for your Google Cloud project. Follow the Google instructions to enable billing for the Maps JavaScript API.</p>
                    <p className="text-xs text-gray-500 mt-3">See: <a className="text-blue-600 underline" href="https://developers.google.com/maps/documentation/javascript/error-messages#billing-not-enabled-map-error" target="_blank" rel="noreferrer">BillingNotEnabledMapError</a></p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Instructions for implementation */}
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md max-w-sm text-xs">
            <p className="font-semibold mb-2">Implementation Note:</p>
            <p className="text-gray-600">This component will render a Google Map when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-10">
        <button
          type="button"
          className="px-7 py-3 border-1 border-blue-600 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors"
        >
          Search Storage Units Near Me
        </button>
      </div>
    </div>
  );
};

export default StorageMapSection;

/* 
 * IMPLEMENTATION GUIDE:
 * 
 * 1. Install Google Maps for React:
 *    npm install @react-google-maps/api
 * 
 * 2. Get a Google Maps API key from Google Cloud Console
 * 
 * 3. Add to your .env.local:
 *    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
 * 
 * 4. Replace the placeholder div with:
 * 
 *    import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
 * 
 *    const mapContainerStyle = {
 *      width: '100%',
 *      height: '100%'
 *    };
 * 
 *    const center = {
 *      lat: 38.794595,
 *      lng: -106.534838
 *    };
 * 
 *    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
 *      <GoogleMap
 *        mapContainerStyle={mapContainerStyle}
 *        center={center}
 *        zoom={4}
 *      >
 *        {displayLocations.map((location, idx) => (
 *          <Marker
 *            key={idx}
 *            position={{ lat: location.lat, lng: location.lng }}
 *            icon={{
 *              path: "M24 3.795c-4.374 0-8.568 1.74-11.661 4.833...",
 *              fillColor: '#1642F0',
 *              fillOpacity: 1,
 *              strokeWeight: 0,
 *              scale: 1,
 *            }}
 *          />
 *        ))}
 *      </GoogleMap>
 *    </LoadScript>
 */