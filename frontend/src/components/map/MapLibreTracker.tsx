'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LatLng, fetchOSRMRoute } from '@/lib/map-utils';
import { Navigation, Sun, Moon, Maximize2, RotateCcw } from 'lucide-react';

interface MapLibreTrackerProps {
  riderLocation?: {
    lat: number;
    lng: number;
    heading?: number;
    speed?: number;
  } | null;
  storeLocation?: LatLng | null;
  customerLocation?: LatLng | null;
  height?: string;
  theme?: 'dark' | 'light';
  showControls?: boolean;
  onRouteUpdate?: (distanceKm: number, durationMins: number) => void;
}

export function MapLibreTracker({
  riderLocation,
  storeLocation,
  customerLocation,
  height = '420px',
  theme: initialTheme = 'dark',
  showControls = true,
  onRouteUpdate,
}: MapLibreTrackerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const riderMarkerRef = useRef<maplibregl.Marker | null>(null);
  const storeMarkerRef = useRef<maplibregl.Marker | null>(null);
  const customerMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);

  // Map Tile Style URLs (Free CartoDB Dark/Light Tiles - 0 Google Cost)
  const tileStyles = {
    dark: {
      version: 8 as const,
      sources: {
        'carto-dark': {
          type: 'raster' as const,
          tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        },
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster' as const,
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
    light: {
      version: 8 as const,
      sources: {
        'osm-tiles': {
          type: 'raster' as const,
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm-layer',
          type: 'raster' as const,
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  };

  // Default Center (Savar / Mohakhali DOHS)
  const defaultCenter: [number, number] = [
    riderLocation?.lng || storeLocation?.lng || 90.2741,
    riderLocation?.lat || storeLocation?.lat || 23.8762,
  ];

  // ── Initialize Map ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: tileStyles[theme],
      center: defaultCenter,
      zoom: 14,
      pitch: 30,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Add Route Source & Layer
      map.addSource('osrm-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [] },
        },
      });

      map.addLayer({
        id: 'osrm-route-line',
        type: 'line',
        source: 'osrm-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': theme === 'dark' ? '#10b981' : '#059669',
          'line-width': 6,
          'line-opacity': 0.85,
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Switch Theme ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(tileStyles[theme]);
    }
  }, [theme]);

  // ── Update Markers & Animated Motorcycle Movement ─────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Store Marker
    if (storeLocation) {
      if (!storeMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'w-9 h-9 rounded-2xl bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black';
        el.innerHTML = '🏪';
        storeMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([storeLocation.lng, storeLocation.lat])
          .addTo(map);
      } else {
        storeMarkerRef.current.setLngLat([storeLocation.lng, storeLocation.lat]);
      }
    }

    // 2. Customer Destination Marker
    if (customerLocation) {
      if (!customerMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'w-9 h-9 rounded-2xl bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black';
        el.innerHTML = '🏠';
        customerMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([customerLocation.lng, customerLocation.lat])
          .addTo(map);
      } else {
        customerMarkerRef.current.setLngLat([customerLocation.lng, customerLocation.lat]);
      }
    }

    // 3. Rider Motorcycle Animated Marker
    if (riderLocation?.lat && riderLocation?.lng) {
      const heading = riderLocation.heading || 0;

      if (!riderMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 border-2 border-white shadow-2xl flex items-center justify-center text-white text-base font-black transform transition-transform duration-300';
        el.innerHTML = '🏍️';
        el.style.transform = `rotate(${heading}deg)`;
        riderMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([riderLocation.lng, riderLocation.lat])
          .addTo(map);
      } else {
        riderMarkerRef.current.setLngLat([riderLocation.lng, riderLocation.lat]);
        const el = riderMarkerRef.current.getElement();
        el.style.transform = `rotate(${heading}deg)`;
      }
    }
  }, [riderLocation, storeLocation, customerLocation]);

  // ── OSRM Route Calculation & Polyline Update ─────────────────────────────
  useEffect(() => {
    const origin = riderLocation ? { lat: riderLocation.lat, lng: riderLocation.lng } : storeLocation;
    const destination = customerLocation || storeLocation;

    if (!origin || !destination) return;

    fetchOSRMRoute(origin, destination).then((result) => {
      if (onRouteUpdate) {
        onRouteUpdate(result.distanceKm, result.durationMins);
      }

      const map = mapRef.current;
      if (map && map.isStyleLoaded() && map.getSource('osrm-route')) {
        const source = map.getSource('osrm-route') as maplibregl.GeoJSONSource;
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: result.coordinates,
          },
        });
      }
    });
  }, [riderLocation?.lat, riderLocation?.lng, storeLocation?.lat, storeLocation?.lng, customerLocation?.lat, customerLocation?.lng]);

  // ── Fit Map Bounds ───────────────────────────────────────────────────────────
  const handleFitBounds = () => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = new maplibregl.LngLatBounds();
    if (riderLocation?.lng) bounds.extend([riderLocation.lng, riderLocation.lat]);
    if (storeLocation?.lng) bounds.extend([storeLocation.lng, storeLocation.lat]);
    if (customerLocation?.lng) bounds.extend([customerLocation.lng, customerLocation.lat]);

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 16, duration: 1000 });
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Control Toolbar */}
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white shadow-xl transition-all"
            title="Toggle Map Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            type="button"
            onClick={handleFitBounds}
            className="p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-emerald-400 hover:text-emerald-300 shadow-xl transition-all"
            title="Fit Route Bounds"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
