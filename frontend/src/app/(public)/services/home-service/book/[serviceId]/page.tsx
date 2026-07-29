import React from 'react';
import { FEATURED_SERVICES } from '@/constants/services';
import { BookingClient } from '@/components/services/BookingClient';

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const service = FEATURED_SERVICES.find((s) => s.id === serviceId) || FEATURED_SERVICES[0];

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-8">
      <BookingClient service={service} />
    </div>
  );
}
