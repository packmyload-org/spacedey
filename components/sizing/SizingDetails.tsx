'use client'; // This component uses client-side hooks like useState

import React, { useState } from 'react';
import Link from "next/link";

// Define the structure for the content of an individual storage size (e.g., 3x5)
interface StorageSizeDetails {
  size: string;
  howBig: string;
  whatFits: string;
}

// Define the structure for the content of a major storage category (e.g., Small)
interface StorageCategory {
  title: string;
  description: string;
  sizes: StorageSizeDetails[];
}

// Define the data for the three size categories
const storageData: Record<'Small' | 'Medium' | 'Large', StorageCategory> = {
  Small: {
    title: 'Small storage units',
    description:
      'Small storage units, ranging from 3 x 5 to 5 x 10, offer more room than you might expect—perfect for making extra space at home or storing items between seasons. These units are commonly used for holiday decorations, yard tools, kids’ clothes and toys, or even as summer storage for students. Not sure which size you need? Learn more about the difference between a 3 x 5, 5 x 5, and 5 x 10 storage unit below.',
    sizes: [
      {
        size: '3 x 5 Storage Unit',
        howBig:
          'At 15 square feet, the 3 x 5 is often the smallest unit available, but don’t underestimate it. With up to 200 cubic feet of vertical space, it functions like a small walk-in closet—great for compact storage needs.',
        whatFits:
          'Ideal for smaller items and smart stacking, this unit can hold: Full-size mattress, Christmas tree, Small dresser, Desk or chair, Boxes and bins',
      },
      {
        size: '5 x 5 Storage Unit',
        howBig:
          'With 25 square feet of space and around 250 cubic feet of volume, a 5×5 unit is similar in size to a standard closet. It’s perfect for storing a few pieces of furniture and household extras.',
        whatFits:
          'This compact yet versatile unit can fit: Twin or full-size mattress, Small dresser or bookshelf, Seasonal decorations, Boxes of clothing, books, or collectibles, Sports gear',
      },
      {
        size: '5 x 10 Storage Unit',
        howBig:
          'Offering 50 square feet of space—about the size of a walk-in closet—the 5×10 unit holds up to 400 cubic feet of your belongings. It’s a great choice for small apartment items or business storage.',
        whatFits:
          'This size comfortably accommodates: Queen-size bed and frame, Sofa or loveseat, Dresser, desk, or bookshelves, Bikes or sports equipment, Several medium to large moving boxes',
      },
    ],
  },
  Medium: {
    title: 'Medium storage units',
    description:
      'Medium storage units, including 6 x 10 and 10 x 10 sizes, offer generous space for life transitions, home projects, or decluttering efforts. These units are commonly used to store the contents of a one-bedroom apartment—perfect for furniture, small appliances, or a mix of household items and moving boxes. Explore the differences between a 6 x 10 and a 10 x 10 storage unit below to find the best fit for your needs.',
    sizes: [
      {
        size: '6 x 10 Storage Unit',
        howBig:
          'With 60 square feet of space, the 6 x 10 unit is roughly the size of a small bedroom. It provides a comfortable amount of room for a mix of medium-size furniture and packed boxes.',
        whatFits:
          'Ideal for personal or small household storage, this unit can typically hold: Queen-size mattress and bed frame, Small sofa or loveseat, Dresser or TV stand, Desk and chair, Several medium or large boxes',
      },
      {
        size: '10 x 10 Storage Unit',
        howBig:
          'Offering 100 square feet of space, the 10 x 10 unit is about the size of a standard bedroom. It’s one of the most popular storage sizes thanks to its flexibility and roomy layout.',
        whatFits:
          'This size can comfortably hold the contents of a one-bedroom apartment or small office, including: Queen or king-size mattress and bed frame, Full living room set (sofa, coffee table, armchair), Dining table with chairs, Dresser, bookshelves, or file cabinets, Dozens of boxes or totes',
      },
    ],
  },
  Large: {
    title: 'Large storage units',
    description:
      'Large storage units, including 10 x 15 and 10 x 20 options, are ideal for major moves, home renovations, or business storage needs. These spacious units can hold the contents of a two- to three-bedroom home, including large furniture, appliances, and dozens of boxes. Explore the key differences between a 10×15 and 10×20 storage unit to choose the right fit for your belongings.',
    sizes: [
      {
        size: '10 x 15 Storage Unit',
        howBig:
          'With 150 square feet of space, a 10 x 15 unit is about the size of a large bedroom or small garage. It offers plenty of room for bulkier household items and is great for storing multiple rooms’ worth of furniture.',
        whatFits:
          'This unit is ideal for medium to large storage needs, such as: Bedroom sets including queen or king mattresses, Living room furniture (sofa, chairs, coffee table), Large appliances (refrigerator, washer/dryer), Dining table and chairs, Dozens of moving boxes',
      },
      {
        size: '10 x 20 Storage Unit',
        howBig:
          'At 200 square feet, a 10 x 20 unit is roughly the size of a standard one-car garage. It provides ample space for an entire household or large commercial inventory.',
        whatFits:
          'Perfect for full-home storage or business use, this unit can hold: Full sets of bedroom, living room, and dining furniture, Large appliances and exercise equipment, Office furniture and business inventory, Multiple mattresses, wardrobes, and shelving units, 40–50 moving boxes or storage bins',
      },
    ],
  },
};

