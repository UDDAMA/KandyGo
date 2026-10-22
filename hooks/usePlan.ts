'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PlanItem, Attraction } from '@/lib/types';

const STORAGE_KEY = 'kandygo_visit_plan';
const EVENT_NAME = 'kandygo_plan_changed';

export function usePlan() {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load visit plan from localStorage:', err);
    } finally {
      setIsLoaded(true);
    }

    // Listen for cross-tab or same-window updates
    const handleStorageChange = () => {
      try {
        const updated = localStorage.getItem(STORAGE_KEY);
        setItems(updated ? JSON.parse(updated) : []);
      } catch (err) {
        console.error('Failed to parse updated visit plan:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(EVENT_NAME, handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(EVENT_NAME, handleStorageChange);
    };
  }, []);

  // Save to localStorage and dispatch event
  const persist = useCallback((newItems: PlanItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (err) {
      console.error('Failed to save visit plan to localStorage:', err);
    }
  }, []);

  // Check if an attraction is in the plan
  const isInPlan = useCallback(
    (id: number) => {
      return items.some((item) => item.id === id);
    },
    [items]
  );

  // Add attraction to plan (Duplicate prevention)
  const addToPlan = useCallback(
    (attraction: Attraction | PlanItem): { success: boolean; message: string } => {
      if (items.some((i) => i.id === attraction.id)) {
        return { success: false, message: 'Attraction is already in your itinerary.' };
      }

      const categoryName =
        'category' in attraction && attraction.category
          ? attraction.category.name
          : 'category_name' in attraction
          ? attraction.category_name
          : 'General';

      const newItem: PlanItem = {
        id: attraction.id,
        name: attraction.name,
        category_name: categoryName,
        visit_duration_minutes: attraction.visit_duration_minutes ?? null,
        entrance_fee_lkr: attraction.entrance_fee_lkr ?? null,
        distance_km: attraction.distance_km ?? null,
      };

      const updated = [...items, newItem];
      persist(updated);
      return { success: true, message: `Added ${attraction.name} to your plan.` };
    },
    [items, persist]
  );

  // Remove attraction from plan
  const removeFromPlan = useCallback(
    (id: number) => {
      const updated = items.filter((item) => item.id !== id);
      persist(updated);
    },
    [items, persist]
  );

  // Reorder stops up or down
  const moveItem = useCallback(
    (index: number, direction: 'up' | 'down') => {
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === items.length - 1)
      ) {
        return;
      }
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const updated = [...items];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      persist(updated);
    },
    [items, persist]
  );

  // Clear plan
  const clearPlan = useCallback(() => {
    persist([]);
  }, [persist]);

  // Aggregate totals
  const totalMinutes = items.reduce(
    (sum, item) => sum + (item.visit_duration_minutes || 0),
    0
  );

  const totalFeeLKR = items.reduce(
    (sum, item) => sum + (Number(item.entrance_fee_lkr) || 0),
    0
  );

  return {
    items,
    isLoaded,
    count: items.length,
    isInPlan,
    addToPlan,
    removeFromPlan,
    moveItem,
    clearPlan,
    totalMinutes,
    totalFeeLKR,
  };
}
