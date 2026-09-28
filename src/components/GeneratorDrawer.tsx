import { useState } from 'react';
import { Sparkles, MapPin, Calendar, DollarSign, Heart, Compass, Loader2, X, AlertCircle } from 'lucide-react';
import { GenerationParams, Itinerary } from '../types.ts';
import { PRESET_ITINERARIES } from '../data/presets.ts';

interface GeneratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (itinerary: Itinerary, rawJson?: string) => void;
}

const INTERESTS_LIST = [
  'History & Heritage',
  'Art & Museums',
  'Food & Street Markets',
  'Nature & Gardens',
  'Nightlife & Bars',
  'Shopping & Crafts',
  'Architecture',
  'Hidden Local Gems',
];

const POPULAR_DESTINATIONS = [
  { city: 'Jaipur', country: 'India', presetKey: 'jaipur' },
  { city: 'Lucknow', country: 'India', presetKey: 'lucknow' },
  { city: 'Noida', country: 'India', presetKey: 'noida' },
  { city: 'Kyoto', country: 'Japan', presetKey: 'kyoto' },
  { city: 'Paris', country: 'France' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Bangkok', country: 'Thailand' },
  { city: 'Cape Town', country: 'South Africa' },
];

export function GeneratorDrawer({ isOpen, onClose, onGenerated }: GeneratorDrawerProps) {
  const [city, setCity] = useState('Kyoto');
  const [country, setCountry] = useState('Japan');
  const [daysCount, setDaysCount] = useState(3);
  const [budgetLevel, setBudgetLevel] = useState<'low' | 'mid' | 'high'>('mid');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'History & Heritage',
    'Food & Street Markets',
    'Art & Museums',
  ]);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'packed'>('moderate');
  const [includeStays, setIncludeStays] = useState(true);
  const [customNotes, setCustomNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSelectPreset = (dest: { city: string; country: string; presetKey?: string }) => {
    setCity(dest.city);
    setCountry(dest.country);
    if (dest.presetKey && PRESET_ITINERARIES[dest.presetKey]) {
      onGenerated(PRESET_ITINERARIES[dest.presetKey]);
      onClose();
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setErrorMsg('Please enter a destination city');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setLoadingStep('Consulting Flash-Lite model...');

    // Progress timer to provide reassuring feedback during potential retries
    const progressTimer1 = setTimeout(() => {
      setLoadingStep('High demand detected, retrying (attempt 1 of 3)...');
    }, 2800);
    const progressTimer2 = setTimeout(() => {
      setLoadingStep('Still busy, retrying (attempt 2 of 3)...');
    }, 7200);
    const progressTimer3 = setTimeout(() => {
      setLoadingStep('Retrying (attempt 3 of 3)...');
    }, 15500);
    const progressTimer4 = setTimeout(() => {
      setLoadingStep('Connecting to fallback Flash model...');
    }, 24000);

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: city.trim(),
          country: country.trim(),
          daysCount,
          budgetLevel,
          interests: selectedInterests,
          pace,
          includeStays,
          customNotes: customNotes.trim(),
        }),
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      clearTimeout(progressTimer4);

      const rawResponseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(rawResponseText);
      } catch {
        throw new Error('Servers are busy, please try again in a minute');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Servers are busy, please try again in a minute');
      }

      const generatedItinerary = data?.itinerary || data?.data;
      if (generatedItinerary && generatedItinerary.city && Array.isArray(generatedItinerary.days)) {
        onGenerated(generatedItinerary, data.rawJson);
        onClose();
      } else {
        throw new Error('Servers are busy, please try again in a minute');
      }
    } catch (err: any) {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      clearTimeout(progressTimer4);
      console.error(err);
      setErrorMsg('Servers are busy, please try again in a minute');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Generate Custom Travel Itinerary
              </h2>
              <p className="text-xs text-slate-500">
                Powered by Gemini with strict geographic proximity and real stops
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-sm transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold">Generation Notice</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Popular Presets (Instant Load)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest.city}
                  type="button"
                  onClick={() => handleSelectPreset(dest)}
                  className={`text-xs px-2.5 py-1 rounded-sm border transition font-medium ${
                    city.toLowerCase() === dest.city.toLowerCase()
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {dest.city}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* City & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination City *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kyoto, Rome, Oaxaca"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Japan, Italy, Mexico"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Trip Days & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trip Duration: <span className="text-blue-600 font-bold">{daysCount} Days</span>
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysCount(d)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-sm border transition ${
                        daysCount === d
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Budget Level
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: 'low', label: '$ Low' },
                    { id: 'mid', label: '$$ Mid' },
                    { id: 'high', label: '$$$ High' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setBudgetLevel(tier.id as any)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-sm border transition ${
                        budgetLevel === tier.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Key Interests & Themes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTERESTS_LIST.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`text-xs px-2.5 py-1 rounded-sm border transition ${
                        active
                          ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pace & Stays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pace Preference
                </label>
                <select
                  value={pace}
                  onChange={(e) => setPace(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-sm"
                >
                  <option value="relaxed">Relaxed (Easy walk, 3 stops/day)</option>
                  <option value="moderate">Moderate (Standard, 3-4 stops/day)</option>
                  <option value="packed">Packed (Fast highlights, 4 stops/day)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accommodations
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-300 rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeStays}
                    onChange={(e) => setIncludeStays(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Include 3 Curated Stays
                  </span>
                </label>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Requirements (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Vegetarian dining focus, traveling with teens, love scenic views..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-md transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{loadingStep || 'Generating Itinerary...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
