'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlan } from '@/hooks/usePlan';

export default function Navbar() {
  const pathname = usePathname();
  const { count, isLoaded } = usePlan();

  const navLinks: { label: string; href: string; badge?: number | null }[] = [
    { label: 'Home', href: '/' },
    { label: 'Attractions', href: '/attractions' },
    { label: 'My Plan', href: '/plan', badge: isLoaded && count > 0 ? count : null },
  ];

  const isAdminActive = pathname.startsWith('/admin');

  return (
    <header className="navbar-header">
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem',
        }}
      >
        {/* Brand */}
        <Link href="/" className="nav-brand" aria-label="KandyGo Homepage">
          <div className="nav-brand-icon">
            K
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Kandy<span style={{ color: 'var(--accent)' }}>Go</span>
            </span>
            <span
              className="nav-brand-subtitle"
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Day-Visit Planner
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

          <div
            style={{
              width: '1px',
              height: '1.5rem',
              backgroundColor: 'var(--border)',
              margin: '0 0.5rem',
            }}
          />

          <Link
            href="/admin"
            className={`nav-admin-btn ${isAdminActive ? 'active' : ''}`}
            aria-current={isAdminActive ? 'page' : undefined}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
