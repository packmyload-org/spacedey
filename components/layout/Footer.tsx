import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d1d73] text-white ">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          {/* <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-md"></div>
            <span className="text-2xl font-bold">spacedey</span>
          </div> */}
          <div>
                <Link href="/" aria-label="Logo"> 
              <Image src="/images/SpacedeyLogo.png" alt="Spacedey Logo" width={90} height={20} className=" border-1   rounded-xl" priority />
            </Link>

          </div>
         
          <h3 className="uppercase font-bold text-sm mb-3">Reach Out To Us</h3>
          <p className="mb-2">09166680777</p>
          <p className="mb-4">info@spacedey.com</p>
          <div className="w-12 h-[2px] bg-[#e65c3a] mb-6"></div>
          <div className="flex gap-4 text-white">
            <a href="#" aria-label="Facebook">
              <Facebook className="w-6 h-6 hover:text-gray-300" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="w-6 h-6 hover:text-gray-300" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="w-6 h-6 hover:text-gray-300" />
            </a>
          </div>
        </div>

        <div>
          <ul className="space-y-3">
            <li><Link href="/locations" className="hover:text-gray-300">Locations</Link></li>
            <li><Link href="/sizing" className="hover:text-gray-300">Sizing</Link></li>
            <li><Link href="/sizing" className="hover:text-gray-300">FAQ</Link></li>
            <li><Link href="/search" className="hover:text-gray-300">Self-storage near me</Link></li>
            <li><Link href="/blog" className="hover:text-gray-300">News</Link></li>
            <li><Link href="/refer" className="hover:text-gray-300">Refer a Friend</Link></li>
          </ul>
        </div>

        <div>
          <ul className="space-y-3">
            <li><Link href="/landlord" className="hover:text-gray-300">Landlord</Link></li>
            <li><Link href="/products" className="hover:text-gray-300">Perks</Link></li>
            <li><Link href="/products" className="hover:text-gray-300">Products</Link></li>
            <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gray-300">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#e65c3a] w-24 mx-auto"></div>
      <div className="text-center text-sm py-6">
        Copyright © {new Date().getFullYear()} Packmyload Inc. All rights reserved.
      </div>
      <button className="fixed bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition">
        <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">
          ?
        </span>
        Support
      </button>
    </footer>
  );
}


