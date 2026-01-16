'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import loadGoogleMaps from '../../lib/loadGoogleMaps';
import { ApiSite } from '@/lib/interfaces/ApiSite';

interface MapViewProps {
  selectedCity: string;
  sites: ApiSite[];
}

interface MapLike {
  panTo(center: { lat: number; lng: number }): void;
  setCenter(center: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
}

interface MarkerLike {
  setPosition(position: { lat: number; lng: number } | unknown): void;
  setMap(map: MapLike | null): void;
}

export default function MapView({ selectedCity, sites }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapDomRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<MapLike | null>(null);
  const markersRef = useRef<MarkerLike[]>([]);

  // Filter sites based on selected city
  const activeSites = useMemo(() => {
    if (!selectedCity) return sites;
    return sites.filter(s => {
      const addressParts = s.address.split(',').map(p => p.trim());
      const city = addressParts.length > 1 ? addressParts[1] : (addressParts[0] || '');
      return city.toLowerCase() === selectedCity.toLowerCase();
    });
  }, [selectedCity, sites]);

  // Determine if we have valid location data to show
  const hasLocation = activeSites.length > 0;
  
  // Center on the first site of the group, or default to Lagos (fallback)
  const centerLocation = hasLocation && activeSites[0].coordinates.lat && activeSites[0].coordinates.lng
    ? { lat: activeSites[0].coordinates.lat, lng: activeSites[0].coordinates.lng }
    : { lat: 6.5244, lng: 3.3792 }; // Default Lagos

  // Show "Coming Soon" if a city is selected but no sites are found there
  const showComingSoon = selectedCity && !hasLocation && sites.length > 0;

  useEffect(() => {
    if (!mapDomRef.current) return;
    if (showComingSoon) return;
    if (!apiKey) return;

    let mounted = true;

    async function loadAndInit() {
      if (!mapRef.current) setMapsLoading(true); 
      
      try {
        await loadGoogleMaps(apiKey!);

        if (!mounted || !mapDomRef.current) return;

        const gw = window as any; 

        // Initialize Map if not exists
        if (!mapRef.current) {
          mapRef.current = new gw.google.maps.Map(mapDomRef.current, {
            center: centerLocation,
            zoom: 12,
            disableDefaultUI: true,
            styles: [
               {
                 featureType: "poi",
                 elementType: "labels",
                 stylers: [{ visibility: "off" }]
               }
            ]
          });
        } else {
          mapRef.current.panTo(centerLocation);
        }

        // Clear existing markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        // Add markers for active sites
        activeSites.forEach(site => {
          if (site.coordinates.lat && site.coordinates.lng) {
            const marker = new gw.google.maps.Marker({
              position: { lat: site.coordinates.lat, lng: site.coordinates.lng },
              map: mapRef.current,
              title: site.name,
              animation: gw.google.maps.Animation.DROP,
            });
            markersRef.current.push(marker);
          }
        });

      } catch (e) {
        setMapsError(String(e ?? 'Failed to load Google Maps'));
      } finally {
        setMapsLoading(false);
      }
    }

    loadAndInit();

    return () => {
      mounted = false;
    };
  }, [apiKey, activeSites, centerLocation, showComingSoon]);


  return (
    <div
      ref={mapContainer}
      className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative"
    >
      {showComingSoon ? (
        <>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 z-20" />
          <div className="absolute inset-0 h-full w-full flex items-center justify-center z-20 p-4">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm mx-auto">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon!</h2>
              <p className="text-gray-700 mb-6">
                <span className="font-semibold text-[#1642F0]">{selectedCity}</span> storage is on the way.
              </p>
              <a 
                href={`mailto:info@spacedey.com?subject=Notify me when ${selectedCity} is available`}
                className="inline-block px-6 py-2 bg-[#1642F0] text-white rounded-full text-sm font-semibold hover:bg-[#0d1d73] transition-colors"
              >
                Notify Me
              </a>
            </div>
          </div>
        </>
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
