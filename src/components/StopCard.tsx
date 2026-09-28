import { useState } from 'react';
import { Category, Stop } from '../types.ts';
import { CATEGORY_CONFIG, formatPrice } from '../utils/itineraryHelper.ts';
import {
  Sun,
  SunMedium,
  Moon,
  Clock,
  Ticket,
  MapPin,
  ExternalLink,
  Edit2,
  Check,
  X,
  Compass,
} from 'lucide-react';

interface StopCardProps {
  stop: Stop;
  index: number;
  currency: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updatedStop: Stop) => void;
}

export function StopCard({
  stop,
  index,
  currency,
  isSelected,
  onSelect,
  onUpdate,
}: StopCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Stop>({ ...stop });

  const catConfig = CATEGORY_CONFIG[stop.category] || CATEGORY_CONFIG.other;

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'morning':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'afternoon':
        return <SunMedium className="w-3.5 h-3.5 text-orange-500" />;
      case 'evening':
        return <Moon className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editForm);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...stop });
    setIsEditing(false);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border p-4.5 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-blue-50/70 border-blue-400 shadow-md ring-2 ring-blue-400/30'
          : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {isEditing ? (
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Edit Stop #{index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-slate-500 hover:bg-slate-100 text-xs rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
              Place Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
              Description (One short sentence)
            </label>
            <input
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Category
              </label>
              <select
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value as Category })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="history">History</option>
                <option value="art">Art</option>
                <option value="nature">Nature</option>
                <option value="food">Food</option>
                <option value="nightlife">Nightlife</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Best Time
              </label>
              <select
                value={editForm.best_time}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    best_time: e.target.value as 'morning' | 'afternoon' | 'evening',
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={editForm.duration_hours}
                onChange={(e) =>
                  setEditForm({ ...editForm, duration_hours: parseFloat(e.target.value) || 1 })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Entry Fee (Min / Max)
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={editForm.est_entry_price.min ?? ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      est_entry_price: {
                        ...editForm.est_entry_price,
                        min: e.target.value === '' ? null : parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-1/2 px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={editForm.est_entry_price.max ?? ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      est_entry_price: {
                        ...editForm.est_entry_price,
                        max: e.target.value === '' ? null : parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-1/2 px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Top header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {/* Step indicator */}
              <div
                style={{ backgroundColor: catConfig.markerColor }}
                className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-xs"
              >
                {index + 1}
              </div>

              {/* Category badge */}
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}
              >
                {catConfig.label}
              </span>

              {/* Time slot */}
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium capitalize bg-slate-100 px-2 py-0.5 rounded-md">
                {getTimeIcon(stop.best_time)}
                <span>{stop.best_time}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
                title="Edit stop"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Stop Name */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
            {stop.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {stop.description}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            {/* Duration */}
            <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-150">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">{stop.duration_hours} hrs</span>
            </div>

            {/* Entry Fee */}
            <div className="flex items-center gap-1 text-slate-800 bg-slate-50 px-2 py-1 rounded-md border border-slate-150">
              <Ticket className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">
                {formatPrice(stop.est_entry_price, currency)}
              </span>
            </div>

            {/* GPS Lat/Lng */}
            <div className="ml-auto flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>
                {stop.lat?.toFixed(4)}, {stop.lng?.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
