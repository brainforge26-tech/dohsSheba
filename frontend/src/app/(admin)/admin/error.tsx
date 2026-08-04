'use client';

import React, { useEffect } from 'react';
import { ErrorPage } from '@/components/ui/ErrorPage';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DOHS Sheba Admin Error]', error);
  }, [error]);

  return (
    <ErrorPage
      title="Admin Panel Error"
      description={error?.message || 'Failed to load this admin section. Please try again.'}
      onReset={reset}
    />
  );
}
