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
  initialCity = '',
  initialCountry = '',
  onBackToHome,
  onGenerated,
}: SearchWindowProps) {
  const [city, setCity] = useState(initialCity);
  const [country, setCountry] = useState(initialCountry);
  const [daysCount, setDaysCount] = useState<number | null>(null);
  const [budgetLevel, setBudgetLevel] = useState<'very-low' | 'low' | 'mid' | 'high' | null>(null);
  const [pacePreference, setPacePreference] = useState<'relaxed' | 'moderate' | 'packed' | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
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
    if (!country.trim()) {
      setErrorMsg('Please enter a country');
      return;
    }
    if (!daysCount) {
      setErrorMsg('Please select a trip duration');
      return;
    }
    if (!budgetLevel) {
      setErrorMsg('Please select a budget tier');
      return;
    }
    if (!pacePreference) {
      setErrorMsg('Please select a pace preference');
      return;
    }
    if (selectedInterests.length === 0) {
      setErrorMsg('Please select at least one interest');
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
    <div className="h-screen overflow-hidden bg-[#e1ecf7] text-slate-800 antialiased flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#e1ecf7]/85 backdrop-blur-xl border-b border-white/40 shadow-sm shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button
              onClick={onBackToHome}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition flex items-center cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={onBackToHome}
              className="font-medium text-2xl text-[#2d497c] tracking-wide hover:opacity-80 transition-opacity cursor-pointer"
            >
              TravelX
            </button>
          </div>
          <div className="flex justify-end">
            {/* Empty for layout balance */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full sm:w-[90%] max-w-none mx-auto px-4 sm:px-6 py-[3vh] sm:py-[5vh] flex-1 flex flex-col">
        {/* Search & Customization Form */}
        <form
          onSubmit={handleGenerate}
          className="w-full h-full bg-white/90 backdrop-blur-lg rounded-sm border border-white p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between"
        >
          {/* Title & Introduction */}
          <div className="text-center shrink-0">
            <h1 className="text-xl sm:text-2xl font-medium text-[#2d497c] tracking-wide">
              Customize Your Travel Plan
            </h1>
          </div>

          {/* Destination Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="w-full px-3 py-2 sm:py-2.5 bg-slate-50/50 border border-slate-200 shadow-inner rounded-sm text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
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
                className="w-full px-3 py-2 sm:py-2.5 bg-slate-50/50 border border-slate-200 shadow-inner rounded-sm text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Preferences Grid (Duration, Budget, Pace) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Trip Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Duration (Days)</span>
              </label>
              <select
                value={daysCount || ''}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                className="w-full px-3 py-2 sm:py-2.5 bg-slate-50/50 border border-slate-200 shadow-inner rounded-sm text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
              >
                <option value="" disabled>Select Duration</option>
                {[1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? 'Day' : 'Days'}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Tier Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                <span>Budget Tier</span>
              </label>
              <select
                value={budgetLevel || ''}
                onChange={(e) => setBudgetLevel(e.target.value as any)}
                className="w-full px-3 py-2 sm:py-2.5 bg-slate-50/50 border border-slate-200 shadow-inner rounded-sm text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
              >
                <option value="" disabled>Select Budget Tier</option>
                {[
                  { id: 'very-low', label: 'Under ₹5,000 / day' },
                  { id: 'low', label: '₹5,000 - ₹10,000 / day' },
                  { id: 'mid', label: '₹10,000 - ₹15,000 / day' },
                  { id: 'high', label: '₹15,000+ / day' },
                ].map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pace Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-600" />
                <span>Pace Preference</span>
              </label>
              <select
                value={pacePreference || ''}
                onChange={(e) => setPacePreference(e.target.value as any)}
                className="w-full px-3 py-2 sm:py-2.5 bg-slate-50/50 border border-slate-200 shadow-inner rounded-sm text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
              >
                <option value="" disabled>Select Pace</option>
                {[
                  { id: 'relaxed', label: 'Relaxed Pace (2–3 stops, plenty of leisure)' },
                  { id: 'moderate', label: 'Moderate (3–4 clustered stops, balanced)' },
                  { id: 'packed', label: 'Packed (4–5 stops, maximum highlights)' },
                ].map((pace) => (
                  <option key={pace.id} value={pace.id}>
                    {pace.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Key Interests Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Interests & Themes</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded-sm text-[14px] font-medium border transition cursor-pointer flex items-center gap-1.5 ${
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
              rows={1}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Vegetarian food preferences..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold text-xs shrink-0 transition cursor-pointer self-start sm:self-auto"
                >
                  Load {matchedPreset.city} Itinerary
                </button>
              )}
            </div>
          )}

          {/* Progress / Loading Indicator */}
          {loading && (
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-sm space-y-3">
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
          <div className="flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-sm transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#2d497c] hover:bg-blue-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Go</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
