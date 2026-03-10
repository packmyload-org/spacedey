'use client';

import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { env } from '@/config';
import { ApiSite } from '@/lib/types/local';
import { cityMatchesSite, formatSiteCount, stateMatchesSite } from '@/lib/utils/siteLocations';

interface MapViewProps {
  selectedState: string;
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

function MapUpdater({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
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
  selectedLabel,
  showAllSites,
}: Readonly<{
  sites: ApiSite[];
  selectedLabel: string;
  showAllSites: boolean;
}>) {
  return (
    <div className="h-full w-full overflow-hidden bg-[#EAF1FF]">
      <div className="relative h-full w-full">
        <Image
          src="/images/mock-storage-map.svg"
          alt="Mock map preview of Spacedey storage sites"
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
              {showAllSites ? 'All mapped sites' : `Showing ${selectedLabel}`}
            </h3>
            <p className="mt-1 text-sm text-[#5E6C91]">
              {showAllSites
                ? 'Pick a state or city from the list to focus the search, or browse all visible storage sites.'
                : `${formatSiteCount(sites.length)} visible in this view.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapView({ selectedState, selectedCity, sites }: Readonly<MapViewProps>) {
  const apiKey = env.googleMaps.apiKey;
  const mapsEnabled = env.googleMaps.enabled;
  const [mapLoadFailed, setMapLoadFailed] = useState(false);
  const safeSites = useMemo(() => (Array.isArray(sites) ? sites : []), [sites]);
  const selectedLabel = selectedCity || selectedState;
  const hasSelection = Boolean(selectedLabel);

  const filteredSites = useMemo(() => {
    if (selectedCity) {
      return safeSites.filter((site) => {
        const matchesCity = cityMatchesSite(site, selectedCity);
        const matchesState = selectedState ? stateMatchesSite(site, selectedState) : true;
        return matchesCity && matchesState;
      });
    }

    if (selectedState) {
      return safeSites.filter((site) => stateMatchesSite(site, selectedState));
    }

    return safeSites;
  }, [safeSites, selectedCity, selectedState]);

  const showAllSites = hasSelection && filteredSites.length === 0;
  const activeSites = useMemo(() => {
    if (!hasSelection) {
      return safeSites;
    }

    return filteredSites.length > 0 ? filteredSites : safeSites;
  }, [filteredSites, hasSelection, safeSites]);

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

  const zoomLevel = hasSelection && !showAllSites ? (selectedCity ? 11 : 8) : 6;
  const showStaticFallback = !mapsEnabled || !apiKey || mapLoadFailed;

  if (showStaticFallback) {
    return (
      <div className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative">
        <SearchMapFallback
          sites={activeSites}
          selectedLabel={selectedLabel}
          showAllSites={showAllSites || !hasSelection}
        />
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 h-screen lg:max-h-[calc(100vh-82px)] bg-gray-200 relative">
      <div className="h-full w-full relative">
        {showAllSites && (
          <div className="absolute left-4 right-4 top-4 z-10 rounded-2xl border border-white/70 bg-white/92 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Search coverage
            </p>
            <p className="mt-1 text-sm text-[#102A72]">
              No exact map match for <span className="font-bold">{selectedLabel}</span> yet. Showing all mapped sites instead.
            </p>
          </div>
        )}
        <MapErrorBoundary
          fallback={
            <SearchMapFallback
              sites={activeSites}
              selectedLabel={selectedLabel}
              showAllSites={showAllSites || !hasSelection}
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
              mapId="spacedey-map-id"
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
