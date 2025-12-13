// components/ExploreLocationsModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { getAvailableCities } from '@/lib/cities';

interface ExploreLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExploreLocationsModal({
  isOpen,
  onClose,
}: ExploreLocationsModalProps) {
  const router = useRouter();
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const availableCities = getAvailableCities();

  if (!isOpen) return null;

  const handleLocationClick = (cityName: string) => {
    router.push(`/search?city=${encodeURIComponent(cityName)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex max-h-[90vh]">
        {/* Left Side - Location List */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-blue-600 mb-2">
              Explore Locations
            </h2>
          </div>

          {/* Location List */}
          <div className="space-y-1">
            {availableCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleLocationClick(city.name)}
                onMouseEnter={() => setHoveredLocation(city.name)}
                onMouseLeave={() => setHoveredLocation(null)}
                className="w-full flex items-center justify-between px-6 py-5 text-left border-b border-gray-200 hover:bg-gray-50 transition-colors group"
              >
                <span className="text-lg text-blue-600 font-medium group-hover:text-blue-700">
                  {city.name}
                </span>
                <ChevronRight 
                  className={`w-5 h-5 text-red-500 transition-transform ${
                    hoveredLocation === city.name ? 'translate-x-1' : ''
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/images/LocationHero.jpg"
            alt="Storage facility"
            fill
            className="object-cover"
          />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Close Button for Mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}