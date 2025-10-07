import React from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import LocationsPageContent from "@/app/components/pages/locations/PageContent";

export default function LocationsPage() {
  return (
    <>
      <Header />
      <LocationsPageContent />
      <Footer />
    </>
  );
}


