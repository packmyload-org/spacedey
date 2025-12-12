"use client";
import { useState } from "react";
import Image from "next/image";

// Using your provided data structure
const storageData = {
  small: {
    sizes: [
      { label: "3 x 5", image: "/images/Size1a.jpg" },
      { label: "5 x 5", image: "/images/Size1b.jpg" },
      { label: "5 x 10", image: "/images/Size1c.jpg" },
    ],
    description:
      "About the size of a hall closet or small walk-in closet, these storage units are great for clearing out a little extra space at home. Common uses include storing seasonal decorations, yard tools, kids’ clothing and toys, or serving as summer storage for college students.",
  },
  medium: {
    sizes: [
      { label: "6 x 10", image: "/images/Size2a.jpg" },
      { label: "10 x 10", image: "/images/Size2b.jpg" },
    ],
    description:
      "About the size of a small bedroom or large walk-in closet, medium storage units are great for storing the contents of a one-bedroom apartment. Common uses include holding furniture like a bed, sofa, and dining set, storing boxes of household items, or keeping things organized during a move or home renovation.",
  },
  large: {
    sizes: [
      { label: "10 x 15", image: "/images/Size3a.jpg" },
      { label: "10 x 20", image: "/images/Size3b.jpg" },
    ],
    description:
      "About the size of a standard one-car garage, large storage units are perfect for storing the contents of a two- to three-bedroom home. They can hold big items like living room furniture, multiple mattresses, kitchen appliances, and dozens of boxes—ideal for moving, remodeling, or business storage needs.",
  },
};

export default function StorageUnitSizes() {
  const [selectedCategory, setSelectedCategory] = useState<
    "small" | "medium" | "large"
  >("medium"); // Start on 'medium' to match the screenshot state
  const [selectedSize, setSelectedSize] = useState(
    storageData.medium.sizes[0] // Start on '6 x 10' to match the screenshot state
  );

  const category = storageData[selectedCategory];

  // Helper to capitalize the first letter
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    // Outer section: Light blue background, specific padding, and max-width for overall page look
    <section className="py-16 px-4 md:px-8 bg-blue-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Title: 'Storage unit sizes' */}
        <div className="text-center mb-10">
          <h2 className="text-center text-blue-900 text-3xl lg:text-4xl font-bold mb-6">
            Storage unit sizes
            {/* Orange underline for the title */}
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-1 w-12 h-1 bg-orange-500 rounded-full"></span>
          </h2>
        </div>

        {/* Main Content Area: Flex container for the two-column layout */}
        <div className="flex flex-col lg:flex-row bg-white/0 rounded-xl">
          
          {/* Left Side: Image */}
          <div className="w-full lg:w-1/2 relative min-h-[300px]">
            {/* Image container setup for proper cropping and positioning */}
            <div className="relative w-full h-full">
              <Image
                // NOTE: Use the placeholder image path from the data structure
                src={selectedSize.image}
                alt={selectedSize.label}
                // Use fill layout to make the image occupy the full left container
                layout="fill"
                objectFit="cover"
                className="lg:rounded-l-xl" // Round the left corners only for desktop
              />
            </div>
          </div>

          {/* Right Side: Tabs and Description */}
          <div className="w-full lg:w-1/2 p-6 md:p-10">
            
            {/* Category tabs (Small, Medium, Large) */}
            <div className="flex justify-start border-b border-gray-200 mb-8">
              {Object.keys(storageData).map((key) => (
                <button
                  key={key}
                  className={`px-0 pb-2 mr-10 text-lg font-normal text-indigo-900 transition-all duration-200 relative ${
                    selectedCategory === key
                      ? "font-semibold border-b-4 border-blue-600" // Active state: Blue underline
                      : "text-gray-500 hover:text-indigo-900" // Inactive state
                  }`}
                  onClick={() => {
                    const newCategory = key as "small" | "medium" | "large";
                    setSelectedCategory(newCategory);
                    // Reset selected size to the first of the new category
                    setSelectedSize(storageData[newCategory].sizes[0]);
                  }}
                >
                  {capitalize(key)}
                </button>
              ))}
            </div>

            {/* Size buttons area */}
            <p className="uppercase text-xs font-semibold text-gray-500 mb-3 tracking-widest">
              Common Sizes
            </p>
            <div className="flex justify-start gap-3 mb-8 flex-wrap">
              {category.sizes.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(s)}
                  // Styling to match the screenshot: Blue border, white BG for inactive; Solid Blue BG for active.
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors duration-200 ${
                    selectedSize.label === s.label
                      ? "bg-blue-600 text-white border-blue-600" // Active style
                      : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50" // Inactive style
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="text-left text-gray-700 leading-relaxed">
              {/* You might want a bolded first line or title here if you were trying to match the description exactly */}
              <p>{category.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}