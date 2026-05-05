import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocationFacilityCard, LocationLinkCard, LocationStatCard } from '@/components/locations/LocationSeoSections';
import { getStateLandingPageBySlug } from '@/lib/services/locationLandingPages';
import { buildPageMetadata, serializeJsonLd, toAbsoluteUrl } from '@/lib/seo';
import { formatCountLabel, formatPriceFromAmount } from '@/lib/utils/locationSeo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const state = await getStateLandingPageBySlug(slug);

  if (!state) {
    return {
      title: 'Storage by state',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildPageMetadata({
    title: `Storage facilities in ${state.name}`,
    description: state.description,
    path: `/locations/state/${state.slug}`,
    image: state.image,
  });
}

export default async function StateLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = await getStateLandingPageBySlug(slug);

  if (!state) {
    notFound();
  }
  return (
    <main className="min-h-screen bg-[#F5F8FF] pb-20 pt-24">

      <section className="px-6 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_440px]">
          <div className="rounded-[36px] bg-white p-8 shadow-sm md:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">State guide</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#0F172A] md:text-5xl">
              Self storage in {state.name}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#475569] md:text-base">
              {state.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/locations"
                className="inline-flex items-center justify-center rounded-full bg-[#1642F0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1138D8]"
              >
                Back to all locations
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full border border-[#D8E2FF] px-5 py-3 text-sm font-bold text-[#1642F0] transition hover:bg-[#F0F4FF]"
              >
                Search inventory
              </Link>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[36px] border border-[#D8E2FF] bg-white shadow-sm">
            <Image
              src={state.image}
              alt={`Storage in ${state.name}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-8 px-6 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          <LocationStatCard
            label="Cities"
            value={String(state.cities.length)}
            detail={`Indexable city pages currently live in ${state.name}.`}
          />
          <LocationStatCard
            label="Facilities"
            value={String(state.totalSites)}
            detail="Storage sites operating across this state-level market."
          />
          <LocationStatCard
            label="Available units"
            value={String(state.totalAvailableUnits)}
            detail="Current available spaces grouped into one planning view."
          />
          <LocationStatCard
            label="Monthly pricing"
            value={formatPriceFromAmount(state.minMonthlyPrice)}
            detail={state.maxMonthlyPrice && state.maxMonthlyPrice !== state.minMonthlyPrice
              ? `Top-end options currently reach NGN ${Math.round(state.maxMonthlyPrice).toLocaleString()}/month.`
              : 'Pricing reflects the current spread of unit sizes in this state.'}
          />
        </div>
      </section>

      <section className="mt-12 px-6 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">City hubs</p>
              <h2 className="mt-3 text-3xl font-black text-[#0F172A]">Storage by city in {state.name}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#475569]">
              These city pages break down where demand and inventory sit within the state, which helps both search engines
              and customers move from broad research into a local facility page faster.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {state.cities.map((city) => (
              <LocationLinkCard
                key={city.slug}
                title={`Storage in ${city.name}`}
                detail={`${city.totalSites} facilities and ${city.totalAvailableUnits} available units in ${city.name}.`}
                href={`/locations/city/${city.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 px-6 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Facility pages</p>
            <h2 className="mt-3 text-3xl font-black text-[#0F172A]">Explore storage facilities in {state.name}</h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {state.sites.map((site) => (
              <LocationFacilityCard key={site.id} site={site} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 px-6 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-[32px] border border-[#D8E2FF] bg-white p-7 shadow-sm md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Demand signal</p>
            <h2 className="mt-3 text-3xl font-black text-[#0F172A]">What this state page contributes to SEO</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[#475569] md:text-base">
              <p>
                State-level pages capture broader search intent such as “self storage in {state.name}” or “storage facilities in {state.name}”
                and then pass visitors into more specific city or facility pages.
              </p>
              <p>
                That hub-and-spoke structure keeps the site easier to crawl, creates clearer canonical topical clusters, and reduces the chance
                that high-intent location searches land on a generic page with weak local detail.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#D8E2FF] bg-white p-7 shadow-sm md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Current mix</p>
            <h2 className="mt-3 text-2xl font-black text-[#0F172A]">Unit formats in {state.name}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {state.unitTypeLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[#D8E2FF] bg-[#F8FAFF] px-4 py-2 text-sm font-bold text-[#4F6CB5]"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-[#5D74B0]">
              {formatCountLabel(state.totalUnits, 'storage space')} across {formatCountLabel(state.totalSites, 'facility', 'facilities')}.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
