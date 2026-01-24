// "use client";

// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// type Location = {
//   city: string;
//   image: string;
// };

// const LOCATIONS: Location[] = [
//   { city: "Lagos", image: "/images/Lagos.jpg" },
//   { city: "Abuja", image: "/images/Abuja.jpeg" },
//   { city: "Kano", image: "/images/Kano.png" },
//   { city: "Ibadan", image: "/images/Ibadan.jpg" },
//   { city: "Port Harcourt", image: "/images/ph.jpg" }, 
// ];

// export default function FeatureList() {
//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = React.useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % Math.max(1, LOCATIONS.length - 2));
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + Math.max(1, LOCATIONS.length - 2)) % Math.max(1, LOCATIONS.length - 2));
//   };

//   const handleViewFacilities = (city: string) => {
//     router.push(`/search?city=${encodeURIComponent(city)}`);
//   };

//   return (
//     <section className="py-16 px-4 bg-white">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-center mb-12">
//           <div className="text-center">
//             {/* <h2 className="text-4xl lg:text-4xl font-bold text-[#0A1E5E] inline-block">Discover Our Locations</h2> */}
//             <Link href="/locations">
//               <button className="text-center text-xl p-3 font-bold mt-  pt-5 text-[#1642F0] hover:bg-[#f0f1f6]  rounded-3xl">Explore All Locations</button>
//             </Link>
//             <div className="w-16 h-1 bg-[#D96541] mx-auto mt-3" />
//           </div>
//         </div>

//         <div className="relative overflow-hidden">
//           <div className="p-0">
//             <div
//               className="flex transition-transform duration-500 ease-in-out"
//               style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
//             >
//               {LOCATIONS.map((location, idx) => (
//                 <div key={idx} className="w-full sm:w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
//                   <div className="bg-white p-0 rounded-3xl shadow-lg overflow-hidden h-full border border-gray-50">
//                       <div className="relative overflow-hidden mb-0">
//                       <Image
//                         src={location.image}
//                         alt={`${location.city} skyline`}
//                         width={600}
//                         height={256}
//                         style={{ height: '16rem', width: '100%' }}
//                         className="object-cover rounded-t-3xl w-full"
//                       />
//                     </div>
//                     <div className="items-center p-5">
//                       <h3 className="text-xl font-bold text-[#0A1E5E] ">Storage in {location.city}</h3>
//                       <button 
//                         onClick={() => handleViewFacilities(location.city)}
//                         className="w-full my-8 py-2 px-4 border  border-[#1642F0] text-[#2B5CE7] rounded-full font-semibold hover:bg-[#2B5CE7] hover:text-white transition-colors text-base"
//                       >
//                         View All Facilities
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-center items-center gap-3 mt-8">
//           <button
//             onClick={prevSlide}
//             className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
//             aria-label="Previous locations"
//           >
//             <ChevronLeft className="w-6 h-6 text-gray-600" />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
//             aria-label="Next locations"
//           >
//             <ChevronRight className="w-6 h-6 text-gray-600" />
//           </button>
//         </div>
//       </div>
//       {/* <div className="text-center text-xl font-bold mt-5  pt-5 text-[#1642F0] bg-[#FF00FF]">Explore All Locations</div> */}
//     </section>
//   );
// }




// "use client";

// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// type Location = {
//   city: string;
//   image: string;
// };

// const LOCATIONS: Location[] = [
//   { city: "Lagos", image: "/images/Lagos.jpg" },
//   { city: "Abuja", image: "/images/Abuja.jpeg" },
//   { city: "Kano", image: "/images/Kano.png" },
//   { city: "Ibadan", image: "/images/Ibadan.jpg" },
//   { city: "Port Harcourt", image: "/images/ph.jpg" }, 
// ];

// const VISIBLE_SLIDES = 3;

// export default function FeatureList() {
//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = React.useState(0);
//   const [isAutoPlay, setIsAutoPlay] = React.useState(true);

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % LOCATIONS.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + LOCATIONS.length) % LOCATIONS.length);
//   };

//   // Auto-slide effect - continuous infinite sliding
//   React.useEffect(() => {
//     if (!isAutoPlay) return;

//     const interval = setInterval(() => {
//       nextSlide();
//     }, 4000); // Change slide every 4 seconds

//     return () => clearInterval(interval);
//   }, [isAutoPlay, currentIndex]);

//   const handleViewFacilities = (city: string) => {
//     router.push(`/search?city=${encodeURIComponent(city)}`);
//   };

//   return (
//     <section 
//       className="py-16 px-4 bg-white"
//       onMouseEnter={() => setIsAutoPlay(false)}
//       onMouseLeave={() => setIsAutoPlay(true)}
//     >
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-center mb-12">
//           <div className="text-center">
//             <Link href="/locations">
//               <button className="text-center text-xl p-3 font-bold pt-5 text-[#1642F0] hover:bg-[#f0f1f6] rounded-3xl">Explore All Locations</button>
//             </Link>
//             <div className="w-16 h-1 bg-[#D96541] mx-auto mt-3" />
//           </div>
//         </div>

