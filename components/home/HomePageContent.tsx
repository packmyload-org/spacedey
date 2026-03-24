'use client';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import WhyStoreWithUs from "@/components/home/WhyStoreWithUs";
import FinalCtaBlock from "@/components/ui/FinalCtaBlock";
import NotAverageStorage from "@/components/ui/NotAverageStorage";
import CitiesStatesNav from "@/components/home/CitiesStatesNav";
import FeatureList from "@/components/home/FeatureList";
import HomeSeoSection from "@/components/home/HomeSeoSection";

export default function HomePageContent() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeatureList />
        <HomeSeoSection />
        <FinalCtaBlock />
        <WhyStoreWithUs />
        <NotAverageStorage />
        <CitiesStatesNav />
      </main>
      <Footer />
    </>
  );
}
