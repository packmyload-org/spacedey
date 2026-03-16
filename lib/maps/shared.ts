export const defaultMapCenter = {
  lat: 9.082,
  lng: 8.6753,
};

export function getValidCoordinates(lat: number, lng: number) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
}
