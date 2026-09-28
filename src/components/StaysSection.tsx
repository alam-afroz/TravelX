import { StaySpot } from '../types.ts';
import { BedDouble, MapPin, ExternalLink, Star } from 'lucide-react';
import { formatPriceLevel } from '../utils/itineraryHelper.ts';

interface StaysSectionProps {
  stays: StaySpot[];
  city: string;
}

export function StaysSection({ stays, city }: StaysSectionProps) {
  if (!stays || stays.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <BedDouble className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Curated Accommodations in {city}
            </h3>
            <p className="text-xs text-slate-500">
              3 real hotels and hostels matched to your trip's budget tier
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stays.map((stay, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-slate-200/80 p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                  {stay.type}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    stay.price_level === 'low'
                      ? 'bg-emerald-100 text-emerald-800'
                      : stay.price_level === 'mid'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                  title={formatPriceLevel(stay.price_level)}
                >
                  {stay.price_level === 'low' ? '$' : stay.price_level === 'mid' ? '$$' : '$$$'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {stay.name}
              </h4>

              <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{stay.area}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {stay.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Tier: <span className="font-semibold capitalize text-slate-700">{stay.price_level}</span>
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${stay.name} ${stay.area} ${city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <span>View stay</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