//         <div className="relative overflow-hidden">
//           <div className="p-0">
//             <div
//               className="flex transition-transform duration-500 ease-in-out"
//               style={{ 
//                 transform: `translateX(-${(currentIndex * 100) / VISIBLE_SLIDES}%)`,
//               }}
//             >
//               {LOCATIONS.map((location, idx) => (
//                 <div key={idx} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
//                   <div className="bg-white p-0 rounded-3xl shadow-lg overflow-hidden h-full border border-gray-50">
//                     <div className="relative overflow-hidden mb-0">
//                       <Image
//                         src={location.image}
//                         alt={`${location.city} skyline`}
//                         width={600}
//                         height={256}
//                         style={{ height: '16rem', width: '100%' }}
//                         className="object-cover rounded-t-3xl w-full"
//                       />
//                     </div>
//                     <div className="items-center p-5">
//                       <h3 className="text-xl font-bold text-[#0A1E5E]">Storage in {location.city}</h3>
//                       <button 
//                         onClick={() => handleViewFacilities(location.city)}
//                         className="w-full my-8 py-2 px-4 border border-[#1642F0] text-[#2B5CE7] rounded-full font-semibold hover:bg-[#2B5CE7] hover:text-white transition-colors text-base"
//                       >
//                         View All Facilities
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-center items-center gap-3 mt-8">
//           <button
//             onClick={prevSlide}
//             className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
//             aria-label="Previous locations"
//           >
//             <ChevronLeft className="w-6 h-6 text-gray-600" />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
//             aria-label="Next locations"
//           >
//             <ChevronRight className="w-6 h-6 text-gray-600" />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }






// "use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Location = {
  city: string;
  image: string;
};

const LOCATIONS: Location[] = [
  { city: "Lagos", image: "/images/Lagos.jpg" },
  { city: "Abuja", image: "/images/Abuja.jpeg" },
  { city: "Kano", image: "/images/Kano.png" },
  { city: "Ibadan", image: "/images/Ibadan.jpg" },
  { city: "Port Harcourt", image: "/images/ph.jpg" },
];

const VISIBLE_SLIDES = 3;
const CLONE_COUNT = 3; // Clone all slides to ensure continuous sliding without blanks

export default function FeatureList() {
  const router = useRouter();
  const realLength = LOCATIONS.length;

  const extendedSlides = React.useMemo(
    () => [
      ...LOCATIONS.slice(-CLONE_COUNT),
      ...LOCATIONS,
      ...LOCATIONS.slice(0, CLONE_COUNT),
    ],
    []
  );

  const startIndex = CLONE_COUNT;
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  const [isAutoPlay, setIsAutoPlay] = React.useState(true);
  const [transitionDisabled, setTransitionDisabled] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const goToSlide = React.useCallback(
    (realIdx: number) => {
      setCurrentIndex(startIndex + ((realIdx % realLength) + realLength) % realLength);
    },
    [startIndex, realLength]
  );

  const normalizedIndex =
    ((currentIndex - startIndex) % realLength + realLength) % realLength;

  React.useEffect(() => {
    const interval = isAutoPlay
      ? setInterval(() => setCurrentIndex((prev) => prev + 1), 4000)
      : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlay]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide]);

  const handleTransitionEnd = () => {
    // jumped into appended clone after last real slide
    if (currentIndex >= startIndex + realLength) {
      setTransitionDisabled(true);
      setCurrentIndex((idx) => idx - realLength);
      requestAnimationFrame(() => requestAnimationFrame(() => setTransitionDisabled(false)));
      return;
    }
    // jumped into prepended clone before first real slide
    if (currentIndex < startIndex) {
      setTransitionDisabled(true);
      setCurrentIndex((idx) => idx + realLength);
      requestAnimationFrame(() => requestAnimationFrame(() => setTransitionDisabled(false)));
    }
  };

  const handleViewFacilities = (city: string) => {
    router.push(`/search?city=${encodeURIComponent(city)}`);
  };

  return (
    <section
      className="py-16 px-4 bg-white"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      aria-label="Featured locations carousel"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div className="text-center">
            <Link href="/locations">
              <button className="text-center text-xl p-3 font-bold pt-5 text-[#1642F0] hover:bg-[#f0f1f6] rounded-3xl">
                Explore All Locations
              </button>
            </Link>
            <div className="w-16 h-1 bg-[#D96541] mx-auto mt-3" />
          </div>
        </div>

        <div className="relative overflow-x-hidden overflow-y-visible">
          <div className="p-0">
            <div
              className={`flex ${transitionDisabled ? "transition-none" : "transition-transform duration-500 ease-in-out"}`}
              style={{
                transform: `translateX(-${(currentIndex * 100) / VISIBLE_SLIDES}%)`,
              }}
              role="region"
              aria-label="Carousel slides"
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedSlides.map((location, idx) => (
                <div
                  key={idx}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                  role="group"
                  aria-label={`${location.city} slide`}
                >
                  <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-full border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                    <div className="relative overflow-hidden mb-0">
                      <Image
                        src={location.image}
                        alt={`${location.city} skyline`}
                        width={600}
                        height={256}
                        style={{ height: "16rem", width: "100%" }}
                        className="object-cover rounded-t-3xl w-full"
                      />
                    </div>
                    <div className="items-center p-5">
                      <h3 className="text-xl font-bold text-[#0A1E5E]">Storage in {location.city}</h3>
                      <button
                        onClick={() => handleViewFacilities(location.city)}
                        className="w-full my-8 py-2 px-4 border border-[#1642F0] text-[#2B5CE7] rounded-full font-semibold hover:bg-[#2B5CE7] hover:text-white transition-colors text-base"
                      >
                        View All Facilities
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Previous locations"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Slide indicators">
            {LOCATIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${normalizedIndex === idx ? "bg-[#1642F0] w-8" : "bg-gray-300 hover:bg-gray-400"}`}
                role="tab"
                aria-selected={normalizedIndex === idx}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Next locations"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}