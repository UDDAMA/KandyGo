// app/admin/attractions/[id]/edit/page.tsx
// Edit Attraction Page (FR-020)

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import type { Attraction, Category } from '@/lib/types';
import AttractionForm from '@/components/AttractionForm';
import { updateAttractionAction } from '@/app/admin/actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Attraction — KandyGo Admin',
  description: 'Modify attraction details and guidelines.',
};

export default async function EditAttractionPage({ params }: PageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  if (isNaN(numId)) {
    notFound();
  }

  // Enforce designated administrator identity (fails closed)
  const { supabase } = await requireAdmin();

  const [attractionRes, categoriesRes] = await Promise.all([
    supabase.from('attractions').select('*').eq('id', numId).single(),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (attractionRes.error || !attractionRes.data) {
    notFound();
  }

  const attraction = attractionRes.data as Attraction;
  const categoryList = (categoriesRes.data || []) as Category[];

  // Bind the ID to the update action
  const boundAction = updateAttractionAction.bind(null, numId);

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
            Edit: {attraction.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Update attraction information, entrance rates, or travel tips.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <AttractionForm
            categories={categoryList}
            initialAttraction={attraction}
            action={boundAction}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}
