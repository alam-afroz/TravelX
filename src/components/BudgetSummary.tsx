import { Itinerary } from '../types.ts';
import { calculateTripBudget, CATEGORY_CONFIG } from '../utils/itineraryHelper.ts';
import { Coins, Clock, MapPin, Compass, Sparkles } from 'lucide-react';

interface BudgetSummaryProps {
  itinerary: Itinerary;
}

export function BudgetSummary({ itinerary }: BudgetSummaryProps) {
  const { minEntry, maxEntry, totalStops, totalDuration } = calculateTripBudget(itinerary);

  // Calculate category counts
  const categoryCounts: Record<string, number> = {};
  itinerary.days.forEach((day) => {
    day.stops.forEach((stop) => {
      categoryCounts[stop.category] = (categoryCounts[stop.category] || 0) + 1;
    });
  });

  const categories = Object.keys(categoryCounts);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Metric 1: Est. Entry Fees */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          <span>Est. Entry Fees</span>
        </div>
        <div className="text-base sm:text-lg font-bold text-slate-900 truncate">
          {minEntry === 0 && maxEntry === 0 ? (
            <span className="text-emerald-600">Free Attractions</span>
          ) : minEntry === maxEntry ? (
            `${itinerary.currency} ${minEntry.toLocaleString()}`
          ) : (
            `${itinerary.currency} ${minEntry.toLocaleString()} - ${maxEntry.toLocaleString()}`
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Sum of stops approximate ticket costs
        </p>
      </div>

      {/* Metric 2: Exploration Hours */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Total Planned Time</span>
        </div>
        <div className="text-base sm:text-lg font-bold text-slate-900">
          {totalDuration.toFixed(1)} hrs
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          ~{(totalDuration / Math.max(1, itinerary.days.length)).toFixed(1)} hrs/day average
        </p>
      </div>

      {/* Metric 3: Planned Stops */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span>Curated Stops</span>
        </div>
        <div className="text-base sm:text-lg font-bold text-slate-900">
          {totalStops} places
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Across {itinerary.days.length} days ({Math.round(totalStops / Math.max(1, itinerary.days.length))} per day)
        </p>
      </div>

      {/* Metric 4: Category Distribution */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Experience Mix</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap mt-1">
          {categories.slice(0, 3).map((cat) => {
            const config = (CATEGORY_CONFIG as any)[cat] || CATEGORY_CONFIG.other;
            return (
              <span
                key={cat}
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${config.bg} ${config.text}`}
              >
                {categoryCounts[cat]} {cat}
              </span>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Curated by geographic proximity
        </p>
      </div>
    </div>
  );
}
