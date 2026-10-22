'use client';

import { usePlan } from '@/hooks/usePlan';
import type { Attraction } from '@/lib/types';
import { useState } from 'react';

export default function PlanActionButton({ attraction }: { attraction: Attraction }) {
  const { isInPlan, addToPlan, removeFromPlan } = usePlan();
  const inPlan = isInPlan(attraction.id);
  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = () => {
    if (inPlan) {
      removeFromPlan(attraction.id);
      setToast(`Removed "${attraction.name}" from your plan.`);
    } else {
      const res = addToPlan(attraction);
      setToast(res.message);
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className={`btn ${inPlan ? 'btn-danger' : 'btn-primary'}`}
        style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
      >
        {inPlan ? '✓ In Your Plan (Click to Remove)' : '+ Add to One-Day Plan'}
      </button>

      {toast && (
        <div className="toast-notice">
          <span>ℹ️</span>
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}
