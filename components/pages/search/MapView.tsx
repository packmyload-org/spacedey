'use client';

import { useEffect, useRef, useState } from 'react';
import loadGoogleMaps from '../../../lib/loadGoogleMaps';

interface MapViewProps {
  selectedCity: string;
}

// Minimal interfaces for the parts of the Google Maps JS API we use.
interface MapLike {
  panTo(center: { lat: number; lng: number }): void;
  setCenter(center: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
  fitBounds?(bounds: unknown): void;
}

interface MarkerLike {
  setPosition(position: { lat: number; lng: number } | unknown): void;
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
  const mapDomRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<MapLike | null>(null);
  const markerRef = useRef<MarkerLike | null>(null);

  const currentLocation = selectedCity && CITY_COORDINATES[selectedCity]
    ? CITY_COORDINATES[selectedCity]
    : CITY_COORDINATES['Lagos'];

  useEffect(() => {
    if (!mapDomRef.current) return;

    // If there's no API key, just show the placeholder UI (no script load)
    if (!apiKey) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

  async function loadAndInit() {
      setMapsLoading(true);
      try {
        await loadGoogleMaps(apiKey!);

        if (!mounted || !mapDomRef.current) return;

        const center = {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        };

        if (!mapRef.current) {
          // initialize map
          // runtime access to window.google must use a permissive cast
          // runtime access to window.google
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const gw = window as any;
          mapRef.current = new gw.google.maps.Map(mapDomRef.current, {
            center,
            zoom: 12,
            disableDefaultUI: true,
          }) as MapLike;

          // create marker
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          markerRef.current = new gw.google.maps.Marker({
            position: center,
            map: mapRef.current as unknown as object,
          }) as MarkerLike;
        } else {
          // pan to new location
          mapRef.current.panTo(center);
          if (markerRef.current) markerRef.current.setPosition(center);
        }

        setIsLoading(false);
      } catch (e) {
        // Failed to load maps - surface a helpful message to the user
        setMapsError(String(e ?? 'Failed to load Google Maps'));
      } finally {
        setMapsLoading(false);
      }
    }

    loadAndInit();

    return () => {
      mounted = false;
    };
  }, [selectedCity, apiKey, currentLocation.lat, currentLocation.lng]);


  // loader is delegated to lib/loadGoogleMaps

  return (
    <div
      ref={mapContainer}
      className="hidden lg:block w-1/2 max-h-[calc(100vh-82px)] bg-gray-200 relative"
      id="map-view"
    >
      {/* If there's no API key, keep the placeholder UI and instruct about .env */}
      {!apiKey ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <div className="text-6xl mb-4">🗺️</div>
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
              ⚠️ Google Maps API key not set. Create a <code>.env.local</code> with <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the map.
            </p>
          </div>
        </div>
      ) : (
        // Show the actual map
        <div className="h-full w-full">
          {/* map DOM */}
          <div ref={mapDomRef} className="h-full w-full" />

          {/* Loading overlay when switching cities or loading maps */}
          {(isLoading || mapsLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <div className="text-center bg-white/80 p-6 rounded-lg shadow">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-gray-600">{mapsLoading ? 'Loading map...' : 'Updating location...'}</p>
              </div>
            </div>
          )}

          {/* Maps error overlay (e.g., BillingNotEnabledMapError) */}
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
        </div>
      )}
    </div>
  );
}