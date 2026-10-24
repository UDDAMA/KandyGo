// app/admin/page.tsx
// Administrator Dashboard (FR-018, FR-022, FR-023)

import Link from 'next/link';
import type { Attraction } from '@/lib/types';
import { requireAdmin } from '@/lib/auth';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import AdminAttractionsManager from '@/components/AdminAttractionsManager';

export const metadata = {
  title: 'Admin Dashboard — KandyGo',
  description: 'Manage attractions, categories, and site data.',
};

export default async function AdminDashboardPage() {
  // Enforce designated administrator identity (fails closed)
  const { supabase, user } = await requireAdmin();

  const { data: attractions, error } = await supabase
    .from('attractions')
    .select(`
      *,
      category:categories(id, name, description)
    `)
    .order('id');

  const items = (attractions || []) as Attraction[];

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.25rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary">Admin Control Center</span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                👤 {user.email}
              </span>
            </div>
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                color: 'var(--primary-text)',
                letterSpacing: '-0.02em',
              }}
            >
              Attractions Management
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/admin/attractions/new" className="btn btn-primary">
              + Add New Attraction
            </Link>
            <AdminLogoutButton />
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
            }}
          >
            Failed to load attractions from Supabase: {error.message}
          </div>
        )}

        {/* Tabbed Attractions & Recycle Bin Manager */}
        <AdminAttractionsManager attractions={items} />
      </div>
    </div>
  );
}
