"use client";

import React, { useEffect, useRef } from "react";
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
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();

  // Build user initials
  const userInitials = user
    ? `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase()
    : "";

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = "flex items-center border-b-2 border-transparent hover:text-gray-300 focus:text-gray-300 hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring transition-colors duration-200";

  const handleReserveNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth/signin");
    } else {
      router.push("/search");
    }
  };

  useEffect(() => {
    setIsLocationsModalOpen(false);
    setIsProfileOpen(false);
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
              <button
                onClick={handleReserveNow}
                className="font-bold inline-flex text-center items-center hover:cursor-pointer bg-[#D96541] text-white rounded-full text-xs lg:text-xs xl:text-base truncate py-3.5 px-6"
              >
                Reserve Now
              </button>
            </div>

            {/* User Avatar / Sign In */}
            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white font-bold text-sm transition-all duration-200 hover:scale-105 cursor-pointer"
                  aria-label="User menu"
                  id="user-avatar-btn"
                >
                  {userInitials}
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                    {isAdmin() && (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors border-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/bookings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors border-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      My Bookings
                    </Link>
                    <Link
                      href="/invoices"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors border-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                      My Invoices
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        router.push("/");
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="font-bold inline-flex text-center items-center bg-white/10 hover:bg-white/20 text-white rounded-full text-sm py-2.5 px-5 border border-white/20 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
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

          {/* User Info (Mobile) */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-[#F0F4FF] border border-[#DCE4FF]">
              <div className="w-12 h-12 rounded-full bg-[#1642F0] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900 truncate">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-neutral-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

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

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  router.push("/");
                }}
                className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-red-50 text-red-600 font-bold border border-red-100 hover:bg-red-100 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-neutral-100 text-neutral-900 font-bold border border-neutral-200 hover:bg-neutral-200 transition-all"
              >
                Sign In
              </Link>
            )}

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
