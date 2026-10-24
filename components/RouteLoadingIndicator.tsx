'use client';

// components/RouteLoadingIndicator.tsx
// App Router-compatible route navigation loading indicator featuring Kandy elephant

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ElephantLoader from './ElephantLoader';

function RouteLoadingContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // When pathname or search params change, navigation has completed
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Global click listener to detect internal link navigations
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignore modified clicks or secondary button clicks
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      // Ignore links that open in new window or download files
      if (
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        anchor.getAttribute('rel')?.includes('external')
      ) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        // Only trigger for same origin
        if (targetUrl.origin !== window.location.origin) {
          return;
        }

        // If clicking the current page with no search/hash differences, no transition
        const currentPathAndQuery = window.location.pathname + window.location.search;
        const targetPathAndQuery = targetUrl.pathname + targetUrl.search;
        if (currentPathAndQuery === targetPathAndQuery) {
          return;
        }

        // Valid internal navigation initiated
        setIsNavigating(true);
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  // Safety fallback: Never keep indicator visible for longer than 6 seconds
  useEffect(() => {
    if (!isNavigating) return;
    const timeout = setTimeout(() => {
      setIsNavigating(false);
    }, 6000);
    return () => clearTimeout(timeout);
  }, [isNavigating]);

  if (!isNavigating) return null;

  return (
    <div
      className="route-loading-pill"
      role="status"
      aria-live="polite"
    >
      <ElephantLoader size="sm" label="Exploring Kandy…" />
    </div>
  );
}

export default function RouteLoadingIndicator() {
  return (
    <Suspense fallback={null}>
      <RouteLoadingContent />
    </Suspense>
  );
}
