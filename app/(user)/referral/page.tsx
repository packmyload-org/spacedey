import type { Metadata } from 'next';
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ReferralFAQAccordion from "@/components/refer/ReferralFAQAccordion";
import ReferralHero from "@/components/refer/ReferralHero";
import ReferralReviewsCarousel from "@/components/refer/ReferralReviewsCarousel";
import ReferralStorageFeatures from "@/components/refer/ReferralStorageFeatures";
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Refer a Friend for Storage Rewards',
  description:
    'Refer friends to Spacedey and earn storage rewards when they reserve a unit. Share secure self storage with people who need more space in Nigeria.',
  path: '/referral',
  keywords: [
    'refer a friend storage',
    'storage referral program nigeria',
    'self storage rewards',
    'refer storage lagos',
    'storage referral bonus',
  ],
});

export default function Page() {
    return (
        <div className="bg-[#F5F8FF]">
            <Header />
            <ReferralHero />
            <ReferralStorageFeatures />
            <ReferralFAQAccordion />
            <ReferralReviewsCarousel />
            <Footer />
        </div>
    );
}
