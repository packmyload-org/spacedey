'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { env } from '@/config';
import { siteMarkerIcon } from '@/lib/maps/leaflet';
import { defaultMapCenter, getValidCoordinates } from '@/lib/maps/shared';
import type { ApiSite } from '@/lib/types/local';
import type { MapContainerProps } from 'react-leaflet';

interface StorageLocationsLeafletMapProps {
  mapSites: ApiSite[];
}

const MAX_SITE_ZOOM = 18;

function MapViewport({ sites }: Readonly<{ sites: ApiSite[] }>) {
  const map = useMap();

  useEffect(() => {
    const validSites = sites
      .map((site) => getValidCoordinates(site.coordinates.lat, site.coordinates.lng))
      .filter((site): site is { lat: number; lng: number } => site !== null);

    if (validSites.length === 0) {
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
        padding: [48, 48],
      }
    );
  }, [map, sites]);

  return null;
}

export default function StorageLocationsLeafletMap({
  mapSites,
}: Readonly<StorageLocationsLeafletMapProps>) {
  const initialCenter: [number, number] = [defaultMapCenter.lat, defaultMapCenter.lng];
  const mapContainerProps = {
    center: initialCenter,
    zoom: 6,
    maxZoom: 19,
    scrollWheelZoom: true,
    className: 'h-full w-full',
  } as unknown as MapContainerProps;

  return (
    <MapContainer {...mapContainerProps}>
      <TileLayer attribution={env.maps.attribution} url={env.maps.tileUrl} maxZoom={19} />

      {mapSites.map((site) => {
        const coordinates = getValidCoordinates(site.coordinates.lat, site.coordinates.lng);

        if (!coordinates) {
          return null;
        }

        return (
          <Marker
            key={site.id}
            position={[coordinates.lat, coordinates.lng]}
            title={site.name}
            icon={siteMarkerIcon}
          />
        );
      })}

      <MapViewport sites={mapSites} />
    </MapContainer>
  );
}
