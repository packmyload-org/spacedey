"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Location = {
  city: string;
  image: string;
};

const LOCATIONS: Location[] = [
  { city: "Lagos", image: "/images/Lagos.jpg" },
  { city: "Abuja", image: "/images/Abuja.jpeg" },
  { city: "Kano", image: "/images/Kano.png" },
  { city: "Ibadan", image: "/images/Ibadan.jpg" },
  { city: "Port Harcourt", image: "/images/LocationHero.jpg" }, 
];

export default function FeatureList() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, LOCATIONS.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, LOCATIONS.length - 2)) % Math.max(1, LOCATIONS.length - 2));
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex-1" />
          <div className="text-center">
            {/* <h2 className="text-4xl lg:text-4xl font-bold text-[#0A1E5E] inline-block">Discover Our Locations</h2> */}
            <button className="text-center text-xl p-3 font-bold mt-  pt-5 text-[#1642F0] hover:bg-[#f0f1f6]  rounded-3xl">Explore All Locations</button>
            <div className="w-16 h-1 bg-[#D96541] mx-auto mt-3" />
          </div>
          <div className="flex-1 flex justify-end items-start mt-20 gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Previous locations"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="Next locations"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="p-0">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {LOCATIONS.map((location, idx) => (
                <div key={idx} className="w-full sm:w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white p-5 rounded-3xl shadow-lg overflow-hidden h-full border border-gray-50">
                    <div className="relative overflow-hidden mb-3">
                      <Image src={location.image} alt={`${location.city} skyline`} width={600} height={192} className="w-full h-48 object-cover rounded-xl" />
                    </div>
                    <div className=" items-center ">
                      <h3 className="text-xl font-bold text-[#0A1E5E] ">Storage in {location.city}</h3>
                      <button className="w-full my-8 py-2 px-4 border  border-[#1642F0] text-[#2B5CE7] rounded-full font-semibold hover:bg-[#2B5CE7] hover:text-white transition-colors text-base">
                        View All Facilities
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="text-center text-xl font-bold mt-5  pt-5 text-[#1642F0] bg-[#FF00FF]">Explore All Locations</div> */}
    </section>
  );
}



