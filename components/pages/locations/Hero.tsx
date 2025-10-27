'use client'
import { useState } from "react";
import Image from "next/image";

export default function LocationSection() {
  const [location, setLocation] = useState("");

  return (
    <section className="relative overflow-hidden pt-16">
      {/* Blue Background + Pattern */}
      <div
        className="relative lg:p-20 bg-[#1642F0] flex flex-col lg:flex-row items-center justify-center bg-cover bg-no-repeat overflow-hidden"
        style={{ backgroundImage: "url('/blue-wave.png')" }}
      >
        {/* SVG Curve — sits above blue bg but below image */}
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 left-0 w-full z-10"
          preserveAspectRatio="none"
        >
          <path fill="#ffffff" d="M0,288L1440,96L1440,320L0,320Z" />
        </svg>

        {/* Mobile Heading */}
        <h1 className="font-semibold text-5xl lg:hidden text-white text-center my-8 z-20 relative ">
          Spacedey Locations
        </h1>

        {/* Left Box */}
        <div className="hidden lg:block p-12 rounded-3xl bg-white h-full w-[500px] -mr-12 z-30 border border-gray-200 shadow-md relative pb-10">
          <h1 className="font-semibold text-5xl">Spacedey Locations</h1>

          <p className="font-serif mt-6 text-gray-700">Location</p>

          {/* Custom Dropdown */}
          <div className="mt-4 relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 appearance-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a location</option>
              <option value="new-york">New York</option>
              <option value="chicago">Chicago</option>
              <option value="houston">Houston</option>
              <option value="los-angeles">Los Angeles</option>
            </select>

            {/* Down Arrow Icon */}
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center z-20 relative">
          <Image
            src="/images/LocationHero.jpg"
            alt="Storage facility"
            width={1450}
            height={860}
            className="rounded-3xl mr-[-20%] lg:mr-0 object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}











