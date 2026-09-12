"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as ConsentStore from "@/lib/consent";

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

interface ToggleProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label: string;
  description: string;
}

function Toggle({
  id,
  checked,
  disabled = false,
  onChange,
  label,
  description,
}: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label
          htmlFor={id}
          className={`text-sm font-semibold text-gray-900 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
          {label}
        </label>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={disabled ? undefined : onChange}
        disabled={disabled}
        className={[
          "relative shrink-0 h-6 w-11 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d1d73]",
          checked ? "bg-[#0d1d73]" : "bg-gray-200",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
        <span className="sr-only">{checked ? "Enabled" : "Disabled"}</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CookieConsent
// ---------------------------------------------------------------------------

export default function CookieConsent() {
  // -------------------------------------------------------------------------
  // State
  // null  = not yet hydrated (SSR guard — renders nothing)
  // true  = banner visible
  // false = banner dismissed
  // -------------------------------------------------------------------------
  const [bannerOpen, setBannerOpen] = useState<boolean | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // -------------------------------------------------------------------------
  // Refs for focus management
  // -------------------------------------------------------------------------
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------------------
  // Mount — init ConsentStore and decide banner visibility
  // -------------------------------------------------------------------------
  useEffect(() => {
    const stored = ConsentStore.init();
    if (stored) {
      setPreferences(stored.preferences);
      setStatistics(stored.statistics);
      setMarketing(stored.marketing);
      setBannerOpen(false);
    } else {
      setBannerOpen(true);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Auto-focus the primary action when the banner opens
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (bannerOpen === true) {
      firstFocusRef.current?.focus();
    }
  }, [bannerOpen]);

  // -------------------------------------------------------------------------
  // Focus trap — keeps keyboard navigation inside the dialog
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!bannerOpen || !containerRef.current) return;
    const container = containerRef.current;

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [bannerOpen]);

  // -------------------------------------------------------------------------
  // consent:reopen — any part of the app can dispatch this event to reopen
  // the banner (e.g. a "Cookie settings" link in the footer)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const openBanner = () => {
      try {
        const stored = ConsentStore.read();
        if (stored) {
          setPreferences(stored.preferences);
          setStatistics(stored.statistics);
          setMarketing(stored.marketing);
        }
      } catch {
        // Open banner anyway with whatever state we already have
      }
      setBannerOpen(true);
    };

    try {
      window.addEventListener("consent:reopen", openBanner);
    } catch {
      // Graceful no-op in very old browsers
    }

    return () => {
      try {
        window.removeEventListener("consent:reopen", openBanner);
      } catch {
        // Ignore
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // Action handlers — every path saves; no silent dismiss
  // -------------------------------------------------------------------------
  const handleAcceptAll = () => {
    ConsentStore.save({
      preferences: true,
      statistics: true,
      marketing: true,
      savedAt: Date.now(),
    });
    setBannerOpen(false);
    setPrefsOpen(false);
  };

  const handleRejectAll = () => {
    ConsentStore.save({
      preferences: false,
      statistics: false,
      marketing: false,
      savedAt: Date.now(),
    });
    setBannerOpen(false);
    setPrefsOpen(false);
  };

  const handleSavePreferences = () => {
    ConsentStore.save({
      preferences,
      statistics,
      marketing,
      savedAt: Date.now(),
    });
    setBannerOpen(false);
    setPrefsOpen(false);
  };

  // -------------------------------------------------------------------------
  // SSR guard — return nothing until hydrated
  // -------------------------------------------------------------------------
  if (bannerOpen === null) return null;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <>
      {/* --------------------------------------------------------------- */}
      {/* Banner                                                            */}
      {/* --------------------------------------------------------------- */}
      <AnimatePresence>
        {bannerOpen && (
          <motion.div
            key="consent-banner"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            ref={containerRef}
            className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <div className="mx-auto max-w-4xl px-5 py-5">
              {/* Heading */}
              <h2
                id="consent-title"
                className="text-base font-bold text-gray-900"
              >
                Cookie Settings
              </h2>

              {/* Description */}
              <p className="mt-1 text-sm text-gray-600">
                We use cookies to enhance your experience, analyse site traffic,
                and personalise content. Choose which cookies you allow below.
                See our{" "}
                <a
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="/cookie-policy"
                  className="underline underline-offset-2 hover:text-gray-900 transition-colors"
                >
                  Cookie Policy
                </a>{" "}
                for details.
              </p>

              {/* --------------------------------------------------------- */}
              {/* Preferences panel                                           */}
              {/* --------------------------------------------------------- */}
              <div className="mt-3">
                <button
                  type="button"
                  aria-expanded={prefsOpen}
                  aria-controls="consent-prefs-panel"
                  onClick={() => setPrefsOpen((v) => !v)}
                  className="text-sm font-semibold text-[#0d1d73] underline underline-offset-2 hover:text-blue-900 transition-colors"
                >
                  {prefsOpen ? "Hide preferences" : "Manage preferences"}
                </button>

                <AnimatePresence>
                  {prefsOpen && (
                    <motion.div
                      id="consent-prefs-panel"
                      key="prefs-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                        {/* Necessary — always on */}
                        <Toggle
                          id="consent-necessary"
                          checked={true}
                          disabled={true}
                          onChange={() => undefined}
                          label="Necessary"
                          description="Essential for the site to function correctly. Cannot be disabled."
                        />

                        {/* Preferences */}
                        <Toggle
                          id="consent-preferences"
                          checked={preferences}
                          onChange={() => setPreferences((v) => !v)}
                          label="Preferences"
                          description="Remember your settings and personalise your experience."
                        />

                        {/* Statistics */}
                        <Toggle
                          id="consent-statistics"
                          checked={statistics}
                          onChange={() => setStatistics((v) => !v)}
                          label="Statistics"
                          description="Help us understand how visitors use the site so we can improve it."
                        />

                        {/* Marketing */}
                        <Toggle
                          id="consent-marketing"
                          checked={marketing}
                          onChange={() => setMarketing((v) => !v)}
                          label="Marketing"
                          description="Allow personalised ads and remarketing based on your activity."
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --------------------------------------------------------- */}
              {/* Action buttons                                              */}
              {/* --------------------------------------------------------- */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Reject all
                </button>
                {prefsOpen && (
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Save preferences
                  </button>
                )}
                <button
                  ref={firstFocusRef}
                  type="button"
                  onClick={handleAcceptAll}
                  className="rounded-lg bg-[#0d1d73] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900"
                >
                  Accept all
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------- */}
      {/* Floating re-open button (FAB) — visible after banner is dismissed */}
      {/* --------------------------------------------------------------- */}
      <AnimatePresence>
        {bannerOpen === false && (
          <motion.button
            key="consent-fab"
            type="button"
            onClick={() => {
              try {
                const stored = ConsentStore.read();
                if (stored) {
                  setPreferences(stored.preferences);
                  setStatistics(stored.statistics);
                  setMarketing(stored.marketing);
                }
              } catch {
                // Open banner anyway
              }
              setBannerOpen(true);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            aria-label="Open cookie preferences"
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 shadow-lg hover:bg-gray-50 transition-colors"
          >
            {/* Cookie icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="5.5" cy="6" r="1" fill="currentColor" />
              <circle cx="9" cy="5" r="0.75" fill="currentColor" />
              <circle cx="10.5" cy="8.5" r="1" fill="currentColor" />
              <circle cx="6.5" cy="10" r="0.75" fill="currentColor" />
              <circle cx="8.5" cy="11.5" r="0.5" fill="currentColor" />
            </svg>
            <span aria-hidden="true">Cookie settings</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
