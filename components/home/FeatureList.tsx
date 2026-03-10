"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { getAvailableCities } from "@/lib/utils/cities";
import { getLocationDetails } from "@/lib/utils/sampleLocations";

type Location = {
  city: string;
  image: string;
};

const DEFAULT_IMAGE = "/images/Lagos.jpg";

function buildKnownLocations(): Location[] {
  return getAvailableCities().map(({ name }) => ({
    city: name,
    image: getLocationDetails(name).image || DEFAULT_IMAGE,
  }));
}

export default function FeatureList() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [transitionDisabled, setTransitionDisabled] = useState(false);

  // 1. Fetch data
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch('/api/sites');
        const data = await res.json();
        if (data.ok && data.sites && data.sites.length > 0) {
          const uniqueCities = new Map<string, string>();
          data.sites.forEach((site: { address: string; image?: string }) => {
            const parts = site.address.split(',').map((p: string) => p.trim());
            const city = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
            if (!uniqueCities.has(city)) {
              uniqueCities.set(city, site.image || getLocationDetails(city).image || DEFAULT_IMAGE);
            }
          });

          buildKnownLocations().forEach(({ city, image }) => {
            if (!uniqueCities.has(city)) {
              uniqueCities.set(city, image);
            }
          });

          const locArray = Array.from(uniqueCities.entries()).map(([city, image]) => ({ city, image }));
          setLocations(locArray);
          setCurrentIndex(Math.min(3, locArray.length)); // Start at first real slide
        } else {
          const fallback = buildKnownLocations();
          setLocations(fallback);
          setCurrentIndex(Math.min(3, fallback.length));
        }
      } catch {
        const fallback = buildKnownLocations();
        setLocations(fallback);
        setCurrentIndex(Math.min(3, fallback.length));
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, []);

  // 2. Responsive slides
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setVisibleSlides(1);
      else if (width < 1024) setVisibleSlides(2);
      else setVisibleSlides(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. Carousel logic helpers
  const realLength = locations.length;
  const cloneCount = Math.min(3, realLength);

  const extendedSlides = useMemo(() => {
    if (realLength === 0) return [];
    return [
      ...locations.slice(-cloneCount),
      ...locations,
      ...locations.slice(0, cloneCount),
    ];
  }, [locations, cloneCount, realLength]);

  const startIndex = cloneCount;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const goToSlide = useCallback((idx: number) => {
    setCurrentIndex(startIndex + idx);
  }, [startIndex]);

  const normalizedIndex = realLength > 0 ? ((currentIndex - startIndex) % realLength + realLength) % realLength : 0;

  // 4. Autoplay and Keyboard
  useEffect(() => {
    const interval = isAutoPlay && realLength > 0
      ? setInterval(nextSlide, 4000)
      : null;
    return () => { if (interval) clearInterval(interval); };
  }, [isAutoPlay, realLength, nextSlide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide]);

  const handleTransitionEnd = () => {
    if (currentIndex >= startIndex + realLength) {
      setTransitionDisabled(true);
      setCurrentIndex(currentIndex - realLength);
      setTimeout(() => setTransitionDisabled(false), 20);
    } else if (currentIndex < startIndex) {
      setTransitionDisabled(true);
      setCurrentIndex(currentIndex + realLength);
      setTimeout(() => setTransitionDisabled(false), 20);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <section
      className="py-12 px-4 bg-white"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="max-w-7xl mx-auto">
        <FadeIn direction="up" className="text-center mb-12">
          <Link href="/locations">
            <button className="text-xl font-bold text-[#1642F0] hover:bg-blue-50 px-6 py-3 rounded-full transition-colors">
              Explore All Locations
            </button>
          </Link>
          <div className="w-16 h-1 bg-[#D96541] mx-auto mt-4" />
        </FadeIn>

        <div className="relative overflow-hidden">
          <div
            className={`flex ${transitionDisabled ? "" : "transition-transform duration-500 ease-in-out"}`}
            style={{ transform: `translateX(-${(currentIndex * 100) / visibleSlides}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((loc, idx) => (
              <div key={idx} className="w-full sm:w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all">
                  <div className="relative h-48 sm:h-56">
                    <Image src={loc.image} alt={loc.city} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Storage in {loc.city}</h3>
                    <button
                      onClick={() => router.push(`/search?city=${encodeURIComponent(loc.city)}`)}
                      className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all"
                    >
                      View All Facilities
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-10">
          <button onClick={prevSlide} className="p-3 rounded-full border border-gray-200 shadow-md hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex gap-2">
            {locations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${normalizedIndex === idx ? "bg-blue-600 w-8" : "bg-gray-200 w-2.5"}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="p-3 rounded-full border border-gray-200 shadow-md hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
