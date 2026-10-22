// app/admin/attractions/new/page.tsx
// Add Attraction Page (FR-019)

import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import type { Category } from '@/lib/types';
import AttractionForm from '@/components/AttractionForm';
import { createAttractionAction } from '@/app/admin/actions';

export const metadata = {
  title: 'Add New Attraction — KandyGo Admin',
  description: 'Create and publish a new attraction in Kandy.',
};

export default async function NewAttractionPage() {
  // Enforce designated administrator identity (fails closed)
  const { supabase } = await requireAdmin();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const categoryList = (categories || []) as Category[];

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            href="/admin"
            style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
          >
            ← Back to Admin Dashboard
          </Link>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--primary-text)',
              marginTop: '0.5rem',
            }}
          >
            Add New Attraction
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Provide all necessary details, coordinates, and visitor guidelines to publish a new destination.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <AttractionForm
            categories={categoryList}
            action={createAttractionAction}
            isEditing={false}
          />
        </div>
      </div>
    </div>
  );
}
