import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Eye, Loader2, Calendar } from 'lucide-react';
import { db } from '../lib/firebase.ts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Itinerary } from '../types.ts';

interface RecentTripsPageProps {
  currentUser: any;
  onBackToHome: () => void;
  onSelectRecentTrip: (itinerary: Itinerary) => void;
}

export function RecentTripsPage({ currentUser, onBackToHome, onSelectRecentTrip }: RecentTripsPageProps) {
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTrips = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, 'trips'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const trips = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        // Sort client-side to avoid composite index requirement
        trips.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });
        setRecentTrips(trips);
      } catch (err) {
        console.error("Error fetching recent trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentTrips();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#e1ecf7] text-slate-800 antialiased flex flex-col font-sans">
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
              ExploreX
            </button>
          </div>
          <div className="flex justify-end">
            {/* Empty for layout balance */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1 flex flex-col">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-semibold text-[#2d497c] tracking-wide flex items-center justify-center sm:justify-start gap-3">
            <Clock className="w-7 h-7" />
            Your Recent Searches
          </h1>
          <p className="text-slate-500 mt-2">
            Access your previously generated itineraries
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="font-medium">Loading your trips...</span>
          </div>
        ) : recentTrips.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-sm border border-white p-10 shadow-sm text-center">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-700 mb-2">No recent trips found</h3>
            <p className="text-slate-500 mb-6">You haven't generated any travel plans yet.</p>
            <button
              onClick={onBackToHome}
              className="px-6 py-2.5 bg-[#2d497c] hover:bg-[#1e293b] text-white text-sm font-semibold rounded-full shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              Start Planning
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map((trip) => (
              <div 
                key={trip.id} 
                className="bg-white/90 backdrop-blur-lg rounded-sm border border-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wide">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.itinerary?.country || 'Destination'}
                    </div>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {trip.createdAt?.toDate ? trip.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-medium text-[#2d497c] tracking-wide mb-2 line-clamp-1">
                    {trip.city}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-sm border border-blue-100">
                      {trip.days} {trip.days === 1 ? 'Day' : 'Days'}
                    </span>
                    {trip.budget && trip.budget !== 'N/A' && (
                      <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded-sm border border-amber-100 uppercase">
                        {trip.budget} Budget
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onSelectRecentTrip(trip.itinerary)}
                  className="w-full px-4 py-2.5 bg-slate-50 hover:bg-[#2d497c] text-slate-700 hover:text-white border border-slate-200 hover:border-[#2d497c] text-sm font-semibold rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  View Travel Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
