'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { formatCurrency } from '@/utils/cn';
import { MapLibreTracker } from '@/components/map/MapLibreTracker';
import {
  Bike,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Store,
  User,
} from 'lucide-react';

interface CustomerLiveTrackerProps {
  order: any;
}

export function CustomerLiveTracker({ order: initialOrder }: CustomerLiveTrackerProps) {
  const { socket } = useSocket();
  const [order, setOrder] = useState(initialOrder);

  const [riderPos, setRiderPos] = useState<{
    lat: number;
    lng: number;
    heading: number;
    speed: number;
  } | null>(
    initialOrder?.rider?.riderProfile?.currentLatitude
      ? {
          lat: initialOrder.rider.riderProfile.currentLatitude,
          lng: initialOrder.rider.riderProfile.currentLongitude,
          heading: initialOrder.rider.riderProfile.heading || 0,
          speed: initialOrder.rider.riderProfile.speed || 0,
        }
      : null
  );

  const [distanceKm, setDistanceKm] = useState<number>(1.2);
  const [durationMins, setDurationMins] = useState<number>(6);

  // Store & Customer Locations
  const storeLocation = {
    lat: order.items?.[0]?.product?.seller?.latitude || 23.8762,
    lng: order.items?.[0]?.product?.seller?.longitude || 90.2741,
  };

  const customerLocation = {
    lat: order.address?.latitude || 23.879,
    lng: order.address?.longitude || 90.278,
  };

  // Real-Time Socket Listener
  useEffect(() => {
    if (!socket || !order.id) return;

    socket.emit('join_order', order.id);

    const handleLocationUpdate = (payload: any) => {
      if (payload.latitude && payload.longitude) {
        setRiderPos({
          lat: payload.latitude,
          lng: payload.longitude,
          heading: payload.heading || 0,
          speed: payload.speed || 0,
        });
      }
    };

    const handleStatusUpdate = (payload: any) => {
      if (payload.status) {
        setOrder((prev: any) => ({ ...prev, status: payload.status }));
      }
    };

    socket.on('RIDER_LOCATION_UPDATED', handleLocationUpdate);
    socket.on('ORDER_STATUS_UPDATED', handleStatusUpdate);

    return () => {
      socket.off('RIDER_LOCATION_UPDATED', handleLocationUpdate);
      socket.off('ORDER_STATUS_UPDATED', handleStatusUpdate);
    };
  }, [socket, order.id]);

  const riderPhone = order.rider?.phone || '01306031982';
  const riderName = order.riderName || order.rider?.name || 'Assigned Rider';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Live Map Header Status */}
      <div className="bg-[#1f2136] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest block">
              Live Order Delivery Status
            </span>
            <h2 className="text-xl font-black text-white">Order #{order.id.slice(-8).toUpperCase()}</h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Estimated Arrival</span>
            <span className="text-2xl font-black text-emerald-400">~{durationMins} mins ({distanceKm} km)</span>
          </div>
        </div>

        {/* Live Navigation Map */}
        <MapLibreTracker
          riderLocation={riderPos}
          storeLocation={storeLocation}
          customerLocation={customerLocation}
          height="400px"
          onRouteUpdate={(km, mins) => {
            setDistanceKm(km);
            setDurationMins(mins);
          }}
        />
      </div>

      {/* Assigned Rider Contact Card */}
      {order.riderId && (
        <div className="bg-[#1f2136] border border-white/10 p-5 rounded-3xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 p-0.5 shrink-0 overflow-hidden shadow-lg">
                {order.rider?.avatar ? (
                  <img src={order.rider.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-[#181928] flex items-center justify-center text-white font-black text-base">
                    {riderName[0]}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{riderName}</h3>
                <p className="text-xs text-emerald-400 font-semibold">Delivery Partner on Duty</p>
              </div>
            </div>

            <a
              href={`tel:${riderPhone}`}
              className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" /> Call Rider
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
