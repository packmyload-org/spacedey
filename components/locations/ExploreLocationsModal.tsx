// components/ExploreLocationsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, Loader2 } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const availableCities = getAvailableCities();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleLocationClick = async (cityName: string) => {
    if (loading) return; // Prevent multiple clicks
    
    setLoading(true);
    setSelectedCity(cityName);
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to search page
      router.push(`/search?city=${encodeURIComponent(cityName)}`);
      
      // Close modal after navigation starts
      setTimeout(() => {
        onClose();
        setLoading(false);
        setSelectedCity(null);
      }, 100);
    } catch (error) {
      console.error('Navigation error:', error);
      setLoading(false);
      setSelectedCity(null);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={loading ? undefined : onClose}
        style={{ cursor: loading ? 'wait' : 'pointer' }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex max-h-[90vh]">
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
            {availableCities.map((city) => {
              const isSelected = selectedCity === city.name;
              const isDisabled = loading && !isSelected;
              
              return (
                <button
                  key={city.name}
                  onClick={() => handleLocationClick(city.name)}
                  onMouseEnter={() => !loading && setHoveredLocation(city.name)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  disabled={loading}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left border-b border-gray-200 transition-colors group ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50 cursor-pointer'
                  } ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <span className={`text-lg font-medium ${
                    isSelected 
                      ? 'text-blue-700' 
                      : 'text-blue-600 group-hover:text-blue-700'
                  }`}>
                    {city.name}
                  </span>
                  {isSelected && loading ? (
                    <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                  ) : (
                    <ChevronRight 
                      className={`w-5 h-5 text-red-500 transition-transform ${
                        hoveredLocation === city.name && !loading ? 'translate-x-1' : ''
                      }`}
                    />
                  )}
                </button>
              );
            })}
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
            disabled={loading}
            className={`absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Close Button for Mobile */}
        <button
          onClick={onClose}
          disabled={loading}
          className={`md:hidden absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}