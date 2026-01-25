'use client';

import { useMemo, useEffect } from 'react';
import { ApiSite } from '@/lib/types/storeganise';
import { MapComingSoon } from './MapComingSoon';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';

interface MapViewProps {
  selectedCity: string;
  sites: ApiSite[];
}

// Inner component to handle map interactions like panning
function MapUpdater({ center }: { center: { lat: number, lng: number } }) {
  const map = useMap();
  
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);

  return null;
}

export default function MapView({ selectedCity, sites }: Readonly<MapViewProps>) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Filter sites based on selected city
  const activeSites = useMemo(() => {
    if (!selectedCity) return sites;
    return sites.filter(s => s.code.toLowerCase() === selectedCity.toLowerCase());
  }, [selectedCity, sites]);

  const hasLocation = activeSites.length > 0;
  
  const centerLocation = useMemo(() => {
    return hasLocation && activeSites[0].coordinates.lat && activeSites[0].coordinates.lng
      ? { lat: activeSites[0].coordinates.lat, lng: activeSites[0].coordinates.lng }
      : { lat: 6.5244, lng: 3.3792 }; // Default Lagos
  }, [hasLocation, activeSites]);

  const showComingSoon = selectedCity && !hasLocation && sites.length > 0;

  if (showComingSoon) {
    return (
      <div className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative">
        <MapComingSoon city={selectedCity} />
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative">
        <div className="h-full flex items-center justify-center bg-gray-100">
           <div className="text-center p-6 bg-white rounded shadow-lg max-w-sm">
             <div className="text-4xl mb-3">🗺️</div>
             <p className="font-semibold">Map Unavailable</p>
             <p className="text-xs text-gray-500 mt-2">API Key missing in environment</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative">
      <div className="h-full w-full relative">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={centerLocation}
            defaultZoom={12}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            className="w-full h-full"
            mapId="spacedey-map-id" // Required for AdvancedMarker if we upgrade later, good practice
          >
            {activeSites.map((site, index) => (
              site.coordinates.lat && site.coordinates.lng ? (
                <Marker
                  key={`${site.id}-${index}`}
                  position={{ lat: site.coordinates.lat, lng: site.coordinates.lng }}
                  title={site.name}
                />
              ) : null
            ))}
            <MapUpdater center={centerLocation} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}