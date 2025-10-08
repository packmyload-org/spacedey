import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d1d73] text-white ">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-md"></div>
            <span className="text-2xl font-bold">stuf</span>
          </div>
          <h3 className="uppercase font-bold text-sm mb-3">Reach Out To Us</h3>
          <p className="mb-2">(833) 380-7883</p>
          <p className="mb-4">info@stufstorage.com</p>
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
            <li><a href="#" className="hover:text-gray-300">Locations</a></li>
            <li><a href="#" className="hover:text-gray-300">Sizing</a></li>
            <li><a href="#" className="hover:text-gray-300">FAQ</a></li>
            <li><a href="#" className="hover:text-gray-300">Self-storage near me</a></li>
            <li><a href="#" className="hover:text-gray-300">News</a></li>
            <li><a href="#" className="hover:text-gray-300">Refer a Friend</a></li>
          </ul>
        </div>

        <div>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-gray-300">Landlord</a></li>
            <li><a href="#" className="hover:text-gray-300">Perks</a></li>
            <li><a href="#" className="hover:text-gray-300">Products</a></li>
            <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gray-300">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#e65c3a] w-24 mx-auto"></div>
      <div className="text-center text-sm py-6">
        Copyright © {new Date().getFullYear()} Stuf Inc. All rights reserved.
      </div>
    </footer>
  );
}


