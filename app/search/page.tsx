"use client";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/pages/search/SearchBar";
import CityList from "@/components/pages/search/CityList";
import MapView from "@/components/pages/search/MapView";

import { useState } from "react";
// Footer and SearchPageContent were intentionally not used here

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <>
      <Header />
      {/* <SearchPageContent /> */}
      <main className="flex-1 lg:flex lg:flex-col mt-20">
        <div className="lg:flex lg:flex-col lg:flex-1 lg:bg-brand-page-bg">
          <div className="lg:flex lg:flex-1">
            {/* Left Sidebar */}
            <div className="lg:w-1/2 max-h-[calc(100vh-82px)] overflow-y-scroll">
              <div className="mt20">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
