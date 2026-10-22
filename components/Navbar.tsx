'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlan } from '@/hooks/usePlan';

export default function Navbar() {
  const pathname = usePathname();
  const { count, isLoaded } = usePlan();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Attractions', href: '/attractions' },
    { label: 'My Plan', href: '/plan', badge: isLoaded && count > 0 ? count : null },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
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
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '2.4rem',
              height: '2.4rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.15rem',
              boxShadow: '0 2px 6px rgba(27, 67, 50, 0.3)',
            }}
          >
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                  transition: 'var(--transition)',
                }}
              >
                <span>{link.label}</span>
                {link.badge !== null && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '1.25rem',
                      height: '1.25rem',
                      padding: '0 0.35rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--accent)',
                      color: '#ffffff',
                    }}
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
            className="btn btn-sm btn-secondary"
            style={{
              fontSize: '0.8rem',
              padding: '0.4rem 0.75rem',
            }}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
