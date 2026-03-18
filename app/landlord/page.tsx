import type { Metadata } from 'next';
import LandlordGetInTouch from "@/components/landlord/LandlordGetInTouch";
import LandlordHero from "@/components/landlord/LandlordHero";
import LandlordMarkets from "@/components/landlord/LandlordMarkets";
import LandlordPress from "@/components/landlord/LandlordPress";
import LandlordStoragePartnership from "@/components/landlord/LandlordStoragePartnership";
import LandlordWhatWeLookFor from "@/components/landlord/LandlordWhatWeLookFor";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { buildPageMetadata } from '@/lib/seo';
import React from "react";

export const metadata: Metadata = buildPageMetadata({
   title: 'Partner Your Property With Spacedey',
   description:
      'Partner with Spacedey to turn underused property into storage inventory. Explore landlord partnerships, expansion opportunities, and storage demand across Nigeria.',
   path: '/landlord',
   keywords: [
      'self storage landlord partnership',
      'rent warehouse space nigeria',
      'property partnership lagos',
      'storage facility partnership',
      'unused property income nigeria',
   ],
});

const page = () => {
   return (
      <>
         <Header />
         <LandlordHero />
         <LandlordStoragePartnership />
         <LandlordMarkets />
         {/* <LandlordHeavyLifting /> */}
         <LandlordPress />
         <LandlordWhatWeLookFor />
         {/* <LandlordFeaturedLocation /> */}
         <LandlordGetInTouch />
         <Footer />
      </>
   );
};

export default page;
