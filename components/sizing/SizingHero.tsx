'use client';

import React from 'react';
import Link from "next/link";

const StorageHeroSection = () => {
  return (
    <section
      className="relative w-full h-auto sm:h-80 md:h-96 lg:h-[550px] flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/SizingHeroBg.png')",
      }}
    >

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20 pt-32">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 lg:mb-8">
          Find the Right Storage Unit Size
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-base lg:text-lg font-normal text-white mb-8 sm:mb-10 lg:mb-12 leading-relaxed">
          Get a clear picture of what fits inside a 5x10 or 10x10 unit.
        </p>

        {/* CTA Button */}
        <Link href="/search">
          <button
            type="button"
            className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-[#D96541] hover:bg-orange-600 text-white font-bold text-sm sm:text-base lg:text-lg rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto max-w-sm"
          >
            Find storage near me
          </button>
        </Link>
      </div>
    </section>
  );
};

export default StorageHeroSection;