'use client'; // This component uses client-side hooks like useState

import React, { useState } from 'react';

// Define the structure for a single FAQ item
interface FaqItem {
  question: string;
  answer: string;
}

// Define the data for the FAQ section
const faqData: FaqItem[] = [
  {
    question: 'How do I know what size is the right size?',
    answer:
      "We offer a size guide to help you choose based on what you're storing. Our team is also available to recommend the best fit.",
  },
  {
    question: 'How tall are storage units?',
    answer:
      'Standard storage unit heights typically range from 8 to 10 feet. It’s always best to check the specific unit details for exact dimensions.',
  },
  {
    question: 'How much does each size cost?',
    answer:
      'Pricing varies based on location, unit size, and availability. Please use our location finder and select a size for current rates.',
  },
  {
    question: 'Can I switch to a different size later?',
    answer:
      'Yes, subject to availability, you can usually switch to a larger or smaller unit. Contact our facility manager for assistance with transfers.',
  },
  {
    question: 'Can I store a vehicle in a unit?',
    answer:
      'Some locations offer vehicle storage, including car, boat, and RV parking. Check the specific location pages for available options and restrictions.',
  },
  {
    question: 'What size do I need for a studio apartment?',
    answer:
      'A small unit, such as a 5x10, is typically recommended for the contents of a studio or small one-bedroom apartment.',
  },
  {
    question: 'What size do I need for a 1-bedroom apartment?',
    answer:
      'A medium unit, such as a 10x10, is generally sufficient for a fully furnished one-bedroom apartment.',
  },
  {
    question: 'What size do I need for a 2-bedroom apartment?',
    answer:
      'A 10x15 unit is often the best fit for a two-bedroom home or apartment, holding large appliances and multiple furniture sets.',
  },
  {
    question: 'What size do I need for a 3-bedroom house?',
    answer:
      'A large unit, like a 10x20, can accommodate the contents of a standard three-bedroom house, including major appliances.',
  },
  {
    question: 'What size do I need for a 4-bedroom house?',
    answer:
      'A 10x30 unit is ideal for a four-bedroom house or a large home with a garage full of items.',
  },
];

// Reusable component for the Chevron Icon (SVG path remains the same)
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 256 256"
    className={`flex-shrink-0 transition-transform duration-200 ${
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
      className="border-b-[1px] last:border-b-0 border-gray-200 lg:pb-6 pb-5 last:pb-0 lg:mb-6 mb-5 last:mb-0"
      aria-expanded={isOpen}
    >
      <button
        className="w-full flex items-center gap-2 text-left"
        onClick={toggleAccordion}
        aria-controls={`faq-content-${index}`}
        id={`faq-header-${index}`}
      >
        {/* Question text styling preserved */}
        <span className="font-serif lg:text-2xl text-lg font-medium text-brand-secondary-blue flex-grow">
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
            <p className="font-serif lg:text-xl text-base font-normal text-brand-charcoal-2">
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
  // The background color from the original HTML: bg-[#1642F00D]
  // Note: This is a hex color with 2-digit opacity (0D), which is complex.
  // Tailwind uses 10-point scale opacity. 0D in hex is about 5.1% opacity.
  // We'll use the exact hex with opacity for maximum fidelity, as it's a valid Tailwind class name if configured,
  // but it's used here as an inline style to ensure it works without custom config.
  const sectionBgColor = 'bg-[#1642F00D]';

  return (
    <section>
      {/* Container styling and custom background color preserved */}
      <div className={`lg:py-28 py-12 lg:px-20 px-6 ${sectionBgColor}`}>
        <h2 className="text-center text-blue-900 text-3xl lg:text-5xl font-bold mb-6">
          Frequently asked questions
        </h2>
        {/* Separator HR styling preserved */}
        <hr className="h-[3px] w-[50px] mt-6 lg:mb-12 mb-10 mx-auto bg-brand-orange border-0" />

        <div className="lg:mb-12 mb-10">
          {/* Map through the FAQ data to render Accordion items */}
          {faqData.map((item, index) => (
            <FaqAccordionItem key={index} item={item} index={index} />
          ))}
        </div>

        {/* Button styling preserved. Note: Mui classes replaced with Tailwind. */}
        <div className="text-center">
          <button
            className="
              w-full sm:w-auto px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200
            "
            type="button"
          >
            Reserve now
          </button>
        </div>
      </div>
    </section>
  );
};

export default SizingFaq;