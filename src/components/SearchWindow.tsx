import { useState } from 'react';
import {
  Compass,
  ArrowLeft,
  Search,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Gauge,
  SlidersHorizontal,
  Check,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Itinerary } from '../types.ts';
import { PRESET_ITINERARIES } from '../data/presets.ts';

interface SearchWindowProps {
  initialCity?: string;
  initialCountry?: string;
  onBackToHome: () => void;
  onGenerated: (itinerary: Itinerary) => void;
}

const INTEREST_OPTIONS = [
  'History & Heritage',
  'Art & Museums',
  'Food & Street Markets',
  'Nightlife & Bars',
  'Nature & Scenic Outdoors',
  'Local Shopping & Bazaars',
  'Architecture & Photography',
  'Hidden Local Gems',
];

const POPULAR_DESTINATIONS = [
  { city: 'Jaipur', country: 'India', presetKey: 'jaipur' },
  { city: 'Lucknow', country: 'India', presetKey: 'lucknow' },
  { city: 'Noida', country: 'India', presetKey: 'noida' },
  { city: 'Kyoto', country: 'Japan', presetKey: 'kyoto' },
  { city: 'Rome', country: 'Italy', presetKey: 'rome' },
  { city: 'Barcelona', country: 'Spain', presetKey: 'barcelona' },
  { city: 'Paris', country: 'France' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Bangkok', country: 'Thailand' },
];

export function SearchWindow({
  initialCity = 'Jaipur',
  initialCountry = 'India',
  onBackToHome,
  onGenerated,
}: SearchWindowProps) {
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [daysCount, setDaysCount] = useState<number>(2);
  const [budgetLevel, setBudgetLevel] = useState<'low' | 'mid' | 'high'>('mid');
  const [pacePreference, setPacePreference] = useState<'relaxed' | 'moderate' | 'packed'>('moderate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'History & Heritage',
    'Art & Museums',
    'Food & Street Markets',
  ]);
  const [customNotes, setCustomNotes] = useState('');

  // Generation status
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(1);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if destination has an instant preset
  const cityKey = city.trim().toLowerCase();
  const matchedPreset = PRESET_ITINERARIES[cityKey];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSelectPopular = (item: (typeof POPULAR_DESTINATIONS)[0]) => {
    setCity(item.city);
    setCountry(item.country);
    setErrorMsg(null);
  };

  // Direct load preset
  const handleLoadInstantPreset = () => {
    if (matchedPreset) {
      onGenerated(matchedPreset);
    }
  };

  // Trigger Gemini AI Generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim()) {
      setErrorMsg('Please enter a destination city');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setProgressStep(1);
    setProgressMessage('Analyzing iconic monuments & landmarks...');

    const timer1 = setTimeout(() => {
      setProgressStep(2);
      setProgressMessage('Calculating geographic clustering & visiting sequence...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setProgressStep(3);
      setProgressMessage('Pairing authentic local eateries near daily stops...');
    }, 2400);

    const timer3 = setTimeout(() => {
      setProgressStep(4);
      setProgressMessage('Curating budget-matched stays & final schema validation...');
    }, 3600);

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: city.trim(),
          country: country.trim(),
          daysCount,
          budgetLevel,
          pacePreference,
          pace: pacePreference,
          interests: selectedInterests,
          notes: customNotes.trim(),
          customNotes: customNotes.trim(),
        }),
      });

      const rawResponseText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(rawResponseText);
      } catch (parseErr) {
        console.warn('Non-JSON server response:', rawResponseText);
        throw new Error('Servers are busy, please try again in a minute');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Servers are busy, please try again in a minute');
      }

      const generatedItinerary = data?.itinerary || data?.data;
      if (generatedItinerary && generatedItinerary.city && Array.isArray(generatedItinerary.days)) {
        onGenerated(generatedItinerary);
      } else {
        throw new Error('Received invalid itinerary data from server');
      }
    } catch (err: any) {
      console.error(err);
      if (matchedPreset) {
        setErrorMsg(`${err.message || 'Generation issue'}. You can load the verified pre-crafted itinerary for ${city} below.`);
      } else {
        setErrorMsg(err.message || 'Error communicating with generation engine');
      }
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                TravelX
              </span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Trip Search Window
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Fill your parameters → Generate customized itinerary
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-1">
        {/* Title & Introduction */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customize Your Travel Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify your destination, pace, interests, and budget to generate an optimized itinerary with exact stops and coordinates.
          </p>
        </div>

        {/* Quick Destination Suggestions */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Popular Destinations
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_DESTINATIONS.map((item) => (
              <button
                key={item.city}
                type="button"
                onClick={() => handleSelectPopular(item)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  city.toLowerCase() === item.city.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.city}, {item.country}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Customization Form */}
        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6"
        >
          {/* Destination Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Destination City</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="e.g. Jaipur, Lucknow, Noida, Rome"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India, Japan, Italy"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Instant Preset Alert Banner if applicable */}
          {matchedPreset && (
            <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Instant Preset Ready:</strong> Verified 2-day itinerary available for{' '}
                  {matchedPreset.city}!
                </span>
              </div>
              <button
                type="button"
                onClick={handleLoadInstantPreset}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-2xs shrink-0 transition cursor-pointer"
              >
                Load Instant Itinerary
              </button>
            </div>
          )}

          {/* Trip Duration Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Trip Duration (Days)</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDaysCount(d)}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    daysCount === d
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d} {d === 1 ? 'Day' : 'Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Tier Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              <span>Budget Tier</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Budget ($ / ₹)', desc: 'Hostels, street food & free sites' },
                { id: 'mid', label: 'Mid-Range ($$ / ₹₹)', desc: 'Boutique stays, casual bistros' },
                { id: 'high', label: 'Luxury ($$$ / ₹₹₹)', desc: '5-star resorts, fine dining' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setBudgetLevel(tier.id as any)}
                  className={`p-3 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    budgetLevel === tier.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold">{tier.label}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{tier.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pace Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-blue-600" />
              <span>Pace Preference</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'relaxed', label: 'Relaxed Pace', desc: '2–3 stops per day, plenty of leisure' },
                { id: 'moderate', label: 'Moderate (Standard)', desc: '3–4 clustered stops, balanced' },
                { id: 'packed', label: 'Packed / Intensive', desc: '4–5 stops, see maximum highlights' },
              ].map((pace) => (
                <button
                  key={pace.id}
                  type="button"
                  onClick={() => setPacePreference(pace.id as any)}
                  className={`p-3 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    pacePreference === pace.id
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold">{pace.label}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{pace.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Key Interests Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Interests & Themes</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Special Requests or Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Vegetarian food preferences, traveling with senior parents, prefer rooftop cafes..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Generation Notice</p>
                  <p className="mt-0.5">{errorMsg}</p>
                </div>
              </div>
              {matchedPreset && (
                <button
                  type="button"
                  onClick={handleLoadInstantPreset}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shrink-0 transition cursor-pointer self-start sm:self-auto"
                >
                  Load {matchedPreset.city} Itinerary
                </button>
              )}
            </div>
          )}

          {/* Progress / Loading Indicator */}
          {loading && (
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <h5 className="text-xs font-bold text-blue-900">
                    Generating Itinerary for {city}...
                  </h5>
                  <p className="text-[11px] text-blue-700">{progressMessage}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 transition-all duration-500"
                  style={{ width: `${progressStep * 25}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
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
      </main>
    </div>
  );
}
