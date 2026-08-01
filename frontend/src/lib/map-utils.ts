/**
 * OpenStreetMap & OSRM Routing Utility Functions
 * Zero Google Maps Cost Infrastructure
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteResult {
  coordinates: [number, number][]; // [lng, lat] format for MapLibre
  distanceKm: number;
  durationMins: number;
}

// ─── Fetch Fastest Route via OSRM Public Routing API ──────────────────────────

export const fetchOSRMRoute = async (
  origin: LatLng,
  destination: LatLng
): Promise<RouteResult> => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url).then((r) => r.json());

    if (res?.code === 'Ok' && res?.routes?.[0]) {
      const route = res.routes[0];
      const coordinates = route.geometry?.coordinates as [number, number][];
      const distanceKm = Number((route.distance / 1000).toFixed(2));
      const durationMins = Math.max(1, Math.round(route.duration / 60));

      return { coordinates, distanceKm, durationMins };
    }
  } catch (err) {
    console.warn('⚠️ OSRM Route fetch fallback notice:', err);
  }

  // Fallback straight line if OSRM is unreachable
  const straightDist = calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  return {
    coordinates: [
      [origin.lng, origin.lat],
      [destination.lng, destination.lat],
    ],
    distanceKm: Number(straightDist.toFixed(2)),
    durationMins: Math.max(1, Math.round((straightDist / 30) * 60)), // 30 km/h avg speed estimate
  };
};

// ─── Haversine Distance Calculation (km) ────────────────────────────────────

export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ─── Smooth Marker Position Interpolation ─────────────────────────────────────

export const interpolatePosition = (
  start: [number, number],
  end: [number, number],
  progress: number
): [number, number] => {
  const lng = start[0] + (end[0] - start[0]) * progress;
  const lat = start[1] + (end[1] - start[1]) * progress;
  return [lng, lat];
};

// ─── External Navigation App Launcher URLs ───────────────────────────────────

export const getNavigationAppUrls = (lat?: number | null, lng?: number | null, addressText?: string) => {
  const destinationQuery = addressText?.trim()
    ? encodeURIComponent(addressText.trim())
    : lat && lng
    ? `${lat},${lng}`
    : encodeURIComponent('Mohakhali DOHS, Dhaka');

  return {
    googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`,
    appleMaps: `https://maps.apple.com/?daddr=${destinationQuery}`,
    waze: lat && lng
      ? `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
      : `https://waze.com/ul?q=${destinationQuery}&navigate=yes`,
  };
};

// ─── Default Savar / Mohakhali DOHS Center Coordinates ────────────────────────

export const DOHS_BAZAAR_COORDS: LatLng = { lat: 23.8762, lng: 90.2741 }; // Savar DOHS Center
