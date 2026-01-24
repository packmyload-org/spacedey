import React from 'react';

interface MapComingSoonProps {
  city: string;
}

export const MapComingSoon: React.FC<MapComingSoonProps> = ({ city }) => {
  return (
    <>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 z-20" />
      <div className="absolute inset-0 h-full w-full flex items-center justify-center z-20 p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm mx-auto">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon!</h2>
          <p className="text-gray-700 mb-6">
            <span className="font-semibold text-[#1642F0]">{city}</span> storage is on the way.
          </p>
          <a 
            href={`mailto:info@spacedey.com?subject=Notify me when ${city} is available`}
            className="inline-block px-6 py-2 bg-[#1642F0] text-white rounded-full text-sm font-semibold hover:bg-[#0d1d73] transition-colors"
          >
            Notify Me
          </a>
        </div>
      </div>
    </>
  );
};
