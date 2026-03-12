"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useSitesData } from "@/contexts/SitesContext";
import FadeIn from "@/components/ui/FadeIn";
import { getAvailableCities } from "@/lib/utils/cities";
import { getLocationDetails } from "@/lib/utils/sampleLocations";
import { getSiteCity } from "@/lib/utils/siteLocations";

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
  const { sites, isLoading: isSitesLoading } = useSitesData();
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [transitionDisabled, setTransitionDisabled] = useState(false);

  const locations = useMemo(() => {
    if (sites.length === 0) {
      return buildKnownLocations();
    }

    const uniqueCities = new Map<string, string>();

    sites.forEach((site) => {
      const city = getSiteCity(site);

      if (!city || uniqueCities.has(city)) {
        return;
      }

      uniqueCities.set(city, site.image || getLocationDetails(city).image || DEFAULT_IMAGE);
    });

    buildKnownLocations().forEach(({ city, image }) => {
      if (!uniqueCities.has(city)) {
        uniqueCities.set(city, image);
      }
    });

    return Array.from(uniqueCities.entries()).map(([city, image]) => ({ city, image }));
  }, [sites]);
  const loading = isSitesLoading && sites.length === 0;

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
  const safeCurrentIndex = realLength === 0
    ? 0
    : Math.min(Math.max(currentIndex, cloneCount), cloneCount + realLength - 1);

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

  const normalizedIndex = realLength > 0
    ? ((safeCurrentIndex - startIndex) % realLength + realLength) % realLength
    : 0;

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
    if (safeCurrentIndex >= startIndex + realLength) {
      setTransitionDisabled(true);
      setCurrentIndex(safeCurrentIndex - realLength);
      setTimeout(() => setTransitionDisabled(false), 20);
    } else if (safeCurrentIndex < startIndex) {
      setTransitionDisabled(true);
      setCurrentIndex(safeCurrentIndex + realLength);
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
            style={{ transform: `translateX(-${(safeCurrentIndex * 100) / visibleSlides}%)` }}
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
