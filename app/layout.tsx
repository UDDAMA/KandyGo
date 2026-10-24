// app/layout.tsx
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Navbar from '@/components/Navbar';
import RouteLoadingIndicator from '@/components/RouteLoadingIndicator';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

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
    <html lang="en" className={playfair.variable}>
      <body>
        <RouteLoadingIndicator />
        <Navbar />
        <main>{children}</main>
        <footer className="footer-wrap">
          <div className="container footer-container">
            {/* Left side: Exactly 3 lines */}
            <div className="footer-left">
              <div className="footer-line">ITE2953 - Programming Group Project 25S2</div>
              <div className="footer-line">E2410553</div>
              <div className="footer-line">&copy; 2026</div>
            </div>

            {/* Right side: Only About and Admin links */}
            <nav className="footer-nav" aria-label="Footer Navigation">
              <Link href="/about" className="footer-link">
                About
              </Link>
              <Link href="/admin" className="footer-link">
                Admin
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
