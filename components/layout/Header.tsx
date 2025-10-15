"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-[#1642F0] backdrop-blur border-b border-[#1642F0]">
      <div className="container-px">
        <div className="flex items-center justify-between h-16 lg:h-16">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-32 h-8 bg-neutral-200 rounded-md" aria-label="Logo">
              <Image src="/images/SpacedeyLogo1.jpg" alt="Spacedey Logo" width={228} height={52} className="object-contain w-full h-full" priority />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 sm:gap-8 lg:gap-12 text-sm text-white">
            <Link href="/search" className="hover:text-neutral-900">Search</Link>
            <Link href="/locations" className="hover:text-neutral-900">Locations</Link>
            <Link href="/sizing" className="hover:text-neutral-900">Sizing</Link>
            <Link href="/landlord" className="hover:text-neutral-900">Landlord</Link>
            <Link href="/products" className="hover:text-neutral-900">Products</Link>
            <Link href="/blog" className="hover:text-neutral-900">Blog</Link>
            <Link href="/refer" className="hover:text-neutral-900">Refer a Friend</Link>
            <a href="tel:8333807883" className="hover:text-neutral-900">(833)380 7883</a>
            <Link href="/login" className="hover:text-neutral-900">Log in</Link>
          </nav>

          <div className="hidden md:flex lg:ml-2">
            <Link href="/locations">
              <PrimaryButton className="text-[#1642F0] bg-white">Reserve Now</PrimaryButton>
            </Link>
          </div>

          <div className="md:hidden">
            <Link href="/locations">
              <PrimaryButton className="px-4 py-2 text-sm">Reserve Now</PrimaryButton>
            </Link>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-neutral-300"
            aria-label="Open Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-neutral-900 transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}></span>
              <span className={`block h-0.5 w-6 bg-neutral-900 transition-opacity ${open ? "opacity-0" : ""}`}></span>
              <span className={`block h-0.5 w-6 bg-neutral-900 transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}></span>
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-sm border-t border-neutral-200 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="container-px h-full flex flex-col py-6">
          <div className="flex items-center justify-between">
            <div className="w-32 h-8 bg-neutral-200 rounded-md" aria-label="Logo">
              <Image src="/images/SpacedeyLogo1.jpg" alt="Spacedey Logo" width={128} height={32} className="object-contain w-full h-full" priority />
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
            <Link href="/locations" onClick={() => setOpen(false)} className="hover:text-neutral-900">Locations</Link>
            <Link href="/sizing" onClick={() => setOpen(false)} className="hover:text-neutral-900">Sizing</Link>
            <Link href="/landlord" onClick={() => setOpen(false)} className="hover:text-neutral-900">Landlord</Link>
            <Link href="/products" onClick={() => setOpen(false)} className="hover:text-neutral-900">Products</Link>
            <Link href="/blog" onClick={() => setOpen(false)} className="hover:text-neutral-900">Blog</Link>
            <Link href="/refer" onClick={() => setOpen(false)} className="hover:text-neutral-900">Refer a Friend</Link>
            <Link href="/login" onClick={() => setOpen(false)} className="hover:text-neutral-900">Log in</Link>
          </nav>

          <div className="mt-auto pt-6">
            <Link href="/locations" onClick={() => setOpen(false)}>
              <PrimaryButton className="w-full py-3 bg-white text-[#1642F0]">Reserve Now</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


