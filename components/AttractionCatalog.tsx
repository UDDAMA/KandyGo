'use client';

import { useState, useMemo } from 'react';
import type { Attraction, Category } from '@/lib/types';
import AttractionCard from '@/components/AttractionCard';
import ItineraryDurationProgress from '@/components/ItineraryDurationProgress';

interface AttractionCatalogProps {
  attractions: Attraction[];
  categories: Category[];
}

export default function AttractionCatalog({
  attractions,
  categories,
}: AttractionCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'distance' | 'duration'>('name');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filter and sort items
  const filteredAttractions = useMemo(() => {
    return attractions
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
          return false;
        }

        // Search filter
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(q);
          const descMatch = item.description.toLowerCase().includes(q);
          const catMatch = item.category?.name.toLowerCase().includes(q);
          if (!nameMatch && !descMatch && !catMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return (a.distance_km ?? 999) - (b.distance_km ?? 999);
        }
        if (sortBy === 'duration') {
          return (a.visit_duration_minutes ?? 0) - (b.visit_duration_minutes ?? 0);
        }
        return a.name.localeCompare(b.name);
      });
  }, [attractions, selectedCategory, searchTerm, sortBy]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <div style={{ padding: '2.5rem 0 7.5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Curated Local Attractions
          </span>
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: 'var(--primary-text)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Explore Kandy’s Top Destinations
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Discover sacred temples, tea trails, scenic mountain viewpoints, and
            lush gardens. Filter by category, inspect travel advisories, and add
            stops to your custom 1-day itinerary.
          </p>
        </div>

        {/* Itinerary Duration Progress Bar */}
        <ItineraryDurationProgress />

        {/* Search & Filter Controls */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by name, category, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '1rem',
                }}
              >
                🔍
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: 'flex-end',
              }}
            >
              <label
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input"
                style={{ width: 'auto', padding: '0.55rem 1rem' }}
              >
                <option value="name">Name (A–Z)</option>
                <option value="distance">Distance (Nearest First)</option>
                <option value="duration">Visit Duration (Shortest First)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginRight: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Categories:
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn btn-sm ${
                selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              All ({attractions.length})
            </button>

            {categories.map((cat) => {
              const count = attractions.filter((a) => a.category_id === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn btn-sm ${
                    isSelected ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '0 0.25rem',
          }}
        >
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredAttractions.length}</strong> of{' '}
            <strong>{attractions.length}</strong> attractions
          </p>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Attractions Grid */}
        {filteredAttractions.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredAttractions.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                onNotice={showToast}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div
            className="card"
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No attractions match your search
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                maxWidth: '400px',
                margin: '0 auto 1.5rem',
              }}
            >
              Try adjusting your search terms or clearing the selected category
              filter to view all attractions.
            </p>
            <button onClick={resetFilters} className="btn btn-primary">
              View All 10 Attractions
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <span>ℹ️</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
