"use client";

import { useEffect } from "react";

type Props = {
  widgetKey?: string;
};

export default function ZendeskWidget({ widgetKey }: Props) {
  const key = widgetKey || process.env.NEXT_PUBLIC_ZENDESK_KEY;

  useEffect(() => {
    if (!key) {
      // No key provided; mark widget as unavailable
      (window as any).__zendeskAvailable = false;
      return;
    }

    // Avoid loading twice
    if (document.getElementById("ze-snippet")) return;
    // Ensure an open function exists immediately so button clicks before
    // the snippet loads are queued/opened once ready.
    if (!(window as any).openZendesk) {
      (window as any).openZendesk = () => {
        try {
          if ((window as any).zE) {
            (window as any).zE("webWidget", "open");
          } else {
            // mark pending open; when the script loads we'll open if pending
            (window as any).__openZendeskPending = true;
          }
        } catch (e) {
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
        (window as any).__zendeskAvailable = true;
        // If the snippet defines zE, and an open was requested earlier, open now
        if ((window as any).__openZendeskPending && (window as any).zE) {
          try {
            (window as any).zE("webWidget", "open");
            (window as any).__openZendeskPending = false;
          } catch (e) {
            // ignore
          }
        }

        // Ensure openZendesk uses the real zE if available
        (window as any).openZendesk = () => {
          try {
            (window as any).zE?.("webWidget", "open");
          } catch (e) {
            // ignore
          }
        };
      } catch (e) {
        // ignore
      }
    };
    s.onerror = () => {
      // Script failed to load or returned 400/error; use fallback
      (window as any).__zendeskAvailable = false;
    };
    document.head.appendChild(s);

    return () => {
      // keep the snippet loaded for the session; don't remove it on unmount
    };
  }, [key]);

  return null;
}
