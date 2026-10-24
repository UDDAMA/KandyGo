// app/attractions/[id]/page.tsx
// Attraction Detail Page (FR-006 through FR-010)

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Attraction } from '@/lib/types';
import AttractionMapWrapper from '@/components/AttractionMapWrapper';
import PlanActionButton from '@/components/PlanActionButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: attraction } = await supabase
    .from('attractions')
    .select('name, description, deleted_at')
    .eq('id', id)
    .single();

  if (!attraction || attraction.deleted_at) {
    return { title: 'Attraction Not Found — KandyGo' };
  }

  return {
    title: `${attraction.name} — KandyGo`,
    description: attraction.description.slice(0, 160),
  };
}

export default async function AttractionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  if (isNaN(numId)) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('attractions')
    .select(`
      *,
      category:categories(id, name, description)
    `)
    .eq('id', numId)
    .single();

  if (error || !data || data.deleted_at) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Attraction Not Found
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We could not locate this attraction in the KandyGo database.
          </p>
          <Link href="/attractions" className="btn btn-primary">
            ← Back to All Attractions
          </Link>
        </div>
      </div>
    );
  }

  const attraction = data as Attraction;

  // Format entrance fee
  let feeFormatted = 'Free Admission';
  if (attraction.entrance_fee_lkr) {
    feeFormatted = `LKR ${Number(attraction.entrance_fee_lkr).toLocaleString()}`;
    if (attraction.entrance_fee_usd) {
      feeFormatted += ` (Approx. $${Number(attraction.entrance_fee_usd)} USD)`;
    }
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.75rem',
          }}
        >
          <Link href="/" style={{ textDecoration: 'underline' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/attractions" style={{ textDecoration: 'underline' }}>
            Attractions
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
            {attraction.name}
          </span>
        </nav>

        {/* Header Title Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <span className="badge badge-primary">
              {attraction.category?.name || 'Attraction'}
            </span>
            {attraction.distance_km !== null && (
              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                📍 {attraction.distance_km} km from Kandy City Centre
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--primary-text)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {attraction.name}
          </h1>
        </div>

        {/* Attraction Imagery Showcase (if images exist) */}
        {(attraction.image_url || attraction.secondary_image_url) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                attraction.image_url && attraction.secondary_image_url
                  ? 'repeat(auto-fit, minmax(280px, 1fr))'
                  : '1fr',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            {attraction.image_url && (
              <div
                className="card"
                style={{
                  height: '320px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <img
                  src={attraction.image_url}
                  alt={attraction.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            {attraction.secondary_image_url && (
              <div
                className="card"
                style={{
                  height: '320px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <img
                  src={attraction.secondary_image_url}
                  alt={`${attraction.name} (Alternative view)`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Two-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Details & Practical Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Overview / Description */}
            <section
              className="card"
              style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)' }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>📖</span> About This Destination
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-line',
                }}
              >
                {attraction.description}
              </p>
            </section>

            {/* Travel Tips & Etiquette Advisory (FR-008) */}
            {attraction.travel_tips && (
              <section
                className="card"
                style={{
                  padding: '2rem',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#92400e',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>💡</span> Travel Tips & Visitor Etiquette
                </h2>
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: '#78350f',
                  }}
                >
                  {attraction.travel_tips}
                </p>
              </section>
            )}

            {/* Practical Information Grid (FR-007, FR-009, FR-015) */}
            <section
              className="card"
              style={{
                padding: '2rem',
                backgroundColor: 'var(--bg-surface)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  🕒 Opening Hours
                </span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {attraction.opening_hours || 'Open / Accessible anytime'}
                </p>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  ⏱ Estimated Duration
                </span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {attraction.visit_duration_minutes
                    ? `${attraction.visit_duration_minutes} minutes`
                    : 'Flexible'}
                </p>
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  🎟 Admission Rates
                </span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {feeFormatted}
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: Actions & Leaflet Interactive Map (FR-010, FR-011) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              position: 'sticky',
              top: '5.5rem',
            }}
          >
            {/* Itinerary CTA Card */}
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
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--text-main)',
                }}
              >
                Plan Your Day Visit
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem',
                }}
              >
                Add this destination to your one-day visit itinerary to calculate
                total trip duration and entrance expenses.
              </p>
              <PlanActionButton attraction={attraction} />
            </div>

            {/* Interactive Map (FR-010) */}
            <div
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>🗺️</span> Interactive Map
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  OpenStreetMap
                </span>
              </div>

              <AttractionMapWrapper
                latitude={Number(attraction.latitude)}
                longitude={Number(attraction.longitude)}
                name={attraction.name}
                categoryName={attraction.category?.name}
                height="340px"
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>
                  GPS: {Number(attraction.latitude).toFixed(4)},{' '}
                  {Number(attraction.longitude).toFixed(4)}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${attraction.latitude},${attraction.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  External Directions ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
