'use client';

import SitesGoogleMap from '@/components/maps/SitesGoogleMap';
import { defaultMapCenter } from '@/lib/maps/shared';
import type { ApiSite } from '@/lib/types/local';

interface StorageLocationsLeafletMapProps {
  mapSites: ApiSite[];
}

export default function StorageLocationsLeafletMap({
  mapSites,
}: Readonly<StorageLocationsLeafletMapProps>) {
  return (
    <SitesGoogleMap
      initialCenter={defaultMapCenter}
      initialZoom={6}
      sites={mapSites}
    />
  );
}
