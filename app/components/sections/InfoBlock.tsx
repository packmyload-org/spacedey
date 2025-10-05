"use client";

import React from "react";
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
] as const;

const IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
] as const;

export default function InfoBlock() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        <div className="relative lg:w-[85%] bg-[#0A2472] rounded-r-full text-white px-8 lg:px-16 py-16 lg:py-20">
          <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-32">
            <svg className="absolute top-0 right-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 Q50,50 0,100 L0,0 Z" fill="#0A2472" />
            </svg>
          </div>

          <div className="relative flex flex-col justify-center z-10 max-w-2xl ml-36">
            <div className="mb-12 ">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">What Stuf members are saying</h2>
              <div className="w-12 h-1 bg-[#D96541]"></div>
            </div>

            <div className="flex-row-reverse">
              <div className="flex justify-between flex-reverse mb-8">
                <h3 className="text-2xl font-bold mb-6">{TESTIMONIALS[currentIndex].name}</h3>
                <div className="flex gap-2 mb-6">
                  {Array.from({ length: TESTIMONIALS[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-[#D96541] text-[#D96541]" />
                  ))}
                </div>
              </div>

              <p className="text-lg lg:text-xl leading-relaxed mb-6">{TESTIMONIALS[currentIndex].text}</p>
              <p className="text-base opacity-90">{TESTIMONIALS[currentIndex].source}</p>
            </div>

            <div className="flex gap-3 mt-12">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className=" p-8 lg:p-16 flex items-center justify-center min-h-full">
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src={IMAGES[0]} alt="Storage facility interior" className="w-full h-48 object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src={IMAGES[1]} alt="Stuf branded box" className="w-full h-28 object-cover" />
              </div>
            </div>

            <div className="row-span-2 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={IMAGES[2]}
                alt="Person accessing storage unit"
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


