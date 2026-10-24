'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Attraction } from '@/lib/types';
import { usePlan } from '@/hooks/usePlan';

interface AttractionCardProps {
  attraction: Attraction;
  onNotice?: (msg: string) => void;
}

function getCategoryIcon(categoryName?: string) {
  if (!categoryName) return '📍';
  const lower = categoryName.toLowerCase();
  if (lower.includes('relig') || lower.includes('temple') || lower.includes('heritage')) return '🏛️';
  if (lower.includes('nature') || lower.includes('garden') || lower.includes('park')) return '🌿';
  if (lower.includes('scenic') || lower.includes('view') || lower.includes('mountain')) return '🌄';
  if (lower.includes('cultur') || lower.includes('museum') || lower.includes('tea')) return '☕';
  return '📍';
}

export default function AttractionCard({ attraction, onNotice }: AttractionCardProps) {
  const { isInPlan, addToPlan, removeFromPlan } = usePlan();
  const inPlan = isInPlan(attraction.id);

  const [primaryFailed, setPrimaryFailed] = useState(false);
  const [secondaryFailed, setSecondaryFailed] = useState(false);

  const handlePlanToggle = () => {
    if (inPlan) {
      removeFromPlan(attraction.id);
      if (onNotice) onNotice(`Removed "${attraction.name}" from your plan.`);
    } else {
      const res = addToPlan(attraction);
      if (onNotice) onNotice(res.message);
    }
  };

  // Format fee display
  let feeLabel = 'Free entry';
  if (attraction.entrance_fee_lkr) {
    feeLabel = `LKR ${Number(attraction.entrance_fee_lkr).toLocaleString()}`;
    if (attraction.entrance_fee_usd) {
      feeLabel += ` (~$${Number(attraction.entrance_fee_usd)})`;
    }
  }

  const rawPrimary = attraction.image_url || attraction.secondary_image_url;
  const rawSecondary =
    attraction.image_url && attraction.secondary_image_url
      ? attraction.secondary_image_url
      : null;

  // Gracefully fall back if image fails to load
  const primaryImage = !primaryFailed ? rawPrimary : (!secondaryFailed ? rawSecondary : null);
  const secondaryImage = !primaryFailed && !secondaryFailed ? rawSecondary : null;

  return (
    <div className="card card-interactive attraction-card">
      {/* Card Media Container: Supports dual-image hover crossfade */}
      <div className="card-media-wrap">
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={attraction.name}
              className="card-media-img card-media-primary"
              loading="lazy"
              onError={() => setPrimaryFailed(true)}
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${attraction.name} (alternate view)`}
                className="card-media-img card-media-secondary"
                loading="lazy"
                onError={() => setSecondaryFailed(true)}
              />
            )}
          </>
        ) : (
          <div className="card-media-placeholder">
            <span className="card-media-placeholder-icon">
              {getCategoryIcon(attraction.category?.name)}
            </span>
            <span className="card-media-placeholder-label">
              {attraction.name}
            </span>
          </div>
        )}

        {/* Category Badge Overlay */}
        <div className="card-media-badge-overlay">
          <span className="badge badge-primary">
            {attraction.category?.name || 'Attraction'}
          </span>
        </div>
      </div>

      {/* Card Content - fully readable on touchscreens without hover */}
      <div className="card-content-wrap">
        <div>
          {/* Top Meta: Distance & Duration */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginBottom: '0.65rem',
            }}
          >
            {attraction.distance_km !== null ? (
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                📍 {attraction.distance_km} km away
              </span>
            ) : <span />}

            {attraction.visit_duration_minutes && (
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                ⏱ {attraction.visit_duration_minutes} mins
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '0.6rem',
              lineHeight: 1.3,
            }}
          >
            <Link
              href={`/attractions/${attraction.id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
              className="hover-underline"
            >
              {attraction.name}
            </Link>
          </h3>

          {/* Short description */}
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {attraction.description}
          </p>

          {/* Practical Quick Tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.65rem',
              fontSize: '0.825rem',
              color: 'var(--text-main)',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--bg-subtle)',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span>🎟</span>
              <span>{feeLabel}</span>
            </div>

            {attraction.opening_hours && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  maxWidth: '180px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                title={attraction.opening_hours}
              >
                <span>🕒</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {attraction.opening_hours}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <Link
            href={`/attractions/${attraction.id}`}
            className="btn btn-secondary btn-sm"
          >
            Details & Map
          </Link>
          <button
            type="button"
            onClick={handlePlanToggle}
            className={`btn btn-sm ${inPlan ? 'btn-danger' : 'btn-primary'}`}
          >
            {inPlan ? '✓ In Your Plan' : '+ Add to Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
