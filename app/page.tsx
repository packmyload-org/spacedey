'use client';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/Home/HeroSection";
// QuoteSection and InfoBlock imports removed because they are commented out in the render tree
import WhyStoreWithUs from "@/components/Home/WhyStoreWithUs";
import FinalCtaBlock from "@/components/ui/FinalCtaBlock";
import NotAverageStorage from "@/components/ui/NotAverageStorage";
import CitiesStatesNav from "@/components/Home/CitiesStatesNav";
import FeatureList from "@/components/Home/FeatureList";

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
