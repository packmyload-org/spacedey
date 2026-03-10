"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import SupportModal from "@/components/ui/SupportModal";
import ExploreLocationsModal from "@/components/locations/ExploreLocationsModal";

export default function Footer() {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false);
  const footerLinkClass = "text-white transition-colors hover:text-gray-300";

  const handleSupportClick = () => {
    try {
      // Try to open Zendesk if available
      if (window.__zendeskAvailable || typeof window.zE === "function") {
        window.openZendesk?.();
      } else {
        // Fallback to modal if Zendesk is not available
        setIsSupportModalOpen(true);
      }
    } catch (e) {
      console.error("Support widget error:", e);
      // Show fallback modal on error
      setIsSupportModalOpen(true);
    }
  };

  return (
    <>
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
      <ExploreLocationsModal
        isOpen={isLocationsModalOpen}
        onClose={() => setIsLocationsModalOpen(false)}
      />
      <footer className="bg-[#0d1d73] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-start sm:justify-center lg:justify-center gap-12">
          <div className="w-full md:w-1/5 text-left">
            {/* <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-md"><img src="/images/spacelg.jpg
            " alt="" /></div>
            <span className="text-2xl font-bold">spacedey</span>
          </div> */}
            <div>
              <Link href="/" aria-label="Logo">
                <Image
                  src="/images/logo.png"
                  alt="Spacedey Logo"
                  width={107}
                  height={28}
                  style={{ height: 'auto' }}
                  className="rounded-xl"
                  priority
                />
              </Link>
            </div>

            <h3 className="uppercase font-bold text-sm mb-3 text-white">
              Reach Out To Us
            </h3>
            <p className="mb-2 text-white">09166680777</p>
            <p className="mb-4 text-white">info@spacedey.com</p>
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
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => setIsLocationsModalOpen(true)}
                  className={footerLinkClass}
                >
                  Locations
                </button>
              </li>
              <li>
                <Link href="/sizing" className={footerLinkClass}>
                  Sizing
                </Link>
              </li>
              <li>
                <Link href="/sizing" className={footerLinkClass}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/search" className={footerLinkClass}>
                  Self-storage near me
                </Link>
              </li>
              <li>
                <Link href="/blog" className={footerLinkClass}>
                  News
                </Link>
              </li>
              <li>
                <Link href="/referral" className={footerLinkClass}>
                  Refer a Friend
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/5 text-left">
            <ul className="space-y-3">
              <li>
                {/* <Link href="/landlord" className="hover:text-gray-300">
                  Landlord
                </Link> */}
              </li>
              <li>
                <Link href="/products" className={footerLinkClass}>
                  Perks
                </Link>
              </li>
              <li>
                <Link href="/products" className={footerLinkClass}>
                  Products
                </Link>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="border-1 border-[#e65c3a] w-12 mx-auto"></div> */}
        <div className="w-12 h-[2px] bg-[#e65c3a] mb-6 mx-auto"></div>
        <div className="text-center text-sm py-6">
          Copyright © {new Date().getFullYear()} Packmyload Inc. All rights
          reserved.
        </div>
        <button
          onClick={handleSupportClick}
          className="fixed bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">
            ?
          </span>
          Support
        </button>
      </footer>
    </>
  );
}
