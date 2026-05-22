"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { DEFAULT_SUPPORT_EMAIL, DEFAULT_SUPPORT_PHONE } from "@/lib/types/constants";

const SupportModal = dynamic(() => import("@/components/ui/SupportModal"), {
  loading: () => null,
  ssr: false,
});

const ExploreLocationsModal = dynamic(
  () => import("@/components/locations/ExploreLocationsModal"),
  {
    loading: () => null,
    ssr: false,
  }
);

export default function Footer() {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false);
  const footerLinkClass = "text-white transition-colors hover:text-gray-300";

  const handleSupportClick = () => {
    setIsSupportModalOpen((current) => !current);
  };

  return (
    <>
      {isSupportModalOpen ? (
        <SupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
        />
      ) : null}
      {isLocationsModalOpen ? (
        <ExploreLocationsModal
          isOpen={isLocationsModalOpen}
          onClose={() => setIsLocationsModalOpen(false)}
        />
      ) : null}
      <footer className="bg-[#0d1d73] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-start sm:justify-center lg:justify-center gap-12">
          <div className="w-full md:w-1/5 text-left">
            <h3 className="uppercase font-bold text-sm mb-3 text-white">
              Reach Out To Us
            </h3>
            <p className="mb-2 text-white">{DEFAULT_SUPPORT_PHONE}</p>
            <p className="mb-4 text-white">{DEFAULT_SUPPORT_EMAIL}</p>
            <div className="w-12 h-[2px] bg-[#e65c3a] mb-6"></div>
            <div className="flex gap-4 text-white">
              <a
                href="https://web.facebook.com/spacedeyng/?_rdc=1&_rdr#"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-6 h-6 hover:text-gray-300" />
              </a>
              <a
                href="https://www.instagram.com/spacedey.ng/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-6 h-6 hover:text-gray-300" />
              </a>
              <a
                href="https://x.com/spacedeyng"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-6 h-6 hover:text-gray-300" />
              </a>
              <a
                href="https://www.linkedin.com/company/spacedey/?originalSubdomain=ng"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-6 h-6 hover:text-gray-300" />
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/5 text-left">
            <h3 className="uppercase font-bold text-sm mb-3 text-white">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/about" className={footerLinkClass}>
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className={footerLinkClass}>
                  Services
                </a>
              </li>
              <li>
                <a href="/locations" className={footerLinkClass}>
                  Locations
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/5 text-left">
            <h3 className="uppercase font-bold text-sm mb-3 text-white">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/privacy-policy" className={footerLinkClass}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className={footerLinkClass}>
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/terms-and-conditions" className={footerLinkClass}>
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-12 h-[2px] bg-[#e65c3a] mb-6 mx-auto"></div>
        <div className="text-center text-sm py-6">
          Copyright © {new Date().getFullYear()} Packmyload Inc. All rights
          reserved.
        </div>
        <button
          onClick={handleSupportClick}
          className={`fixed bottom-6 left-4 z-[70] flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg shadow-blue-900/25 transition hover:bg-blue-700 sm:left-6 ${
            isSupportModalOpen ? 'pointer-events-none translate-y-3 opacity-0' : 'opacity-100'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">
            {isSupportModalOpen ? "×" : "?"}
          </span>
          {isSupportModalOpen ? "Close Chat" : "Chat with Spacedey"}
        </button>
      </footer>
    </>
  );
}
