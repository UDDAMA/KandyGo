// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'KandyGo — Local Tourist Day-Visit Planner for Kandy, Sri Lanka',
  description:
    'Plan your perfect day trip around Kandy, Sri Lanka. Browse 10 iconic historical, scenic, and cultural destinations with interactive maps, entrance fee guides, and custom day itineraries.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border)',
            padding: '2.5rem 0 2rem',
            marginTop: 'auto',
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                }}
              >
                Kandy<span style={{ color: 'var(--accent)' }}>Go</span>
              </div>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem',
                }}
              >
                Kandy Local Day-Visit Planner · University Group Project (ITE2953)
              </p>
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textAlign: 'right',
              }}
            >
              <p>Built with Next.js, React, Supabase PostgreSQL, and Leaflet / OSM.</p>
              <p style={{ marginTop: '0.25rem' }}>
                Featuring the 10 iconic attractions in and around Kandy, Sri Lanka.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
