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

export function CurrentMissionView({ mission: initialMission, onMissionUpdate }: CurrentMissionViewProps) {
  const { socket } = useSocket();

  const [currentMission, setCurrentMission] = useState(initialMission);
  const mission = currentMission;

  useEffect(() => {
    setCurrentMission(initialMission);
  }, [initialMission]);

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
  const QUEUE_KEY = `gps_queue_${currentMission.id}`;

  // Store & Customer Locations
  const storeLocation = {
    lat: currentMission.items?.[0]?.product?.seller?.latitude || 23.8762,
    lng: currentMission.items?.[0]?.product?.seller?.longitude || 90.2741,
  };

  const customerAddressText =
    currentMission.deliveryAddress ||
    currentMission.guestAddress ||
    [
      currentMission.address?.line1,
      currentMission.address?.line2,
      currentMission.address?.area,
      currentMission.address?.city,
    ]
      .filter(Boolean)
      .join(', ') ||
    'Savar, Nabinagar';

  const customerLocation = {
    lat: currentMission.latitude || currentMission.address?.latitude || 23.879,
    lng: currentMission.longitude || currentMission.address?.longitude || 90.278,
  };

  const customerPhone = currentMission.customerPhone || currentMission.customer?.phone || '01306031982';
  const navUrls = getNavigationAppUrls(
    customerLocation.lat,
    customerLocation.lng,
    customerAddressText
  );

  // ── Real-Time Location Update Listener ──────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = (payload: any) => {
      if (!payload) return;
      const targetId = payload.orderId || payload.order?.id;
      if (targetId && (targetId === currentMission.id || targetId === initialMission.id)) {
        setCurrentMission((prev: any) => {
          const newDeliveryAddress = payload.deliveryAddress || payload.order?.deliveryAddress || prev.deliveryAddress;
          const newLat = payload.latitude ?? payload.order?.latitude ?? prev.latitude;
          const newLng = payload.longitude ?? payload.order?.longitude ?? prev.longitude;

          return {
            ...prev,
            ...payload.order,
            deliveryAddress: newDeliveryAddress,
            guestAddress: newDeliveryAddress || prev.guestAddress,
            latitude: newLat,
            longitude: newLng,
            address: {
              ...prev.address,
              line1: payload.line1 || prev.address?.line1,
              line2: payload.line2 || prev.address?.line2,
              area: payload.area || prev.address?.area,
              city: payload.city || prev.address?.city,
              latitude: newLat,
              longitude: newLng,
            },
          };
        });

        if (onMissionUpdate) {
          onMissionUpdate();
        }
      }
    };

    socket.on('ORDER_LOCATION_UPDATED', handleLocationUpdate);
    socket.on('ORDER_UPDATED', handleLocationUpdate);

    return () => {
      socket.off('ORDER_LOCATION_UPDATED', handleLocationUpdate);
      socket.off('ORDER_UPDATED', handleLocationUpdate);
    };
  }, [socket, currentMission.id, initialMission.id, onMissionUpdate]);

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
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="font-mono font-black text-white text-base tracking-wide">Mission #{mission.id.slice(-8).toUpperCase()}</span>
            <span className="text-xs text-emerald-400 font-bold block mt-0.5">Status: {mission.status}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Distance & Time</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{distanceKm} km · ~{durationMins} mins</span>
          </div>
        </div>

        {/* Store Info Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white text-sm font-bold block">
                {mission.items?.[0]?.product?.seller?.sellerProfile?.shopName || mission.items?.[0]?.product?.seller?.name || 'Green Market DOHS'}
              </strong>
              <span className="text-xs text-slate-400 block mt-0.5">
                {mission.items?.[0]?.product?.seller?.sellerProfile?.shopAddress || 'DOHS Central Market, Gate 2'}
              </span>
            </div>
          </div>
          {mission.items?.[0]?.product?.seller?.phone && (
            <a
              href={`tel:${mission.items[0].product.seller.phone}`}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 shrink-0"
            >
              <Phone className="w-3.5 h-3.5" /> Call Store
            </a>
          )}
        </div>

        {/* Customer Call & Cash Collection Card */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider block">Customer Destination</span>
              <strong className="text-white text-base font-bold block">{currentMission.customer?.name || currentMission.guestName || 'Resident Customer'}</strong>
              <span className="text-xs text-slate-400 block font-medium">{customerAddressText}</span>
            </div>
            <a
              href={`tel:${customerPhone}`}
              className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <Phone className="w-4 h-4" /> Call Customer
            </a>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">Collect Cash on Delivery:</span>
            <span className="font-black text-emerald-400 text-xl font-mono">{formatCurrency(mission.totalAmount)}</span>
          </div>
        </div>

        {/* Visual 5-Step Delivery Milestone Stepper */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <span className="text-xs text-slate-400 font-extrabold uppercase tracking-widest block text-center">
            Mission Progress Tracker
          </span>
          <div className="flex items-center justify-between relative px-3 py-2">
            {/* Background Connector Line */}
            <div className="absolute left-8 right-8 top-6 h-1 bg-slate-800 -z-0 rounded-full" />
            
            {/* Active Progress Connector Fill */}
            <div
              className="absolute left-8 top-6 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 -z-0 rounded-full transition-all duration-500"
              style={{
                width: `${
                  mission.status === 'RIDER_ASSIGNED' ? '0%' :
                  mission.status === 'ARRIVED_AT_STORE' || mission.status === 'PICKUP_STARTED' ? '25%' :
                  mission.status === 'PICKED_UP' ? '50%' :
                  mission.status === 'ON_THE_WAY' || mission.status === 'ARRIVED' || mission.status === 'ARRIVED_DESTINATION' ? '75%' : '100%'
                }`,
              }}
            />

            {[
              { id: 'RIDER_ASSIGNED', label: 'Accepted', icon: ShieldCheck },
              { id: 'ARRIVED_AT_STORE', label: 'At Store', icon: Store },
              { id: 'PICKED_UP', label: 'Picked Up', icon: Package },
              { id: 'ON_THE_WAY', label: 'On Way', icon: Navigation },
              { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
            ].map((step, idx) => {
              const currentStepIdx = (
                mission.status === 'RIDER_ASSIGNED' ? 0 :
                mission.status === 'ARRIVED_AT_STORE' || mission.status === 'PICKUP_STARTED' ? 1 :
                mission.status === 'PICKED_UP' ? 2 :
                mission.status === 'ON_THE_WAY' || mission.status === 'ARRIVED' || mission.status === 'ARRIVED_DESTINATION' ? 3 : 4
              );
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 scale-110 shadow-lg shadow-emerald-500/50'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold tracking-tight ${isCurrent ? 'text-emerald-400 font-black' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Milestone Action Button */}
        <button
          type="button"
          onClick={handleNextMilestone}
          disabled={actionLoading}
          className={`w-full py-4 px-6 font-black text-sm rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 tracking-wide uppercase ${
            mission.status === 'RIDER_ASSIGNED'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-950/80'
              : mission.status === 'ARRIVED_AT_STORE' || mission.status === 'PICKUP_STARTED'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-950/80'
              : mission.status === 'PICKED_UP'
              ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-blue-950/80'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-950/90 animate-pulse'
          }`}
        >
          {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{getMilestoneButtonLabel(mission.status)}</span>
        </button>

        {statusMsg && <p className="text-xs text-rose-400 font-bold text-center">{statusMsg}</p>}
      </div>
    </div>
  );
}
