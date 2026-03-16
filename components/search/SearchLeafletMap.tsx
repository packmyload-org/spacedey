'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { env } from '@/config';
import { siteMarkerIcon } from '@/lib/maps/leaflet';
import { getValidCoordinates } from '@/lib/maps/shared';
import type { ApiSite } from '@/lib/types/local';

interface SearchLeafletMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  sites: ApiSite[];
}

const MAX_SITE_ZOOM = 18;

function SearchMapViewport({
  center,
  zoom,
  sites,
}: Readonly<{
  center: { lat: number; lng: number };
  zoom: number;
  sites: ApiSite[];
}>) {
  const map = useMap();

  useEffect(() => {
    const validSites = sites
      .map((site) => getValidCoordinates(site.coordinates.lat, site.coordinates.lng))
      .filter((site): site is { lat: number; lng: number } => site !== null);

    if (validSites.length === 0) {
      map.setView([center.lat, center.lng], zoom, {
        animate: false,
      });
      return;
    }

    if (validSites.length === 1) {
      map.setView([validSites[0].lat, validSites[0].lng], MAX_SITE_ZOOM, {
        animate: false,
      });
      return;
    }

    map.fitBounds(
      validSites.map((site) => [site.lat, site.lng] as [number, number]),
      {
        animate: false,
        maxZoom: MAX_SITE_ZOOM,
        padding: [40, 40],
      }
    );
  }, [center.lat, center.lng, map, sites, zoom]);

  return null;
}

export default function SearchLeafletMap({
  center,
  zoom,
  sites,
}: Readonly<SearchLeafletMapProps>) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      maxZoom={19}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer attribution={env.maps.attribution} url={env.maps.tileUrl} maxZoom={19} />

      {sites.map((site, index) => {
        const coordinates = getValidCoordinates(site.coordinates.lat, site.coordinates.lng);

        if (!coordinates) {
          return null;
        }

        return (
          <Marker
            key={`${site.id}-${index}`}
            position={[coordinates.lat, coordinates.lng]}
            title={site.name}
            icon={siteMarkerIcon}
          />
        );
      })}

      <SearchMapViewport center={center} zoom={zoom} sites={sites} />
    </MapContainer>
  );
}
