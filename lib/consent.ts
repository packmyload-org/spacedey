/**
 * consent.ts — ConsentStore
 *
 * Pure logic for reading/writing Google Consent Mode v2 state.
 * No React dependency. All browser API accesses are SSR-guarded.
 *
 * Categories are kept as Spacedey's four-category model:
 *   - necessary    (always true, never stored — implicit)
 *   - preferences  → functionality_storage, personalization_storage
 *   - statistics   → analytics_storage
 *   - marketing    → ad_storage, ad_user_data, ad_personalization
 */

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

/** Persisted user consent choices. Stored under the key `spacedey_consent`. */
export interface ConsentState {
  /** Whether preference cookies (functionality/personalisation) are permitted. */
  preferences: boolean;
  /** Whether statistics cookies (GA4 event collection) are permitted. */
  statistics: boolean;
  /** Whether marketing cookies (ad storage/personalization) are permitted. */
  marketing: boolean;
  /** Unix timestamp (ms) at which the state was last saved. */
  savedAt: number;
}

/** Valid values accepted by the Google Consent Mode API. */
export type ConsentValue = "granted" | "denied";

/** Shape of the object passed to `gtag('consent', 'default' | 'update', …)`. */
export interface GtagConsentParams {
  analytics_storage: ConsentValue;
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  functionality_storage: ConsentValue;
  personalization_storage: ConsentValue;
  security_storage: ConsentValue;
}

// ---------------------------------------------------------------------------
// Global type augmentation
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ---------------------------------------------------------------------------
// Mapping helper
// ---------------------------------------------------------------------------

/**
 * Converts a `ConsentState` into the `GtagConsentParams` object expected by
 * the Google `gtag` Consent Mode v2 API.
 *
 * - `statistics`   → analytics_storage
 * - `marketing`    → ad_storage, ad_user_data, ad_personalization
 * - `preferences`  → functionality_storage, personalization_storage
 * - security_storage is always granted (essential)
 */
export function toGtagParams(state: ConsentState): GtagConsentParams {
  return {
    analytics_storage: state.statistics ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    functionality_storage: state.preferences ? "granted" : "denied",
    personalization_storage: state.preferences ? "granted" : "denied",
    security_storage: "granted", // always granted — necessary cookies
  };
}

// ---------------------------------------------------------------------------
// Shape validator
// ---------------------------------------------------------------------------

/**
 * Returns `true` when `value` is a structurally valid `ConsentState`.
 * Guards against malformed / outdated JSON blobs before trusting them.
 */
function isValidConsentState(value: unknown): value is ConsentState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v["preferences"] === "boolean" &&
    typeof v["statistics"] === "boolean" &&
    typeof v["marketing"] === "boolean" &&
    typeof v["savedAt"] === "number"
  );
}

// ---------------------------------------------------------------------------
// Storage key
// ---------------------------------------------------------------------------

const STORAGE_KEY = "spacedey_consent";

// ---------------------------------------------------------------------------
// read
// ---------------------------------------------------------------------------

/**
 * Reads the persisted `ConsentState` using a localStorage-first, cookie-fallback
 * strategy.
 *
 * Precedence:
 * 1. `localStorage` — authoritative, fastest.
 * 2. `spacedey_consent` cookie — fallback for private-browsing or localStorage
 *    being cleared. When found, it is mirrored back to localStorage.
 * 3. Returns `null` when neither source has valid data.
 *
 * Fully SSR-safe: never accesses browser APIs on the server.
 */
export function read(): ConsentState | null {
  if (typeof window === "undefined") return null;

  // 1. Try localStorage first
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (isValidConsentState(parsed)) return parsed;
    }
  } catch {
    // localStorage inaccessible or JSON malformed — fall through.
  }

  // 2. Cookie fallback
  try {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${STORAGE_KEY}=`))
      ?.slice(STORAGE_KEY.length + 1);

    if (cookieValue) {
      const parsed: unknown = JSON.parse(decodeURIComponent(cookieValue));
      if (isValidConsentState(parsed)) {
        // Mirror back to localStorage so future reads are faster.
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch {
          // Ignore write failures — cookie remains the source of truth.
        }
        return parsed;
      }
    }
  } catch {
    // Cookie parse or JSON decode failed.
  }

  return null;
}

// ---------------------------------------------------------------------------
// write
// ---------------------------------------------------------------------------

/**
 * Persists `state` to both `localStorage` and a first-party cookie so that
 * the choice survives browser sessions and is accessible to server-side code.
 *
 * Cookie attributes:
 *   - `Max-Age=31536000`  — 1 year TTL
 *   - `SameSite=Lax`      — CSRF protection for cross-site navigations
 *   - `Path=/`            — available site-wide
 *   - `Secure`            — only on HTTPS (safe for local dev)
 */
export function write(state: ConsentState): void {
  if (typeof window === "undefined") return;

  const json = JSON.stringify(state);

  // Primary store
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch (err) {
    console.warn("[ConsentStore] localStorage write failed:", err);
  }

  // Cookie fallback
  const secure = location.protocol === "https:" ? " Secure;" : "";
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(json)}; Max-Age=31536000; SameSite=Lax; Path=/;${secure}`;
}

// ---------------------------------------------------------------------------
// emitUpdate
// ---------------------------------------------------------------------------

/**
 * Pushes a `gtag('consent', 'update', …)` call so Google tags honour the
 * user's latest choice immediately.
 *
 * Silently no-ops when running on the server or before the gtag function is
 * injected by the GTM loader.
 */
export function emitUpdate(state: ConsentState): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("consent", "update", toGtagParams(state));

  // Also dispatch the legacy CustomEvent that third-party scripts may listen to.
  try {
    window.dispatchEvent(
      new CustomEvent("cookieConsentUpdated", {
        detail: { ...state, necessary: true },
      })
    );
  } catch {
    // Ignore in environments where CustomEvent is unavailable.
  }
}

// ---------------------------------------------------------------------------
// save
// ---------------------------------------------------------------------------

/**
 * Primary action called by the UI after the user makes a choice.
 * Persists via `write()` then signals Google tags via `emitUpdate()`.
 * Write-first ensures state is durable even if the gtag call throws.
 */
export function save(state: ConsentState): void {
  write(state);
  emitUpdate(state);
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

/**
 * Called once on client mount inside the consent banner's `useEffect`.
 *
 * If a previously stored `ConsentState` exists, re-emits the consent update
 * to Google so tags are correctly configured within the `wait_for_update`
 * window declared in the inline GTM default script.
 *
 * Returns the stored state (so the banner knows whether to show), or `null`
 * when no prior choice is recorded.
 */
export function init(): ConsentState | null {
  if (typeof window === "undefined") return null;

  const stored = read();
  if (stored) {
    emitUpdate(stored);
    return stored;
  }

  return null;
}
