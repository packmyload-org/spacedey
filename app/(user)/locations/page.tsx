import Hero from "@/components/locations/Hero";
import LocationDiscoveryLinks from '@/components/locations/LocationDiscoveryLinks';
import LocationsSection from "@/components/locations/LocationsSection";
import StorageLocationsMap from "@/components/locations/StorageLocationsMap";
import { getLocationLandingPages } from '@/lib/services/locationLandingPages';


export const revalidate = 3600;

export default async function LocationsPage() {
  const { cityPages, statePages } = await getLocationLandingPages();

  return (
    <main className="flex flex-col min-h-screen pt-20">
      <Hero />
      <LocationsSection cityPages={cityPages} statePages={statePages} />
      <LocationDiscoveryLinks cityPages={cityPages} statePages={statePages} />
      <StorageLocationsMap />
    </main>
  );
}
