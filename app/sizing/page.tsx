import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SizingHero from "@/components/sizing/SizingHero";
import ComparisonSizesSection from "@/components/sizing/ComparisonSizes";
import StorageUnitSizes from "@/components/sizing/StorageUnitSizes";

import SizingDetails from "@/components/sizing/SizingDetails";
import WhyStoreWithus from "@/components/sizing/SizingWhyStoreWithUs";
import SizingFaq from "@/components/sizing/SizingFaq";



export default function SizingPage() {
    return (
        <>
           <Header />
           <SizingHero />
           <ComparisonSizesSection />
           <StorageUnitSizes />
           <WhyStoreWithus />
           <SizingDetails />
           <SizingFaq />
           <Footer />
        </>
    );
}