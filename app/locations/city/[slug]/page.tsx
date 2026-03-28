import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LocationFacilityCard, LocationLinkCard, LocationStatCard } from '@/components/locations/LocationSeoSections';
import { getCityLandingPageBySlug, listCityLandingPages, listStateLandingPages } from '@/lib/services/locationLandingPages';
import { buildPageMetadata, serializeJsonLd, toAbsoluteUrl } from '@/lib/seo';
import { formatCountLabel, formatPriceFromAmount } from '@/lib/utils/locationSeo';

export const dynamicParams = false;

export async function generateStaticParams() {
  const cities = await listCityLandingPages();

  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityLandingPageBySlug(slug);

  if (!city) {
    return {
      title: 'Storage in Nigeria',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildPageMetadata({
    title: `Self Storage in ${city.name}, ${city.state}`,
    description: city.description,
    path: `/locations/city/${city.slug}`,
    image: city.image,
    keywords: [
      `self storage in ${city.name.toLowerCase()}`,
      `storage units in ${city.name.toLowerCase()}`,
      `${city.name.toLowerCase()} storage facilities`,
      `self storage ${city.state.toLowerCase()}`,
      `${city.name.toLowerCase()} business storage`,
    ],
  });
}

export default async function CityLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = await getCityLandingPageBySlug(slug);
  const statePages = await listStateLandingPages();

  if (!city) {
    notFound();
  }

  const siblingCities = (await listCityLandingPages())
    .filter((entry) => entry.state === city.state && entry.slug !== city.slug)
    .slice(0, 4);
  const statePage = statePages.find((entry) => entry.slug === city.stateSlug) ?? null;
  const pageUrl = toAbsoluteUrl(`/locations/city/${city.slug}`);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Locations',
        item: toAbsoluteUrl('/locations'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: city.state,
        item: toAbsoluteUrl(`/locations/state/${city.stateSlug}`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: city.name,
        item: pageUrl,
      },
    ],
  };
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Self storage in ${city.name}, ${city.state}`,
    description: city.description,
    url: pageUrl,
    hasPart: city.sites.map((site, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: toAbsoluteUrl(`/locations/${site.id}`),
      name: site.name,
    })),
  };

  return (
    <main className="min-h-screen bg-[#F5F8FF] pb-20 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListJsonLd) }}
      />

      <section className="px-6 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_440px] lg:items-stretch">
          <div className="rounded-[36px] bg-[#1238D8] p-8 text-white shadow-[0_28px_90px_rgba(17,56,216,0.22)] md:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">City guide</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Self storage in {city.name}, {city.state}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#DDE6FF] md:text-base">
              {city.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white px-5 py-3 text-sm font-black !text-[#1642F0] shadow-[0_10px_30px_rgba(9,24,86,0.16)] transition hover:bg-[#EAF0FF] hover:!text-[#1238D8]"
              >
                Search all facilities
              </Link>
              {statePage ? (
                <Link
                  href={`/locations/state/${city.stateSlug}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Explore {city.state}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[36px] border border-[#D8E2FF] bg-white shadow-sm">
            <Image
              src={city.image}
              alt={`Storage in ${city.name}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-8 px-6 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          <LocationStatCard
            label="Facilities"
            value={String(city.totalSites)}
            detail={`Active storage locations serving ${city.name}.`}
          />
          <LocationStatCard
            label="Available units"
            value={String(city.totalAvailableUnits)}
            detail="Live unit availability based on the current inventory."
          />
          <LocationStatCard
            label="Price range"
            value={formatPriceFromAmount(city.minMonthlyPrice)}
            detail={city.maxMonthlyPrice && city.maxMonthlyPrice !== city.minMonthlyPrice
              ? `Higher-priced options currently reach NGN ${Math.round(city.maxMonthlyPrice).toLocaleString()}/month.`
              : 'Pricing is grounded in the current mix of available unit sizes.'}
          />
          <LocationStatCard
            label="Unit-size mix"
            value={formatCountLabel(city.unitTypeLabels.length, 'format')}
            detail="A practical spread of unit sizes for moving, personal, and business storage."
          />
        </div>
      </section>

      <section className="mt-12 px-6 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Facilities in {city.name}</p>
              <h2 className="mt-3 text-3xl font-black text-[#0F172A]">Compare live storage options</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#475569]">
              Review nearby facilities, compare available unit sizes, and choose the location that fits your move,
              business stock, or extra household storage.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {city.sites.map((site) => (
              <LocationFacilityCard key={site.id} site={site} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 px-6 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-[32px] border border-[#D8E2FF] bg-white p-7 shadow-sm md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Storage guide</p>
            <h2 className="mt-3 text-3xl font-black text-[#0F172A]">What to know before you book storage in {city.name}</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[#475569] md:text-base">
              <p>
                Start by checking how much access you need, how long you plan to store, and the kind of items you are moving in.
                That usually makes it easier to narrow down the right facility and unit format.
              </p>
              <p>
                For most customers in {city.name}, the best choice comes down to location convenience, visible monthly
                pricing, available space, and whether the site is a better fit for personal items, moving support, or
                business inventory.
              </p>
              <p>
                If you are comparing which storage is safest or which option is the best value, start with facilities
                that clearly show current availability, practical size options, and pricing from {formatPriceFromAmount(city.minMonthlyPrice)}.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#D8E2FF] bg-white p-7 shadow-sm md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Popular sizes</p>
            <h2 className="mt-3 text-2xl font-black text-[#0F172A]">Common unit formats in {city.name}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {city.unitTypeLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[#D8E2FF] bg-[#F8FAFF] px-4 py-2 text-sm font-bold text-[#4F6CB5]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(siblingCities.length > 0 || statePage) ? (
        <section className="mt-12 px-6 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#5D74B0]">Keep exploring</p>
              <h2 className="mt-3 text-3xl font-black text-[#0F172A]">More coverage around {city.state}</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {statePage ? (
                <LocationLinkCard
                  title={`${city.state} storage overview`}
                  detail={`${statePage.cities.length} city pages and ${statePage.totalSites} facilities in one indexable hub.`}
                  href={`/locations/state/${statePage.slug}`}
                />
              ) : null}

              {siblingCities.map((entry) => (
                <LocationLinkCard
                  key={entry.slug}
                  title={`Storage in ${entry.name}`}
                  detail={`${entry.totalSites} facilities and ${entry.totalAvailableUnits} available units nearby.`}
                  href={`/locations/city/${entry.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
