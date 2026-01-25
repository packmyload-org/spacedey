"use client";

import React from 'react';

interface SiteMapViewerProps {
  svgContent?: string;
}

export default function SiteMapViewer({ svgContent }: SiteMapViewerProps) {
  if (!svgContent) {
    return (
        <div className="text-center p-12 bg-white border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500">Facility map not available for this location.</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Map</h3>
        <div 
            className="w-full overflow-auto flex justify-center sitemap-container"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ minHeight: '400px' }}
        />
        <style jsx global>{`
            .sitemap-container svg {
                width: 100%;
                height: auto;
                max-width: 100%;
            }
            .sitemap-container .unit {
                cursor: pointer;
                transition: fill 0.2s;
            }
            .sitemap-container .unit:hover {
                fill: #EFF6FF !important; /* blue-50 */
                stroke: #2563EB !important; /* blue-600 */
                stroke-width: 2px;
            }
        `}</style>
    </div>
  );
}
