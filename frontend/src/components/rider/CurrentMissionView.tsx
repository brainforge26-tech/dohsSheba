'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchApi } from '@/lib/api-client';
import { useSocket } from '@/hooks/useSocket';
import { formatCurrency } from '@/utils/cn';
import { MapLibreTracker } from '@/components/map/MapLibreTracker';
import { getNavigationAppUrls } from '@/lib/map-utils';
import {
  Navigation,
  Phone,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
  Wifi,
  WifiOff,
  ChevronUp,
  RotateCcw,
  Loader2,
  Store,
} from 'lucide-react';

interface CurrentMissionViewProps {
  mission: any;
  onMissionUpdate: () => void;
}

export function CurrentMissionView({ mission, onMissionUpdate }: CurrentMissionViewProps) {
  const { socket } = useSocket();

  // ── States ──────────────────────────────────────────────────────────────────
  const [currentPos, setCurrentPos] = useState<{
    lat: number;
    lng: number;
    heading: number;
    speed: number;
    accuracy: number;
  } | null>(null);

  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [distanceKm, setDistanceKm] = useState<number>(1.5);
  const [durationMins, setDurationMins] = useState<number>(8);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Offline GPS Queue Storage Key
  const QUEUE_KEY = `gps_queue_${mission.id}`;

  // Store & Customer Locations
  const storeLocation = {
    lat: mission.items?.[0]?.product?.seller?.latitude || 23.8762,
    lng: mission.items?.[0]?.product?.seller?.longitude || 90.2741,
  };

  const customerAddressText = [
    mission.address?.line1,
    mission.address?.line2,
    mission.address?.area,
    mission.address?.city,
  ].filter(Boolean).join(', ');

  const customerLocation = {
    lat: mission.address?.latitude || 23.879,
    lng: mission.address?.longitude || 90.278,
  };

  const customerPhone = mission.customerPhone || mission.customer?.phone || '01306031982';
  const navUrls = getNavigationAppUrls(
    mission.address?.latitude,
    mission.address?.longitude,
    customerAddressText
  );

  // ── 1. Screen Wake Lock API (Keep Display Awake During Mission) ─────────────
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          setWakeLockActive(true);
        }
      } catch (_) {}
    };

    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, []);

  // ── 2. Offline Network Monitor ──────────────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushGpsQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [socket]);

  // Flush queued GPS logs upon socket reconnect
  const flushGpsQueue = useCallback(() => {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      if (raw && socket) {
        const queue = JSON.parse(raw);
        if (Array.isArray(queue) && queue.length > 0) {
          queue.forEach((item) => socket.emit('RIDER_LOCATION_UPDATED', item));
          localStorage.removeItem(QUEUE_KEY);
        }
      }
    } catch (_) {}
  }, [socket, QUEUE_KEY]);

  // ── 3. Real-Time GPS watchPosition (2-second interval) ──────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setIsGpsActive(true);
        const { latitude, longitude, heading, speed, accuracy } = pos.coords;

        const payload = {
          orderId: mission.id,
          latitude,
          longitude,
          heading: heading || 0,
          speed: speed ? Math.round(speed * 3.6) : 0, // m/s to km/h
          accuracy: Math.round(accuracy),
          timestamp: Date.now(),
        };

        setCurrentPos({
          lat: latitude,
          lng: longitude,
          heading: payload.heading,
          speed: payload.speed,
          accuracy: payload.accuracy,
        });

        // Send over socket if online, otherwise queue in localStorage
        if (socket && socket.connected && isOnline) {
          socket.emit('RIDER_LOCATION_UPDATED', payload);
        } else {
          try {
            const raw = localStorage.getItem(QUEUE_KEY);
            const queue = raw ? JSON.parse(raw) : [];
            queue.push(payload);
            localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-50))); // Keep last 50
          } catch (_) {}
        }
      },
      (err) => console.warn('⚠️ Geolocation watch notice:', err),
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [mission.id, socket, isOnline, QUEUE_KEY]);

  // ── 4. Milestone Mission Status Progression ──────────────────────────────────
  const handleNextMilestone = async () => {
    const statusSequence: Record<string, string> = {
      RIDER_ASSIGNED: 'ARRIVED_AT_STORE',
      ARRIVED_AT_STORE: 'PICKED_UP',
      PICKUP_STARTED: 'PICKED_UP',
      PICKED_UP: 'ON_THE_WAY',
      ON_THE_WAY: 'ARRIVED',
      ARRIVED: 'DELIVERED',
      ARRIVED_DESTINATION: 'DELIVERED',
    };

    const nextStatus = statusSequence[mission.status];
    if (!nextStatus) return;

    setActionLoading(true);
    setStatusMsg('');
    try {
      const res = await fetchApi<any>(`/rider/orders/${mission.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res?.success) {
        onMissionUpdate();
      } else {
        setStatusMsg(res?.message || 'Could not update status');
      }
    } catch (e: any) {
      setStatusMsg(e?.message || 'Failed to update mission status');
    } finally {
      setActionLoading(false);
    }
  };

  const getMilestoneButtonLabel = (status: string) => {
    switch (status) {
      case 'RIDER_ASSIGNED':
        return 'Arrived at Merchant Store';
      case 'ARRIVED_AT_STORE':
      case 'PICKUP_STARTED':
        return 'Picked Up Order & Start Delivery';
      case 'PICKED_UP':
        return 'On the Way to Customer';
      case 'ON_THE_WAY':
        return 'Arrived at Doorstep';
      case 'ARRIVED':
      case 'ARRIVED_DESTINATION':
        return 'Confirm Order Delivered & Paid';
      default:
        return 'Complete Mission Step';
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-24 animate-in fade-in duration-300">
      {/* Network & WakeLock Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Wifi className="w-4 h-4" /> Socket Online
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <WifiOff className="w-4 h-4 animate-pulse" /> Offline (GPS Queued)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-bold ${wakeLockActive ? 'text-amber-400' : 'text-slate-500'}`}>
            {wakeLockActive ? '⚡ Screen Wake Lock ON' : 'Screen Timeout Normal'}
          </span>
        </div>
      </div>

      {/* MapLibre OpenStreetMap Live Navigation Map */}
      <div className="relative">
        <MapLibreTracker
          riderLocation={currentPos}
          storeLocation={storeLocation}
          customerLocation={customerLocation}
          height="380px"
          onRouteUpdate={(km, mins) => {
            setDistanceKm(km);
            setDurationMins(mins);
          }}
        />

        {/* Live Speed & GPS Overlay */}
        {currentPos && (
          <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl text-center shadow-xl">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Speed</span>
            <span className="text-xl font-black text-emerald-400">{currentPos.speed} <span className="text-xs font-normal">km/h</span></span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Acc: ±{currentPos.accuracy}m</span>
          </div>
        )}
      </div>

      {/* External Navigation Launchers (Google Maps, Apple Maps, Waze) */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-2.5 shadow-xl">
        <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider block">
          External Turn-by-Turn Navigation Apps:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <a
            href={navUrls.googleMaps}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" /> Google Maps
          </a>
          <a
            href={navUrls.appleMaps}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" /> Apple Maps
          </a>
          <a
            href={navUrls.waze}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Waze
          </a>
        </div>
      </div>

      {/* Native App Bottom Sheet UI */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="font-mono font-black text-white text-sm">Mission #{mission.id.slice(-8).toUpperCase()}</span>
            <span className="text-xs text-emerald-400 font-bold block">Status: {mission.status}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Remaining</span>
            <span className="text-base font-black text-emerald-400">{distanceKm} km · ~{durationMins} mins</span>
          </div>
        </div>

        {/* Customer Call & Address */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <strong className="text-white block text-sm">{mission.customer?.name || 'Resident Customer'}</strong>
              <span className="text-slate-400">{mission.address?.line1}, {mission.address?.area}</span>
            </div>
            <a
              href={`tel:${customerPhone}`}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 font-bold">Collect Cash on Delivery:</span>
            <span className="font-black text-white text-base">{formatCurrency(mission.totalAmount)}</span>
          </div>
        </div>

        {/* Sticky Milestone Action Button */}
        <button
          type="button"
          onClick={handleNextMilestone}
          disabled={actionLoading}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all disabled:opacity-50 tracking-wide"
        >
          {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{getMilestoneButtonLabel(mission.status)}</span>
        </button>

        {statusMsg && <p className="text-xs text-rose-400 font-bold text-center">{statusMsg}</p>}
      </div>
    </div>
  );
}
