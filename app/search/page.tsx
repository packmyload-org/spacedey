"use client";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/search/SearchBar";
import CityList from "@/components/search/CityList";
import MapView from "@/components/search/MapView";

import { useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchStore } from "@/lib/store/useSearchStore";

function SearchContent() {
  const searchParams = useSearchParams();
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCity, 
    setSelectedCity, 
    sites, 
    fetchSites 
  } = useSearchStore();

  // Fetch sites on mount using the internal API
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // Read city from URL query parameter on mount
  useEffect(() => {
    const cityParam = searchParams.get("city");
    if (cityParam) {
      const decodedCity = decodeURIComponent(cityParam);
      setSelectedCity(decodedCity);
      setSearchQuery(decodedCity);
      return;
    }

    setSelectedCity("");
    setSearchQuery("");
  }, [searchParams, setSelectedCity, setSearchQuery]);

  const syncSelectedCity = useCallback((cityName: string) => {
    const normalizedCity = cityName.trim();
    setSelectedCity(normalizedCity);
    setSearchQuery(normalizedCity);

    const url = new URL(globalThis.location.href);

    if (normalizedCity) {
      url.searchParams.set('city', normalizedCity);
    } else {
      url.searchParams.delete('city');
    }

    globalThis.history.replaceState({}, '', url);
  }, [setSearchQuery, setSelectedCity]);

  // Handle search from SearchBar
  const handleSearch = (cityName: string) => {
    syncSelectedCity(cityName);
  };

  return (
    <>
      <Header />
      <main className="flex-1 lg:flex lg:flex-col mt-20">
        <div className="lg:flex lg:flex-col lg:flex-1 lg:bg-brand-page-bg">
          <div className="lg:flex lg:flex-1">
            {/* Left Sidebar */}
            <div className="lg:w-1/2 max-h-[calc(100vh-82px)] overflow-y-scroll">
              <div className="">
                <SearchBar 
                  value={searchQuery} 
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                />
                <CityList
                  searchQuery={searchQuery}
                  selectedCity={selectedCity}
                  onSelectCity={syncSelectedCity}
                  sites={sites}
                />
              </div>
            </div>

            {/* Right Map View */}
            <MapView 
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
            <p className="text-gray-600">Loading storage locations...</p>
          </div>
        </main>
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}
