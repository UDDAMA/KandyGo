// app/admin/page.tsx
// Administrator Dashboard (FR-018, FR-022, FR-023)

import Link from 'next/link';
import type { Attraction } from '@/lib/types';
import { requireAdmin } from '@/lib/auth';
import AdminDeleteButton from '@/components/AdminDeleteButton';
import AdminLogoutButton from '@/components/AdminLogoutButton';

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

        {/* Attractions Table */}
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid var(--border)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '0.85rem 1rem' }}>#</th>
                <th style={{ padding: '0.85rem 1rem' }}>Attraction Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.85rem 1rem' }}>Distance</th>
                <th style={{ padding: '0.85rem 1rem' }}>Admission</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                    <Link
                      href={`/attractions/${item.id}`}
                      style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-primary">{item.category?.name || 'Unassigned'}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {item.visit_duration_minutes ? `${item.visit_duration_minutes}m` : '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {item.distance_km !== null ? `${item.distance_km} km` : '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {item.entrance_fee_lkr ? `LKR ${Number(item.entrance_fee_lkr).toLocaleString()}` : 'Free'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Link
                        href={`/admin/attractions/${item.id}/edit`}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                      >
                        Edit
                      </Link>
                      <AdminDeleteButton id={item.id} name={item.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No attractions in the database. Click "+ Add New Attraction" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
