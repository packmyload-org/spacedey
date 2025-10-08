'use client';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import QuoteSection from "@/components/sections/QuoteSection";
import InfoBlock from "@/components/sections/InfoBlock";
import WhyStoreWithUs from "@/components/sections/WhyStoreWithUs";
import FinalCtaBlock from "@/components/sections/FinalCtaBlock";
import NotAverageStorage from "@/components/sections/NotAverageStorage";
import CitiesStatesNav from "@/components/sections/CitiesStatesNav";
import FeatureList from "@/components/sections/FeatureList";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeatureList />
        <QuoteSection />
        <InfoBlock />
        <WhyStoreWithUs />
        <NotAverageStorage />
        <FinalCtaBlock />
        <CitiesStatesNav />
      </main>
      <Footer />
    </>
  );
}
