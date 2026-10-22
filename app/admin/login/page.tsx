// app/admin/login/page.tsx
// Admin Login Page (FR-018)

import Link from 'next/link';
import AdminLoginForm from '@/components/AdminLoginForm';

export const metadata = {
  title: 'Admin Sign In — KandyGo',
  description: 'Administrator authentication for managing KandyGo attractions.',
};

export default function AdminLoginPage() {
  return (
    <div style={{ padding: '4rem 1.5rem', minHeight: 'calc(100vh - 12rem)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '3.2rem',
                height: '3.2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.4rem',
                marginBottom: '1rem',
                boxShadow: '0 4px 10px rgba(27, 67, 50, 0.3)',
              }}
            >
              K
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              Administrator Sign In
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Sign in with your Supabase administrator account to manage attractions and categories.
            </p>
          </div>

          <AdminLoginForm />

          <div
            style={{
              textAlign: 'center',
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>
              ← Return to Visitor Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
