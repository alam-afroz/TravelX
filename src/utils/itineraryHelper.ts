import { Category, Itinerary, PriceLevel } from '../types.ts';

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; color: string; bg: string; text: string; border: string; markerColor: string }
> = {
  history: {
    label: 'History',
    color: '#d97706',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
    markerColor: '#d97706',
  },
  art: {
    label: 'Art',
    color: '#4f46e5',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-800 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-700',
    markerColor: '#4f46e5',
  },
  nature: {
    label: 'Nature',
    color: '#059669',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-700',
    markerColor: '#059669',
  },
  food: {
    label: 'Food',
    color: '#ea580c',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-800 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-700',
    markerColor: '#ea580c',
  },
  nightlife: {
    label: 'Nightlife',
    color: '#9333ea',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-800 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
    markerColor: '#9333ea',
  },
  shopping: {
    label: 'Shopping',
    color: '#db2777',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-800 dark:text-pink-300',
    border: 'border-pink-300 dark:border-pink-700',
    markerColor: '#db2777',
  },
  other: {
    label: 'Other',
    color: '#64748b',
    bg: 'bg-slate-50 dark:bg-slate-900',
    text: 'text-slate-800 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
    markerColor: '#64748b',
  },
};

export function formatPrice(
  price: { min: number | null; max: number | null },
  currency: string
): string {
  if (price.min === null && price.max === null) {
    return 'Free / Unspecified';
  }
  if (price.min === 0 && price.max === 0) {
    return 'Free';
  }
  if (price.min !== null && price.max !== null) {
    if (price.min === price.max) {
      return `${currency} ${price.min.toLocaleString()}`;
    }
    return `${currency} ${price.min.toLocaleString()} – ${price.max.toLocaleString()}`;
  }
  if (price.min !== null) {
    return `From ${currency} ${price.min.toLocaleString()}`;
  }
  if (price.max !== null) {
    return `Up to ${currency} ${price.max.toLocaleString()}`;
  }
  return 'Free';
}

export function formatPriceLevel(level: PriceLevel): string {
  switch (level) {
    case 'low':
      return '$ (Budget-friendly)';
    case 'mid':
      return '$$ (Moderate)';
    case 'high':
      return '$$$ (High-end / Upscale)';
    default:
      return level;
  }
}

export function calculateTripBudget(itinerary: Itinerary): {
  minEntry: number;
  maxEntry: number;
  totalStops: number;
  totalDuration: number;
} {
  let minEntry = 0;
  let maxEntry = 0;
  let totalStops = 0;
  let totalDuration = 0;

  itinerary.days.forEach((day) => {
    day.stops.forEach((stop) => {
      totalStops++;
      totalDuration += stop.duration_hours || 0;
      if (stop.est_entry_price) {
        if (stop.est_entry_price.min !== null) {
          minEntry += stop.est_entry_price.min;
        }
        if (stop.est_entry_price.max !== null) {
          maxEntry += stop.est_entry_price.max;
        } else if (stop.est_entry_price.min !== null) {
          maxEntry += stop.est_entry_price.min;
        }
      }
    });
  });

  return { minEntry, maxEntry, totalStops, totalDuration };
}

export function validateSchema(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Root is not an object'] };
  }
  if (typeof data.city !== 'string') errors.push('Missing or invalid "city" string');
  if (typeof data.country !== 'string') errors.push('Missing or invalid "country" string');
  if (typeof data.currency !== 'string') errors.push('Missing or invalid "currency" string');
  if (typeof data.summary !== 'string') errors.push('Missing or invalid "summary" string');

  if (!Array.isArray(data.days) || data.days.length === 0) {
    errors.push('"days" must be a non-empty array');
  } else {
    data.days.forEach((day: any, i: number) => {
      if (typeof day.day !== 'number') errors.push(`Day ${i + 1}: missing "day" number`);
      if (typeof day.theme !== 'string') errors.push(`Day ${i + 1}: missing "theme" string`);
      if (!Array.isArray(day.stops) || day.stops.length < 1) {
        errors.push(`Day ${i + 1}: stops must be an array`);
      } else {
        day.stops.forEach((stop: any, sIdx: number) => {
          if (!stop.name) errors.push(`Day ${i + 1} stop ${sIdx + 1}: missing "name"`);
          if (typeof stop.lat !== 'number' || typeof stop.lng !== 'number') {
            errors.push(`Day ${i + 1} stop ${sIdx + 1} (${stop.name}): missing valid lat/lng numbers`);
          }
        });
      }
      if (!Array.isArray(day.food)) {
        errors.push(`Day ${i + 1}: food must be an array`);
      }
    });
  }

  if (!Array.isArray(data.stays)) {
    errors.push('"stays" must be an array');
  }

  return { valid: errors.length === 0, errors };
}
