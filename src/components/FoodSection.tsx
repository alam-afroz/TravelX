import { FoodSpot } from '../types.ts';
import { Utensils, DollarSign, ExternalLink } from 'lucide-react';
import { formatPriceLevel } from '../utils/itineraryHelper.ts';

interface FoodSectionProps {
  foodSpots: FoodSpot[];
  dayNumber: number;
  city: string;
}

export function FoodSection({ foodSpots, dayNumber, city }: FoodSectionProps) {
  if (!foodSpots || foodSpots.length === 0) return null;

  return (
    <div className="rounded-xl border border-orange-200/80 bg-linear-to-br from-orange-50/50 to-amber-50/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
            <Utensils className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Day {dayNumber} Culinary Recommendations
            </h4>
            <p className="text-[11px] text-slate-500">
              2 well-known spots selected near today's itinerary stops
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {foodSpots.map((spot, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-3 border border-orange-100 shadow-2xs hover:shadow-xs transition"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">
                  {spot.cuisine}
                </span>
                <h5 className="text-sm font-bold text-slate-900">
                  {spot.name}
                </h5>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  spot.price_level === 'low'
                    ? 'bg-emerald-100 text-emerald-800'
                    : spot.price_level === 'mid'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
                title={formatPriceLevel(spot.price_level)}
              >
                {spot.price_level === 'low' ? '$' : spot.price_level === 'mid' ? '$$' : '$$$'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              {spot.description}
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${spot.name} ${city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 font-medium"
            >
              <span>Find on Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
