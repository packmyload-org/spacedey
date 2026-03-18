import Link from 'next/link';
import { listCityLandingPages, listStateLandingPages } from '@/lib/services/locationLandingPages';
import { LocationLinkCard } from '@/components/locations/LocationSeoSections';

export default async function LocationDiscoveryLinks() {
  const [cityPages, statePages] = await Promise.all([
    listCityLandingPages(),
    listStateLandingPages(),
  ]);
  const featuredCities = cityPages.slice(0, 6);
  const featuredStates = statePages.slice(0, 4);

  if (featuredCities.length === 0 && featuredStates.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F5F8FF] px-6 py-14 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Location Guides</p>
          <h2 className="mt-3 text-3xl font-black text-[#0F172A] md:text-4xl">
            Browse storage by city and state
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#475569] md:text-base">
            These landing pages organize Spacedey inventory by local demand so customers can compare facilities,
            available units, and coverage before opening a specific storage site.
          </p>
        </div>

        {featuredCities.length > 0 ? (
          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-xl font-black text-[#102A72]">Popular city pages</h3>
              <Link href="/search" className="text-sm font-bold text-[#1642F0]">
                Search all locations
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredCities.map((city) => (
                <LocationLinkCard
                  key={city.slug}
                  title={`Storage in ${city.name}`}
                  detail={`${city.totalSites} facilities, ${city.totalAvailableUnits} available units, and live unit-size coverage in ${city.state}.`}
                  href={`/locations/city/${city.slug}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {featuredStates.length > 0 ? (
          <div className="mt-12">
            <div className="mb-5">
              <h3 className="text-xl font-black text-[#102A72]">State coverage pages</h3>
              <p className="mt-2 text-sm leading-6 text-[#5D74B0]">
                See how Spacedey inventory is distributed across each state and jump into the cities that matter most.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {featuredStates.map((state) => (
                <LocationLinkCard
                  key={state.slug}
                  title={`${state.name} storage guide`}
                  detail={`${state.cities.length} cities, ${state.totalSites} facilities, and ${state.totalAvailableUnits} available units in one view.`}
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
