'use client';

import SitesGoogleMap from '@/components/maps/SitesGoogleMap';
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
    <SitesGoogleMap
      initialCenter={center}
      initialZoom={zoom}
      sites={sites}
    />
  );
}
