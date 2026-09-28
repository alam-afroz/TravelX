import { useState, useEffect } from 'react';
import { Itinerary, Stop } from './types.ts';
import { PRESET_ITINERARIES } from './data/presets.ts';
import { MapView } from './components/MapView.tsx';
import { StopCard } from './components/StopCard.tsx';
import { FoodSection } from './components/FoodSection.tsx';
import { StaysSection } from './components/StaysSection.tsx';
import { BudgetSummary } from './components/BudgetSummary.tsx';
import { RawJsonViewer } from './components/RawJsonViewer.tsx';
import { SystemPromptViewer } from './components/SystemPromptViewer.tsx';
import { GeneratorDrawer } from './components/GeneratorDrawer.tsx';
import { TransportationSection } from './components/TransportationSection.tsx';
import { HomePage } from './components/HomePage.tsx';
import { SearchWindow } from './components/SearchWindow.tsx';
import {
  Compass,
  Sparkles,
  Code2,
  Terminal,
  MapPin,
  Calendar,
  Share2,
  Printer,
  Copy,
  Check,
  Plus,
  Layers,
  ChevronRight,
  Globe2,
  Train,
  ArrowLeft,
  Search,
} from 'lucide-react';

type AppView = 'home' | 'search' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#search') return 'search';
      if (hash === '#results' || hash === '#itinerary') return 'results';
    }
    return 'home';
  });

  const [searchInit, setSearchInit] = useState({ city: 'Jaipur', country: 'India' });
  const [itinerary, setItinerary] = useState<Itinerary>(PRESET_ITINERARIES.jaipur);
  const [activeTab, setActiveTab] = useState<'visual' | 'json' | 'prompt'>('visual');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | 'all'>(1);
  const [activeStopName, setActiveStopName] = useState<string | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Sync hash routing so browser Back / Forward buttons work smoothly
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#home' || hash === '') {
        setCurrentView('home');
      } else if (hash === '#search') {
        setCurrentView('search');
      } else if (hash === '#results' || hash === '#itinerary') {
        setCurrentView('results');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = `#${view}`;
    }
  };

  const handleStartSearchFromHome = (city?: string, country?: string) => {
    if (city) {
      setSearchInit({ city, country: country || '' });
    }
    navigateTo('search');
  };

  const handleSelectPresetFromHome = (preset: Itinerary) => {
    setItinerary(preset);
    setSelectedDayNumber(1);
    setActiveStopName(null);
    navigateTo('results');
  };

  const handleGeneratedFromSearch = (newItinerary: Itinerary) => {
    setItinerary(newItinerary);
    setSelectedDayNumber(1);
    setActiveStopName(null);
    navigateTo('results');
  };

  // Switch preset destination inside results view
  const handleSelectPreset = (key: string) => {
    if (PRESET_ITINERARIES[key]) {
      setItinerary(PRESET_ITINERARIES[key]);
      setSelectedDayNumber(1);
      setActiveStopName(null);
    }
  };

  // Handle updated stop from inline editor
  const handleUpdateStop = (dayNumber: number, stopIndex: number, updatedStop: Stop) => {
    setItinerary((prev) => {
      const newDays = prev.days.map((day) => {
        if (day.day !== dayNumber) return day;
        const newStops = [...day.stops];
        newStops[stopIndex] = updatedStop;
        return { ...day, stops: newStops };
      });
      return { ...prev, days: newDays };
    });
  };

  // Handle receiving new generated itinerary from drawer
  const handleGenerated = (newItinerary: Itinerary) => {
    setItinerary(newItinerary);
    setSelectedDayNumber(1);
    setActiveStopName(null);
  };

  // Quick copy raw JSON
  const handleCopyRawJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(itinerary, null, 2));
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  // Print itinerary
  const handlePrint = () => {
    window.print();
  };

  // Screen 1: Home Page
  if (currentView === 'home') {
    return (
      <HomePage
        onStartSearch={handleStartSearchFromHome}
        onSelectPresetItinerary={handleSelectPresetFromHome}
      />
    );
  }

  // Screen 2: Search Window
  if (currentView === 'search') {
    return (
      <SearchWindow
        initialCity={searchInit.city}
        initialCountry={searchInit.country}
        onBackToHome={() => navigateTo('home')}
        onGenerated={handleGeneratedFromSearch}
      />
    );
  }

  // Screen 3: Results View (Itinerary Studio)
  const currentDay =
    selectedDayNumber === 'all'
      ? null
      : itinerary.days.find((d) => d.day === selectedDayNumber) || itinerary.days[0];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Back to Home & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Return to Home Page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <span className="text-slate-300">|</span>

            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                    TravelX
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                    Results
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {itinerary.city}, {itinerary.country}
                </p>
              </div>
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Itinerary Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Raw JSON</span>
            </button>
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'prompt'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-purple-600" />
              <span>Prompt & Rules</span>
            </button>
          </div>

          {/* Preset Buttons & Plan Action */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 text-xs">
              <span className="text-slate-400 mr-1 text-[11px] font-medium">Presets:</span>
              {['jaipur', 'lucknow', 'noida', 'kyoto', 'rome'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`px-2.5 py-1 rounded-lg border transition capitalize cursor-pointer ${
                    itinerary.city.toLowerCase() === key
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSearchInit({ city: itinerary.city, country: itinerary.country });
                navigateTo('search');
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>New Search</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-200 bg-slate-50/90 px-3 py-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('visual')}
            className={`py-1 px-3 rounded-md transition ${
              activeTab === 'visual' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-1 px-3 rounded-md transition ${
              activeTab === 'json' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600'
            }`}
          >
            Raw JSON
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-1 px-3 rounded-md transition ${
              activeTab === 'prompt' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600'
            }`}
          >
            Prompt Specs
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Destination Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {itinerary.country}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {itinerary.days.length} Days Trip
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  {itinerary.currency}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {itinerary.city} Itinerary
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {itinerary.summary}
              </p>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
              <a
                href="#travel-section"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <Train className="w-3.5 h-3.5" />
                <span>Travel to {itinerary.city}</span>
              </a>

              <button
                onClick={handleCopyRawJson}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition flex items-center gap-1.5"
                title="Copy JSON directly"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied JSON!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition"
                title="Print Itinerary"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <BudgetSummary itinerary={itinerary} />
          </div>
        </div>

        {/* View Switcher Content */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {itinerary.days.map((d) => (
                <button
                  key={d.day}
                  onClick={() => {
                    setSelectedDayNumber(d.day);
                    setActiveStopName(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                    selectedDayNumber === d.day
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Day {d.day}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedDayNumber === d.day
                        ? 'bg-blue-500/80 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {d.stops.length} stops
                  </span>
                </button>
              ))}

              <button
                onClick={() => {
                  setSelectedDayNumber('all');
                  setActiveStopName(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedDayNumber === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All {itinerary.days.length} Days</span>
              </button>
            </div>

            {/* Split Grid: Stops List & Map View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Stops & Dining */}
              <div className="lg:col-span-7 space-y-5">
                {selectedDayNumber !== 'all' && currentDay ? (
                  <div className="space-y-4">
                    {/* Day Theme Banner */}
                    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                        <span>Day {currentDay.day} Theme</span>
                      </div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        {currentDay.theme}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentDay.stops.length} stops grouped in sensible geographic order to avoid zig-zagging
                      </p>
                    </div>

                    {/* Stops List */}
                    <div className="space-y-3">
                      {currentDay.stops.map((stop, sIdx) => (
                        <StopCard
                          key={`${currentDay.day}-${sIdx}-${stop.name}`}
                          stop={stop}
                          index={sIdx}
                          currency={itinerary.currency}
                          isSelected={activeStopName === stop.name}
                          onSelect={() => setActiveStopName(stop.name)}
                          onUpdate={(updated) =>
                            handleUpdateStop(currentDay.day, sIdx, updated)
                          }
                        />
                      ))}
                    </div>

                    {/* Dining Recommendation for this day */}
                    <FoodSection
                      foodSpots={currentDay.food}
                      dayNumber={currentDay.day}
                      city={itinerary.city}
                    />
                  </div>
                ) : (
                  /* 'All Days' List View */
                  <div className="space-y-6">
                    {itinerary.days.map((dayPlan) => (
                      <div
                        key={dayPlan.day}
                        className="bg-white rounded-xl border border-slate-200 p-4.5 space-y-4"
                      >
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <span className="text-xs font-bold text-blue-600 uppercase">
                              Day {dayPlan.day}
                            </span>
                            <h3 className="text-base font-bold text-slate-900">
                              {dayPlan.theme}
                            </h3>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {dayPlan.stops.length} stops
                          </span>
                        </div>

                        <div className="space-y-3">
                          {dayPlan.stops.map((stop, sIdx) => (
                            <StopCard
                              key={`${dayPlan.day}-${sIdx}-${stop.name}`}
                              stop={stop}
                              index={sIdx}
                              currency={itinerary.currency}
                              isSelected={activeStopName === stop.name}
                              onSelect={() => setActiveStopName(stop.name)}
                              onUpdate={(updated) =>
                                handleUpdateStop(dayPlan.day, sIdx, updated)
                              }
                            />
                          ))}
                        </div>

                        <FoodSection
                          foodSpots={dayPlan.food}
                          dayNumber={dayPlan.day}
                          city={itinerary.city}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Interactive Map */}
              <div className="lg:col-span-5 sticky top-22">
                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
                  <div className="flex items-center justify-between px-2 py-1 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {selectedDayNumber === 'all'
                          ? 'All Stops Route Map'
                          : `Day ${selectedDayNumber} Stops Map`}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {selectedDayNumber === 'all'
                        ? `${itinerary.days.reduce((a, b) => a + b.stops.length, 0)} Pins`
                        : `${currentDay?.stops.length || 0} Pins`}
                    </span>
                  </div>

                  <div className="h-[480px] w-full">
                    <MapView
                      days={itinerary.days}
                      selectedDayNumber={selectedDayNumber}
                      currency={itinerary.currency}
                      activeStopName={activeStopName}
                      onSelectStop={(stop) => setActiveStopName(stop.name)}
                    />
                  </div>

                  <div className="p-2 text-center">
                    <p className="text-[11px] text-slate-400">
                      Click any pin to inspect details or open directly in Google Maps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stays Section */}
            {itinerary.stays && itinerary.stays.length > 0 && (
              <StaysSection stays={itinerary.stays} city={itinerary.city} />
            )}

            {/* Optional Transportation Section: Travel to Destination */}
            <div id="travel-section" className="pt-2 scroll-mt-20">
              <TransportationSection
                destinationCity={itinerary.city}
                country={itinerary.country}
              />
            </div>
          </div>
        )}

        {/* View Mode: Raw JSON */}
        {activeTab === 'json' && (
          <RawJsonViewer
            itinerary={itinerary}
            onImportJson={(imported) => {
              setItinerary(imported);
              setSelectedDayNumber(1);
            }}
          />
        )}

        {/* View Mode: System Prompt & Rules */}
        {activeTab === 'prompt' && <SystemPromptViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TravelX</span>
            <span>—</span>
            <span>Travel Itinerary Generator strictly adhering to schema constraints</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('prompt')}
              className="hover:text-blue-600 transition font-medium"
            >
              System Prompt Specs
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('json')}
              className="hover:text-blue-600 transition font-medium"
            >
              JSON Schema Export
            </button>
            <span>•</span>
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="text-blue-600 font-bold hover:underline"
            >
              Generate Itinerary
            </button>
          </div>
        </div>
      </footer>

      {/* Generator Drawer / Modal */}
      <GeneratorDrawer
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerated={handleGenerated}
      />
    </div>
  );
}
