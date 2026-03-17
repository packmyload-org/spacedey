import Link from 'next/link';
import { ArrowRight, MapPin, Warehouse } from 'lucide-react';
import type { LocationSiteSummary } from '@/lib/services/locationLandingPages';
import { formatCountLabel, formatPriceFromAmount } from '@/lib/utils/locationSeo';

export function LocationStatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#D8E2FF] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#5D74B0]">{label}</p>
      <p className="mt-3 text-3xl font-black text-[#102A72]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#5D74B0]">{detail}</p>
    </div>
  );
}

export function LocationFacilityCard({
  site,
}: {
  site: LocationSiteSummary;
}) {
  return (
    <article className="rounded-[28px] border border-[#D8E2FF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#BCD0FF]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#5D74B0]">
            {site.city}, {site.state}
          </p>
          <h3 className="mt-2 text-2xl font-black text-[#0F172A]">{site.name}</h3>
        </div>
        <span className="rounded-full bg-[#EEF3FF] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#1642F0]">
          {formatPriceFromAmount(site.minMonthlyPrice)}
        </span>
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#475569]">
        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1642F0]" />
        <span>{site.address}</span>
      </p>

      <p className="mt-4 text-sm leading-7 text-[#475569]">{site.about}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {site.unitTypeLabels.slice(0, 4).map((label) => (
          <span
            key={label}
            className="rounded-full border border-[#D8E2FF] bg-[#F8FAFF] px-3 py-2 text-xs font-bold text-[#4F6CB5]"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#F8FAFF] px-4 py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#5D74B0]">Availability</p>
          <p className="mt-2 text-base font-black text-[#102A72]">{formatCountLabel(site.availableUnits, 'unit')}</p>
        </div>
        <div className="rounded-2xl bg-[#F8FAFF] px-4 py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#5D74B0]">Unit types</p>
          <p className="mt-2 text-base font-black text-[#102A72]">{site.totalUnitTypes}</p>
        </div>
        <div className="rounded-2xl bg-[#F8FAFF] px-4 py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#5D74B0]">Inventory</p>
          <p className="mt-2 text-base font-black text-[#102A72]">{formatCountLabel(site.totalUnits, 'space')}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/locations/${site.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#1642F0] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1138D8]"
        >
          View facility
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/checkout?siteId=${site.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#D8E2FF] px-5 py-3 text-sm font-bold text-[#1642F0] transition hover:bg-[#F0F4FF]"
        >
          Reserve a unit
        </Link>
      </div>
    </article>
  );
}

export function LocationLinkCard({
  title,
  detail,
  href,
}: {
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[24px] border border-[#D8E2FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#BCD0FF]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#1642F0]">
            <Warehouse className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#0F172A]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#5D74B0]">{detail}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-[#1642F0] transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
