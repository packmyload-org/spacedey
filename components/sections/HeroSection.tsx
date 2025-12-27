import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PrimaryButton from "../../components/ui/PrimaryButton";
import InputSearch from "../../components/ui/InputSearch";
// Using public/ images served by Next.js

function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCity, setActiveCity] = useState("");

  const cities = [
  'Lagos',
  'Abuja',
  'Kano',
  'Ibadan',
  'Port Harcourt',
  'Benin City',
  'Jos',
  'Enugu',
  'Kaduna',
  'Abeokuta',
  ];

  const handleCityClick = (city: string) => {
    setActiveCity(city);
    setQuery(city);
  };

  const handleReserve = () => {
    const searchCity = query || activeCity;
    if (searchCity) {
      router.push(`/search?city=${encodeURIComponent(searchCity)}`);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-[#1642F0]">
      {/* Social Proof Badge */}
      <div className="w-full flex justify-center pb-10 pt-24">
        <div className="bg-white rounded-xl shadow-lg flex items-center px-3 py-1 sm:px-6 sm:py-2 gap-3 torch-sweep">
          <div className="flex -ml-1 items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-200 border-2 border-white -ml-2 sm:-ml-3">
              <Image src="/images/Ellipse1.png" alt="" width={32} height={32} className="rounded-full object-cover" />
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-200 border-2 border-white -ml-2 sm:-ml-3">
              <Image src="/images/Ellipse2.png" alt="" width={32} height={32} className="rounded-full object-cover" />
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-200 border-2 border-white -ml-2 sm:-ml-3">
              <Image src="/images/Ellipse3.png" alt="" width={32} height={32} className="rounded-full object-cover" />
            </div>
            <div className="hidden sm:block w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-200 border-2 border-white -ml-2 sm:-ml-3">
              <Image src="/images/Ellipse4.png" alt="" width={32} height={32} className="rounded-full object-cover" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-700">
            Trusted by thousands of renters across <span className="text-neutral-400">7 cities</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full justify-center mb-2 px-4">
        <div className="max-w-6xl mx-auto text-center items-center w-full">
          {/* Hero Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mt-2 mb-8">
            Self-Storage In Your
            
            Neighborhood
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl lg:text-2xl text-white/95 pb-2 mb-6">
            No hidden fees. Fast booking. A smarter way to store.
          </p>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-none sm:max-w-6xl mx-2 py-4">
            {/* City Navigation */}
            <div className="flex flex-wrap justify-center border-b border-neutral-200 gap-2 sm:gap-10 mb-5 px-2 sm:px-0">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className={`text-sm sm:text-base font-medium transition-colors ${
                    activeCity === city
                      ? "text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex flex-col sm:flex-row py-2 mx-4 gap-3">
              <InputSearch
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your city or location"
                className="flex-1"
                inputClassName="text-base border-neutral-300 focus:ring-orange-500"
              />
              <PrimaryButton 
                onClick={handleReserve}
                variant="primary"
                className="bg-[#D96541] hover:bg-[#B85737] text-white px-8 py-4 whitespace-nowrap border-0 rounded-lg focus:ring-orange-500"
              >
                Reserve now
              </PrimaryButton>
            </div>
            {/* Thumbnails moved below the search card (rendered after this card) */}
          </div>
          {/* Thumbnails displayed under the search card */}
          <div className="mt-6 flex items-center justify-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto px-2">
            {/* Responsive image tiles: full width on small screens, fixed size on larger screens */}
            <div className="flex-1 sm:flex-none sm:w-[300px] flex-shrink-0">
              <Image src="/images/hero2.jpg" alt="hero 2" width={300} height={340} className="w-full h-auto object-cover rounded-md" />
            </div>
            <div className="flex-1 sm:flex-none sm:w-[300px] flex-shrink-0">
              <Image src="/images/hero3.jpg" alt="hero 3" width={300} height={340} className="w-full h-auto object-cover rounded-md" />
            </div>
            <div className="flex-1 sm:flex-none sm:w-[300px] flex-shrink-0">
              <Image src="/images/hero4.jpg" alt="hero 4" width={300} height={340} className="w-full h-auto object-cover rounded-md" />
            </div>
            <div className="flex-1 sm:flex-none sm:w-[300px] flex-shrink-0">
              <Image src="/images/hero5.jpg" alt="hero 5" width={300} height={340} className="w-full h-auto object-cover rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Support Link */}
      <div className="absolute bottom-8 left-8">
        <button className="flex items-center text-white hover:text-white/80 transition-colors gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-xs font-bold">?</span>
          </div>
          {/* <span className="font-medium">Support</span> */}
        </button>
          {/* Support area only (images moved into search card) */}
      </div>
      {/* <div className="mt-6">
      <Image 
        src="/images/HeroM.jpg"
        alt="Hero image"
        width={800}
        height={400}
        className="w-full h-auto"
      />
      </div>
       */}
    </section>
  );
}

export default HeroSection;