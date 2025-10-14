"use client";

// import { useState } from "react";
// import Image from "next/image";

// interface StorageInfo {
//   image: string;
//   sizes: string[];
//   description: string;
// }

// export default function StorageUnitSizes() {
//   const [activeTab, setActiveTab] = useState<"small" | "medium" | "large">("large");

//   const storageData: Record<"small" | "medium" | "large", StorageInfo> = {
//     small: {
//       image: "/images/storage-small-2.jpg",
//       sizes: ["3 x 5", "5 x 5", "5 x 10"],
//       description:
//         "About the size of a hall closet or small walk-in closet, these storage units are great for clearing out a little extra space at home. Common uses include storing seasonal decorations, yard tools, kids’ clothing and toys, or serving as summer storage for college students.",
//     },
//     medium: {
//       image: "/images/storage-medium-1.jpg",
//       sizes: ["6 x 10", "10 x 10"],
//       description:
//         "About the size of a small bedroom or large walk-in closet, medium storage units are great for storing the contents of a one-bedroom apartment. Common uses include holding furniture like a bed, sofa, and dining set, storing boxes of household items, or keeping things organized during a move or home renovation.",
//     },
//     large: {
//       image: "/images/storage-large-1.jpg",
//       sizes: ["10 x 15", "10 x 20"],
//       description:
//         "About the size of a standard one-car garage, large storage units are perfect for storing the contents of a two- to three-bedroom home. They can hold big items like living room furniture, multiple mattresses, kitchen appliances, and dozens of boxes—ideal for moving, remodeling, or business storage needs.",
//     },
//   };

//   const { image, sizes, description } = storageData[activeTab];

//   return (
//     <section className="lg:pt-28 lg:pb-44 py-12 lg:px-20 px-6 bg-[#1642F00D]">
//       {/* Title */}
//       <h2 className="text-center text-brand-dark-blue text-3xl lg:text-5xl font-bold">
//         Storage unit sizes
//       </h2>
//       <hr className="h-[3px] w-[50px] mt-6 lg:mb-16 mb-10 mx-auto bg-brand-orange border-0" />

//       <div className="flex lg:flex-row flex-col-reverse xl:gap-20 lg:gap-10 gap-6">
//         {/* Image Section */}
//         <div className="lg:w-[49%] flex-shrink-0">
//           <Image
//             src={image}
//             alt={`${activeTab} storage unit`}
//             width={693}
//             height={390}
//             className="rounded-lg object-cover w-full"
//             priority
//           />
//         </div>

//         {/* Text Section */}
//         <div className="lg:self-center flex-grow">
//           {/* Tabs */}
//           <div className="flex border-b border-gray-200 mb-8">
//             {(["small", "medium", "large"] as const).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`w-1/3 py-2 text-lg font-semibold transition ${
//                   activeTab === tab
//                     ? "text-[#1642F0] border-b-4 border-[#FF7A00]"
//                     : "text-gray-500 hover:text-[#1642F0]"
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Common Sizes */}
//           <h6 className="font-serif uppercase text-base font-bold text-brand-graphite mb-2">
//             Common sizes
//           </h6>

//           <div className="flex gap-4 mb-8">
//             {sizes.map((size) => (
//               <button
//                 key={size}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-brand-orange hover:text-white transition"
//               >
//                 {size}
//               </button>
//             ))}
//           </div>

//           {/* Description */}
//           <p className="font-serif lg:text-xl text-base font-normal text-brand-charcoal-2">
//             {description}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }









// "use client";
// import { useState } from "react";
// import Image from "next/image";

// export default function StorageUnitSizes() {
//   const storageData = {
//     small: {
//       sizes: [
//         { label: "3 x 5", image: "/images/storage-small-3x5.jpg" },
//         { label: "5 x 5", image: "/images/storage-small-5x5.jpg" },
//         { label: "5 x 10", image: "/images/storage-small-5x10.jpg" },
//       ],
//       description:
//         "About the size of a hall closet or small walk-in closet, these storage units are great for clearing out a little extra space at home. Common uses include storing seasonal decorations, yard tools, kids’ clothing and toys, or serving as summer storage for college students.",
//     },
//     medium: {
//       sizes: [
//         { label: "6 x 10", image: "/images/storage-medium-6x10.jpg" },
//         { label: "10 x 10", image: "/images/storage-medium-10x10.jpg" },
//       ],
//       description:
//         "About the size of a small bedroom or large walk-in closet, medium storage units are great for storing the contents of a one-bedroom apartment. Common uses include holding furniture like a bed, sofa, and dining set, storing boxes of household items, or keeping things organized during a move or home renovation.",
//     },
//     large: {
//       sizes: [
//         { label: "10 x 15", image: "/images/storage-large-10x15.jpg" },
//         { label: "10 x 20", image: "/images/storage-large-10x20.jpg" },
//       ],
//       description:
//         "About the size of a standard one-car garage, large storage units are perfect for storing the contents of a two- to three-bedroom home. They can hold big items like living room furniture, multiple mattresses, kitchen appliances, and dozens of boxes—ideal for moving, remodeling, or business storage needs.",
//     },
//   };

