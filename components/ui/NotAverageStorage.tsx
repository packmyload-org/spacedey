"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";


export default function StorageLanding() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8 lg:py-10">
        {/* Header */}
        <FadeIn direction="up" className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl  md:text-4xl lg:text-4xl font-bold text-[#003087] mb-5 leading-tight">
            Not Your Average Storage
          </h1>
          <div className="w-16 h-1 bg-[#ff6b35]"></div>
        </FadeIn>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-2 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-5 pr-4 sm:pr-6 lg:pr-8">
            {/* Feature 1 */}
            <FadeIn direction="left" delay={0.1}>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-3 leading-snug">
                Storage in your neighborhood
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We transform underutilized spaces in nearby buildings into convenient storage solutions.
              </p>
            </FadeIn>

            {/* Feature 2 */}
            <FadeIn direction="left" delay={0.2}>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-3 leading-snug">
                Secure, inviting spaces
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our clean, bright, and welcoming storage facilities are equipped with top-notch security and surveillance.
              </p>
            </FadeIn>

            {/* Feature 3 */}
            <FadeIn direction="left" delay={0.3}>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-3 leading-snug">
                Digital key entry
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Safe, simple, and at your fingertips — the Spacedey Digital Key is the modern way to access your storage unit.
              </p>
            </FadeIn>

            {/* Feature 4 */}
            <FadeIn direction="left" delay={0.4}>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-3 leading-snug">
                Personalized service
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Manage your reservation online or chat with a member of our 5-star Member Experience team.
              </p>
            </FadeIn>

            {/* CTA Button */}
            <FadeIn direction="up" delay={0.5} className="pt-6">
              <Link href="/locations">
                <button className="w-full sm:w-auto px-6 sm:px-10 md:px-12 py-2 sm:py-3 border-2 border-[#2563ff] text-[#2563ff] rounded-full text-sm sm:text-lg font-semibold hover:bg-[#2563ff] hover:text-white transition-all duration-300">
                  Explore Our Storage Facilities
                </button>
              </Link>
            </FadeIn>
          </div>

          {/* Right Column - Image */}
          <FadeIn direction="right" delay={0.2} className="flex justify-center items-center">
            <div className="relative w-full max-w-xl lg:max-w-3xl">
              <Image
                src="/images/DigitalKey.png"
                alt="Digital Key App Interface"
                width={600}
                height={400}
                className="w-full h-auto rounded-[3rem] object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}