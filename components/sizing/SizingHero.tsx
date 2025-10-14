'use client';

import React from 'react';

const StorageHeroSection = () => {
  return (
    <section
      className="relative w-full lg:h-[550px] sm:h-[100px] flex items-center justify-center overflow-hidden bg-cover bg-center "
      style={{
        backgroundImage: "url('/images/SizingHeroBg.png')",
      }}
    >

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 lg:px-20 py-20 mt-20">
        {/* Heading */}
        <h1 className="font-serif lg:text-6xl text-5xl font-bold text-white leading-tight mb-8">
          Find the Right Storage Unit Size
        </h1>

        {/* Subheading */}
        <p className="lg:text-2xl text-lg font-normal text-white mb-12 leading-relaxed">
          Get a clear picture of what fits inside a 5x10 or 10x10 unit.
        </p>

        {/* CTA Button */}
        <button
          type="button"
          className="px-10 py-5 bg-[#D96541] hover:bg-orange-600 text-white font-bold text-lg rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 sm:w-auto w-full max-w-sm"
        >
          Find storage near me
        </button>
      </div>
    </section>
  );
};

export default StorageHeroSection;