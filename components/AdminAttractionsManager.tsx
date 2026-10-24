'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Attraction } from '@/lib/types';
import AdminDeleteButton from '@/components/AdminDeleteButton';
import AdminRestoreButton from '@/components/AdminRestoreButton';
import AdminPermanentDeleteButton from '@/components/AdminPermanentDeleteButton';

interface AdminAttractionsManagerProps {
  attractions: Attraction[];
}

export default function AdminAttractionsManager({ attractions }: AdminAttractionsManagerProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'bin'>('active');
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice(null);
    }, 4000);
  };

  const activeAttractions = attractions.filter((a) => !a.deleted_at);
  const deletedAttractions = attractions.filter((a) => !!a.deleted_at);

  return (
    <div>
      {/* Toast Notice */}
      {notice && (
        <div className="toast-notice" role="status">
          <span>✓</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.75rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '0.925rem',
            fontWeight: activeTab === 'active' ? 700 : 500,
            cursor: 'pointer',
            backgroundColor: activeTab === 'active' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'active' ? '#ffffff' : 'var(--text-main)',
            transition: 'var(--transition)',
          }}
        >
          <span>Active Attractions</span>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeTab === 'active' ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-subtle)',
              color: activeTab === 'active' ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            {activeAttractions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bin')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '0.925rem',
            fontWeight: activeTab === 'bin' ? 700 : 500,
            cursor: 'pointer',
            backgroundColor: activeTab === 'bin' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'bin' ? '#ffffff' : 'var(--text-main)',
            transition: 'var(--transition)',
          }}
        >
          <span>🗑️ Recycle Bin</span>
          {deletedAttractions.length > 0 && (
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'bin' ? 'rgba(255, 255, 255, 0.25)' : '#fee2e2',
                color: activeTab === 'bin' ? '#ffffff' : '#991b1b',
                fontWeight: 700,
              }}
            >
              {deletedAttractions.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Active Attractions */}
      {activeTab === 'active' && (
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
              {activeAttractions.map((item, index) => (
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
                      <AdminDeleteButton
                        id={item.id}
                        name={item.name}
                        onSuccess={() => showNotice(`Moved "${item.name}" to Recycle Bin.`)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activeAttractions.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active attractions. Click &ldquo;+ Add New Attraction&rdquo; to create one, or restore items from the Recycle Bin.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Recycle Bin */}
      {activeTab === 'bin' && (
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            overflowX: 'auto',
          }}
        >
          {deletedAttractions.length > 0 ? (
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
                    backgroundColor: '#fffbeb',
                    color: '#92400e',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '0.85rem 1rem' }}>#</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Attraction Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Deleted Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Distance</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Recycle Bin Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedAttractions.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: 'rgba(254, 242, 242, 0.3)',
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{item.name}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600,
                          }}
                        >
                          In Bin
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge">{item.category?.name || 'Unassigned'}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      {item.deleted_at
                        ? new Date(item.deleted_at).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {item.distance_km !== null ? `${item.distance_km} km` : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AdminRestoreButton
                          id={item.id}
                          name={item.name}
                          onSuccess={() => showNotice(`Restored "${item.name}" to active attractions.`)}
                        />
                        <AdminPermanentDeleteButton
                          id={item.id}
                          name={item.name}
                          onSuccess={() => showNotice(`Permanently deleted "${item.name}".`)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗑️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-text)', marginBottom: '0.35rem' }}>
                Recycle Bin is Empty
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
                Deleted attractions will appear here. You can safely restore them to public view or permanently remove them.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
