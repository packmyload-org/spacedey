'use client';

import SitesMaplibre from '@/components/maps/SitesMaplibre';
import { defaultMapCenter } from '@/lib/maps/shared';
import type { ApiSite } from '@/lib/types/local';

interface StorageLocationsLeafletMapProps {
  mapSites: ApiSite[];
}

export default function StorageLocationsLeafletMap({
  mapSites,
}: Readonly<StorageLocationsLeafletMapProps>) {
  return (
    <SitesMaplibre
      initialCenter={defaultMapCenter}
      initialZoom={6}
      sites={mapSites}
    />
  );
}
