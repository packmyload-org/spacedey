import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import HeroSection from "@/app/components/sections/HeroSection";
import QuoteSection from "@/app/components/sections/QuoteSection";
import InfoBlock from "@/app/components/sections/InfoBlock";
import WhyStoreWithUs from "@/app/components/sections/WhyStoreWithUs";
import FinalCtaBlock from "@/app/components/sections/FinalCtaBlock";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <QuoteSection />
        <InfoBlock />
        <WhyStoreWithUs />
        <FinalCtaBlock />
      </main>
      <Footer />
    </>
  );
}
