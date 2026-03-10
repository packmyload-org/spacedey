"use client";

import Header from "@/components/layout/Header";
import SearchBar from "@/components/search/SearchBar";
import CityList from "@/components/search/CityList";
import MapView from "@/components/search/MapView";
import { useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchStore } from "@/lib/store/useSearchStore";
import { getSiteCity, getSiteState, resolveStateFromQuery } from "@/lib/utils/siteLocations";

function SearchContent() {
  const searchParams = useSearchParams();
  const {
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    sites,
    fetchSites,
  } = useSearchStore();

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    const stateParam = searchParams.get("state");
    const cityParam = searchParams.get("city");

    if (stateParam) {
      const decodedState = decodeURIComponent(stateParam);
      const decodedCity = cityParam ? decodeURIComponent(cityParam) : "";

      setSelectedState(decodedState);
      setSelectedCity(decodedCity);
      setSearchQuery(decodedCity || decodedState);
      return;
    }

    if (cityParam) {
      const decodedCity = decodeURIComponent(cityParam);
      setSelectedState("");
      setSelectedCity(decodedCity);
      setSearchQuery(decodedCity);
      return;
    }

    setSelectedState("");
    setSelectedCity("");
    setSearchQuery("");
  }, [searchParams, setSearchQuery, setSelectedCity, setSelectedState]);

  useEffect(() => {
    if (!selectedCity || selectedState || sites.length === 0) {
      return;
    }

    const matchedSite = sites.find((site) => {
      return getSiteCity(site).toLowerCase() === selectedCity.trim().toLowerCase();
    });

    if (!matchedSite) {
      return;
    }

    setSelectedState(getSiteState(matchedSite));
  }, [selectedCity, selectedState, setSelectedState, sites]);

  const syncSelectedState = useCallback((stateName: string) => {
    const normalizedState = stateName.trim();

    setSelectedState(normalizedState);
    setSelectedCity("");
    setSearchQuery(normalizedState);

    const url = new URL(globalThis.location.href);

    if (normalizedState) {
      url.searchParams.set("state", normalizedState);
    } else {
      url.searchParams.delete("state");
    }

    url.searchParams.delete("city");
    globalThis.history.replaceState({}, "", url);
  }, [setSearchQuery, setSelectedCity, setSelectedState]);

  const syncSelectedCity = useCallback((stateName: string, cityName: string) => {
    const normalizedState = stateName.trim();
    const normalizedCity = cityName.trim();

    setSelectedState(normalizedState);
    setSelectedCity(normalizedCity);
    setSearchQuery(normalizedCity);

    const url = new URL(globalThis.location.href);

    if (normalizedState) {
      url.searchParams.set("state", normalizedState);
    } else {
      url.searchParams.delete("state");
    }

    if (normalizedCity) {
      url.searchParams.set("city", normalizedCity);
    } else {
      url.searchParams.delete("city");
    }

    globalThis.history.replaceState({}, "", url);
  }, [setSearchQuery, setSelectedCity, setSelectedState]);

  const handleSearch = useCallback((value: string) => {
    const resolvedState = resolveStateFromQuery(value, sites);

    if (resolvedState) {
      syncSelectedState(resolvedState);
      return;
    }

    setSearchQuery(value.trim());
    setSelectedState("");
    setSelectedCity("");

    const url = new URL(globalThis.location.href);
    url.searchParams.delete("state");
    url.searchParams.delete("city");
    globalThis.history.replaceState({}, "", url);
  }, [setSearchQuery, setSelectedCity, setSelectedState, sites, syncSelectedState]);

  const clearSelection = useCallback(() => {
    setSelectedState("");
    setSelectedCity("");
    setSearchQuery("");

    const url = new URL(globalThis.location.href);
    url.searchParams.delete("state");
    url.searchParams.delete("city");
    globalThis.history.replaceState({}, "", url);
  }, [setSearchQuery, setSelectedCity, setSelectedState]);

  return (
    <>
      <Header />
      <main className="flex-1 lg:flex lg:flex-col mt-20">
        <div className="lg:flex lg:flex-col lg:flex-1 lg:bg-brand-page-bg">
          <div className="lg:flex lg:flex-1">
            <div className="lg:w-1/2 max-h-[calc(100vh-82px)] overflow-y-scroll">
              <div>
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                />
                <CityList
                  searchQuery={searchQuery}
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  onSelectState={syncSelectedState}
                  onSelectCity={syncSelectedCity}
                  onClearSelection={clearSelection}
                  sites={sites}
                />
              </div>
            </div>

            <MapView
              selectedState={selectedState}
              selectedCity={selectedCity}
              sites={sites}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="flex-1 lg:flex lg:flex-col mt-20">
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <p className="text-gray-600">Loading storage sites...</p>
          </div>
        </main>
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}
