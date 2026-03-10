'use client';

import { Component, type ErrorInfo, type ReactNode, useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { env } from '@/config';
import { ApiSite } from '@/lib/types/local';
import { cityMatchesSite } from '@/lib/utils/siteLocations';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';

interface MapViewProps {
  selectedCity: string;
  sites: ApiSite[];
}

interface MapErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

interface MapErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  state: MapErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Map rendering error:', error, info);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function getValidCoordinates(site: ApiSite): { lat: number; lng: number } | null {
  const lat = Number(site?.coordinates?.lat);
  const lng = Number(site?.coordinates?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
}

// Inner component to handle map interactions like panning
function MapUpdater({ center, zoom }: { center: { lat: number, lng: number }, zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  return null;
}

function SearchMapFallback({
  sites,
  selectedCity,
  showAllLocations,
}: Readonly<{
  sites: ApiSite[];
  selectedCity: string;
  showAllLocations: boolean;
}>) {
  return (
    <div className="h-full w-full overflow-hidden bg-[#EAF1FF]">
      <div className="relative h-full w-full">
        <Image
          src="/images/mock-storage-map.svg"
          alt="Mock map preview of Spacedey storage locations"
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07153F]/28 via-transparent to-white/20" />
        <div className="absolute left-5 top-5 right-5">
          <div className="inline-flex max-w-full flex-col rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-[0_18px_50px_rgba(17,42,114,0.18)] backdrop-blur">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Search coverage
            </p>
            <h3 className="mt-2 text-lg font-black text-[#102A72]">
              {showAllLocations ? 'All mapped locations' : `Showing ${selectedCity}`}
            </h3>
            <p className="mt-1 text-sm text-[#5E6C91]">
              {showAllLocations
                ? 'Pick a city from the list to focus the search, or browse all visible storage sites.'
                : `${sites.length} site${sites.length === 1 ? '' : 's'} visible in this view.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapView({ selectedCity, sites }: Readonly<MapViewProps>) {
  const apiKey = env.googleMaps.apiKey;
  const mapsEnabled = env.googleMaps.enabled;
  const [mapLoadFailed, setMapLoadFailed] = useState(false);
  const hasSelectedCity = Boolean(selectedCity);
  const safeSites = useMemo(() => (Array.isArray(sites) ? sites : []), [sites]);

  const filteredSites = useMemo(() => {
    if (!hasSelectedCity) {
      return safeSites;
    }

    return safeSites.filter((site) => cityMatchesSite(site, selectedCity));
  }, [hasSelectedCity, selectedCity, safeSites]);

  const showAllLocations = hasSelectedCity && filteredSites.length === 0;
  const activeSites = useMemo(() => {
    if (!hasSelectedCity) {
      return safeSites;
    }

    return filteredSites.length > 0 ? filteredSites : safeSites;
  }, [filteredSites, hasSelectedCity, safeSites]);

  const centerLocation = useMemo(() => {
    const sitesWithCoordinates = activeSites
      .map((site) => getValidCoordinates(site))
      .filter((coords): coords is { lat: number; lng: number } => coords !== null);

    if (sitesWithCoordinates.length === 0) {
      return { lat: 9.082, lng: 8.6753 };
    }

    const total = sitesWithCoordinates.reduce(
      (acc, site) => ({
        lat: acc.lat + site.lat,
        lng: acc.lng + site.lng,
      }),
      { lat: 0, lng: 0 }
    );

    return {
      lat: total.lat / sitesWithCoordinates.length,
      lng: total.lng / sitesWithCoordinates.length,
    };
  }, [activeSites]);

  const zoomLevel = hasSelectedCity && !showAllLocations ? 11 : 6;
  const showStaticFallback = !mapsEnabled || !apiKey || mapLoadFailed;

  if (showStaticFallback) {
    return (
      <div className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative">
        <SearchMapFallback
          sites={activeSites}
          selectedCity={selectedCity}
          showAllLocations={showAllLocations || !hasSelectedCity}
        />
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative">
      <div className="h-full w-full relative">
        {showAllLocations && (
          <div className="absolute left-4 right-4 top-4 z-10 rounded-2xl border border-white/70 bg-white/92 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Search coverage
            </p>
            <p className="mt-1 text-sm text-[#102A72]">
              No exact map match for <span className="font-bold">{selectedCity}</span> yet. Showing all mapped locations instead.
            </p>
          </div>
        )}
        <MapErrorBoundary
          fallback={
            <SearchMapFallback
              sites={activeSites}
              selectedCity={selectedCity}
              showAllLocations={showAllLocations || !hasSelectedCity}
            />
          }
          onError={() => {
            setMapLoadFailed(true);
          }}
        >
          <APIProvider
            apiKey={apiKey}
            onError={() => {
              setMapLoadFailed(true);
            }}
          >
            <Map
              defaultCenter={centerLocation}
              defaultZoom={zoomLevel}
              gestureHandling={'greedy'}
              disableDefaultUI={false}
              className="w-full h-full"
              mapId="spacedey-map-id" // Required for AdvancedMarker if we upgrade later, good practice
            >
              {activeSites.map((site, index) => {
                const coordinates = getValidCoordinates(site);

                if (!coordinates) {
                  return null;
                }

                return (
                <Marker
                  key={`${site.id}-${index}`}
                  position={coordinates}
                  title={site.name}
                />
                );
              })}
              <MapUpdater center={centerLocation} zoom={zoomLevel} />
            </Map>
          </APIProvider>
        </MapErrorBoundary>
      </div>
    </div>
  );
}
