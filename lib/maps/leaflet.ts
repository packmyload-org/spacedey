import L from 'leaflet';

const siteMarkerSvg = `
  <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <filter id="pinShadow" x="0" y="0" width="36" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0B1F59" flood-opacity="0.28" />
      </filter>
      <linearGradient id="pinFill" x1="18" y1="6" x2="18" y2="40" gradientUnits="userSpaceOnUse">
        <stop stop-color="#4C8DFF" />
        <stop offset="1" stop-color="#1642F0" />
      </linearGradient>
    </defs>
    <g filter="url(#pinShadow)">
      <path d="M18 4C10.268 4 4 10.268 4 18C4 29.246 18 42 18 42C18 42 32 29.246 32 18C32 10.268 25.732 4 18 4Z" fill="url(#pinFill)" />
      <path d="M18 40.5C20.018 38.477 30 28.194 30 18C30 11.373 24.627 6 18 6C11.373 6 6 11.373 6 18C6 28.194 15.982 38.477 18 40.5Z" stroke="#0E2C9B" stroke-width="1.5" />
      <circle cx="18" cy="18" r="7.5" fill="white" />
      <circle cx="18" cy="18" r="3.5" fill="#1642F0" />
    </g>
  </svg>
`;

export const siteMarkerIcon = L.divIcon({
  className: '',
  html: siteMarkerSvg,
  iconSize: [36, 48],
  iconAnchor: [18, 42],
  popupAnchor: [0, -36],
});
