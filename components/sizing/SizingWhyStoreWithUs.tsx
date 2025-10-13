import Image from 'next/image';
import React from 'react';

// 1. Define a TypeScript interface for the data structure
interface Feature {
  id: number;
  iconSrc: string; // The URL/path for the image icon
  iconAlt: string;
  title: string;
}

// 2. Define the data array
const storeFeatures: Feature[] = [
  {
    id: 1,
    // NOTE: Replace these with your actual static image paths (e.g., from the /public folder)
    // The original code used /_next/static/media/Dollar.66bc4a77.png, which suggests a file import structure.
    // For a clean conversion, we'll assume the assets are in the /public folder.
    iconSrc: '/images/Dollar.png', // Assuming asset path
    iconAlt: 'Dollar Icon',
    title: 'No "Admin" fees',
  },
  {
    id: 2,
    iconSrc: '/images/LocationPin.png', // Assuming asset path
    iconAlt: 'Location Pin Icon',
    title: 'Storage in your neighborhood',
  },
  {
    id: 3,
    iconSrc: '/images/Lock.png', // Assuming asset path
    iconAlt: 'Lock Icon',
    title: 'Complimentary lock',
  },
];

// 3. Define the component
const WhyStoreWithus: React.FC = () => {
  return (
    <section>
      {/* Container with padding and max-width management */}
      <div className="lg:py-28 py-12 lg:px-20 px-6 max-w-7xl mx-auto">
        
        {/* Title Section */}
        <h2 className="text-center text-blue-900 text-3xl lg:text-5xl font-bold mb-6">
          Why store with us?
        </h2>
        {/* Horizontal Rule/Underline */}
        <hr className="h-[3px] w-[50px] mt-6 lg:mb-20 mb-10 mx-auto bg-brand-orange border-0" />
        
        {/* Features Grid */}
        <div className="flex lg:flex-row flex-col justify-between xl:gap-20 gap-10 lg:mb-20 mb-10">
          {storeFeatures.map((feature) => (
            <div
              key={feature.id}
              // Tailwind class to achieve the custom column width from the original HTML: 
              // xl:w-[calc((100%/3)-(80px/2))] lg:w-[calc((100%/3)-(40px/2))]
              className="xl:w-[calc((100%/3)-40px)] lg:w-[calc((100%/3)-20px)] text-center w-full"
            >
              {/* Image Component for optimization */}
              <Image
                src={feature.iconSrc}
                alt={feature.iconAlt}
                width={150}
                height={150}
                className="mx-auto mb-6"
                // The 'draggable' attribute is unnecessary in the Image component
                // 'loading' is managed by Next.js.
              />
              <h4 className="font-serif text-2xl font-medium text-brand-dark-blue">
                {feature.title}
              </h4>
            </div>
          ))}
        </div>
        
        {/* Button Section */}
        <div className="text-center">
          {/* NOTE: I've replaced the complex MuiButton classes with clean Tailwind/React structure. 
                     You will need to ensure 'brand-orange' is defined in your tailwind config 
                     if you want the exact styling of the original button.
          */}
          <button 
            className="w-full sm:w-auto px-8 py-3 border-1 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors duration-200"
            type="button"
          >
            <span className="lg:block hidden">Find A Storage Unit</span>
            <span className="lg:hidden">Book a unit</span>
          </button>
        </div>
        
      </div>
    </section>
  );
};

export default WhyStoreWithus;