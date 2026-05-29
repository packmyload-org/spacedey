'use client'; // This component uses client-side hooks like useState

import React, { useState } from 'react';
import { SIZING_FAQS } from '@/lib/sizingSeoContent';

type FaqItem = (typeof SIZING_FAQS)[number];

// Reusable component for the Chevron Icon (SVG path remains the same)
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 256 256"
    className={`shrink-0 transition-transform duration-200 ${
      isOpen ? 'rotate-180' : ''
    }`}
  >
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
  </svg>
);

// Component for a single FAQ item (Accordion logic)
const FaqAccordionItem = ({ item, index }: { item: FaqItem; index: number }) => {
  // We use the index of the item as the unique ID for tracking the open state
  const [isOpen, setIsOpen] = useState(index === 0); // Keep the first item open by default, as in the original HTML

  const toggleAccordion = () => setIsOpen(!isOpen);

  // Preserve original wrapper styling for each item
  return (
    <div
      className="border-b last:border-b-0 border-gray-200 lg:pb-6 pb-5 last:pb-0 lg:mb-6 mb-5 last:mb-0"
      aria-expanded={isOpen}
    >
      <button
        className="w-full flex items-center gap-2 text-left"
        onClick={toggleAccordion}
        aria-controls={`faq-content-${index}`}
        id={`faq-header-${index}`}
      >
        {/* Question text styling preserved */}
        <span className="lg:text-2xl text-lg font-medium text-brand-secondary-blue grow">
          {item.question}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* Answer Content - Conditionally rendered or collapsed with CSS for transition effect (using max-height) */}
      <div
        id={`faq-content-${index}`}
        role="region"
        aria-labelledby={`faq-header-${index}`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {/* Padding and paragraph styling preserved */}
          <div className="lg:pt-4 pt-3">
            <p className="lg:text-xl text-base font-normal text-brand-charcoal-2">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Next.js/React component
const SizingFaq = () => {
  const sectionBgColor = 'bg-[#1642F00D]';

  return (
    <section>
      {/* Container styling and custom background color preserved */}
      <div className={`lg:py-28 py-12 lg:px-30 px-6 ${sectionBgColor}`}>
        <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-center text-blue-900 text-3xl lg:text-4xl font-bold mb-6">
          Frequently asked questions
        </h2>
        {/* Separator HR styling preserved */}
        <hr className="h-[3px] w-[50px] mt-6 lg:mb-12 mb-10 mx-auto bg-brand-orange border-0" />

        <div className="w-full bg-gray-50 rounded-xl px-6 lg:px-8 py-8 shadow-sm">
        <div className="lg:mb-12 mb-10">
          {/* Map through the FAQ data to render Accordion items */}
          {SIZING_FAQS.map((item, index) => (
            <FaqAccordionItem key={index} item={item} index={index} />
          ))}
        </div>

        {/* Button styling preserved. Note: Mui classes replaced with Tailwind. */}
        <div className="text-center">
          <button
            className="
              w-full sm:w-auto px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors duration-200
            "
            type="button"
          >
            Reserve now
          </button>
        </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default SizingFaq;
