"use client";

import React from "react";
import { X } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Support</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Need help? Reach out to our support team using one of the following methods:
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
            <a
              href="tel:09166680777"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              09166680777
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <a
              href="mailto:info@spacedey.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              info@spacedey.com
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
            <p className="text-gray-600">Weekend: Limited support</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
