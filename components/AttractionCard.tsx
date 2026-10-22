'use client';

import Link from 'next/link';
import type { Attraction } from '@/lib/types';
import { usePlan } from '@/hooks/usePlan';
import { useState } from 'react';

interface AttractionCardProps {
  attraction: Attraction;
  onNotice?: (msg: string) => void;
}

export default function AttractionCard({ attraction, onNotice }: AttractionCardProps) {
  const { isInPlan, addToPlan, removeFromPlan } = usePlan();
  const inPlan = isInPlan(attraction.id);

  const handlePlanToggle = () => {
    if (inPlan) {
      removeFromPlan(attraction.id);
      if (onNotice) onNotice(`Removed "${attraction.name}" from your plan.`);
    } else {
      const res = addToPlan(attraction);
      if (onNotice) onNotice(res.message);
    }
  };

  // Format fee
  let feeLabel = 'Free entry';
  if (attraction.entrance_fee_lkr) {
    feeLabel = `LKR ${Number(attraction.entrance_fee_lkr).toLocaleString()}`;
    if (attraction.entrance_fee_usd) {
      feeLabel += ` (~$${Number(attraction.entrance_fee_usd)})`;
    }
  }

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        height: '100%',
      }}
    >
      <div>
        {/* Top meta: Category & Distance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.85rem',
          }}
        >
          <span className="badge badge-primary">
            {attraction.category?.name || 'Attraction'}
          </span>
          {attraction.distance_km !== null && (
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
              }}
            >
              📍 {attraction.distance_km} km away
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
            gap: '0.75rem',
            fontSize: '0.825rem',
            color: 'var(--text-main)',
            marginBottom: '1.5rem',
          }}
        >
          {attraction.visit_duration_minutes && (
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
              <span>⏱</span>
              <span>{attraction.visit_duration_minutes} mins</span>
            </div>
          )}

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
          onClick={handlePlanToggle}
          className={`btn btn-sm ${inPlan ? 'btn-danger' : 'btn-primary'}`}
        >
          {inPlan ? '✓ In Your Plan' : '+ Add to Plan'}
        </button>
      </div>
    </div>
  );
}
