// Lightweight helper to load Google Maps JavaScript API once.
let loadPromise: Promise<void> | null = null;

export default function loadGoogleMaps(apiKey: string): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    // runtime check for existing google maps object; inline any usage is intentional
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gw = globalThis as any;
    if (gw.google && gw.google.maps) {
      resolve();
      return;
    }

    const existing = document.getElementById('google-maps-script') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed to load'));
    document.head.appendChild(script);
  });

  return loadPromise;
}
