import Link from 'next/link';
import { LocationLinkCard, LocationStatCard } from '@/components/locations/LocationSeoSections';
import type { CityLandingData, StateLandingData } from '@/lib/services/locationLandingPages';

interface LocationsSectionProps {
  cityPages: CityLandingData[];
  statePages: StateLandingData[];
}

export default function LocationsSection({
  cityPages,
  statePages,
}: Readonly<LocationsSectionProps>) {
  const featuredCities = cityPages.slice(0, 6);
  const featuredStates = statePages.slice(0, 4);
  const totalFacilities = statePages.reduce((sum, state) => sum + state.totalSites, 0);
  const totalAvailableUnits = statePages.reduce((sum, state) => sum + state.totalAvailableUnits, 0);

  if (featuredCities.length === 0 && featuredStates.length === 0) {
    return null;
  }

  return (
    <section className="bg-white px-6 py-12 lg:px-20 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl text-center mx-auto">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">
            Location Discovery
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#102A72] md:text-4xl">
            Compare storage by city and state before you choose a facility
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5D74B0] md:text-base">
            These pages group Spacedey inventory by local demand so searchers can move from broad location research to
            city guides, state coverage pages, and specific facilities without relying on client-side filtering first.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <LocationStatCard
            label="City guides"
            value={String(cityPages.length)}
            detail="Indexable city landing pages with local facility and pricing context."
          />
          <LocationStatCard
            label="State pages"
            value={String(statePages.length)}
            detail="State-level coverage hubs that link into the city pages that matter most."
          />
          <LocationStatCard
            label="Facilities"
            value={String(totalFacilities)}
            detail="Published storage facilities currently discoverable through the location hub."
          />
          <LocationStatCard
            label="Available units"
            value={String(totalAvailableUnits)}
            detail="Live inventory totals surfaced across the strongest local landing pages."
          />
        </div>

        {featuredCities.length > 0 ? (
          <div className="mt-12">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">Featured cities</p>
                <h3 className="mt-2 text-2xl font-black text-[#102A72]">Popular city storage guides</h3>
              </div>
              <Link href="/search" className="text-sm font-bold text-[#1642F0]">
                Search all locations
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredCities.map((city) => (
                <LocationLinkCard
                  key={city.slug}
                  title={`Storage in ${city.name}`}
                  detail={`${city.totalSites} facilities, ${city.totalAvailableUnits} available units, and local coverage across ${city.state}.`}
                  href={`/locations/city/${city.slug}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {featuredStates.length > 0 ? (
          <div className="mt-12">
            <div className="mb-5">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5D74B0]">State coverage</p>
              <h3 className="mt-2 text-2xl font-black text-[#102A72]">State-level storage hubs</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {featuredStates.map((state) => (
                <LocationLinkCard
                  key={state.slug}
                  title={`${state.name} storage guide`}
                  detail={`${state.cities.length} city pages, ${state.totalSites} facilities, and ${state.totalAvailableUnits} available units in one view.`}
                  href={`/locations/state/${state.slug}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
