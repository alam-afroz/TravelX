import { useState } from 'react';
import {
  Compass,
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Train,
  Plane,
  Utensils,
  Hotel,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { PRESET_ITINERARIES } from '../data/presets.ts';
import { Itinerary } from '../types.ts';

interface HomePageProps {
  onStartSearch: (initialCity?: string, initialCountry?: string) => void;
  onSelectPresetItinerary: (itinerary: Itinerary) => void;
}

const FEATURED_CITIES = [
  {
    key: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan, India',
    days: 2,
    badge: 'Royal Heritage',
    budget: 'Mid',
    tagline: 'Amer Fort, royal palaces, handblock printing & spicy kachoris',
    highlightTags: ['Hilltop Forts', 'Artisan Haveli', 'Bazaar Street Food'],
    gradient: 'from-amber-500 to-rose-600',
    bgBadge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    key: 'lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh, India',
    days: 2,
    badge: 'Nawabi Legacy',
    budget: 'Mid',
    tagline: 'Bara Imambara, Chikankari crafts, Galouti kebabs & heritage walks',
    highlightTags: ['Imambara Marvels', 'Awadhi Kebabs', 'State Museum'],
    gradient: 'from-emerald-600 to-teal-700',
    bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    key: 'noida',
    city: 'Noida',
    state: 'Uttar Pradesh, India',
    days: 2,
    badge: 'Modern & Nightlife',
    budget: 'Mid',
    tagline: 'Monumental memorials, wetland trails, bustling markets & lively pubs',
    highlightTags: ['Sandstone Memorial', 'Sector 18 Markets', 'Galleria Lounges'],
    gradient: 'from-indigo-600 to-purple-700',
    bgBadge: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    key: 'kyoto',
    city: 'Kyoto',
    state: 'Kansai, Japan',
    days: 3,
    badge: 'Zen & Temples',
    budget: 'Mid',
    tagline: 'Vermilion torii gates, bamboo groves, historic tea houses & gardens',
    highlightTags: ['Fushimi Inari', 'Arashiyama', 'Gion Historic District'],
    gradient: 'from-rose-500 to-pink-700',
    bgBadge: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    key: 'rome',
    city: 'Rome',
    state: 'Lazio, Italy',
    days: 3,
    badge: 'Ancient Empire',
    budget: 'Mid',
    tagline: 'Colosseum gladiators, Vatican masterpieces, fountains & authentic pasta',
    highlightTags: ['Ancient Forum', 'Vatican Museums', 'Trastevere Dining'],
    gradient: 'from-amber-600 to-orange-700',
    bgBadge: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  {
    key: 'barcelona',
    city: 'Barcelona',
    state: 'Catalonia, Spain',
    days: 3,
    badge: 'Gaudí & Coastal',
    budget: 'Mid',
    tagline: 'Sagrada Família spires, Park Güell mosaics, Mediterranean tapas & beach',
    highlightTags: ['Sagrada Família', 'Gothic Quarter', 'Beachfront Promenade'],
    gradient: 'from-blue-600 to-cyan-700',
    bgBadge: 'bg-blue-100 text-blue-800 border-blue-200',
  },
];

export function HomePage({ onStartSearch, onSelectPresetItinerary }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number>(2);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      onStartSearch(trimmed);
    } else {
      onStartSearch('Jaipur', 'India');
    }
  };

  const handleSelectFeatured = (item: (typeof FEATURED_CITIES)[0]) => {
    const preset = PRESET_ITINERARIES[item.key];
    if (preset) {
      onSelectPresetItinerary(preset);
    } else {
      onStartSearch(item.city);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  TravelX
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  AI Travel Planner
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onStartSearch()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plan New Trip</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Strict Schema AI Itinerary Generator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-4 text-balance">
            Where Do You Want to Explore Next?
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Generate realistic, day-by-day travel itineraries with geographically clustered stops, local dining spots, curated stays, and transportation routes.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleHeroSubmit}
            className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-xl border border-white/20 flex flex-col sm:flex-row items-center gap-2.5 text-slate-800"
          >
            <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city or destination (e.g. Jaipur, Lucknow, Noida)..."
                className="w-full text-xs sm:text-sm bg-transparent border-none outline-none font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Duration select */}
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value={1}>1 Day</option>
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
                <option value={4}>4 Days</option>
                <option value={5}>5 Days</option>
              </select>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search & Plan</span>
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400">
            <span className="font-medium text-slate-300">Quick explore:</span>
            {['Jaipur', 'Lucknow', 'Noida', 'Kyoto', 'Rome', 'Barcelona'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  const key = city.toLowerCase();
                  if (PRESET_ITINERARIES[key]) {
                    onSelectPresetItinerary(PRESET_ITINERARIES[key]);
                  } else {
                    onStartSearch(city);
                  }
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition text-[11px] font-medium cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Curated Ready-to-Explore Itineraries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Trip Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hand-verified routes with non-zigzag geographic ordering, local food, and realistic schedules.
            </p>
          </div>

          <button
            onClick={() => onStartSearch()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>Custom Destination Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_CITIES.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between group"
            >
              <div>
                {/* Banner Gradient Header */}
                <div
                  className={`h-24 bg-linear-to-r ${item.gradient} p-4 text-white flex items-start justify-between relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full border border-white/20">
                      {item.badge}
                    </span>
                    <h3 className="text-xl font-extrabold mt-1 tracking-tight">{item.city}</h3>
                    <p className="text-xs text-white/80">{item.state}</p>
                  </div>

                  <span className="text-xs font-bold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/25 shrink-0">
                    {item.days} Days
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.tagline}</p>

                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Key Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.highlightTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onStartSearch(item.city)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                >
                  Customize Inputs
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectFeatured(item)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why TravelX Feature Grid */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Realistic Travel
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every detail is shaped around how people actually explore cities on foot and transit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Geographic Proximity</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Stops are sequenced logically by neighborhood so you never waste time crisscrossing the city.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Authentic Local Dining</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Two culinary recommendations per day placed right near that day's walking route.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <Train className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Train & Flight Routes</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore estimated connections, class types, and fares to reach your vacation destination.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Strict JSON Schema</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Export to JSON, copy coordinates, or print a formatted travel plan ready for your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Ready to create your next itinerary?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
              Fill in your travel preferences, budget, and desired pace to generate a tailored itinerary in seconds.
            </p>
          </div>

          <button
            onClick={() => onStartSearch()}
            className="px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Open Trip Planner</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TravelX</span>
            <span>—</span>
            <span>AI Travel Itinerary Generator strictly adhering to schema constraints</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onStartSearch()}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Plan Trip Now
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
