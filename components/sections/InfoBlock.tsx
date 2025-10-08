// import React from "react";
import Image from "next/image";
// import ImagePlaceholder from "../../components/ui/ImagePlaceholder.jsx";
// import SectionTitle from "../../components/ui/SectionTitle.jsx";
// import PrimaryButton from "../../components/ui/PrimaryButton.jsx";

// function InfoBlock() {
//   return (
//     <section className="container-px py-20 lg:py-28">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
//         <div>
//           <ImagePlaceholder aspect="fourThree" />
//         </div>
//         <div>
//           <SectionTitle as="h2" className="mb-5">Storage made simple, but with a human touch.</SectionTitle>
//           <p className="text-neutral-600 leading-relaxed text-base sm:text-lg max-w-prose">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
//             dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
//             ex ea commodo consequat.
//           </p>
//           <div className="mt-7">
//             <PrimaryButton>Find Your Space</PrimaryButton>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default InfoBlock;

import React, { useState } from "react";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "JAYSON J.",
    rating: 5,
    text: "This place has always offered the best service to me. I get excited when i think about it!!!!",
    source: "Posted On Google",
  },
  {
    name: "SARAH M.",
    rating: 5,
    text: "Amazing storage facility! The staff is incredibly helpful and the units are always clean. Highly recommend!",
    source: "Posted On Google",
  },
  {
    name: "MIKE T.",
    rating: 5,
    text: "Best storage experience I've ever had. Easy access, great security, and reasonable prices.",
    source: "Posted On Yelp",
  },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
  // "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop"
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Left Side - Blue Curved Background with Content */}
        <div className="relative lg:w-[85%] sm:h-full bg-[#0A2472] lg:rounded-r-full text-white lg:px-16  lg:py-20">
          {/* Curved Edge */}
          <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-32">
            <svg
              className="absolute top-0 right-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0,0 Q50,50 0,100 L0,0 Z" fill="#0A2472" />
            </svg>
          </div>

          <div className="relative flex flex-col justify-center z-10 max-w-2xl p-2 m-6">
            {/* Title */}
            <div className="mb-12 ">
              <h2 className="text-3xl text-center lg:text-4xl font-bold mb-3">
                What Stuf members are saying
              </h2>
              <div className="w-12 ml-26 h-1 bg-[#D96541]"></div>
            </div>

            <div className="flex-row-reverse md:pl-16">
              {/* Testimonial Content */}
              <div className="flex justify-between flex-reverse mb-8">
                <h3 className="text-2xl font-bold mb-6">
                  {TESTIMONIALS[currentIndex].name}
                </h3>

                {/* Star Rating */}
                <div className="flex gap-2 mb-6">
                  {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8 fill-[#D96541] text-[#D96541]"
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-lg lg:text-xl leading-relaxed mb-6">
                {TESTIMONIALS[currentIndex].text}
              </p>

              {/* Source */}
              <p className="text-base opacity-90">
                {TESTIMONIALS[currentIndex].source}
              </p>
            </div>

            {/* Carousel Dots */}
            <div className="flex gap-2 mt-12 md:pl-16">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-white w-8"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className=" p-8 lg:p-16 flex sm:bg-[#0A2472] lg:bg-white items-center justify-center min-h-full">
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {/* Left Column - Two stacked images */}
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src={IMAGES[0]}
                    alt="Storage facility interior"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src={IMAGES[1]}
                    alt="Stuf branded box"
                    width={400}
                    height={112}
                    className="w-full h-28 object-cover"
                  />
              </div>
            </div>

            {/* Right Column - One tall image spanning 2 rows */}
            <div className="row-span-2 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={IMAGES[2]}
                alt="Person accessing storage unit"
                width={400}
                height={266}
                className="w-full h-full object-cover"
                style={{ minHeight: "266px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
