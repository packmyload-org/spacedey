'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from "next/link";

interface StorageSizeDetails {
  size: string;
  howBig: string;
  whatFits: string;
}

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
  return (
    <article className="space-y-4">
      <div>
        <h4 className="lg:text-3xl text-2xl font-semibold text-blue-900 mb-4">
          {details.size}
        </h4>
        <p className="lg:text-lg text-base font-normal text-brand-charcoal-2 leading-relaxed">
          {details.howBig}
        </p>
      </div>

      <div>
        <h5 className="text-xl font-semibold text-brand-primary mb-3">
          What Fits in a {details.size}?
        </h5>
        <p className="lg:text-lg text-base font-normal text-brand-charcoal-2 leading-relaxed">
          {details.whatFits}
        </p>
      </div>
    </article>
  );
};

// Main component with improved HCI
const SizingDetails = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('Medium');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeContent = storageData[activeTab];

  // Calculate indicator position
  const activeTabIndex = tabKeys.indexOf(activeTab);
  const indicatorWidthPercent = 100 / tabKeys.length;
  const indicatorLeftPercent = activeTabIndex * indicatorWidthPercent;

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabKeys.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabKeys.length) % tabKeys.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabKeys.length - 1;
    } else {
      return;
    }

    const nextTab = tabKeys[nextIndex];
    setActiveTab(nextTab);
    
    // Focus the newly activated tab button
    setTimeout(() => {
      tabRefs.current[nextIndex]?.focus();
    }, 0);
  }, []);

  const handleTabClick = (tabKey: TabKey, index: number) => {
    setActiveTab(tabKey);
    tabRefs.current[index]?.focus();
  };

  return (
    <section className="sizing-details-section">
      <div className="py-12 lg:py-16 px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              Sizing details
            </h2>
            <hr className="h-1 w-12 bg-brand-orange border-0 mx-auto" />
          </div>

          {/* Main Content Card */}
          <div className="bg-gray-50 rounded-2xl px-6 lg:px-8 py-10 lg:py-12 shadow-sm">
            {/* Tablist */}
            <div 
              className="border-b border-gray-200 mb-10 lg:mb-12 relative"
              role="tablist"
              aria-label="Storage unit sizes"
            >
              <div className="flex gap-0">
                {tabKeys.map((tabKey, index) => {
                  const isActive = tabKey === activeTab;
                  
                  return (
                    <button
                      key={tabKey}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      className={`
                        flex-1 py-4 px-2 lg:px-4 font-semibold text-center
                        transition-all duration-200 ease-out
                        border-b-2 -mb-[2px]
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary
                        ${
                          isActive
                            ? 'text-brand-primary border-b-brand-primary'
                            : 'text-blue-900 border-b-transparent hover:text-brand-primary hover:border-b-gray-300'
                        }
                      `}
                      onClick={() => handleTabClick(tabKey, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${tabKey}`}
                      tabIndex={isActive ? 0 : -1}
                    >
                      <span className="text-lg lg:text-xl">{tabKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content Panel */}
            <div 
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={activeTab}
              className="space-y-8 lg:space-y-10"
            >
              {/* Category Title and Description */}
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-4">
                  {activeContent.title}
                </h3>
                <p className="lg:text-lg text-base text-brand-charcoal-2 leading-relaxed max-w-4xl">
                  {activeContent.description}
                </p>
              </div>

              {/* Storage Size Cards Grid */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 ">
                {activeContent.sizes.map((sizeDetails, index) => (
                  <StorageSize key={`${activeTab}-${index}`} details={sizeDetails} />
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-12 lg:mt-14 pt-8 lg:pt-10 border-t border-gray-200 text-center">
              <Link href="/locations">
                <button
                  className="
                    inline-block px-8 lg:px-10 py-3 lg:py-4
                    border-1 border-[#1642F0] text-[#1642F0] font-semibold
                    rounded-full
                    transition-all duration-200 ease-out
                    hover:bg-brand-primary hover:text-white
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary
                    active:scale-95
                    text-base lg:text-lg
                  "
                  type="button"
                  aria-label="Explore all storage locations"
                >
                  Explore all locations
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizingDetails;