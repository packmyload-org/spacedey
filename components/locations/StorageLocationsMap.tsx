'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  APILoadingStatus,
  APIProvider,
  Map,
  Marker,
  useApiLoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import { env } from '@/config';
import { useSitesData } from '@/contexts/SitesContext';
import type { ApiSite } from '@/lib/types/local';
import { getUniqueSiteCities } from '@/lib/utils/siteLocations';
import { MapPin, Phone, Mail, Box } from 'lucide-react';

interface StorageMapSectionProps {
  mapHeight?: string;
}

const defaultCities = [
  'Lagos',
  'Abuja',
  'Kano',
  'Ibadan',
  'Port Harcourt',
  'Benin City',
  'Jos',
  'Enugu',
  'Kaduna',
  'Abeokuta',
];

const knownCities = [
  'Port Harcourt',
  'Benin City',
  'Abeokuta',
  'Kaduna',
  'Abuja',
  'Ibadan',
  'Enugu',
  'Lagos',
  'Kano',
  'Jos',
];

const mockMapHotspots: Record<string, { top: string; left: string; label: string }> = {
  Abuja: { top: '42%', left: '42%', label: 'Abuja' },
  Kaduna: { top: '31%', left: '57%', label: 'Kaduna' },
  Jos: { top: '52%', left: '67%', label: 'Jos' },
  Lagos: { top: '62%', left: '47%', label: 'Lagos' },
  Ibadan: { top: '74%', left: '36%', label: 'Ibadan' },
  Enugu: { top: '73%', left: '62%', label: 'Enugu' },
  Kano: { top: '22%', left: '58%', label: 'Kano' },
  'Port Harcourt': { top: '79%', left: '54%', label: 'PH' },
  'Benin City': { top: '68%', left: '44%', label: 'Benin' },
  Abeokuta: { top: '66%', left: '41%', label: 'Abeokuta' },
};

function extractCity(address: string) {
  const normalizedAddress = address.toLowerCase();
  const exactCity = knownCities.find((city) => normalizedAddress.includes(city.toLowerCase()));

  if (exactCity) {
    return exactCity;
  }

  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }

  return parts[0] || '';
}

function cityMatchesSite(site: ApiSite, city: string) {
  return extractCity(site.address).toLowerCase() === city.toLowerCase();
}

function MapViewport({ sites }: Readonly<{ sites: ApiSite[] }>) {
  const map = useMap();

  useEffect(() => {
    if (!map || sites.length === 0) {
      return;
    }

    const validSites = sites.filter(
      (site) => Number.isFinite(site.coordinates.lat) && Number.isFinite(site.coordinates.lng)
    );

    if (validSites.length === 0) {
      return;
    }

    if (validSites.length === 1) {
      map.setCenter({
        lat: validSites[0].coordinates.lat,
        lng: validSites[0].coordinates.lng,
      });
      map.setZoom(12);
      return;
    }

    const bounds = validSites.reduce(
      (currentBounds, site) => ({
        north: Math.max(currentBounds.north, site.coordinates.lat),
        south: Math.min(currentBounds.south, site.coordinates.lat),
        east: Math.max(currentBounds.east, site.coordinates.lng),
        west: Math.min(currentBounds.west, site.coordinates.lng),
      }),
      {
        north: validSites[0].coordinates.lat,
        south: validSites[0].coordinates.lat,
        east: validSites[0].coordinates.lng,
        west: validSites[0].coordinates.lng,
      }
    );

    map.fitBounds(bounds, 80);
  }, [map, sites]);

  return null;
}

