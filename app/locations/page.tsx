import React from "react";
import Hero from "@/components/locations/Hero";
import LocationsSection from "@/components/locations/LocationsSection";
import StorageLocationsMap from "@/components/locations/StorageLocationsMap";
import NotAverageStorage from "@/components/ui/NotAverageStorage";
import FinalCtaBlock from "@/components/ui/FinalCtaBlock";

export default function LocationsPage() {
  return (
    <main className="flex flex-col min-h-screen pt-20">
      <Hero />
      <LocationsSection />
      <StorageLocationsMap />
      <NotAverageStorage />
      <FinalCtaBlock />
    </main>
  );
}


