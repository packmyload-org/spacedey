'use client';

import { useEffect, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { env } from '@/config';
import { getValidCoordinates } from '@/lib/maps/shared';
import type { ApiSite } from '@/lib/types/local';

interface SitesGoogleMapProps {
  initialCenter: {
    lat: number;
    lng: number;
  };
  initialZoom: number;
  sites: ApiSite[];
}

const MAX_SITE_ZOOM = 18;
const FIT_BOUNDS_PADDING = 48;

// Google Maps-style red location pin
function SiteMarkerPin({ title }: Readonly<{ title: string }>) {
  return (
    <div
      aria-label={title}
      style={{ width: 32, height: 48, transform: 'translateY(-44px)', cursor: 'pointer' }}
    >
      <svg
        width="32"
        height="48"
        viewBox="0 0 32 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="pinHighlight" cx="38%" cy="32%" r="55%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#C0392B" />
          </radialGradient>
          <filter id="pinShadow" x="-20%" y="-10%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>
        {/* Pin body */}
        <g filter="url(#pinShadow)">
          <path
            d="M16 2C9.373 2 4 7.373 4 14C4 23.5 16 38 16 38C16 38 28 23.5 28 14C28 7.373 22.627 2 16 2Z"
            fill="url(#pinHighlight)"
          />
          {/* Inner highlight for depth */}
          <path
            d="M16 2C9.373 2 4 7.373 4 14C4 23.5 16 38 16 38C16 38 28 23.5 28 14C28 7.373 22.627 2 16 2Z"
            fill="none"
            stroke="#A93226"
            strokeWidth="1"
          />
          {/* White inner circle */}
          <circle cx="16" cy="14" r="5.5" fill="white" opacity="0.95" />
          {/* Red dot in center */}
          <circle cx="16" cy="14" r="2.5" fill="#C0392B" />
        </g>
        {/* Pin tail shadow */}
        <ellipse cx="16" cy="44" rx="5" ry="2" fill="#000" opacity="0.15" />
      </svg>
    </div>
  );
}

interface MapControllerProps {
  initialCenter: { lat: number; lng: number };
  initialZoom: number;
  validSites: { id: string; name: string; lat: number; lng: number }[];
}

/** Inner component that has access to the map instance via useMap() */
function MapController({ initialCenter, initialZoom, validSites }: Readonly<MapControllerProps>) {
  const map = useMap();
  const coreLib = useMapsLibrary('core');

  useEffect(() => {
    if (!map || !coreLib) return;

    if (validSites.length === 0) {
      map.panTo(initialCenter);
      map.setZoom(initialZoom);
      return;
    }

    if (validSites.length === 1) {
      map.panTo({ lat: validSites[0].lat, lng: validSites[0].lng });
      map.setZoom(MAX_SITE_ZOOM);
      return;
    }

    const bounds = new coreLib.LatLngBounds();
    validSites.forEach((site) => bounds.extend({ lat: site.lat, lng: site.lng }));
    map.fitBounds(bounds, FIT_BOUNDS_PADDING);
  }, [map, coreLib, initialCenter, initialZoom, validSites]);

  return null;
}

export default function SitesGoogleMap({
  initialCenter,
  initialZoom,
  sites,
}: Readonly<SitesGoogleMapProps>) {
  const validSites = useMemo(
    () =>
      sites
        .map((site) => {
          const coordinates = getValidCoordinates(site.coordinates.lat, site.coordinates.lng);
          if (!coordinates) return null;
          return { id: site.id, name: site.name, lat: coordinates.lat, lng: coordinates.lng };
        })
        .filter(
          (site): site is { id: string; name: string; lat: number; lng: number } => site !== null
        ),
    [sites]
  );

  return (
    <APIProvider apiKey={env.maps.googleMapsApiKey}>
      <Map
        mapId="spacedey-sites-map"
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: '100%', height: '100%' }}
        aria-label="Storage locations map"
      >
        <MapController
          initialCenter={initialCenter}
          initialZoom={initialZoom}
          validSites={validSites}
        />
        {validSites.map((site) => (
          <AdvancedMarker
            key={site.id}
            position={{ lat: site.lat, lng: site.lng }}
            title={site.name}
          >
            <SiteMarkerPin title={site.name} />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
