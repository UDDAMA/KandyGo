// app/about/page.tsx
// Project About Page (Purpose, Objectives, Architecture, and Project Contributor)

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About KandyGo — Local Tourist Day-Visit Planner',
  description:
    'Learn about the purpose, objectives, architecture, and project contributor behind KandyGo, the tourist day-visit planner for Kandy, Sri Lanka.',
};

export default function AboutPage() {
  const techStack = [
    {
      name: 'Next.js 16 (App Router)',
      category: 'Web Framework',
      desc: 'Modern React framework featuring Turbopack, React Server Components (RSC), and robust Server Actions for high performance and fast builds.',
    },
    {
      name: 'React 19 & TypeScript',
      category: 'UI & Language',
      desc: 'Interactive UI components with end-to-end type safety, modern hooks, and optimistic state handling.',
    },
    {
      name: 'Supabase & PostgreSQL',
      category: 'Database & Auth',
      desc: 'Relational data persistence with strict Row-Level Security (RLS) policies, session authentication, and fail-closed administrative access.',
    },
    {
      name: 'Leaflet & OpenStreetMap',
      category: 'Interactive Mapping',
      desc: 'Fast, lightweight client-side spatial mapping for pinpointing exact geographic coordinates across Kandy without proprietary map lock-in.',
    },
    {
      name: 'Vanilla CSS Design System',
      category: 'Styling & Tokens',
      desc: 'Handcrafted CSS design system utilizing design tokens, CSS Grid/Flexbox, and accessibility standards without bloated external CSS libraries.',
    },
    {
      name: 'LocalStorage Engine',
      category: 'Client Persistence',
      desc: 'Private, zero-friction client-side itinerary persistence allowing visitors to build, reorder, and print day plans without mandatory sign-up.',
    },
  ];

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header / Intro */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary-subtle)',
              border: '1px solid rgba(27, 67, 50, 0.2)',
              color: 'var(--primary)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            <span>🎓</span> University Project · ITE2953 (25S2)
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--primary-text)',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            About Kandy<span style={{ color: 'var(--accent)' }}>Go</span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            A dedicated local tourist day-visit planning platform designed to make exploring
            Sri Lanka’s historic hill capital seamless, culturally rich, and fully accessible.
          </p>
        </div>

        {/* Section 1: Project Overview & Objectives */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            marginBottom: '2.5rem',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              Academic Context
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Project Overview & Objectives
            </h2>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            KandyGo was conceptualized and developed as part of the university curriculum for{' '}
            <strong>ITE2953 (Programming Group Project)</strong> for Semester 25S2. The objective
            is to solve real-world logistical challenges faced by day visitors and independent
            travelers touring Kandy, a UNESCO World Heritage city renowned for sacred temples, royal
            botanical sanctuaries, and scenic misty tea plantations.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginTop: '1.5rem',
            }}
          >
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🎯</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Curated Regional Catalog
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Providing accurate, unbloated data on the 10 iconic historical and scenic landmarks,
                with admission fees and opening hours.
              </p>
            </div>

            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🧭</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Zero-Friction Planning
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Enabling travelers to sequence visits, calculate estimated budgets in LKR & USD,
                and print day itineraries without mandatory account sign-up.
              </p>
            </div>

            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Robust System Architecture
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Demonstrating full-stack engineering rigor with PostgreSQL Row-Level Security,
                audit-safe soft deletion, and Next.js 16 Server Components.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Core Purpose & Design Principles */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            marginBottom: '2.5rem',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              Design Philosophy
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Core Purpose & Visitor-Centric Principles
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                1. Respect Visitor Autonomy
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Unlike commercial travel portals that enforce paywalls or forced registration to save a plan,
                KandyGo stores itineraries directly in client localStorage. Your data remains on your device
                with zero tracking.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                2. Cultural Authenticity
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Every landmark description, historical significance, dress-code etiquette, and admission guideline
                is reviewed to provide genuine, respectful travel guidance for sacred temples and cultural reserves.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                3. High-Performance & Accessible
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                Built with a lightweight custom design system without heavyweight UI libraries, ensuring rapid
                page loads, high contrast readability, and graceful degradation on intermittent mobile network connections.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Technology Stack */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              Architecture
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Technology Stack
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="card"
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {tech.category}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--primary-text)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {tech.name}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {tech.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Compact Project Contributor Section */}
        <div
          className="card"
          style={{
            padding: '2.25rem',
            marginBottom: '3rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary">Academic Assessment</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Project Contributor
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Course Module: <strong>ITE2953 — Programming Group Project</strong> (Semester 25S2)
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '0.75rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              padding: '1.25rem 1.75rem',
              borderRadius: 'var(--radius-md)',
              minWidth: '280px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Name:</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Samarakoon SMKGU
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Index number:</span>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  fontFamily: 'monospace',
                  backgroundColor: '#ffffff',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                }}
              >
                E2410553
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: '#1b4332',
            color: '#ffffff',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Ready to Explore Kandy?
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.88)',
              fontSize: '1rem',
              maxWidth: '520px',
              margin: '0 auto 1.5rem',
              lineHeight: 1.6,
            }}
          >
            Browse the ten iconic heritage destinations, inspect detailed visitor advice, and build your customized day visit.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/attractions"
              className="btn btn-primary"
              style={{
                backgroundColor: '#fbbf24',
                color: '#1b4332',
                border: 'none',
                fontWeight: 700,
                padding: '0.75rem 1.5rem',
              }}
            >
              Browse 10 Attractions →
            </Link>
            <Link
              href="/plan"
              className="btn btn-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.75rem 1.5rem',
              }}
            >
              Open Your Itinerary
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
