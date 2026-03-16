'use client';

import SitesMaplibre from '@/components/maps/SitesMaplibre';
import type { ApiSite } from '@/lib/types/local';

interface SearchLeafletMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  sites: ApiSite[];
}

export default function SearchLeafletMap({
  center,
  zoom,
  sites,
}: Readonly<SearchLeafletMapProps>) {
  return (
    <SitesMaplibre
      initialCenter={center}
      initialZoom={zoom}
      sites={sites}
    />
  );
}