function LiveMapContent({
  mapHeight,
  mapSites,
  onMapLoadFailed,
}: Readonly<{
  mapHeight: string;
  mapSites: ApiSite[];
  onMapLoadFailed: () => void;
}>) {
  const loadingStatus = useApiLoadingStatus();

  useEffect(() => {
    if (loadingStatus === APILoadingStatus.AUTH_FAILURE || loadingStatus === APILoadingStatus.FAILED) {
      onMapLoadFailed();
    }
  }, [loadingStatus, onMapLoadFailed]);

  if (loadingStatus !== APILoadingStatus.LOADED) {
    return (
      <div
        className="overflow-hidden rounded-[32px] border border-[#D6E2FF] bg-white shadow-[0_24px_70px_rgba(17,42,114,0.12)]"
        style={{ height: mapHeight }}
      />
    );
  }

  return (
    <div
      className="overflow-hidden rounded-[32px] border border-[#D6E2FF] bg-white shadow-[0_24px_70px_rgba(17,42,114,0.12)]"
      style={{ height: mapHeight }}
    >
      <Map
        defaultCenter={{ lat: 6.5244, lng: 3.3792 }}
        defaultZoom={6}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="h-full w-full"
        mapId="storage-locations-map"
      >
        {mapSites.map((site) => (
          <Marker
            key={site.id}
            position={{
              lat: site.coordinates.lat,
              lng: site.coordinates.lng,
            }}
            title={site.name}
          />
        ))}
        <MapViewport sites={mapSites} />
      </Map>
    </div>
  );
}

