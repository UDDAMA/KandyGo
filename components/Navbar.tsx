'use client';

// components/Navbar.tsx
// Scroll-reactive forest-green glass header for KandyGo

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlan } from '@/hooks/usePlan';

export default function Navbar() {
  const pathname = usePathname();
  const { count, isLoaded } = usePlan();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 48;
      setIsScrolled((prev) => (prev !== shouldBeScrolled ? shouldBeScrolled : prev));
    };

    // Check position on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header navigation contains exclusively: Home, Attractions, and My Plan
  // About and Admin are placed exclusively in the footer.
  const navLinks: { label: string; href: string; badge?: number | null }[] = [
    { label: 'Home', href: '/' },
    { label: 'Attractions', href: '/attractions' },
    { label: 'My Plan', href: '/plan', badge: isLoaded && count > 0 ? count : null },
  ];

  const headerStateClass = isHome
    ? isScrolled
      ? 'navbar-home-scrolled'
      : 'navbar-home-top'
    : 'navbar-page';

  return (
    <>
      <header className={`navbar-header ${headerStateClass}`}>
        <div className="container navbar-container">
          {/* Brand Wordmark (Standalone K icon removed) */}
          <Link href="/" className="nav-brand" aria-label="KandyGo Homepage">
            <div className="nav-brand-text">
              <span className="nav-brand-title">
                Kandy<span className="nav-brand-go">Go</span>
              </span>
              <span className="nav-brand-subtitle">
                Day-Visit Planner
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links-wrap" aria-label="Primary Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{link.label}</span>
                  {typeof link.badge === 'number' && link.badge > 0 && (
                    <span
                      className="nav-badge"
                      aria-label={`${link.badge} items in plan`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* When not on homepage, provide a layout spacer so fixed navbar never occludes content */}
      {!isHome && <div className="navbar-spacer" aria-hidden="true" />}
    </>
  );
}
