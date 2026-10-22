'use client';

// app/plan/page.tsx
// One-Day Itinerary Planner (FR-011 through FR-015)

import Link from 'next/link';
import { usePlan } from '@/hooks/usePlan';

export default function PlanPage() {
  const {
    items,
    isLoaded,
    count,
    removeFromPlan,
    moveItem,
    clearPlan,
    totalMinutes,
    totalFeeLKR,
  } = usePlan();

  // Convert minutes into hours and minutes
  const formatTime = (mins: number) => {
    if (mins === 0) return '0 mins';
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    if (hours === 0) return `${remainder} mins`;
    if (remainder === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${hours} hr${hours > 1 ? 's' : ''} ${remainder} mins`;
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your current one-day visit plan?')) {
      clearPlan();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isLoaded) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading your day plan...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1.5rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              One-Day Itinerary Planner
            </span>
            <h1
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: 'var(--primary-text)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Your Kandy Day Plan
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '1rem' }}>
              Organise, reorder, and review your planned stops for a seamless day trip.
            </p>
          </div>

          {count > 0 && (
            <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
              <button onClick={handlePrint} className="btn btn-secondary btn-sm">
                🖨️ Print / Save Plan
              </button>
              <button onClick={handleClear} className="btn btn-danger btn-sm">
                Clear Plan
              </button>
            </div>
          )}
        </div>

        {count === 0 ? (
          /* Empty State */
          <div
            className="card"
            style={{
              padding: '4rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              maxWidth: '600px',
              margin: '2rem auto',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Your visit plan is currently empty
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                marginBottom: '1.75rem',
                lineHeight: 1.6,
              }}
            >
              Browse our directory of 10 curated attractions in Kandy, Sri Lanka,
              and click <strong>“+ Add to Plan”</strong> on any destination to
              calculate your route and schedule.
            </p>
            <Link href="/attractions" className="btn btn-primary">
              Explore Attractions Catalog →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left: Ordered Stops List */}
            <div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>📍</span> Sequence of Stops ({count})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      backgroundColor: 'var(--bg-surface)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Step Number Circle */}
                      <div
                        style={{
                          width: '2.25rem',
                          height: '2.25rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                            <Link
                              href={`/attractions/${item.id}`}
                              style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                              {item.name}
                            </Link>
                          </h3>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginTop: '0.35rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            {item.category_name}
                          </span>
                          {item.visit_duration_minutes && (
                            <span>⏱ {item.visit_duration_minutes} mins</span>
                          )}
                          {item.entrance_fee_lkr && (
                            <span>• 🎟 LKR {Number(item.entrance_fee_lkr).toLocaleString()}</span>
                          )}
                          {item.distance_km !== null && (
                            <span>• 📍 {item.distance_km} km away</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Controls (Move Up/Down, Remove) */}
                    <div
                      className="no-print"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        flexShrink: 0,
                      }}
                    >
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Move stop earlier"
                      >
                        ▲
                      </button>

                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === items.length - 1}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Move stop later"
                      >
                        ▼
                      </button>

                      <button
                        onClick={() => removeFromPlan(item.id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Remove stop"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem' }} className="no-print">
                <Link href="/attractions" className="btn btn-outline">
                  + Add More Attractions
                </Link>
              </div>
            </div>

            {/* Right: Plan Summary & Time Budget (FR-015) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'sticky',
                top: '5.5rem',
              }}
            >
              <div
                className="card"
                style={{
                  padding: '1.75rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '2px solid var(--primary-subtle)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    marginBottom: '1.25rem',
                  }}
                >
                  Itinerary Time & Cost Summary
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Total Planned Stops:
                    </span>
                    <strong style={{ fontSize: '1rem' }}>{count} destinations</strong>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Est. On-Site Duration:
                    </span>
                    <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                      {formatTime(totalMinutes)}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Est. Total Entrance Fees:
                    </span>
                    <strong style={{ fontSize: '1rem' }}>
                      {totalFeeLKR > 0
                        ? `LKR ${totalFeeLKR.toLocaleString()}`
                        : 'Free Entry'}
                    </strong>
                  </div>
                </div>

                {/* Day feasibility hint */}
                <div
                  style={{
                    backgroundColor: totalMinutes > 480 ? '#fff1f2' : 'var(--primary-subtle)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: totalMinutes > 480 ? '#9f1239' : 'var(--primary)',
                    marginBottom: '1.25rem',
                  }}
                >
                  {totalMinutes > 480 ? (
                    <span>
                      ⚠️ <strong>Full Schedule:</strong> Over 8 hours of estimated on-site visiting planned. Note: Transit time between stops is not included. Consider spacing stops across two days.
                    </span>
                  ) : (
                    <span>
                      ✅ <strong>Day Feasible:</strong> Estimated on-site visit duration fits comfortably within a sightseeing day. Note: Travel/transit time between stops is not included.
                    </span>
                  )}
                </div>

                <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={handlePrint} className="btn btn-primary" style={{ width: '100%' }}>
                    🖨️ Print or Save as PDF
                  </button>
                  <Link href="/attractions" className="btn btn-secondary" style={{ width: '100%' }}>
                    Back to Catalog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
