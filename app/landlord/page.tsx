import LandlordGetInTouch from "@/components/landlord/LandlordGetInTouch";
import LandlordHero from "@/components/landlord/LandlordHero";
import LandlordMarkets from "@/components/landlord/LandlordMarkets";
import LandlordPress from "@/components/landlord/LandlordPress";
import LandlordStoragePartnership from "@/components/landlord/LandlordStoragePartnership";
import LandlordWhatWeLookFor from "@/components/landlord/LandlordWhatWeLookFor";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import React from "react";

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