//   // State for selected category and size
//   const [selectedCategory, setSelectedCategory] = useState<"small" | "medium" | "large">("small");
//   const [selectedSize, setSelectedSize] = useState(storageData.small.sizes[0]);

//   const category = storageData[selectedCategory];

//   return (
//     <section className="py-12 px-6 text-center">
//       <h2 className="text-3xl font-bold mb-6 text-brand-dark-blue">
//         Storage Unit Sizes
//       </h2>

//       {/* Category buttons */}
//       <div className="flex justify-center gap-4 mb-8">
//         {Object.keys(storageData).map((key) => (
//           <button
//             key={key}
//             className={`px-4 py-2 rounded-md ${
//               selectedCategory === key
//                 ? "bg-brand-orange text-white"
//                 : "bg-gray-200"
//             }`}
//             onClick={() => {
//               setSelectedCategory(key as "small" | "medium" | "large");
//               setSelectedSize(storageData[key as "small" | "medium" | "large"].sizes[0]);
//             }}
//           >
//             {key.charAt(0).toUpperCase() + key.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Size buttons inside category */}
//       <div className="flex justify-center gap-3 mb-6 flex-wrap">
//         {category.sizes.map((s: { label: string; image: string }) => (
//           <button
//             key={s.label}
//             onClick={() => setSelectedSize(s)}
//             className={`px-3 py-1 rounded-md border ${
//               selectedSize.label === s.label
//                 ? "bg-brand-orange text-white border-brand-orange"
//                 : "bg-white text-brand-dark-blue border-brand-dark-blue"
//             }`}
//           >
//             {s.label}
//           </button>
//         ))}
//       </div>

//       {/* Image and description */}
//       <div className="flex flex-col items-center lg:flex-row gap-8">
//         <Image
//           src={selectedSize.image}
//           alt={selectedSize.label}
//           width={400}
//           height={300}
//           className="rounded-2xl shadow-lg"
//         />

//         <div className="max-w-lg text-left">
//           <h3 className="text-2xl font-semibold mb-2">
//             {selectedCategory.charAt(0).toUpperCase() +
//               selectedCategory.slice(1)}{" "}
//             Unit ({selectedSize.label})
//           </h3>
//           <p>{category.description}</p>
//         </div>
//       </div>
//     </section>
//   );
// }







// import { useState } from "react";
// import Image from "next/image";

// export default function StorageUnitSizes() {
//   const storageData = {
//     small: {
//       sizes: [
//         { label: "3 x 5", image: "/images/storage-small-3x5.jpg" },
//         { label: "5 x 5", image: "/images/storage-small-5x5.jpg" },
//         { label: "5 x 10", image: "/images/storage-small-5x10.jpg" },
//       ],
//       description:
//         "About the size of a hall closet or small walk-in closet, these storage units are great for clearing out a little extra space at home. Common uses include storing seasonal decorations, yard tools, kids’ clothing and toys, or serving as summer storage for college students.",
//     },
//     medium: {
//       sizes: [
//         { label: "6 x 10", image: "/images/storage-medium-6x10.jpg" },
//         { label: "10 x 10", image: "/images/storage-medium-10x10.jpg" },
//       ],
//       description:
//         "About the size of a small bedroom or large walk-in closet, medium storage units are great for storing the contents of a one-bedroom apartment. Common uses include holding furniture like a bed, sofa, and dining set, storing boxes of household items, or keeping things organized during a move or home renovation.",
//     },
//     large: {
//       sizes: [
//         { label: "10 x 15", image: "/images/storage-large-10x15.jpg" },
//         { label: "10 x 20", image: "/images/storage-large-10x20.jpg" },
//       ],
//       description:
//         "About the size of a standard one-car garage, large storage units are perfect for storing the contents of a two- to three-bedroom home. They can hold big items like living room furniture, multiple mattresses, kitchen appliances, and dozens of boxes—ideal for moving, remodeling, or business storage needs.",
//     },
//   };

