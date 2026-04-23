import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import WhyStoreWithUs from "@/components/home/WhyStoreWithUs";
import FinalCtaBlock from "@/components/ui/FinalCtaBlock";
import NotAverageStorage from "@/components/ui/NotAverageStorage";
import CitiesStatesNav from "@/components/home/CitiesStatesNav";
import FeatureList from "@/components/home/FeatureList";

interface HomePageContentProps {
  cities: string[];
  states: string[];
}

export default function HomePageContent({
  cities,
  states,
}: Readonly<HomePageContentProps>) {
  return (
    <main className="flex min-h-screen flex-col z-0">
      <Header />
      <HeroSection states={states} />
      <FeatureList />
      <FinalCtaBlock />
      <WhyStoreWithUs />
      <NotAverageStorage />
      <CitiesStatesNav cities={cities} states={states} />
      <Footer />
    </main>
  );
}