// Define the type for the keys of storageData, which are the tab names
type TabKey = keyof typeof storageData;

const tabKeys: TabKey[] = ['Small', 'Medium', 'Large'];

// Utility component for rendering the content of a single storage size
const StorageSize = ({ details }: { details: StorageSizeDetails }) => {
  const isMedium = details.size === '6 x 10 Storage Unit' || details.size === '10 x 10 Storage Unit';
  const isLarge = details.size === '10 x 15 Storage Unit' || details.size === '10 x 20 Storage Unit';

  return (
    <div>
      <h4 className="lg:text-3xl text-2xl font-medium text-[#0C1E7D] lg:mb-4 mb-3">
        {details.size}
      </h4>
      {/* 6x10 and 10x10 units don't have the 'How Big' title in the original HTML */}
      {(isMedium || isLarge) ? (
        <h5 className="text-xl font-medium text-[#0C1E7D] mb-3">
          How Big is a {details.size}?
        </h5>
      ) : null}
      <p className="lg:text-xl text-base font-normal text-brand-charcoal-2 lg:mb-4 mb-8">
        {details.howBig}
      </p>

      <h5 className="text-xl font-medium text-brand-secondary-blue mb-3">
        What Fits in a {details.size}?
      </h5>
      <p className="lg:text-xl text-base font-normal text-brand-charcoal-2 lg:mb-4 mb-8">
        {details.whatFits}
      </p>
    </div>
  );
};

// Main Next.js/React component
const SizingDetails = () => {
  // Initialize state with 'Medium' as it was the selected tab in the original HTML
  const [activeTab, setActiveTab] = useState<TabKey>('Medium');
  const activeContent = storageData[activeTab];

  // Logic to calculate the indicator position and width based on the active tab
  const activeTabIndex = tabKeys.indexOf(activeTab);
  // Assuming equal width tabs (1/3), so width is 100% / 3 = 33.333%
  const indicatorWidthPercent = 100 / tabKeys.length;
  // Position is (Index * Width)
  const indicatorLeftPercent = activeTabIndex * indicatorWidthPercent;

  return (
    <section>
      <div className="sizing-details-sec py-12 lg:px-30 px-6 flex justify-center">
        <div className="w-full max-w-6xl">
        <h2 className="text-center text-blue-900 text-3xl lg:text-4xl font-bold mb-6">
          Sizing details
        </h2>
        <hr className="h-[3px] w-[50px] mt-6 lg:mb-12 mb-10 mx-auto bg-brand-orange border-0" />

        {/* Custom Tabs Implementation */}
        <div className="border-b-[1px] text-2xl border-gray-200 lg:mb-12 mb-10 relative">
          <div className="flex " role="tablist">
            {tabKeys.map((tabKey) => {
              const isActive = tabKey === activeTab;
              // Replicating the button styling from the original HTML as closely as possible
              const tabClasses = `
                w-1/3 py-3 px-1 font-sm font-medium text-blue-900 transition-all duration-200 ease-out
                ${isActive ? 'text-brand-primary scale-105' : 'text-gray-500 hover:text-brand-primary hover:scale-102'}
                relative focus:outline-none active:scale-95
              `;

              return (
                <button
                  key={tabKey}
                  className={tabClasses}
                  onClick={() => setActiveTab(tabKey)}
                  role="tab"
                  aria-selected={isActive}
                >
                  {tabKey}
                </button>
              );
            })}
          </div>
          {/* Custom Tab Indicator */}
          <span
            className="absolute bottom-0 h-[2px] bg-brand-primary transition-all duration-300"
            style={{
              width: `${indicatorWidthPercent}%`,
              left: `${indicatorLeftPercent}%`,
            }}
          ></span>
        </div>

        {/* Tab Content */}
        <div className="mb-5">
          <h3 className="lg:text-3xl text-2xl font-semibold text-[#0C1E7D] lg:mb-4 mb-3">
            {activeContent.title}
          </h3>
          <p className="lg:text-xl text-base font-normal text-brand-charcoal-2 lg:mb-10 mb-8">
            {activeContent.description}
          </p>
          <div className="grid lg:grid-cols-2 gap-x-8 lg:gap-y-10">
            {activeContent.sizes.map((sizeDetails, index) => (
              <StorageSize key={index} details={sizeDetails} />
            ))}
          </div>
        </div>

        {/* Explore All Locations Button */}
        <div className="text-center">
          <Link href="/locations">
            <button
              className="
           w-full sm:w-auto px-8 py-3 border-1 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors duration-200
            "
              type="button"
            >
              Explore all locations
            </button>
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
};

export default SizingDetails;