//   const [selectedCategory, setSelectedCategory] = useState<
//     "small" | "medium" | "large"
//   >("small");
//   const [selectedSize, setSelectedSize] = useState(
//     storageData.small.sizes[0]
//   );

//   const category = storageData[selectedCategory];

//   return (
//     <section className="py-12 px-6 text-center">
//       <h2 className="text-3xl font-bold mb-6 text-brand-dark-blue">
//         Storage Unit Sizes
//       </h2>

//       {/* Category buttons */}
//       <div className="flex justify-center gap-4 mb-8">
//         {Object.keys(storageData).map((key) => (
//           <button
//             key={key}
//             className={`px-4 py-2 rounded-md ${
//               selectedCategory === key
//                 ? "bg-brand-orange text-white"
//                 : "bg-gray-200"
//             }`}
//             onClick={() => {
//               setSelectedCategory(key as "small" | "medium" | "large");
//               setSelectedSize(
//                 storageData[key as "small" | "medium" | "large"].sizes[0]
//               );
//             }}
//           >
//             {key.charAt(0).toUpperCase() + key.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Size buttons inside category */}
//       <div className="flex justify-center gap-3 mb-6 flex-wrap">
//         {category.sizes.map((s) => (
//           <button
//             key={s.label}
//             onClick={() => setSelectedSize(s)}
//             className={`px-3 py-1 rounded-md border ${
//               selectedSize.label === s.label
//                 ? "bg-brand-orange text-white border-brand-orange"
//                 : "bg-white text-brand-dark-blue border-brand-dark-blue"
//             }`}
//           >
//             {s.label}
//           </button>
//         ))}
//       </div>

//       {/* Image and description */}
//       <div className="flex flex-col items-center lg:flex-row gap-8">
//         <Image
//           src={selectedSize.image}
//           alt={selectedSize.label}
//           width={400}
//           height={300}
//           className="rounded-2xl shadow-lg"
//         />

//         <div className="max-w-lg text-left">
//           <h3 className="text-2xl font-semibold mb-2">
//             {selectedCategory.charAt(0).toUpperCase() +
//               selectedCategory.slice(1)}{" "}
//             Unit ({selectedSize.label})
//           </h3>
//           <p>{category.description}</p>
//         </div>
//       </div>
//     </section>
//   );
// }




// "use client";
// import { useState } from "react";
// import Image from "next/image";

// export default function StorageUnitSizes() {
//   const storageData = {
//     small: {
//       title: "Small",
//       sizes: [
//         { label: "3 x 5", image: "/images/storage-small-3x5.jpg" },
//         { label: "5 x 5", image: "/images/storage-small-5x5.jpg" },
//         { label: "5 x 10", image: "/images/storage-small-5x10.jpg" },
//       ],
//       description:
//         "About the size of a hall closet or small walk-in closet, these storage units are great for clearing out a little extra space at home. Common uses include storing seasonal decorations, yard tools, kids’ clothing and toys, or serving as summer storage for college students.",
//     },
//     medium: {
//       title: "Medium",
//       sizes: [
//         { label: "6 x 10", image: "/images/storage-medium-6x10.jpg" },
//         { label: "10 x 10", image: "/images/storage-medium-10x10.jpg" },
//       ],
//       description:
//         "About the size of a small bedroom or large walk-in closet, medium storage units are great for storing the contents of a one-bedroom apartment. Common uses include holding furniture like a bed, sofa, and dining set, storing boxes of household items, or keeping things organized during a move or home renovation.",
//     },
//     large: {
//       title: "Large",
//       sizes: [
//         { label: "10 x 15", image: "/images/storage-large-10x15.jpg" },
//         { label: "10 x 20", image: "/images/storage-large-10x20.jpg" },
//       ],
//       description:
//         "About the size of a standard one-car garage, large storage units are perfect for storing the contents of a two- to three-bedroom home. They can hold big items like living room furniture, multiple mattresses, kitchen appliances, and dozens of boxes—ideal for moving, remodeling, or business storage needs.",
//     },
//   };

//   const [selectedCategory, setSelectedCategory] = useState<
//     "small" | "medium" | "large"
//   >("small");
//   const [selectedSize, setSelectedSize] = useState(
//     storageData.small.sizes[0]
//   );

