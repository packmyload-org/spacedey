"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { toLocationSlug } from "@/lib/utils/locationSeo";

type FeaturedLocation = {
  city: string;
  image: string;
};

const FEATURED_LOCATIONS: FeaturedLocation[] = [
  { city: "Lagos", image: "/images/Lagos.jpg" },
  { city: "Abuja", image: "/images/Abuja.jpeg" },
  { city: "Kano", image: "/images/Kano.png" },
  { city: "Ibadan", image: "/images/Ibadan.jpg" },
];

function getVisibleSlides(width: number) {
  if (width < 768) {
    return 1;
  }

  if (width < 1200) {
    return 2;
  }

  return 3;
}

export default function FeatureList() {
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, FEATURED_LOCATIONS.length - visibleSlides);

  useEffect(() => {
    setCurrentIndex((previousIndex) => Math.min(previousIndex, maxIndex));
  }, [maxIndex]);

  const translatePercentage = currentIndex * (100 / visibleSlides);

  return (
    <section className="bg-white px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative text-[#1642F0] hover:text-[#0F2FB4]">
          <FadeIn direction="up" className="text-center">
            <Link
              href="/locations"
              className="inline-flex items-center justify-center px-6 py-3 text-xl font-black  transition-colors "
            >
              Explore All Locations
            </Link>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#D96541]" />
          </FadeIn>

          <div className="mt-6 flex justify-center gap-3 md:absolute md:right-0 md:top-1/2 md:mt-0 md:-translate-y-1/2">
            <button
              type="button"
              onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
              disabled={currentIndex === 0}
              aria-label="Show previous locations"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E6EAF5] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.10)] transition hover:-translate-y-0.5 text-[#1642F0] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((value) => Math.min(maxIndex, value + 1))}
              disabled={currentIndex >= maxIndex}
              aria-label="Show next locations"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E6EAF5] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.10)] transition hover:-translate-y-0.5 text-[#1642F0] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${translatePercentage}%)` }}
          >
            {FEATURED_LOCATIONS.map((location) => (
              <article
                key={location.city}
                style={{ width: `${100 / visibleSlides}%` }}
                className="shrink-0 px-3"
              >
                <div className="flex h-full flex-col rounded-[30px] border border-[#EFF3FB] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)]">
                  <div className="relative h-48 overflow-hidden rounded-[22px] sm:h-52">
                    <Image
                      src={location.image}
                      alt={`Storage in ${location.city}`}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col pt-5 hover:text-white text-[#355EFA]">
                    <h4 className="text-xl font-bold tracking-[-0.01em] text-[#16316B]">
                      Storage in {location.city}
                    </h4>

                    <Link
                      href={`/search?city=${toLocationSlug(location.city)}`}
                      className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#5B7BFF] px-6 py-3 text-base font-bold  transition hover:bg-[#355EFA]"
                    >  
                    View All Facilities
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
