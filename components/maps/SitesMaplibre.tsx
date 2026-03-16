'use client';

import { useEffect, useMemo, useRef } from 'react';
import maplibregl, { type Map as MapLibreMap, type Marker, type StyleSpecification } from 'maplibre-gl';
import { env } from '@/config';
import { createSiteMarkerElement } from '@/lib/maps/markers';
import { getValidCoordinates } from '@/lib/maps/shared';
import type { ApiSite } from '@/lib/types/local';

interface SitesMaplibreProps {
  initialCenter: {
    lat: number;
    lng: number;
  };
  initialZoom: number;
  sites: ApiSite[];
}

const MAX_MAP_ZOOM = 19;
const MAX_SITE_ZOOM = 18;
const FIT_BOUNDS_PADDING = 48;

function createTileUrls(tileUrl: string) {
  if (!tileUrl.includes('{s}')) {
    return [tileUrl];
  }

  return ['a', 'b', 'c'].map((subdomain) => tileUrl.replaceAll('{s}', subdomain));
}

function createMapStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: createTileUrls(env.maps.tileUrl),
        tileSize: 256,
        attribution: env.maps.attribution,
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
      },
    ],
  };
}

export default function SitesMaplibre({
  initialCenter,
  initialZoom,
  sites,
}: Readonly<SitesMaplibreProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  const validSites = useMemo(
    () =>
      sites
        .map((site) => {
          const coordinates = getValidCoordinates(site.coordinates.lat, site.coordinates.lng);

          if (!coordinates) {
            return null;
          }

          return {
            id: site.id,
            name: site.name,
            lat: coordinates.lat,
            lng: coordinates.lng,
          };
        })
        .filter(
          (site): site is { id: string; name: string; lat: number; lng: number } => site !== null
        ),
    [sites]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: createMapStyle(),
      center: [initialCenter.lng, initialCenter.lat],
      zoom: initialZoom,
      maxZoom: MAX_MAP_ZOOM,
      attributionControl: false,
      dragRotate: false,
      touchPitch: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    mapRef.current = map;

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            map.resize();
          });

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver?.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [initialCenter.lat, initialCenter.lng, initialZoom]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const syncMap = () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = validSites.map((site) => {
        const marker = new maplibregl.Marker({
          element: createSiteMarkerElement(site.name),
          anchor: 'bottom',
        });

        marker.setLngLat([site.lng, site.lat]);
        marker.addTo(map);

        return marker;
      });

      if (validSites.length === 0) {
        map.jumpTo({
          center: [initialCenter.lng, initialCenter.lat],
          zoom: initialZoom,
        });
        return;
      }

      if (validSites.length === 1) {
        map.jumpTo({
          center: [validSites[0].lng, validSites[0].lat],
          zoom: MAX_SITE_ZOOM,
        });
        return;
      }

      const bounds = validSites.reduce(
        (currentBounds, site) => currentBounds.extend([site.lng, site.lat]),
        new maplibregl.LngLatBounds([validSites[0].lng, validSites[0].lat], [validSites[0].lng, validSites[0].lat])
      );

      map.fitBounds(bounds, {
        padding: FIT_BOUNDS_PADDING,
        maxZoom: MAX_SITE_ZOOM,
        duration: 0,
      });
    };

    if (map.isStyleLoaded()) {
      syncMap();
      return;
    }

    map.once('load', syncMap);

    return () => {
      map.off('load', syncMap);
    };
  }, [initialCenter.lat, initialCenter.lng, initialZoom, validSites]);

  return <div ref={containerRef} className="h-full w-full" aria-label="Storage locations map" />;
}
