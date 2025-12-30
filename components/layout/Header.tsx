"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ExploreLocationsModal from "@/components/locations/ExploreLocationsModal";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [isLocationsModalOpen, setIsLocationsModalOpen] = React.useState(false);
  const pathname = usePathname();

  // Close modal when pathname changes (user navigates)
  useEffect(() => {
    setIsLocationsModalOpen(false);
  }, [pathname]);

  return (
    <header className="fixed w-full top-0 z-40">
      <div className="bg-[#1642F0] transition-colors duration-300 border-b-2 border-[#1642F0]">
        <div className="flex flex-row px-3 lg:px-10 items-center justify-between h-20">
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

          {/* Logo */}
          <div className="flex items-center justify-start h-20 z-10">
            <Link href="/">
              <Image 
                src="/images/logo.png" 
                alt="Spacedey Logo" 
                width={107} 
                height={28} 
                className="rounded-xl" 
                priority 
              />
              {/* <div className="flex items-center gap-1">
                <Image 
                  src="/images/logo.png" 
                  alt="S" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
                <span className="text-2xl text-white font-bold">pacedey</span>
              </div> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="space-x-10 hidden lg:flex mx-6 font-bold">
            <Link 
              href="/search" 
              className="text-white flex items-center border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring"
            >
              Search
            </Link>
            <button 
              onClick={() => setIsLocationsModalOpen(true)}
              className="text-white flex items-center border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring"
            >
              Locations
            </button>
            <Link 
              href="/sizing" 
              className="text-white flex items-center border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring"
            >
              Sizing
            </Link>
            <Link 
              href="/landlord" 
              className="text-white flex items-center border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring"
            >
              Landlord
            </Link>
            <Link 
              href="/products" 
              className="text-white flex items-center border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring"
            >
              Products
            </Link>
            <Link 
              href="/blog" 
              className="text-white flex items-center border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring"
            >
              Blog
            </Link>
            <Link 
              href="/referral" 
              className="text-white flex items-center border-b-2 border-transparent hover:border-gray-300 focus:border-gray-300 py-1 focus:outline-none focus:ring"
            >
              Refer a Friend
            </Link>
            <a 
              href="tel:09166680777" 
              className="flex items-center"
            >
              <p className="text-white font-bold  text-sm xl:text-base">
                09166680777
              </p>
            </a>
            <Link 
                href="/login" 
                className="font-bold inline-flex text-center items-center hover:cursor-pointer text-white text-xs lg:text-xs xl:text-base py-1.5 "
              >
                Log in
              </Link>
          </nav>

          {/* Desktop Right Side Actions */}
          <div className="hidden lg:flex items-center justify-end lg:gap-6">
           
            <div className="hidden lg:flex items-start justify-end">
             
            </div>
            <div className="hidden lg:flex items-start justify-end">
              <Link 
                href="/search" 
                className="font-bold inline-flex text-center items-center hover:cursor-pointer bg-[#D96541] text-white rounded-full  text-xs lg:text-xs xl:text-base truncate py-3.5 px-6"
              >
                Reserve Now
              </Link>
            </div>
          </div>

          {/* Mobile Right Side Actions */}
          <div className="flex flex-row gap-4 lg:hidden">
            <a 
              href="tel:09166680777" 
              className="flex flex-row items-center" 
              title="Support"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" className="my-auto text-white">
                <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-sm border-t border-neutral-200 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col py-6 px-3">
          <div className="flex items-center justify-between">
            <div className="w-32 h-8  rounded-md" aria-label="Logo">
              <Image
                src="/images/SpacedeyLogo.png"
                alt="Spacedey Logo"
                width={128}
                height={32}
                style={{ width: 'auto' }}
                className="object-contain h-full"
                priority
              />
            </div>
            <button
              className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-neutral-300"
              aria-label="Close Menu"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <div className="relative w-5 h-5">
                <span className="absolute inset-0 block h-0.5 w-5 bg-neutral-900 rotate-45 top-2.5"></span>
                <span className="absolute inset-0 block h-0.5 w-5 bg-neutral-900 -rotate-45 top-2.5"></span>
              </div>
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-5 text-lg text-neutral-800">
            <Link href="/search" onClick={() => setOpen(false)} className="hover:text-neutral-900">Search</Link>
            <button onClick={() => { setIsLocationsModalOpen(true); setOpen(false); }} className="text-left hover:text-neutral-900">Locations</button>
            <Link href="/sizing" onClick={() => setOpen(false)} className="hover:text-neutral-900">Sizing</Link>
            <Link href="/landlord" onClick={() => setOpen(false)} className="hover:text-neutral-900">Landlord</Link>
            <Link href="/products" onClick={() => setOpen(false)} className="hover:text-neutral-900">Products</Link>
            <Link href="/blog" onClick={() => setOpen(false)} className="hover:text-neutral-900">Blog</Link>
            <Link href="/refer" onClick={() => setOpen(false)} className="hover:text-neutral-900">Refer a Friend</Link>
            <Link href="/login" onClick={() => setOpen(false)} className="hover:text-neutral-900">Log in</Link>
          </nav>

          <div className="mt-auto pt-6">
            <Link href="/search" onClick={() => setOpen(false)}>
              <PrimaryButton className="w-full py-3 bg-white text-[#1642F0]">Reserve Now</PrimaryButton>
            </Link>
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