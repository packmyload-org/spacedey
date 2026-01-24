'use client';

import { useEffect, useRef, useMemo } from 'react';
import { ApiSite } from '@/lib/types/storeganise';
import { useGoogleMaps, MarkerLike } from '@/lib/hooks/useGoogleMaps';
import { MapComingSoon } from './MapComingSoon';

interface MapViewProps {
  selectedCity: string;
  sites: ApiSite[];
}

export default function MapView({ selectedCity, sites }: MapViewProps) {
  const mapDomRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<MarkerLike[]>([]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Filter sites based on selected city
  const activeSites = useMemo(() => {
    if (!selectedCity) return sites;
    return sites.filter(s => {
      const addressParts = s.address.split(',').map(p => p.trim());
      const city = addressParts.length > 1 ? addressParts[1] : (addressParts[0] || '');
      return city.toLowerCase() === selectedCity.toLowerCase();
    });
  }, [selectedCity, sites]);

  const hasLocation = activeSites.length > 0;
  
  const centerLocation = useMemo(() => {
    return hasLocation && activeSites[0].coordinates.lat && activeSites[0].coordinates.lng
      ? { lat: activeSites[0].coordinates.lat, lng: activeSites[0].coordinates.lng }
      : { lat: 6.5244, lng: 3.3792 }; // Default Lagos
  }, [hasLocation, activeSites]);

  const showComingSoon = selectedCity && !hasLocation && sites.length > 0;

  const { map, mapsLoading, mapsError } = useGoogleMaps(mapDomRef, {
    apiKey: apiKey || '',
    center: centerLocation,
    zoom: 12
  });

  // Update markers when activeSites or map changes
  useEffect(() => {
    if (!map) return;

    const google = (window as any).google;

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Add markers for active sites
    activeSites.forEach(site => {
      if (site.coordinates.lat && site.coordinates.lng) {
        const marker = new google.maps.Marker({
          position: { lat: site.coordinates.lat, lng: site.coordinates.lng },
          map: map,
          title: site.name,
          animation: google.maps.Animation.DROP,
        });
        markersRef.current.push(marker);
      }
    });

    if (hasLocation) {
      map.panTo(centerLocation);
    }
  }, [map, activeSites, centerLocation, hasLocation]);

  return (
    <div className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative">
      {showComingSoon ? (
        <MapComingSoon city={selectedCity} />
      ) : apiKey ? (
        <div className="h-full w-full relative">
          <div ref={mapDomRef} className="h-full w-full" />
          
          {mapsLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
              <p className="bg-white px-4 py-2 rounded shadow text-sm font-medium">Loading map...</p>
            </div>
          )}

          {mapsError && (
             <div className="absolute inset-0 flex items-center justify-center bg-white/80 p-6 z-10">
               <div className="text-center text-red-600 bg-white p-4 rounded shadow">
                 <p>{mapsError}</p>
               </div>
             </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center bg-gray-100">
           <div className="text-center p-6 bg-white rounded shadow-lg max-w-sm">
             <div className="text-4xl mb-3">🗺️</div>
             <p className="font-semibold">Map Unavailable</p>
             <p className="text-xs text-gray-500 mt-2">API Key missing in environment</p>
           </div>
        </div>
      )}
    </div>
  );
}