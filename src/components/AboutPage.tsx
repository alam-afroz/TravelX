import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import bgImage from '../assets/hero_section/ladakh.png';

interface AboutPageProps {
  onBackToHome: () => void;
}

export function AboutPage({ onBackToHome }: AboutPageProps) {
  return (
    <div 
      className="min-h-screen text-slate-800 antialiased flex flex-col font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${bgImage})` }}
    >
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#e1ecf7]/85 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] shrink-0">
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
          <div className="flex justify-end"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full md:w-[60%] max-w-none mx-auto px-4 sm:px-6 py-12 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-xl rounded-sm border border-white p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium text-[#2d497c] tracking-wide mb-3">About ExploreX</h1>
            <p className="text-lg text-slate-500 font-medium">Your trip, planned in seconds.</p>
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                What is ExploreX?
              </h2>
              <p className="mb-4 text-[15px]">
                ExploreX is a smart travel itinerary planner. Tell us where you're going, how many days you have, what you enjoy, and your budget, and ExploreX builds a complete day-by-day plan for you: places to visit, local food to try, stays to book, estimated entry costs, and an interactive map of your route.
              </p>
              <p className="font-medium text-slate-700 bg-blue-50/50 p-4 rounded-sm border border-blue-100/50 text-[15px]">
                No long research. No ten open tabs. No account needed.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                Why we built it
              </h2>
              <p className="text-[15px]">
                Planning a trip to a new city is harder than it should be. Information is scattered across blogs, review sites, and map apps, generic "Top 10" lists don't match your interests, and it's hard to tell which places are close to each other. Many travelers end up spending more time planning than exploring, or skip great places simply because they never found out about them.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                Our goals
              </h2>
              <ul className="space-y-3 list-none text-[15px]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                  <p><strong>Promote tourism:</strong> help travelers discover the history, culture, food, and hidden corners of a destination, including places that often get overlooked.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0" />
                  <p><strong>Make trip planning easy:</strong> turn hours of research into a clear, personalized plan in a few clicks.</p>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                How it works
              </h2>
              <ol className="space-y-4 list-decimal list-inside marker:text-black marker:font-bold text-[15px]">
                <li className="pl-2">
                  <strong>Choose your trip:</strong> enter your city, number of days, interests, and budget level.
                </li>
                <li className="pl-2">
                  <strong>Get your plan:</strong> ExploreX generates a themed itinerary for each day, with nearby stops grouped together.
                </li>
                <li className="pl-2">
                  <strong>Explore:</strong> follow the numbered pins on the map, check food and stay suggestions, and print or save your plan.
                </li>
              </ol>
            </section>

            {/* Section 5 */}
            <section className="bg-[#E6E6FA] p-3 rounded-sm border border-purple-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">A note on accuracy</h2>
              <p className="text-[13px] text-slate-800 leading-tight">
                ExploreX uses AI to generate itineraries and price estimates. Entry fees are approximate and marked as <em className="font-semibold">AI-estimated</em>, and opening hours and prices can change, so please confirm details with the official source before you travel.
              </p>
            </section>

            {/* Section 6 */}
            <section className="pt-6 border-t border-slate-100 text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">About the creator</h2>
              <p className="mb-4 text-[15px]">
                We are a team of four people, we are students of <strong>AKTU</strong>. ExploreX is initially a college project, built to show how technology can make travel simpler and help more people explore new places with confidence.
              </p>
              <p className="text-lg italic font-medium text-blue-600">
                Happy travels!
              </p>
            </section>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
