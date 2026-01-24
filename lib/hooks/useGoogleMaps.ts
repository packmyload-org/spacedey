import { useEffect, useRef, useState } from 'react';
import loadGoogleMaps from '../loadGoogleMaps';

export interface MapLike {
  setCenter(center: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
  panTo(center: { lat: number; lng: number }): void;
  fitBounds(bounds: any): void;
}

export interface MarkerLike {
  setMap(map: MapLike | null): void;
  setPosition(position: { lat: number; lng: number } | unknown): void;
  getPosition(): any;
}

interface UseGoogleMapsOptions {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom?: number;
}

export function useGoogleMaps(
  mapDomRef: React.RefObject<HTMLDivElement | null>,
  options: UseGoogleMapsOptions
) {
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const mapRef = useRef<MapLike | null>(null);
  const { apiKey, center, zoom = 12 } = options;

  useEffect(() => {
    if (!mapDomRef.current || !apiKey) return;

    let mounted = true;

    async function init() {
      setMapsLoading(true);
      try {
        await loadGoogleMaps(apiKey);
        if (!mounted || !mapDomRef.current) return;

        const google = (window as any).google;

        mapRef.current ??= new google.maps.Map(mapDomRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });
      } catch (e) {
        setMapsError(String(e.message ?? 'Failed to load Google Maps'));
        console.error(e);
      } finally {
        setMapsLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [apiKey, mapDomRef]);

  return { map: mapRef.current, mapsLoading, mapsError };
}
