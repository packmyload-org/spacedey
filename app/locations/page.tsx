import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/pages/locations/Hero";
import LocationsSection from "@/components/pages/locations/LocationsSection";
import StorageLocationsMap from "@/components/pages/locations/StorageLocationsMap";
import StorageLocationsByCity from "@/components/pages/locations/StorageLocationsByCity";
import NotAverageStorage from "@/components/ui/NotAverageStorage";
import FinalCtaBlock from "@/components/ui/FinalCtaBlock";

export default function LocationsPage() {
  return (
    <>
      <Header />
      <Hero/>
      <LocationsSection />
      <StorageLocationsMap />
      <StorageLocationsByCity />
      <NotAverageStorage />
      <FinalCtaBlock />
      <Footer />
    </>
  );
}


