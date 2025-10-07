'use client';
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import HeroSection from "@/app/components/sections/HeroSection";
import QuoteSection from "@/app/components/sections/QuoteSection";
import InfoBlock from "@/app/components/sections/InfoBlock";
import WhyStoreWithUs from "@/app/components/sections/WhyStoreWithUs";
import FinalCtaBlock from "@/app/components/sections/FinalCtaBlock";
import NotAverageStorage from "@/app/components/sections/NotAverageStorage";
import CitiesStatesNav from "@/app/components/sections/CitiesStatesNav";
import FeatureList from "@/app/components/sections/FeatureList";

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
