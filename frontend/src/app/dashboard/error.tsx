'use client';

import React, { useEffect } from 'react';
import { ErrorPage } from '@/components/ui/ErrorPage';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DOHS Sheba Dashboard Error]', error);
  }, [error]);

  return (
    <ErrorPage
      title="Dashboard Error"
      description={error?.message || 'Failed to load this dashboard section. Try again or navigate home.'}
      onReset={reset}
    />
  );
}
