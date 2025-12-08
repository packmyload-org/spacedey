'use client';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
// QuoteSection and InfoBlock imports removed because they are commented out in the render tree
import WhyStoreWithUs from "@/components/sections/WhyStoreWithUs";
import FinalCtaBlock from "@/components/ui/FinalCtaBlock";
import NotAverageStorage from "@/components/ui/NotAverageStorage";
import CitiesStatesNav from "@/components/sections/CitiesStatesNav";
import FeatureList from "@/components/sections/FeatureList";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeatureList />
         <FinalCtaBlock />
        {/* <QuoteSection /> */}
        {/* <InfoBlock /> */}
        <WhyStoreWithUs />
        <NotAverageStorage />
        <CitiesStatesNav />
      </main>
      <Footer />
    </>
  );
}
