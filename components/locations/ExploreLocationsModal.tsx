// components/ExploreLocationsModal.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useSitesData } from '@/contexts/SitesContext';
import { LOCATION_DETAILS } from '@/lib/utils/sampleLocations';
import { getUniqueSiteStates } from '@/lib/utils/siteLocations';

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
  const { sites } = useSitesData();
  const availableStates = useMemo(() => {
    const siteStates = getUniqueSiteStates(sites);
    if (siteStates.length > 0) {
      return siteStates;
    }

    return Array.from(
      new Set(Object.values(LOCATION_DETAILS).map((location) => location.state).filter(Boolean))
    ).sort((left, right) => left.localeCompare(right));
  }, [sites]);

  if (!isOpen) return null;

  const handleLocationClick = (stateName: string) => {
    router.push(`/search?state=${encodeURIComponent(stateName)}`);
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
            {availableStates.map((state) => (
              <button
                key={state}
                onClick={() => handleLocationClick(state)}
                onMouseEnter={() => setHoveredLocation(state)}
                onMouseLeave={() => setHoveredLocation(null)}
                className="w-full flex items-center justify-between px-6 py-5 text-left border-b border-gray-200 hover:bg-gray-50 transition-colors group"
              >
                <span className="text-lg text-blue-600 font-medium group-hover:text-blue-700">
                  {state}
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-red-500 transition-transform ${hoveredLocation === state ? 'translate-x-1' : ''
                    }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/images/Nigeria.jpg"
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
