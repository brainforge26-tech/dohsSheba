'use client';

import React, { useEffect } from 'react';
import { ErrorPage } from '@/components/ui/ErrorPage';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DOHS Sheba Error]', error);
  }, [error]);

  return (
    <ErrorPage
      title="Page Error"
      description={error?.message || 'Something went wrong on this page. Please try again.'}
      onReset={reset}
    />
  );
}
