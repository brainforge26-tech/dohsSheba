'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FEATURED_SERVICES } from '@/constants/services';
import { BookingClient } from '@/components/services/BookingClient';
import { getApiBaseUrl } from '@/lib/api-client';

export default function BookServicePage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;
    const API = getApiBaseUrl();
    fetch(`${API}/services/${serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setService(data.data);
        } else {
          // Fallback to local featured service if not found in API
          const fallback = FEATURED_SERVICES.find((s) => s.id === serviceId) || FEATURED_SERVICES[0];
          setService(fallback);
        }
      })
      .catch(() => {
        const fallback = FEATURED_SERVICES.find((s) => s.id === serviceId) || FEATURED_SERVICES[0];
        setService(fallback);
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  if (loading || !service) {
    return (
      <div className="py-16 px-4 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Loading service booking checkout...</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-8">
      <BookingClient service={service} />
    </div>
  );
}
