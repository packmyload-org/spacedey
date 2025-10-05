"use client";

import React from "react";
import PrimaryButton from "@/app/components/ui/PrimaryButton";
import InputSearch from "@/app/components/ui/InputSearch";

export default function HeroSection() {
  const [query, setQuery] = React.useState("");
  const [activeCity, setActiveCity] = React.useState("");

  const cities = [
    "Atlanta",
    "Boston",
    "Los Angeles",
    "New Jersey",
    "New York",
    "San Diego",
    "San Francisco",
    "Seattle",
    "Washington DC",
  ] as const;

  return (
    <section className="relative min-h-screen flex flex-col bg-[#1642F0]">
      <div className="w-full flex justify-center pb-10  pt-24 ">
        <div className="bg-white rounded-xl shadow-lg flex items-center px-6 py-2 gap-3">
          <div className="flex -ml-1">
            <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white -ml-3"></div>
            <div className="w-8 h-8 rounded-full bg-rose-200 border-2 border-white -ml-3"></div>
            <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white -ml-3"></div>
            <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white -ml-3"></div>
          </div>
          <p className="text-sm text-neutral-700">
            Trusted by thousands of renters across <span className="text-neutral-400">7 cities</span>
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center w-full justify-center mb-2 px-4">
        <div className="max-w-6xl mx-auto text-center items-center w-full">
          <h1 className="text-4xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mt-2 mb-8">
            Self-Storage In Your
            <br />
            Neighborhood
          </h1>

          <p className="text-xl sm:text-2xl text-white/95 pb-2 mb-6">
            No hidden fees. Fast booking. A smarter way to store.
          </p>

          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl  mx-2 py-4">
            <div className="flex flex-wrap justify-center border-b border-neutral-200 gap-4 mb-5">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  className={`text-sm sm:text-base font-medium transition-colors ${
                    activeCity === city ? "text-neutral-900" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row py-2 mx-4 gap-3">
              <InputSearch
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city or zip code"
                className="flex-1"
                inputClassName="text-base border-neutral-300 focus:ring-orange-500"
              />
              <PrimaryButton className="bg-[#D96541] hover:bg-[#B85737] text-white px-8 py-4 whitespace-nowrap border-0 rounded-lg focus:ring-orange-500">
                Find storage near me
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8">
        <button className="flex items-center text-white hover:text-white/80 transition-colors gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-xs font-bold">?</span>
          </div>
        </button>
      </div>

      <div className="mt-6">
        <img src="/images/HeroM.jpg" alt="" />
      </div>
    </section>
  );
}


