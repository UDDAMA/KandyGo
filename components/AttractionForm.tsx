'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import type { Category, Attraction } from '@/lib/types';

interface AttractionFormProps {
  categories: Category[];
  initialAttraction?: Attraction;
  action: (prevState: any, formData: FormData) => Promise<{ success: boolean; error?: string } | void>;
  isEditing?: boolean;
}

const initialState = {
  success: true,
  error: '',
};

export default function AttractionForm({
  categories,
  initialAttraction,
  action,
  isEditing = false,
}: AttractionFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {state?.error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
          }}
        >
          <strong>Error:</strong> {state.error}
        </div>
      )}

      {/* Row 1: Name & Category */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div>
          <label
            htmlFor="name"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Attraction Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initialAttraction?.name || ''}
            placeholder="e.g. Temple of the Sacred Tooth Relic"
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="category_id"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Category *
          </label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={initialAttraction?.category_id || (categories[0]?.id ?? '')}
            className="input"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
        >
          Full Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={initialAttraction?.description || ''}
          placeholder="Detailed historical, scenic, or cultural background..."
          className="input"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Travel Tips & Etiquette (FR-008) */}
      <div>
        <label
          htmlFor="travel_tips"
          style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
        >
          Travel Tips & Visitor Etiquette
        </label>
        <textarea
          id="travel_tips"
          name="travel_tips"
          rows={3}
          defaultValue={initialAttraction?.travel_tips || ''}
          placeholder="e.g. Dress modestly covering shoulders and knees. Remove shoes before entering..."
          className="input"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Row 2: Opening Hours & Estimated Duration */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div>
          <label
            htmlFor="opening_hours"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Opening Hours
          </label>
          <input
            id="opening_hours"
            name="opening_hours"
            type="text"
            defaultValue={initialAttraction?.opening_hours || ''}
            placeholder="e.g. Open daily 05:30–20:00"
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="visit_duration_minutes"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Estimated Visit Duration (minutes)
          </label>
          <input
            id="visit_duration_minutes"
            name="visit_duration_minutes"
            type="number"
            min="1"
            max="1440"
            defaultValue={initialAttraction?.visit_duration_minutes || ''}
            placeholder="e.g. 90"
            className="input"
          />
        </div>
      </div>

      {/* Row 3: Admission Rates (LKR & USD) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div>
          <label
            htmlFor="entrance_fee_lkr"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Entrance Fee (LKR)
          </label>
          <input
            id="entrance_fee_lkr"
            name="entrance_fee_lkr"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialAttraction?.entrance_fee_lkr ?? ''}
            placeholder="e.g. 1500 (leave blank if free)"
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="entrance_fee_usd"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Entrance Fee (USD Approx.)
          </label>
          <input
            id="entrance_fee_usd"
            name="entrance_fee_usd"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialAttraction?.entrance_fee_usd ?? ''}
            placeholder="e.g. 10"
            className="input"
          />
        </div>
      </div>

      {/* Row 4: Location Coordinates & Distance */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div>
          <label
            htmlFor="latitude"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Latitude *
          </label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            required
            defaultValue={initialAttraction?.latitude ?? ''}
            placeholder="e.g. 7.2936"
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="longitude"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Longitude *
          </label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            required
            defaultValue={initialAttraction?.longitude ?? ''}
            placeholder="e.g. 80.6412"
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="distance_km"
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}
          >
            Distance from Kandy (km)
          </label>
          <input
            id="distance_km"
            name="distance_km"
            type="number"
            step="0.1"
            defaultValue={initialAttraction?.distance_km ?? ''}
            placeholder="e.g. 0.9"
            className="input"
          />
        </div>
      </div>

      {/* Form Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
          marginTop: '1rem',
        }}
      >
        <Link href="/admin" className="btn btn-secondary">
          Cancel
        </Link>
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending
            ? 'Saving...'
            : isEditing
            ? 'Save Changes'
            : 'Create Attraction'}
        </button>
      </div>
    </form>
  );
}
