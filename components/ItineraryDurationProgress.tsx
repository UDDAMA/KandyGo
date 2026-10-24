'use client';

// components/ItineraryDurationProgress.tsx
// Real-time day-visit duration progress indicator against 8-hour (480 min) target
// Includes top full card + responsive floating bar that appears when scrolled down

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlan } from '@/hooks/usePlan';

const TARGET_MINUTES = 480; // 8-hour full day target

function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0h';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function ItineraryDurationProgress() {
  const { items, totalMinutes, isLoaded } = usePlan();
  const topCardRef = useRef<HTMLDivElement>(null);
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);

  // Monitor when the top card leaves/enters the viewport
  useEffect(() => {
    if (!isLoaded) return;
    const el = topCardRef.current;
    if (!el || typeof window === 'undefined') {
      return;
    }

    const checkVisibility = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // When the bottom of the top card scrolls past the top of the viewport (< 0),
      // show the floating bar.
      const isPastTop = rect.bottom < 10;
      setIsFloatingVisible(isPastTop);
    };

    // Check initial position
    checkVisibility();

    window.addEventListener('scroll', checkVisibility, { passive: true });

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          const isPastTop = entry.boundingClientRect.bottom < 10;
          setIsFloatingVisible(!entry.isIntersecting && isPastTop);
        },
        {
          threshold: 0,
          rootMargin: '-10px 0px 0px 0px',
        }
      );
      observer.observe(el);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  const count = items.length;
  const isOver = totalMinutes > TARGET_MINUTES;
  const isExact = totalMinutes === TARGET_MINUTES && totalMinutes > 0;
  const isEmpty = totalMinutes === 0;
  const isBelow = totalMinutes > 0 && totalMinutes < TARGET_MINUTES;

  // Visual percentage capped at 100% for the progress bar width
  const visualPercentage = Math.min(100, Math.round((totalMinutes / TARGET_MINUTES) * 100));

  const remainingMinutes = Math.max(0, TARGET_MINUTES - totalMinutes);
  const overageMinutes = Math.max(0, totalMinutes - TARGET_MINUTES);

  // Status visual & textual states
  let statusBadgeText = '';
  let statusBadgeClass = '';
  let ariaText = '';
  let barFillColor = 'var(--primary)';

  if (isEmpty) {
    statusBadgeText = '8h remaining';
    statusBadgeClass = 'duration-badge-empty';
    ariaText = '0 hours planned of 8 hours target. 8 hours remaining.';
    barFillColor = 'var(--primary)';
  } else if (isBelow) {
    statusBadgeText = `${formatDuration(remainingMinutes)} remaining`;
    statusBadgeClass = 'duration-badge-below';
    ariaText = `${formatDuration(totalMinutes)} planned of 8 hours target. ${formatDuration(remainingMinutes)} remaining.`;
    barFillColor = 'var(--primary)';
  } else if (isExact) {
    statusBadgeText = 'Target reached (8h full day)';
    statusBadgeClass = 'duration-badge-exact';
    ariaText = '8 hours planned of 8 hours target. Target reached for a full day trip.';
    barFillColor = '#1b4332';
  } else {
    statusBadgeText = `${formatDuration(overageMinutes)} over target`;
    statusBadgeClass = 'duration-badge-over';
    ariaText = `${formatDuration(totalMinutes)} planned of 8 hours target. ${formatDuration(overageMinutes)} over target.`;
    barFillColor = 'var(--accent)';
  }

  return (
    <>
      {/* Top Full Progress Card */}
      <div
        ref={topCardRef}
        className="card duration-progress-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          backgroundColor: 'var(--bg-surface)',
          border: isOver
            ? '1px solid rgba(180, 83, 9, 0.35)'
            : isExact
            ? '1px solid rgba(27, 67, 50, 0.35)'
            : '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.15rem' }} aria-hidden="true">
              {isOver ? '⚠️' : isExact ? '✅' : '⏱️'}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: isOver ? 'var(--accent)' : 'var(--primary-text)',
                    lineHeight: 1.1,
                  }}
                >
                  {formatDuration(totalMinutes)}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  of 8h target
                </span>
              </div>
            </div>

            {/* Accessible visual status badge (does not rely on color alone) */}
            <span
              className={`badge ${statusBadgeClass}`}
              style={{
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              {isOver && <span aria-hidden="true">⚠️</span>}
              {isExact && <span aria-hidden="true">✓</span>}
              <span>{statusBadgeText}</span>
            </span>
          </div>

          {/* Link to view itinerary */}
          <Link
            href="/plan"
            className="btn btn-sm btn-secondary"
            style={{
              fontSize: '0.825rem',
              padding: '0.35rem 0.75rem',
              whiteSpace: 'nowrap',
            }}
          >
            {count > 0 ? `View My Plan (${count}) →` : 'Open My Plan →'}
          </Link>
        </div>

        {/* Visual Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={Math.min(TARGET_MINUTES, totalMinutes)}
          aria-valuemin={0}
          aria-valuemax={TARGET_MINUTES}
          aria-valuetext={ariaText}
          style={{
            width: '100%',
            height: '10px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${visualPercentage}%`,
              backgroundColor: barFillColor,
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
            }}
          />
        </div>

        {/* Helpful explanation caption */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>
            {isEmpty && 'Add attractions below to start scheduling your 8-hour sightseeing day.'}
            {isBelow && `${count} ${count === 1 ? 'stop' : 'stops'} selected. Estimated on-site visit time.`}
            {isExact && 'Perfect full-day itinerary. All 8 hours utilized for on-site visits.'}
            {isOver && 'Schedule exceeds a standard 8-hour day. Consider spacing stops over two days.'}
          </span>
          <span style={{ fontWeight: 600 }}>
            {visualPercentage}% day budget
          </span>
        </div>
      </div>

      {/* Floating Compact Progress Bar (Shown only when scrolled past top card) */}
      <aside
        className={`floating-duration-bar ${isFloatingVisible ? 'visible' : ''} ${
          isOver ? 'floating-over' : isExact ? 'floating-exact' : ''
        }`}
        aria-label="Itinerary Day Budget Progress"
        aria-hidden={!isFloatingVisible}
      >
        <div className="floating-duration-inner">
          {/* Left: Icon, Duration, Status Badge */}
          <div className="floating-duration-info">
            <span className="floating-duration-icon" aria-hidden="true">
              {isOver ? '⚠️' : isExact ? '✅' : '⏱️'}
            </span>
            <div className="floating-duration-text">
              <span className="floating-duration-time">
                {formatDuration(totalMinutes)}
              </span>
              <span className="floating-duration-target">of 8h</span>
            </div>
            <span className={`badge ${statusBadgeClass} floating-badge`}>
              {isOver && <span aria-hidden="true">⚠️</span>}
              {isExact && <span aria-hidden="true">✓</span>}
              <span>{statusBadgeText}</span>
            </span>
          </div>

          {/* Center: Slim visual progress bar */}
          <div
            className="floating-progress-track"
            role="progressbar"
            aria-valuenow={Math.min(TARGET_MINUTES, totalMinutes)}
            aria-valuemin={0}
            aria-valuemax={TARGET_MINUTES}
            aria-valuetext={ariaText}
          >
            <div
              className="floating-progress-fill"
              style={{
                width: `${visualPercentage}%`,
                backgroundColor: barFillColor,
              }}
            />
          </div>

          {/* Right: Plan Action Link */}
          <Link
            href="/plan"
            className="btn btn-sm btn-primary floating-duration-btn"
            tabIndex={isFloatingVisible ? 0 : -1}
          >
            {count > 0 ? `View Plan (${count}) →` : 'Open Plan →'}
          </Link>
        </div>
      </aside>
    </>
  );
}