//   const category = storageData[selectedCategory];

//   return (
//     <section className="bg-[#f7f8fc] py-16 px-6 lg:px-20">
//       <h2 className="text-center text-brand-dark-blue text-4xl font-bold mb-4 capitalize">
//         Storage unit sizes
//       </h2>
//       <hr className="h-[3px] w-[50px] mx-auto bg-brand-orange border-0 mb-10" />

//       {/* Category Tabs */}
//       <div className="flex justify-center border-b border-gray-300 mb-8">
//         {Object.keys(storageData).map((key) => (
//           <button
//             key={key}
//             onClick={() => {
//               setSelectedCategory(key as "small" | "medium" | "large");
//               setSelectedSize(
//                 storageData[key as "small" | "medium" | "large"].sizes[0]
//               );
//             }}
//             className={`mx-6 pb-2 text-lg font-semibold transition-all ${
//               selectedCategory === key
//                 ? "text-brand-dark-blue border-b-4 border-brand-dark-blue"
//                 : "text-gray-500 hover:text-brand-dark-blue"
//             }`}
//           >
//             {storageData[key as "small" | "medium" | "large"].title}
//           </button>
//         ))}
//       </div>

//       {/* Layout */}
//       <div className="flex flex-col lg:flex-row items-center gap-10">
//         {/* Image */}
//         <div className="w-full lg:w-1/2 flex justify-center">
//           <Image
//             src={selectedSize.image}
//             alt={selectedSize.label}
//             width={600}
//             height={400}
//             className="rounded-2xl shadow-lg"
//           />
//         </div>

//         {/* Text Section */}
//         <div className="w-full lg:w-1/2">
//           <h4 className="text-sm font-bold text-gray-600 tracking-wide mb-2 uppercase">
//             Common Sizes
//           </h4>
//           <div className="flex flex-wrap gap-3 mb-6">
//             {category.sizes.map((s) => (
//               <button
//                 key={s.label}
//                 onClick={() => setSelectedSize(s)}
//                 className={`px-5 py-2 rounded-full border font-semibold transition-all ${
//                   selectedSize.label === s.label
//                     ? "bg-brand-dark-blue text-white border-brand-dark-blue"
//                     : "text-brand-dark-blue border-brand-dark-blue bg-transparent hover:bg-brand-dark-blue hover:text-white"
//                 }`}
//               >
//                 {s.label}
//               </button>
//             ))}
//           </div>

//           <p className="text-gray-700 leading-relaxed text-base">
//             {category.description}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }




import { useState } from "react";
import Image from "next/image";

// Using your provided data structure
const storageData = {
  small: {
    sizes: [
      { label: "3 x 5", image: "/images/storage-small-3x5.jpg" },
      { label: "5 x 5", image: "/images/storage-small-5x5.jpg" },
      { label: "5 x 10", image: "/images/storage-small-5x10.jpg" },
    ],
    description:
      "About the size of a hall closet or small walk-in closet, these storage units are great for clearing out a little extra space at home. Common uses include storing seasonal decorations, yard tools, kids’ clothing and toys, or serving as summer storage for college students.",
  },
  medium: {
    sizes: [
      { label: "6 x 10", image: "/images/storage-medium-6x10.jpg" },
      { label: "10 x 10", image: "/images/storage-medium-10x10.jpg" },
    ],
    description:
      "About the size of a small bedroom or large walk-in closet, medium storage units are great for storing the contents of a one-bedroom apartment. Common uses include holding furniture like a bed, sofa, and dining set, storing boxes of household items, or keeping things organized during a move or home renovation.",
  },
  large: {
    sizes: [
      { label: "10 x 15", image: "/images/storage-large-10x15.jpg" },
      { label: "10 x 20", image: "/images/storage-large-10x20.jpg" },
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
          <h2 className="text-center text-blue-900 text-3xl lg:text-5xl font-bold mb-6">
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
              {/* Support Button (Positioned absolutely in the bottom-left corner of the image) */}
              <button className="absolute bottom-4 left-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-10 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.54 0 1.054.18 1.458.528A3 3 0 0112 12m0 0l-1.5 1.5M12 12l-1.5-1.5M12 12l1.5-1.5m-3 0l3 3m-3 0l-3-3m3 3l3-3m0 6l-3-3m3 3l-3 3m0-6l-3 3m-3-3l3 3m0 0l3 3m0-6l-3-3m3 0l-3 3"></path></svg>
                Support
              </button>
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