function MockMap({
  selectedCity,
  selectedCityHref,
  mapHeight,
  onSelectCity,
  showUnavailableMessage,
}: Readonly<{
  selectedCity: string;
  selectedCityHref: string;
  mapHeight: string;
  onSelectCity: (city: string) => void;
  showUnavailableMessage: boolean;
}>) {
  const highlightedHotspot = selectedCity ? mockMapHotspots[selectedCity] : null;

  return (
    <div
      className="relative overflow-hidden rounded-[32px] border border-[#D6E2FF] bg-[#EAF1FF] shadow-[0_24px_70px_rgba(17,42,114,0.12)]"
      style={{ height: mapHeight }}
    >
      <Image
        src="/images/mock-storage-map.svg"
        alt="Illustrated mock map showing Spacedey storage coverage across major Nigerian cities."
        fill
        priority
        className="object-cover"
      />

      {Object.entries(mockMapHotspots).map(([city, hotspot]) => {
        const isActive = selectedCity === city;

        return (
          <button
            key={city}
            type="button"
            onClick={() => onSelectCity(city)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ top: hotspot.top, left: hotspot.left }}
            aria-label={`Focus ${city}`}
          >
            <span
              className={`flex min-w-[88px] items-center justify-center rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.16em] shadow-lg backdrop-blur transition-all ${
                isActive
                  ? 'scale-105 border-[#D96541] bg-[#D96541] text-white'
                  : 'border-white/70 bg-white/92 text-[#16306D] hover:border-[#1642F0] hover:text-[#1642F0]'
              }`}
            >
              {hotspot.label}
            </span>
          </button>
        );
      })}

      {highlightedHotspot && (
        <div
          className="pointer-events-none absolute z-[5] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#D96541]/40 bg-[#D96541]/15 animate-pulse"
          style={{ top: highlightedHotspot.top, left: highlightedHotspot.left }}
        />
      )}

      <div className="absolute inset-x-4 top-4 flex justify-between gap-4 md:inset-x-6 md:top-6">
        <div className="max-w-[260px] rounded-[24px] border border-white/65 bg-white/88 px-4 py-3 backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
            {selectedCity ? 'Coverage preview' : 'Select a location'}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#16306D]">
            {selectedCity
              ? showUnavailableMessage
                ? 'Live map is unavailable, so this section falls back to a static coverage preview.'
                : `Preview the ${selectedCity} area here, then continue to the matching site listings below.`
              : 'Choose a city from the selector or tap a city on the map preview to continue.'}
          </p>
        </div>

        <div className="hidden rounded-[24px] border border-white/65 bg-white/88 px-4 py-3 text-right backdrop-blur md:block">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
            Focus city
          </p>
          <p className="mt-2 text-lg font-black text-[#102A72]">
            {selectedCity || 'Select a location'}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
        <div className="rounded-[26px] border border-white/65 bg-white/90 p-4 backdrop-blur md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
                Next step
              </p>
              <p className="mt-2 text-base font-bold text-[#102A72]">
                {selectedCity
                  ? `Continue with ${selectedCity} to see live listings.`
                  : 'Pick a city from the selector to continue.'}
              </p>
            </div>
            <Link
              href={selectedCityHref}
              className="inline-flex items-center justify-center rounded-full border border-[#1642F0] bg-white px-5 py-3 text-sm font-bold text-[#1642F0] transition-colors hover:bg-[#1642F0] hover:text-white"
            >
              {selectedCity ? 'Open selected city' : 'Open all locations'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StorageMapSection({
  mapHeight = '600px',
}: Readonly<StorageMapSectionProps>) {
  const { sites, isLoading } = useSitesData();
  const [selectedCity, setSelectedCity] = useState('');
  const [mapLoadFailed, setMapLoadFailed] = useState(false);
  const selectedSitesRef = React.useRef<HTMLDivElement | null>(null);
  const cities = useMemo(() => {
    const nextCities = getUniqueSiteCities(sites);
    return nextCities.length > 0 ? nextCities : defaultCities;
  }, [sites]);
  const loading = isLoading && sites.length === 0;

  const selectedCitySites = useMemo(() => {
    if (!selectedCity) {
      return [];
    }

    return sites.filter((site) => cityMatchesSite(site, selectedCity));
  }, [selectedCity, sites]);

  const mapSites = useMemo(() => {
    if (selectedCitySites.length > 0) {
      return selectedCitySites;
    }

    return sites.filter(
      (site) => Number.isFinite(site.coordinates.lat) && Number.isFinite(site.coordinates.lng)
    );
  }, [selectedCitySites, sites]);

  const featuredCities = useMemo(() => cities.slice(0, 8), [cities]);
  const selectedCityHref = selectedCity ? `/search?city=${encodeURIComponent(selectedCity)}` : '/search';
  const hasGoogleMaps = env.googleMaps.enabled;
  const shouldShowLiveMap = Boolean(selectedCity) && hasGoogleMaps && !mapLoadFailed;
  const showUnavailableMessage = Boolean(selectedCity) && !shouldShowLiveMap;

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    selectedSitesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [selectedCity]);

  return (
    <section className="px-6 py-14 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-center text-3xl font-bold capitalize text-blue-900 lg:text-4xl">
          Storage in your neighborhood
        </h2>

        <hr className="mx-auto mb-10 mt-6 h-[3px] w-[50px] border-0 bg-orange-500 lg:mb-[72px]" />

        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-stretch">
          <div className="rounded-[28px] border border-[#D6E2FF] bg-white p-6 shadow-[0_22px_60px_rgba(17,42,114,0.08)] lg:p-7">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
              Explore locations
            </p>
            <h3 className="mt-3 text-2xl font-black text-[#102A72]">
              Select a city first
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#5E6C91]">
              The live map appears only when Google Maps is configured. Selecting a city also reveals the storage sites available under it.
            </p>

            <div className="mt-6">
              <label htmlFor="location-city" className="mb-2 block text-sm font-semibold text-[#16306D]">
                Location or state
              </label>
              <select
                id="location-city"
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                className="w-full rounded-2xl border border-[#C9D7FF] bg-[#F8FAFF] px-4 py-3 text-sm font-medium text-[#16306D] outline-none transition-colors focus:border-[#1642F0] focus:bg-white"
              >
                <option value="">Select a location</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#D6E2FF] bg-[#F6F8FF] p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
                Current selection
              </p>
              <p className="mt-3 text-xl font-bold text-[#102A72]">
                {selectedCity || 'No city selected yet'}
              </p>
              <p className="mt-2 text-sm text-[#5E6C91]">
                {selectedCity
                  ? `${selectedCitySites.length} site${selectedCitySites.length === 1 ? '' : 's'} available in ${selectedCity}.`
                  : 'Choose a city from the list to filter the map and reveal the matching sites.'}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {featuredCities.map((city) => {
                const isActive = city === selectedCity;

                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border-[#1642F0] bg-[#1642F0] text-white'
                        : 'border-[#D6E2FF] bg-white text-[#16306D] hover:border-[#1642F0] hover:text-[#1642F0]'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>

            <Link
              href={selectedCityHref}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#1642F0] px-6 py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#1238D4]"
            >
              {selectedCity ? `View ${selectedCity} storage` : 'Browse all storage units'}
            </Link>

            <p className="mt-3 text-center text-xs text-[#6D7CA4]">
              {loading
                ? 'Updating location list...'
                : !selectedCity
                  ? 'Select a city to activate the map and reveal matching locations'
                  : shouldShowLiveMap
                  ? `${cities.length} cities currently listed`
                  : 'Showing mock coverage preview until Google Maps is configured with an API key.'}
            </p>
          </div>

          {shouldShowLiveMap ? (
            <APIProvider
              apiKey={env.googleMaps.apiKey!}
              onError={() => {
                setMapLoadFailed(true);
              }}
            >
              <LiveMapContent
                mapHeight={mapHeight}
                mapSites={mapSites}
                onMapLoadFailed={() => setMapLoadFailed(true)}
              />
            </APIProvider>
          ) : (
            <MockMap
              selectedCity={selectedCity}
              selectedCityHref={selectedCityHref}
              mapHeight={mapHeight}
              onSelectCity={setSelectedCity}
              showUnavailableMessage={showUnavailableMessage}
            />
          )}
        </div>

        {selectedCity && (
          <div
            ref={selectedSitesRef}
            className="mt-10 rounded-[32px] border border-[#D6E2FF] bg-white p-6 shadow-[0_22px_60px_rgba(17,42,114,0.08)] lg:p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5D74B0]">
                  Sites in {selectedCity}
                </p>
                <h3 className="mt-2 text-2xl font-black text-[#102A72]">
                  Available storage locations
                </h3>
              </div>
              <Link
                href={selectedCityHref}
                className="inline-flex items-center justify-center rounded-full border border-[#1642F0] px-5 py-3 text-sm font-bold text-[#1642F0] transition-colors hover:bg-[#1642F0] hover:text-white"
              >
                View all {selectedCity} listings
              </Link>
            </div>

            {selectedCitySites.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#D6E2FF] bg-[#F8FAFF] px-6 py-10 text-center">
                <p className="text-lg font-bold text-[#102A72]">
                  No sites are listed under {selectedCity} yet.
                </p>
                <p className="mt-2 text-sm text-[#5E6C91]">
                  Try another city or browse all storage units instead.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {selectedCitySites.map((site) => (
                  <article
                    key={site.id}
                    className="rounded-[28px] border border-[#D6E2FF] bg-[#F8FAFF] p-5 transition-colors hover:border-[#1642F0]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-black text-[#102A72]">{site.name}</h4>
                        <p className="mt-2 flex items-start gap-2 text-sm text-[#5E6C91]">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1642F0]" />
                          <span>{site.address}</span>
                        </p>
                      </div>
                      <span className="rounded-full bg-[#E3EBFF] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1642F0]">
                        {extractCity(site.address)}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-[#16306D] sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#1642F0]" />
                        <span>{site.contact.phone || 'Phone unavailable'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#1642F0]" />
                        <span>{site.contact.email || 'Email unavailable'}</span>
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 rounded-[22px] border border-[#D6E2FF] bg-white px-4 py-3">
                      <p className="flex items-center gap-2 text-sm font-semibold text-[#16306D]">
                        <Box className="h-4 w-4 text-[#1642F0]" />
                        <span>{site.unitTypes.length} unit type{site.unitTypes.length === 1 ? '' : 's'}</span>
                      </p>
                      <Link
                        href={`/search?city=${encodeURIComponent(selectedCity)}&site=${encodeURIComponent(site.code)}`}
                        className="text-sm font-bold text-[#1642F0]"
                      >
                        View site
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/search"
            className="rounded-full border border-blue-600 px-7 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            Search Storage Units Near Me
          </Link>
        </div>
      </div>
    </section>
  );
}
