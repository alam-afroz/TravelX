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
import { AboutPage } from './components/AboutPage.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { SignUpPage } from './components/SignUpPage.tsx';
import { UserMenu } from './components/UserMenu.tsx';
import { RecentTripsPage } from './components/RecentTripsPage.tsx';
import { CommunityPage } from './components/CommunityPage.tsx';
import { CustomerCarePage } from './components/CustomerCarePage.tsx';
import { Footer } from './components/Footer.tsx';
import { db, auth } from './lib/firebase.ts';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

type AppView = 'home' | 'search' | 'results' | 'about' | 'login' | 'signup' | 'recent' | 'community' | 'customer-care';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#search') return 'search';
      if (hash === '#results' || hash === '#itinerary') return 'results';
      if (hash === '#about') return 'about';
      if (hash === '#login') return 'login';
      if (hash === '#signup') return 'signup';
      if (hash === '#recent') return 'recent';
      if (hash === '#community') return 'community';
      if (hash === '#customer-care') return 'customer-care';
    }
    return 'home';
  });

  const [searchInit, setSearchInit] = useState({ city: '', country: '' });
  const [itinerary, setItinerary] = useState<Itinerary>(PRESET_ITINERARIES.jaipur);
  const [activeTab, setActiveTab] = useState<'visual' | 'json' | 'prompt'>('visual');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | 'all'>(1);
  const [activeStopName, setActiveStopName] = useState<string | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

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
      } else if (hash === '#about') {
        setCurrentView('about');
      } else if (hash === '#login') {
        setCurrentView('login');
      } else if (hash === '#signup') {
        setCurrentView('signup');
      } else if (hash === '#recent') {
        setCurrentView('recent');
      } else if (hash === '#community') {
        setCurrentView('community');
      } else if (hash === '#customer-care') {
        setCurrentView('customer-care');
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

  const saveItineraryToFirestore = async (newItinerary: Itinerary) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'trips'), {
        userId: currentUser.uid,
        city: newItinerary.city,
        days: newItinerary.days.length,
        budget: newItinerary.budget || 'N/A',
        interests: newItinerary.interests || [],
        itinerary: newItinerary,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving trip to Firestore:", error);
    }
  };

  const handleGeneratedFromSearch = (newItinerary: Itinerary) => {
    setItinerary(newItinerary);
    setSelectedDayNumber(1);
    setActiveStopName(null);
    saveItineraryToFirestore(newItinerary);
    navigateTo('results');
  };

  const handleSelectRecentTrip = (tripItinerary: Itinerary) => {
    setItinerary(tripItinerary);
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

  const handleGenerated = (newItinerary: Itinerary) => {
    setItinerary(newItinerary);
    setSelectedDayNumber(1);
    setActiveStopName(null);
    saveItineraryToFirestore(newItinerary);
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
        currentUser={currentUser}
        onNavigateToLogin={() => navigateTo('login')}
        onNavigateToSignUp={() => navigateTo('signup')}
        onLogout={() => signOut(auth)}
        onNavigateToRecent={() => navigateTo('recent')}
        onNavigateToCommunity={() => navigateTo('community')}
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

  // Screen 3: About Page
  if (currentView === 'about') {
    return (
      <AboutPage onBackToHome={() => navigateTo('home')} />
    );
  }

  // Screen 4: Login
  if (currentView === 'login') {
    return <LoginPage onBack={() => navigateTo('home')} onNavigateToSignUp={() => navigateTo('signup')} />;
  }

  // Screen 5: SignUp
  if (currentView === 'signup') {
    return <SignUpPage onBack={() => navigateTo('home')} onNavigateToLogin={() => navigateTo('login')} />;
  }

  // Screen 6: Recent Trips
  if (currentView === 'recent') {
    return (
      <RecentTripsPage 
        currentUser={currentUser} 
        onBackToHome={() => navigateTo('home')} 
        onSelectRecentTrip={handleSelectRecentTrip} 
      />
    );
  }

  // Screen 7: Community Page
  if (currentView === 'community') {
    return (
      <CommunityPage 
        currentUser={currentUser} 
        onBackToHome={() => navigateTo('home')} 
        onNavigateToLogin={() => navigateTo('login')}
      />
    );
  }

  // Screen 8: Customer Care
  if (currentView === 'customer-care') {
    return <CustomerCarePage onBackToHome={() => navigateTo('home')} />;
  }

  // Screen 3: Results View (Travel Plan Studio)
  const currentDay =
    selectedDayNumber === 'all'
      ? null
      : itinerary.days.find((d) => d.day === selectedDayNumber) || itinerary.days[0];

  return (
    <div className="min-h-screen bg-[#e1ecf7] text-slate-800 antialiased flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#e1ecf7]/85 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Back to Home */}
          <div className="flex-1 flex items-center">
            <button
              onClick={() => navigateTo('home')}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition flex items-center justify-center cursor-pointer"
              title="Return to Home Page"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <button
              onClick={() => navigateTo('home')}
              className="cursor-pointer group flex flex-col items-center"
            >
              <span className="font-medium text-xl text-[#2d497c] tracking-wide">
                TravelX
              </span>
            </button>
          </div>

          {/* Plan Action and Auth */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {currentUser ? (
              <UserMenu 
                currentUser={currentUser} 
                onLogout={() => signOut(auth)} 
                onSwitchAccount={() => {
                  navigateTo('login');
                }}
                onNavigateToRecent={() => navigateTo('recent')}
              />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('login')}
                  className="hidden sm:flex px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-full hover:bg-slate-100 transition-colors items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => navigateTo('signup')}
                  className="hidden sm:flex px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-full transition-colors items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
            
            <button
              onClick={() => {
                setSearchInit({ city: itinerary.city, country: itinerary.country });
                navigateTo('search');
              }}
              className="px-4 py-2 bg-[#2d497c] hover:bg-[#1e293b] text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Search</span>
            </button>
          </div>
        </div>

      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Destination Header Banner */}
        <div className="bg-white/80 backdrop-blur-xl rounded-sm border border-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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
              <h1 className="text-3xl sm:text-4xl font-medium text-[#2d497c] tracking-wide">
                {itinerary.city}
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {itinerary.summary}
              </p>
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
                  className={`px-4 py-2.5 rounded-sm text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
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
                className={`px-4 py-2.5 rounded-sm text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
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
                    <div className="bg-white/80 backdrop-blur-md rounded-sm border border-white p-5 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                        <span>Day {currentDay.day} Theme</span>
                      </div>
                      <h2 className="text-xl font-semibold text-slate-900 tracking-wide">
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
                        className="bg-white/80 backdrop-blur-md rounded-sm border border-white p-6 space-y-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <span className="text-xs font-bold text-blue-600 uppercase">
                              Day {dayPlan.day}
                            </span>
                            <h3 className="text-lg font-semibold text-slate-900 tracking-wide">
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
                <div className="bg-white/80 backdrop-blur-xl rounded-sm border border-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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

      <Footer 
        currentUser={currentUser}
        onNavigateToHome={() => navigateTo('home')}
        onNavigateToExplore={() => {
          navigateTo('home');
          setTimeout(() => {
            window.location.hash = '#popular-destinations';
            document.getElementById('popular-destinations')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onNavigateToSearch={() => navigateTo('search')}
        onNavigateToAbout={() => navigateTo('about')}
        onNavigateToCommunity={() => navigateTo('community')}
        onNavigateToRecent={() => navigateTo('recent')}
        onNavigateToLogin={() => navigateTo('login')}
        onNavigateToCustomerCare={() => navigateTo('customer-care')}
      />

      {/* Generator Drawer / Modal */}
      <GeneratorDrawer
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerated={handleGenerated}
      />
    </div>
  );
}
