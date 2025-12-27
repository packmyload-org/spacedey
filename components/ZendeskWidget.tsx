"use client";

import { useEffect } from "react";

type Props = {
  widgetKey?: string;
};

declare global {
  interface Window {
    __zendeskAvailable?: boolean;
    openZendesk?: () => void;
    __openZendeskPending?: boolean;
    // zE is the Zendesk global function; its signature is dynamic so use unknown
    zE?: unknown;
  }
}

export default function ZendeskWidget({ widgetKey }: Props) {
  const key = widgetKey || process.env.NEXT_PUBLIC_ZENDESK_KEY;

  useEffect(() => {
    if (!key) {
      // No key provided; mark widget as unavailable
      window.__zendeskAvailable = false;
      return;
    }

    // Avoid loading twice
    if (document.getElementById("ze-snippet")) return;
    // Ensure an open function exists immediately so button clicks before
    // the snippet loads are queued/opened once ready.
    type ZendeskFn = (method: string, action: string, ...args: unknown[]) => unknown;

    if (!window.openZendesk) {
      window.openZendesk = () => {
        try {
          if (typeof window.zE === "function") {
            // zE exists — call it with an explicit signature
            (window.zE as ZendeskFn)("webWidget", "open");
          } else {
            // mark pending open; when the script loads we'll open if pending
            window.__openZendeskPending = true;
          }
        } catch {
          // ignore
        }
      };
    }

    const s = document.createElement("script");
    s.id = "ze-snippet";
    s.src = `https://static.zdassets.com/ekr/snippet.js?key=${key}`;
    s.async = true;
    s.onload = () => {
      try {
        // Widget loaded successfully
        window.__zendeskAvailable = true;
        // If the snippet defines zE, and an open was requested earlier, open now
        if (window.__openZendeskPending && typeof window.zE === "function") {
          try {
            (window.zE as ZendeskFn)("webWidget", "open");
            window.__openZendeskPending = false;
          } catch {
            // ignore
          }
        }

        // Ensure openZendesk uses the real zE if available
        window.openZendesk = () => {
          try {
            if (typeof window.zE === "function") (window.zE as ZendeskFn)("webWidget", "open");
          } catch {
            // ignore
          }
        };
      } catch {
        // ignore
      }
    };
    s.onerror = () => {
      // Script failed to load or returned 400/error; use fallback
      window.__zendeskAvailable = false;
    };
    document.head.appendChild(s);

    return () => {
      // keep the snippet loaded for the session; don't remove it on unmount
    };
  }, [key]);

  return null;
}
