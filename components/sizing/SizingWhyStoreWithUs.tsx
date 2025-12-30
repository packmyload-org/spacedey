"use client";

// src/components/WhyStoreWithUs.jsx
import React from 'react';
import Link from "next/link";
import PrimaryButton from "../ui/PrimaryButton"; 

// Define the custom colors used in the layout for easy reference
const COLORS = {
    TITLE_NAVY: '#172a58',
    UNDERLINE_ORANGE: '#e59976',
    BUTTON_BLUE: '#4a7eff',
};

// Define the feature data and placeholder URLs
const features = [
  { id: 1, text: "No hidden or additional fees", iconUrl: "/images/Dollar.jpg" },
  { id: 2, text: "Storage near home and work", iconUrl: "/images/LocationPin.jpg" },
  { id: 3, text: "Month to Month Leases", iconUrl: "/images/Calendar.jpg" },
  // { id: 4, text: "Complimentary padlock", iconUrl: "/images/Lock.jpg" },
];

interface FeatureItemProps {
  iconUrl: string;
  text: string;
}

const FeatureItem = ({ iconUrl, text }: FeatureItemProps) => {
    return (
        // The flex basis ensures 4 items per row on larger screens and stacks responsively
        <div className="flex flex-col items-center text-center p-4 max-w-[280px] min-w-[200px]">
            {/* Icon Placeholder */}
            <div 
                className="w-[150px] h-[150px] mb-4 bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${iconUrl})` }} 
                role="img" 
                aria-label={text.split(' ').slice(0, 2).join(' ') + " icon"}
            >
                {/* The actual image or SVG goes here */}
            </div>
            
            <p className="text-gray-800 lg:text-lg text-base font-normal leading-relaxed px-2">
              {text}
            </p>
        </div>
    );
};


const WhyStoreWithUs = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <h2 
          className="text-4xl font-bold text-center mb-1" 
          style={{ color: COLORS.TITLE_NAVY }}
        >
          Why Store With Us?
        </h2>
        
        {/* Underline */}
        <div 
          className="w-12 h-1 mx-auto mb-16"
          style={{ backgroundColor: COLORS.UNDERLINE_ORANGE }}
        ></div>

        {/* Features Grid: Responsive layout */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-y-12 gap-x-4 lg:gap-x-6">
          {features.map(feature => (
            <FeatureItem 
              key={feature.id} 
              iconUrl={feature.iconUrl} 
              text={feature.text} 
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Link href="/search">
            <PrimaryButton 
              variant="custom" // Use the 'custom' variant for full Tailwind control
              className="px-8 py-3 text-lg font-semibold border-2"
              // Use inline styles to enforce the custom blue color
              style={{ 
                  borderColor: COLORS.BUTTON_BLUE, 
                  color: COLORS.BUTTON_BLUE,
                  // Add hover styles if they aren't fully covered by your PrimaryButton component
              }}
            >
              Find A Storage Unit
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyStoreWithUs;