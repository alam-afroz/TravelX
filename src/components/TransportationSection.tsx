import { useState, useEffect } from 'react';
import {
  Train,
  Plane,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  Coins,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  TransportationMode,
  TrainOption,
  FlightOption,
  TransportationDetail,
} from '../types.ts';
import { PRESET_TRANSPORTATION } from '../data/presets.ts';
import { TransportationDetailModal } from './TransportationDetailModal.tsx';

interface TransportationSectionProps {
  destinationCity: string;
  country: string;
}

export function TransportationSection({
  destinationCity,
  country,
}: TransportationSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TransportationMode>('train');

  // Train form state - empty by default so user enters their own details first
  const [startingStation, setStartingStation] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [quota, setQuota] = useState<'General' | 'Tatkal' | 'Other'>('General');
  const [preferredClass, setPreferredClass] = useState('Any');

  // Flight form state - empty by default so user enters their own details first
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [cabinClass, setCabinClass] = useState<
    'Economy' | 'Premium Economy' | 'Business' | 'First'
  >('Economy');

  // Search results state - empty until user submits search
  const [trainResults, setTrainResults] = useState<TrainOption[]>([]);
  const [flightResults, setFlightResults] = useState<FlightOption[]>([]);
  const [hasSearchedTrain, setHasSearchedTrain] = useState(false);
  const [hasSearchedFlight, setHasSearchedFlight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Detail modal state
  const [selectedDetail, setSelectedDetail] = useState<TransportationDetail | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Auto-determine destination station/airport based on destination city
  // Notice: We do NOT preload search results. User must fill origin & date and submit.
  useEffect(() => {
    const cityLower = destinationCity.toLowerCase();
    const preset = (PRESET_TRANSPORTATION as any)[cityLower];

    if (preset) {
      setDestinationStation(preset.trainStation);
      setArrivalAirport(preset.airport);
    } else {
      setDestinationStation(`${destinationCity} Railway Station`);
      setArrivalAirport(`${destinationCity} International Airport`);
    }

    // Reset results when destination city changes so user inputs their route
    setTrainResults([]);
    setFlightResults([]);
    setHasSearchedTrain(false);
    setHasSearchedFlight(false);
    setErrorMsg(null);
  }, [destinationCity]);

  // Quick date helper
  const handleSetQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setJourneyDate(d.toISOString().split('T')[0]);
    setErrorMsg(null);
  };

  // Handle Search Submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'train' && !startingStation.trim()) {
      setErrorMsg('Please enter your starting station (e.g. New Delhi, Mumbai, Lucknow)');
      return;
    }
    if (mode === 'flight' && !departureCity.trim()) {
      setErrorMsg('Please enter your departure city or airport (e.g. Delhi DEL, Mumbai BOM)');
      return;
    }
    if (!journeyDate) {
      setErrorMsg('Please select your journey date');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setLoadingStep(
      `Finding ${mode === 'train' ? 'train' : 'flight'} options from ${
        mode === 'train' ? startingStation.trim() : departureCity.trim()
      } to ${destinationCity}...`
    );

    const cityLower = destinationCity.toLowerCase();
    const preset = (PRESET_TRANSPORTATION as any)[cityLower];

    try {
      const response = await fetch('/api/transportation/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          destinationCity,
          startingStation: startingStation.trim(),
          destinationStation: destinationStation.trim(),
          journeyDate,
          quota,
          preferredClass,
          departureCity: departureCity.trim(),
          arrivalCity: arrivalAirport.trim(),
          cabinClass,
        }),
      });

      const rawSearchText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(rawSearchText);
      } catch {
        throw new Error('Servers are busy, please try again in a minute');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Servers are busy, please try again in a minute');
      }

      if (data.data?.options && data.data.options.length > 0) {
        if (mode === 'train') {
          setTrainResults(data.data.options);
          setHasSearchedTrain(true);
        } else {
          setFlightResults(data.data.options);
          setHasSearchedFlight(true);
        }
      } else {
        throw new Error('No travel options found for the specified route');
      }
    } catch (err: any) {
      console.warn('Transportation search fallback or error:', err);
      if (preset) {
        if (mode === 'train' && preset.trains) {
          const adaptedTrains = preset.trains.map((t: any) => ({
            ...t,
            startingStation: startingStation.trim() || t.startingStation,
          }));
          setTrainResults(adaptedTrains);
          setHasSearchedTrain(true);
        }
        if (mode === 'flight' && preset.flights) {
          const adaptedFlights = preset.flights.map((f: any) => ({
            ...f,
            departureAirport: departureCity.trim() || f.departureAirport,
          }));
          setFlightResults(adaptedFlights);
          setHasSearchedFlight(true);
        }
      } else {
        setErrorMsg('Servers are busy, please try again in a minute');
      }
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // Handle View Details Click
  const handleViewDetails = async (
    item: TrainOption | FlightOption,
    selectedClassOpt?: string
  ) => {
    setSelectedDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    setDetailModalOpen(true);

    try {
      const response = await fetch('/api/transportation/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          item,
          destinationCity,
          selectedClass: selectedClassOpt || (item as any).cabinClass || preferredClass,
        }),
      });

      const rawDetailText = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(rawDetailText);
      } catch {
        throw new Error('Servers are busy, please try again in a minute');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Servers are busy, please try again in a minute');
      }

      if (data.data) {
        setSelectedDetail(data.data);
      } else {
        throw new Error('Servers are busy, please try again in a minute');
      }
    } catch (err: any) {
      console.warn('Transportation details error, creating synthesized overview:', err);
      // Fallback details if Gemini is temporarily busy
      if (mode === 'train') {
        const train = item as TrainOption;
        setSelectedDetail({
          title: train.name,
          mode: 'train',
          identifier: train.number,
          overview: `${train.name} (${train.number}) connects ${train.startingStation} and ${train.destinationStation} covering the distance in approximately ${train.duration}.`,
          route: `${train.startingStation} → Key Transit Junctions → ${train.destinationStation}`,
          duration: train.duration,
          classMeaning:
            selectedClassOpt === '1A'
              ? '1A (First Class AC): Private lockable cabins/coupes with plush berths, attendant call bell, and maximum comfort.'
              : selectedClassOpt === '2A'
              ? '2A (AC 2 Tier): Air-conditioned berths arranged 4 per compartment with privacy curtains and clean linen.'
              : selectedClassOpt === '3A'
              ? '3A (AC 3 Tier): Air-conditioned 6-berth bay with middle and upper berths, clean bedsheets, blanket, and pillow.'
              : selectedClassOpt === 'SL'
              ? 'SL (Sleeper Class): Non-air-conditioned open-window berths, economical and widely favored for domestic travel.'
              : 'Comfortable rail travel with allocated berths and on-board pantry catering options.',
          classInfo:
            'Linen and bedding provided in all AC classes (1A, 2A, 3A). Charging sockets available near passenger bays.',
          estimatedFare:
            train.classes?.find((c) => c.className === selectedClassOpt)?.fare ||
            train.classes?.[0]?.fare ||
            'Approximate local fare',
          travelTips: [
            'Arrive at the starting station at least 30-45 minutes before departure.',
            'Carry a valid government photo ID card matching passenger name.',
            'Pack drinking water and keep electronic tickets ready on your phone.',
          ],
        });
      } else {
        const flight = item as FlightOption;
        setSelectedDetail({
          title: `${flight.airline} ${flight.flightNumber}`,
          mode: 'flight',
          identifier: flight.flightNumber,
          overview: `${flight.airline} operates regular service between ${flight.departureAirport} and ${flight.arrivalAirport} with an approximate flight time of ${flight.duration}.`,
          route: `${flight.departureAirport} → Direct / Connecting Air Route → ${flight.arrivalAirport}`,
          duration: flight.duration,
          classMeaning: `${flight.cabinClass} cabin offering standard seat pitch, carry-on baggage allowance, and beverage options.`,
          classInfo:
            'Standard cabin bag allowance (typically 7 kg) plus check-in baggage depending on fare rules.',
          estimatedFare: flight.fare,
          travelTips: [
            'Reach the airport 2 hours prior to domestic flight departure.',
            'Complete web check-in within 24 hours of flight to select your seat.',
            'Keep your boarding pass and photo identification readily accessible.',
          ],
        });
      }
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Prominent Header / Toggle Banner */}
      <div className="p-5 sm:p-6 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shrink-0 shadow-xs">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-extrabold tracking-tight">
                Travel to {destinationCity}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/25 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                Optional Travel Exploration
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Explore estimated train routes & flight options to reach your trip destination
            </p>
          </div>
        </div>

        {/* Toggle / Open Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <span>{isOpen ? 'Hide Options' : `Explore Travel to ${destinationCity}`}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Transportation Studio */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6 bg-slate-50/50 border-t border-slate-200">
          {/* Mode Tabs: Train or Flight */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('train')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  mode === 'train'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Train className="w-4 h-4" />
                <span>🚆 Train Options</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('flight')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  mode === 'flight'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>✈️ Flight Options</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI-Estimated Schedules & Fares</span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4"
          >
            {mode === 'train' ? (
              /* Train Search Inputs */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Starting Station */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Starting Station
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter station (e.g. New Delhi, Mumbai, Lucknow)"
                    value={startingStation}
                    onChange={(e) => {
                      setStartingStation(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Destination Station (Auto-determined) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center justify-between">
                    <span>Destination Station</span>
                    <span className="text-[10px] text-blue-600 lowercase font-medium">auto</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${destinationCity} Station`}
                    value={destinationStation}
                    onChange={(e) => setDestinationStation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Journey Date */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Journey Date
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(1)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold px-1 rounded hover:bg-blue-50"
                        title="Set date to tomorrow"
                      >
                        Tomorrow
                      </button>
                      <span className="text-slate-300 text-[10px]">|</span>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(7)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold px-1 rounded hover:bg-blue-50"
                        title="Set date to 1 week from now"
                      >
                        +1 Wk
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={journeyDate}
                    onChange={(e) => {
                      setJourneyDate(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Quota */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Quota
                  </label>
                  <select
                    value={quota}
                    onChange={(e) => setQuota(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Tatkal">Tatkal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Preferred Class */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Preferred Class
                  </label>
                  <select
                    value={preferredClass}
                    onChange={(e) => setPreferredClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Any">Any Class</option>
                    <option value="SL">SL (Sleeper)</option>
                    <option value="3A">3A (AC 3 Tier)</option>
                    <option value="2A">2A (AC 2 Tier)</option>
                    <option value="1A">1A (First Class AC)</option>
                    <option value="CC">CC (AC Chair Car)</option>
                    <option value="EC">EC (Exec Chair Car)</option>
                  </select>
                </div>
              </div>
            ) : (
              /* Flight Search Inputs */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Departure Airport */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Departure City / Airport
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter city/airport (e.g. Delhi DEL, Mumbai BOM)"
                    value={departureCity}
                    onChange={(e) => {
                      setDepartureCity(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Arrival Airport (Auto-determined) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center justify-between">
                    <span>Arrival City / Airport</span>
                    <span className="text-[10px] text-blue-600 lowercase font-medium">auto</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${destinationCity} Airport`}
                    value={arrivalAirport}
                    onChange={(e) => setArrivalAirport(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Journey Date */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Journey Date
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(1)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold px-1 rounded hover:bg-blue-50"
                        title="Set date to tomorrow"
                      >
                        Tomorrow
                      </button>
                      <span className="text-slate-300 text-[10px]">|</span>
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate(7)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold px-1 rounded hover:bg-blue-50"
                        title="Set date to 1 week from now"
                      >
                        +1 Wk
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={journeyDate}
                    onChange={(e) => {
                      setJourneyDate(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {/* Cabin Class */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Preferred Cabin / Class
                  </label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-500">
                Enter your departure details above to fetch AI-estimated routes & fares
              </p>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{loadingStep || 'Searching...'}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Search {mode === 'train' ? 'Trains' : 'Flights'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Mandatory Prominent Disclaimer Notice */}
          <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                Notice: AI-generated transportation information
              </p>
              <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">
                Fares and schedules are estimates and are not live booking information. This feature does not integrate with IRCTC, Indian Railways, or live airline ticketing systems.
              </p>
            </div>
          </div>

          {/* Error Message if search failed */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Results Grid or Empty Search Invitation */}
          <div>
            {mode === 'train' ? (
              !hasSearchedTrain ? (
                /* Unsearched Prompt for Train */
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <Train className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-800">
                    Ready to explore train options to {destinationCity}?
                  </h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Enter your starting station (e.g. New Delhi, Mumbai, Varanasi) and select your journey date above, then click <strong>"Search Trains"</strong> to fetch estimated schedules, available classes, and fares.
                  </p>
                </div>
              ) : (
                /* Trains Results List */
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      Train Options to {destinationCity}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {trainResults.length} trains estimated
                    </span>
                  </div>

                  {trainResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trainResults.map((train) => (
                        <div
                          key={train.id || train.number}
                          className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
                        >
                          <div>
                            {/* Header: Name, Number */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-bold text-slate-900">
                                    {train.name}
                                  </h5>
                                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                    #{train.number}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                  <span>{train.startingStation}</span>
                                  <ArrowRight className="w-3 h-3 text-slate-400" />
                                  <span className="font-semibold text-slate-800">
                                    {train.destinationStation}
                                  </span>
                                </div>
                              </div>

                              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                                {train.duration}
                              </span>
                            </div>

                            {/* Schedule times */}
                            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2.5 border border-slate-150 text-xs mb-3">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Departure
                                </span>
                                <span className="font-bold text-slate-800">{train.departureTime}</span>
                              </div>
                              <div className="text-center">
                                <Clock className="w-3.5 h-3.5 text-slate-400 mx-auto" />
                                <span className="text-[10px] text-slate-500">{train.duration}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Arrival
                                </span>
                                <span className="font-bold text-slate-800">{train.arrivalTime}</span>
                              </div>
                            </div>

                            {/* Class and Fares List */}
                            <div className="mb-3">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Available Classes & Approx Fares
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {train.classes?.map((cls) => (
                                  <button
                                    key={cls.className}
                                    type="button"
                                    onClick={() => handleViewDetails(train, cls.className)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer"
                                    title="Click to view class details"
                                  >
                                    <span className="font-bold text-slate-900">{cls.className}</span>
                                    <span className="text-emerald-700 font-semibold">{cls.fare}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* View Details Button */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">
                              Quota: {quota}
                            </span>
                            <button
                              onClick={() => handleViewDetails(train, preferredClass !== 'Any' ? preferredClass : undefined)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                      No train options found for this route. Please try another starting station or date.
                    </div>
                  )}
                </div>
              )
            ) : (
              !hasSearchedFlight ? (
                /* Unsearched Prompt for Flight */
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
                    <Plane className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-800">
                    Ready to explore flight options to {destinationCity}?
                  </h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Enter your departure city or airport (e.g. Delhi DEL, Mumbai BOM) and select your journey date above, then click <strong>"Search Flights"</strong> to fetch estimated flight schedules and fares.
                  </p>
                </div>
              ) : (
                /* Flights Results List */
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      Flight Options to {destinationCity}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {flightResults.length} flights estimated
                    </span>
                  </div>

                  {flightResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {flightResults.map((flight) => (
                        <div
                          key={flight.id || flight.flightNumber}
                          className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
                        >
                          <div>
                            {/* Header: Airline, Flight No */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-sm font-bold text-slate-900">
                                    {flight.airline}
                                  </h5>
                                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {flight.flightNumber}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                  <span>{flight.departureAirport}</span>
                                  <ArrowRight className="w-3 h-3 text-slate-400" />
                                  <span className="font-semibold text-slate-800">
                                    {flight.arrivalAirport}
                                  </span>
                                </div>
                              </div>

                              <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full shrink-0">
                                {flight.duration}
                              </span>
                            </div>

                            {/* Times */}
                            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2.5 border border-slate-150 text-xs mb-3">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Departs
                                </span>
                                <span className="font-bold text-slate-800">{flight.departureTime}</span>
                              </div>
                              <div className="text-center">
                                <Plane className="w-3.5 h-3.5 text-sky-500 mx-auto" />
                                <span className="text-[10px] text-slate-500">{flight.duration}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Arrives
                                </span>
                                <span className="font-bold text-slate-800">{flight.arrivalTime}</span>
                              </div>
                            </div>

                            {/* Fare & Cabin */}
                            <div className="flex items-center justify-between mb-3 text-xs">
                              <span className="text-slate-600">
                                Cabin: <span className="font-bold text-slate-800">{flight.cabinClass}</span>
                              </span>
                              <div className="flex items-center gap-1 text-slate-900 font-extrabold text-sm">
                                <span className="text-slate-400 text-xs font-normal">Approx:</span>
                                <span className="text-emerald-700">{flight.fare}</span>
                              </div>
                            </div>
                          </div>

                          {/* View Details */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                            <button
                              onClick={() => handleViewDetails(flight, flight.cabinClass)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                      No flight options found for this route. Please try another departure city or date.
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Modal for detailed information */}
      <TransportationDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        detail={selectedDetail}
        loading={detailLoading}
        error={detailError}
      />
    </section>
  );
}
