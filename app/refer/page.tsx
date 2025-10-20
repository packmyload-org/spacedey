import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ReferralFAQAccordion from "@/components/refer/ReferralFAQAccordion";
import ReferralHero from "@/components/refer/ReferralHero";
import ReferralReviewsCarousel from "@/components/refer/ReferralReviewsCarousel";
import ReferralStorageFeatures from "@/components/refer/ReferralStorageFeatures";

export default function Page() {
    return (
        <div>
            <Header />
            <ReferralHero />
            <ReferralStorageFeatures />
            <ReferralFAQAccordion />
            <ReferralReviewsCarousel />
            <Footer />
        </div>
    );
}