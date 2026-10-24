// lib/types.ts
// Shared TypeScript types for KandyGo.
// Import these anywhere you work with attractions, categories, or the visit plan.

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Attraction {
  id: number;
  name: string;
  category_id: number;
  category: Category; // joined from the categories table
  description: string;
  opening_hours: string | null;
  travel_tips: string | null;
  visit_duration_minutes: number | null;
  entrance_fee_lkr: number | null;
  entrance_fee_usd: number | null;
  latitude: number;
  longitude: number;
  distance_km: number | null;
  image_url: string | null;
  secondary_image_url?: string | null; // Optional secondary image for hover crossfade
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null; // null if active; timestamp if in Recycle Bin
}

// A single item stored in the visit plan (localStorage).
// We store a subset of Attraction fields so the plan works offline
// without needing to re-fetch from the database.
export interface PlanItem {
  id: number;
  name: string;
  category_name: string;
  visit_duration_minutes: number | null;
  entrance_fee_lkr: number | null;
  distance_km: number | null;
  deleted_at?: string | null;
}
