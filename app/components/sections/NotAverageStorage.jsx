"use client";

import React from 'react';

// Replace this with your actual import path
// Use public image path
const DigitalKey = "/images/DigitalKey.jpg";


export default function StorageLanding() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8 lg:py-10">
        {/* Header */}
        <div className="mb-10 lg:mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#003087] mb-5 leading-tight">
            Not Your Average Storage
          </h1>
          <div className="w-16 h-1 bg-[#ff6b35]"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-2 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-5 lg:pr-8">
            {/* Feature 1 */}
            <div>
              <h2 className="text-3xl lg:text-3xl font-bold text-[#003087] mb-4 leading-snug">
                Storage in your neighborhood
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We transform underutilized spaces in nearby buildings into convenient storage solutions.
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <h2 className="text-3xl lg:text-3xl font-bold text-[#003087] mb-4 leading-snug">
                Secure, inviting spaces
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our clean, bright, and welcoming storage facilities are equipped with top-notch security and surveillance.
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <h2 className="text-3xl lg:text-3xl font-bold text-[#003087] mb-4 leading-snug">
                Digital key entry
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Safe, simple, and at your fingertips — the Stuf Digital Key is the modern way to access your storage unit.
              </p>
            </div>

            {/* Feature 4 */}
            <div>
              <h2 className="text-3xl lg:text-3xl font-bold text-[#003087] mb-4 leading-snug">
                Personalized service
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Manage your reservation online or chat with a member of our 5-star Member Experience team.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button className="px-12 py-4 border-2 border-[#2563ff] text-[#2563ff] rounded-full text-lg font-semibold hover:bg-[#2563ff] hover:text-white transition-all duration-300">
                Explore Our Storage Facilities
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <img 
                src={DigitalKey} 
                alt="Digital Key App Interface" 
                className="w-full h-auto rounded-[3rem]  object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}