"use client";
import React from "react";
import { Box } from "lucide-react"; // use Box instead of Cube

export default function UnitSizes() {
  return (
    <section className="bg-[#f9faff] min-h-full flex flex-col items-center justify-center px-4 py-12">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#1a1d23]">
          Find The Right Size
        </h2>
        <div className="w-12 h-1 bg-[#e65c3a] mx-auto mt-3 rounded"></div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Small */}
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-3">Small</h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Box className="w-4 h-4 text-blue-600 mr-2" />
            3 x 3 and smaller
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            An extra closet for seasonal storage, bikes, and all the small things
          </p>
        </div>

        {/* Medium */}
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-3">Medium</h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Box className="w-4 h-4 text-blue-600 mr-2" />
            3 x 3 to 6 x 7
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Perfect for moving a 1 bedroom, sports gear, and business supplies
          </p>
        </div>

        {/* Large */}
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-3">Large</h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Box className="w-4 h-4 text-blue-600 mr-2" />
            6 x 7 and larger
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Fit 1-2 bedrooms' worth of stuff, business inventory, and furniture
          </p>
        </div>
      </div>

      {/* Explore Button */}
      <div className="mt-10">
        <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium rounded-full hover:bg-blue-600 hover:text-white transition">
          Explore All Unit Sizes
        </button>
      </div>

      {/* Support Floating Button */}
      <button className="fixed bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition">
        <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">
          ?
        </span>
        Support
      </button>
    </section>
  );
}

