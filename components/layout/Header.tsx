"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ExploreLocationsModal from "@/components/locations/ExploreLocationsModal";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  Search,
  MapPin,
  Maximize,
  ShoppingBag,
  Newspaper,
  UserPlus,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  X
} from "lucide-react";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [isLocationsModalOpen, setIsLocationsModalOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const navLinkClass = "flex items-center border-b-2 border-transparent hover:text-gray-300 focus:text-gray-300 hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring transition-colors duration-200";

  const handleReserveNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth/signin");
    } else {
      router.push("/search");
    }
  };

  // Close modal when pathname changes (user navigates)
  useEffect(() => {
    setIsLocationsModalOpen(false);
  }, [pathname]);

  return (
    <header className="fixed w-full top-0 z-40">
      <div className="bg-[#1642F0] transition-colors duration-300 border-b-2 border-[#1642F0]">
        <div className="flex flex-row px-3 lg:px-10 items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center justify-start z-10">
            <Link href="/">
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

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-white hover:cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
              </svg>
            </button>
          </div>

          <nav className="space-x-10 hidden lg:flex mx-6 font-bold">
            <Link href="/search" className={navLinkClass}>
              Search
            </Link>
            <button
              onClick={() => setIsLocationsModalOpen(true)}
              className={navLinkClass}
              style={{ color: 'white' }}
            >
              Locations
            </button>
            <Link href="/sizing" className={navLinkClass}>
              Sizing
            </Link>
            <Link href="/products" className={navLinkClass}>
              Products
            </Link>
            <Link href="/blog" className={navLinkClass}>
              Blog
            </Link>
            <Link href="/referral" className={navLinkClass}>
              Refer a Friend
            </Link>
            <a href="tel:09166680777" className={navLinkClass}>
              Call Us
            </a>
          </nav>

          {/* Desktop Right Side Actions */}
          <div className="hidden lg:flex items-center justify-end lg:gap-6">

            <div className="hidden lg:flex items-start justify-end">

            </div>
            <div className="hidden lg:flex items-start justify-end">
              <button
                onClick={handleReserveNow}
                className="font-bold inline-flex text-center items-center hover:cursor-pointer bg-[#D96541] text-white rounded-full text-xs lg:text-xs xl:text-base truncate py-3.5 px-6"
              >
                Reserve Now
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out ${open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Header in Overlay */}
          <div className="flex items-center justify-between mb-10">
            <div className="w-32">
              <Image
                src="/images/logo.png"
                alt="Spacedey Logo"
                width={107}
                height={28}
                priority
              />
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-colors"
              aria-label="Close Menu"
              onClick={() => setOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 mb-10">
            {[
              { href: "/search", label: "Search", icon: Search },
              { label: "Locations", icon: MapPin, onClick: () => { setIsLocationsModalOpen(true); setOpen(false); } },
              { href: "/sizing", label: "Sizing", icon: Maximize },
              { href: "/products", label: "Products", icon: ShoppingBag },
              { href: "/blog", label: "Blog", icon: Newspaper },
              { href: "/referral", label: "Refer a Friend", icon: UserPlus },
            ].map((item, idx) => (
              item.href ? (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 py-4 px-4 rounded-2xl hover:bg-neutral-100 active:bg-neutral-200 transition-all text-neutral-900 font-medium"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-100 shadow-sm">
                    <item.icon className="w-5 h-5 text-neutral-600" />
                  </div>
                  <span className="text-lg">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="flex items-center gap-4 py-4 px-4 rounded-2xl hover:bg-neutral-100 active:bg-neutral-200 transition-all text-neutral-900 font-medium text-left"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-50 border border-neutral-100 shadow-sm">
                    <item.icon className="w-5 h-5 text-neutral-600" />
                  </div>
                  <span className="text-lg">{item.label}</span>
                </button>
              )
            ))}
          </nav>

          {/* Call Us & Actions */}
          <div className="mt-auto space-y-4">
            <a
              href="tel:09166680777"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-[#F0F4FF] text-[#1642F0] font-bold border border-[#DCE4FF] hover:bg-[#1642F0] hover:text-white active:bg-[#1642F0] active:text-white focus:bg-[#1642F0] focus:text-white transition-all"
            >
              <Phone className="w-5 h-5" />
              <span>Call Us: 09166680777</span>
            </a>

            <PrimaryButton
              className="w-full py-4 text-lg shadow-lg shadow-orange-600/20 bg-[#D96541] border-[#D96541] hover:bg-[#c45a3a]"
              onClick={(e) => {
                setOpen(false);
                handleReserveNow(e);
              }}
            >
              Reserve Now
            </PrimaryButton>

            {/* Social Links */}
            <div className="flex justify-center gap-6 pt-8 pb-4">
              <a href="https://web.facebook.com/spacedeyng/?_rdc=1&_rdr#" target="_blank" className="p-3 rounded-full bg-neutral-50 text-neutral-400 hover:text-blue-600 transition-colors border border-neutral-100">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/spacedey.ng/" target="_blank" className="p-3 rounded-full bg-neutral-50 text-neutral-400 hover:text-pink-600 transition-colors border border-neutral-100">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://x.com/spacedeyng" target="_blank" className="p-3 rounded-full bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-colors border border-neutral-100">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/spacedey/?originalSubdomain=ng" target="_blank" className="p-3 rounded-full bg-neutral-50 text-neutral-400 hover:text-blue-700 transition-colors border border-neutral-100">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Modal */}
      <ExploreLocationsModal
        isOpen={isLocationsModalOpen}
        onClose={() => setIsLocationsModalOpen(false)}
      />
    </header>
  );
}
