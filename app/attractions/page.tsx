// app/attractions/page.tsx
// Attractions Catalog Page (FR-001 through FR-005)

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Attraction, Category } from '@/lib/types';
import AttractionCatalog from '@/components/AttractionCatalog';

export const metadata = {
  title: 'Attractions in Kandy — KandyGo',
  description:
    'Browse, search, and filter the top 10 iconic tourist destinations in and around Kandy, Sri Lanka. Detailed visitor guides, opening hours, entrance fees, and interactive maps.',
};

export default async function AttractionsPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch categories and attractions in parallel from Supabase
  const [categoriesRes, attractionsRes] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('attractions')
      .select(`
        *,
        category:categories(id, name, description)
      `)
      .order('name'),
  ]);

  // Handle any database retrieval failure gracefully
  if (attractionsRes.error || categoriesRes.error) {
    console.error('Failed to load attractions from Supabase:', {
      attractionsError: attractionsRes.error,
      categoriesError: categoriesRes.error,
    });

    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem', maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Unable to Load Attractions
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We encountered an issue fetching data from the Supabase database. Please check your network connection or try reloading the page.
          </p>
          <a href="/attractions" className="btn btn-primary">
            Retry Loading
          </a>
        </div>
      </div>
    );
  }

  const attractions = (attractionsRes.data || []) as Attraction[];
  const categories = (categoriesRes.data || []) as Category[];

  return <AttractionCatalog attractions={attractions} categories={categories} />;
}
