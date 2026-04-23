"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface ConsentCategories {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentCategories>({
    necessary: true, // Always true
    preferences: false,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    setIsMounted(true);
    const storedConsent = localStorage.getItem("cookieConsent");
    
    if (!storedConsent) {
      setIsVisible(true);
    } else {
      const parsed = JSON.parse(storedConsent);
      setConsent(parsed);
    }
  }, []);

  const updateGTMConsent = (categories: ConsentCategories) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_personalization: categories.marketing ? "granted" : "denied",
        ad_storage: categories.marketing ? "granted" : "denied",
        ad_user_data: categories.marketing ? "granted" : "denied",
        analytics_storage: categories.statistics ? "granted" : "denied",
        functionality_storage: categories.preferences ? "granted" : "denied",
        personalization_storage: categories.preferences ? "granted" : "denied",
        security_storage: "granted", // Always granted
      });
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: ConsentCategories = {
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
    };
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const minimalConsent: ConsentCategories = {
      necessary: true,
      preferences: false,
      statistics: false,
      marketing: false,
    };
    saveConsent(minimalConsent);
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
  };

  const saveConsent = (categories: ConsentCategories) => {
    localStorage.setItem("cookieConsent", JSON.stringify(categories));
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
    
    // Trigger custom event for third-party scripts
    window.dispatchEvent(
      new CustomEvent("cookieConsentUpdated", { detail: categories })
    );

    // Update GTM consent
    updateGTMConsent(categories);

    setConsent(categories);
    setIsVisible(false);
    setShowDetails(false);
  };

  const toggleCategory = (category: keyof ConsentCategories) => {
    if (category === "necessary") return; // Necessary cannot be toggled
    setConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 sm:left-6 sm:right-6 md:bottom-6 md:left-auto md:right-6 md:max-w-md">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Cookie Settings</h2>
            <p className="text-xs text-gray-500 mt-1">
              Your privacy matters to us
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          We use cookies to enhance your browsing experience, analyze site
          traffic, and personalize content. By clicking "Accept," you consent
          to our use of cookies for all purposes.
        </p>

        {/* Cookie Categories Detailed View */}
        {showDetails ? (
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {/* Necessary */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="w-5 h-5 mt-0.5 cursor-not-allowed accent-[#0d1d73]"
                aria-label="Necessary cookies"
                name="necessary"
                id="necessary"
              />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900" htmlFor="necessary">
                  Necessary
                </label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Essential for site functionality and security.
                </p>
              </div>
            </div>

            {/* Preferences */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={consent.preferences}
                onChange={() => toggleCategory("preferences")}
                className="w-5 h-5 mt-0.5 cursor-pointer accent-[#0d1d73]"
                aria-label="Preferences cookies"
                name="preferences"
                id="preferences"
              />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900" htmlFor="preferences">
                  Preferences
                </label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Remember your settings and preferences.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={consent.statistics}
                onChange={() => toggleCategory("statistics")}
                className="w-5 h-5 mt-0.5 cursor-pointer accent-[#0d1d73]"
                aria-label="Statistics cookies"
                name="statistics"
                id="statistics"
              />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900" htmlFor="statistics">
                  Statistics
                </label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Help us understand how you use our site.
                </p>
              </div>
            </div>

            {/* Marketing */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={consent.marketing}
                onChange={() => toggleCategory("marketing")}
                className="w-5 h-5 mt-0.5 cursor-pointer accent-[#0d1d73]"
                aria-label="Marketing cookies"
                name="marketing"
                id="marketing"
              />
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900" htmlFor="marketing">
                  Marketing
                </label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Personalized ads and marketing campaigns.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-[#0d1d73] hover:underline mb-4 font-medium transition-colors"
        >
          {showDetails ? "Hide details" : "Show details"}
        </button>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {showDetails ? (
            <>
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#0d1d73] hover:bg-blue-900 rounded-lg transition-colors"
              >
                Save Preferences
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#0d1d73] hover:bg-blue-900 rounded-lg transition-colors"
              >
                Accept All
              </button>
            </>
          )}
        </div>

        {/* Legal Links */}
        <div className="flex gap-4 justify-center mt-4 text-xs">
          <a
            href="/privacy-policy"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="/cookie-policy"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  );
}