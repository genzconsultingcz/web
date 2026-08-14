'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export function useTrackPageView(event: string, properties?: Record<string, string>) {
  useEffect(() => {
    posthog.capture(event, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
}
