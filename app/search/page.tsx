"use client";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/search/SearchBar";
import CityList from "@/components/search/CityList";
import MapView from "@/components/search/MapView";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
// Footer and SearchPageContent were intentionally not used here

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Read city from URL query parameter on mount
  useEffect(() => {
    const cityParam = searchParams.get("city");
    if (cityParam) {
      const decodedCity = decodeURIComponent(cityParam);
      setSelectedCity(decodedCity);
      setSearchQuery(decodedCity);
    }
  }, [searchParams]);

  // Handle search from SearchBar - allow searching any city
  const handleSearch = (cityName: string) => {
    setSelectedCity(cityName);
    // Update URL without page reload
    const url = new URL(globalThis.location.href);
    url.searchParams.set('city', cityName);
    globalThis.history.pushState({}, '', url);
  };

  return (
    <>
      <Header />
      {/* <SearchPageContent /> */}
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
                  onSelectCity={setSelectedCity}
                />
              </div>
            </div>

            {/* Right Map View */}
            <MapView selectedCity={selectedCity} />
          </div>
        </div>
      </main>
      {/* <Footer /> */}
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
            <p className="text-gray-600">Loading search...</p>
          </div>
        </main>
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}
