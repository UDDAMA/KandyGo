// app/page.tsx
// KandyGo Landing Page

import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Attraction } from '@/lib/types';

export const metadata = {
  title: 'KandyGo — Local Tourist Day-Visit Planner for Kandy, Sri Lanka',
  description:
    'Plan your perfect day trip around Kandy, Sri Lanka. Browse 10 iconic historical, scenic, and cultural destinations with interactive maps, entrance fee guides, and custom day itineraries.',
};

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  let featuredRes = await supabase
    .from('attractions')
    .select(`
      *,
      category:categories(id, name, description)
    `)
    .is('deleted_at', null)
    .limit(3);

  if (featuredRes.error && featuredRes.error.message?.includes('deleted_at')) {
    featuredRes = await supabase
      .from('attractions')
      .select(`
        *,
        category:categories(id, name, description)
      `)
      .limit(3);
  }

  const rawItems = (featuredRes.data || []) as unknown as Attraction[];
  const featuredItems = rawItems.filter((item) => !item.deleted_at);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Layer 1: Scenic Video Background */}
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/kandy-hero-poster.jpg"
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/kandy-hero.mp4" type="video/mp4" />
        </video>

        {/* Layer 2: Dark Semi-Transparent Scenic Overlay */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* Layer 3: Foreground Content (Heading, Description, Badges, Buttons) */}
        <div className="container hero-content">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span>🇱🇰</span> Kandy Day-Visit Planner
          </div>

          <h1 className="hero-title">
            Discover the Heart of Sri Lanka’s Hill Capital
          </h1>

          <p className="hero-description">
            Explore sacred heritage, highland mist, historic tea factories, and
            royal gardens. Select your stops, check visit durations, and build your
            customized 1-day travel itinerary.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <Link
              href="/attractions"
              className="btn btn-primary"
              style={{
                backgroundColor: 'var(--accent)',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                border: 'none',
              }}
            >
              Browse 10 Iconic Attractions →
            </Link>
            <Link
              href="/plan"
              className="btn btn-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              Open Your Itinerary
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section style={{ padding: '4rem 0 3rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            <div className="card card-interactive" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: '1.25rem',
                }}
              >
                🏛️
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Curated 10 Attractions
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Carefully preserved official dataset including the Temple of the Tooth,
                Peradeniya Gardens, Hanthana, Ceylon Tea Museum, and hidden waterfalls.
              </p>
            </div>

            <div className="card card-interactive" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: '1.25rem',
                }}
              >
                🗺️
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Interactive Leaflet Maps
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Pinpoint exact GPS coordinates and visualize every destination
                with clean, fast OpenStreetMap tiles and direct navigation links.
              </p>
            </div>

            <div className="card card-interactive" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: '1.25rem',
                }}
              >
                ⏱️
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Smart Day Planner
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Sequence your stops in your browser, check total time commitments,
                and estimate admission expenses without needing visitor sign-up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Preview */}
      {featuredItems.length > 0 && (
        <section
          style={{
            padding: '2rem 0 5rem',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                  Preview
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                  Featured Destinations
                </h2>
              </div>
              <Link href="/attractions" className="btn btn-outline btn-sm">
                View All 10 Attractions →
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="card card-interactive"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
                      {item.category?.name || 'Heritage'}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      <Link href={`/attractions/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        marginBottom: '1.25rem',
                      }}
                    >
                      {item.description.slice(0, 110)}…
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      📍 {item.distance_km} km away
                    </span>
                    <Link href={`/attractions/${item.id}`} className="btn btn-secondary btn-sm">
                      Details & Map →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
