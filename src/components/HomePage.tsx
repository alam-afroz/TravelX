import { useState, useEffect } from 'react';
import {
  MapPin,
  Utensils,
  Train,
  Layers,
  ArrowRight,
  ChevronRight,
  Zap,
  CalendarDays,
  Map,
  Wallet,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { PRESET_ITINERARIES } from '../data/presets.ts';
import { Itinerary } from '../types.ts';
import { UserMenu } from './UserMenu.tsx';
import slide1 from '../assets/hero_section/ladakh.png';
import slide2 from '../assets/hero_section/ghat.jpg';
import searchImg from '../assets/search.png';
import resultImg from '../assets/result.png';

import imgJaipur from '../assets/popular_destination/Jaipur.jpg';
import imgLucknow from '../assets/popular_destination/Lucknow.jpg';
import imgNoida from '../assets/popular_destination/Noida.jpg';
import imgAgra from '../assets/popular_destination/agra.jpg';
import imgPune from '../assets/popular_destination/Pune.jpg';
import imgHyderabad from '../assets/popular_destination/hyderabad.jpg';

const HERO_IMAGES = [slide1, slide2];

interface HomePageProps {
  onStartSearch: (initialCity?: string, initialCountry?: string) => void;
  onSelectPresetItinerary: (itinerary: Itinerary) => void;
  currentUser?: any;
  onNavigateToLogin?: () => void;
  onNavigateToSignUp?: () => void;
  onLogout?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export function HomePage({ onStartSearch, onSelectPresetItinerary, currentUser, onNavigateToLogin, onNavigateToSignUp, onLogout }: HomePageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#e1ecf7] text-slate-800 flex flex-col font-sans overflow-x-hidden">
      {/* Top Navbar - Sticky & Glassmorphism */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 w-full z-50 bg-[#e1ecf7]/85 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[80px] flex items-center justify-between">
          {/* Mobile Hamburger */}
          <div className="flex md:hidden flex-1 justify-start">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Left Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-slate-500 flex-1 justify-start">
            <button 
              onClick={() => document.getElementById('popular-destinations')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#2d497c] transition-colors cursor-pointer"
            >
              Explore
            </button>
            <button onClick={() => onStartSearch()} className="hover:text-[#2d497c] transition-colors font-light text-slate-400">Search</button>
            <button onClick={() => window.location.hash = '#about'} className="hover:text-[#2d497c] transition-colors cursor-pointer">About</button>
          </nav>
          
          {/* Center Logo */}
          <div className="text-2xl font-medium text-[#2d497c] hover:text-blue-600 transition-colors duration-300 tracking-wide select-none flex items-center justify-center cursor-pointer shrink-0">
            TravelX
          </div>
          
          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-500 flex-1 justify-end">
            <button className="hover:text-[#2d497c] transition-colors cursor-pointer">Community</button>
            {currentUser ? (
              <UserMenu 
                currentUser={currentUser} 
                onLogout={() => onLogout?.()} 
                onSwitchAccount={() => {
                  onNavigateToLogin?.();
                }}
              />
            ) : (
              <button 
                onClick={onNavigateToLogin}
                className="px-7 py-2.5 bg-[#3a3b3c] hover:bg-[#1e293b] text-white text-sm rounded-full transition-colors duration-300 shadow-md flex items-center gap-2 font-semibold active:scale-95 cursor-pointer"
              >
                Login/ Signup
              </button>
            )}
          </div>

          {/* Mobile Right Spacer (to keep logo centered) */}
          <div className="flex md:hidden flex-1 justify-end"></div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-0 w-full bg-[#e1ecf7]/95 backdrop-blur-xl border-b border-white/40 shadow-lg z-40 py-4 px-6 flex flex-col gap-4 text-[15px] font-medium text-slate-600">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                document.getElementById('popular-destinations')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left py-2 hover:text-[#2d497c] transition-colors cursor-pointer"
            >
              Explore
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onStartSearch();
              }} 
              className="text-left py-2 hover:text-[#2d497c] transition-colors cursor-pointer"
            >
              Search
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.location.hash = '#about';
              }} 
              className="text-left py-2 hover:text-[#2d497c] transition-colors cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-[#2d497c] transition-colors cursor-pointer"
            >
              Community
            </button>
            {currentUser ? (
              <>
                <div className="w-full h-px bg-slate-300 my-1" />
                
                <div className="text-left py-2 text-slate-800 font-semibold truncate">
                  {currentUser.displayName || currentUser.email || 'Account'}
                </div>
                
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 hover:text-[#2d497c] transition-colors cursor-pointer"
                >
                  Recent
                </button>

                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateToLogin?.();
                  }}
                  className="text-left py-2 hover:text-[#2d497c] transition-colors cursor-pointer"
                >
                  Switch Account
                </button>

                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="flex items-center gap-3 py-2 text-red-600 hover:text-red-700 transition-colors cursor-pointer text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateToLogin?.();
                }}
                className="mt-2 px-7 py-2.5 bg-[#3a3b3c] hover:bg-[#1e293b] text-white text-sm rounded-full transition-colors duration-300 shadow-md font-semibold text-center w-full active:scale-95 cursor-pointer"
              >
                Login/ Signup
              </button>
            )}
          </div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative w-full h-[calc(100vh-80px)] min-h-[500px] overflow-hidden bg-slate-900">
        {HERO_IMAGES.map((src, index) => (
          <motion.img 
            key={index}
            initial={{ opacity: index === 0 ? 1 : 0, scale: 1 }}
            animate={{ 
              opacity: currentImageIndex === index ? 1 : 0,
              scale: currentImageIndex === index ? 1.15 : 1
            }}
            transition={{ 
              opacity: { duration: 5, ease: "easeInOut" },
              scale: { duration: 15, ease: "linear" }
            }}
            src={src} 
            alt={`Hero background ${index + 1}`} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col items-center justify-end pb-24 px-4 z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-10 tracking-wide drop-shadow-xl text-center"
            >
              Your trip, planned in seconds.
            </motion.h1>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5">
              <button 
                onClick={() => onStartSearch()} 
                className="group px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-full shadow-xl transition-colors duration-300 min-w-[220px] flex items-center justify-center gap-2 active:scale-95"
              >
                Explore Location
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/15 border border-white/40 text-white font-bold rounded-full shadow-lg transition-colors duration-300 backdrop-blur-md min-w-[220px] active:scale-95">
                Community
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 md:py-32 relative">
        {/* Decorative background blur */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-medium text-center text-slate-900 mb-20 max-w-3xl mx-auto tracking-wide drop-shadow-sm"
          >
            Want to Plan your Travel without Switching Tabs ??
          </motion.h2>
          
          <div className="flex flex-col gap-24 lg:gap-0">
            
            {/* Row 1: Image Left, Text Right */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-0">
              {/* Image */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-[60%] flex justify-center"
              >
                <img 
                  src={searchImg} 
                  alt="Search interface preview" 
                  className="w-full rounded-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-4 sm:border-8 border-white/90" 
                />
              </motion.div>
              
              {/* Text */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-[40%] py-2"
              >
                <h3 className="text-2xl font-semibold text-slate-900 mb-4 tracking-wide leading-snug">
                  Enter Destination, Days, Budget & Preference
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Tell us where you want to go and what you love. Our AI handles the heavy lifting, curating the perfect trip parameters.
                </p>
              </motion.div>
            </div>

            {/* Row 2: Text Left, Image Right */}
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
              {/* Text */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-[40%] py-2"
              >
                <h3 className="text-2xl font-semibold text-[#2d497c] mb-4 tracking-wide leading-snug">
                  Get Your Itinerary Plan & Customize it later
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Instantly receive a complete travel plan. Swap out restaurants, change hotels, or adjust timelines directly in the visual studio.
                </p>
              </motion.div>
              
              {/* Image */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-[60%] flex justify-center"
              >
                <img 
                  src={resultImg} 
                  alt="Customization interface preview" 
                  className="w-full rounded-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-4 sm:border-8 border-white/95" 
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Features & Filler Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-white/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-28"
          >
            {[
              { 
                icon: Zap, 
                title: "Personalized in seconds", 
                desc: "Pick your city, days, interests, and budget, and get a complete plan in one click. No research, no account.", 
                color: "text-blue-600", 
                bg: "bg-blue-50" 
              },
              { 
                icon: CalendarDays, 
                title: "Smart day-by-day plans", 
                desc: "Each day has a theme, and nearby stops are grouped together, so you spend more time exploring and less time in transit.", 
                color: "text-indigo-600", 
                bg: "bg-indigo-50" 
              },
              { 
                icon: Map, 
                title: "Interactive map", 
                desc: "See every stop as a numbered pin along your route, so you know where you're going and in what order.", 
                color: "text-emerald-600", 
                bg: "bg-emerald-50" 
              },
              { 
                icon: Wallet, 
                title: "Food, stays, and costs in one place", 
                desc: "Get local food spots, hotel suggestions matched to your budget, and estimated entry prices for each stop.", 
                color: "text-amber-600", 
                bg: "bg-amber-50" 
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.05)" }}
                className="bg-white/80 backdrop-blur-lg rounded-sm p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white transition-all text-center flex flex-col items-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-14 h-14 ${feature.bg} rounded-sm flex items-center justify-center ${feature.color} mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10 shrink-0`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3 tracking-wide relative z-10 leading-tight">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed relative z-10 font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Filler/Suggested Places */}
          <motion.div 
            id="popular-destinations"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pb-32"
          >
             <h3 className="text-2xl font-medium text-[#2d497c] mb-14 tracking-wide flex items-center justify-center gap-3 text-center">
               Popular Destinations to Explore
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
               {[
                 { name: 'Jaipur', desc: 'The Pink City', image: imgJaipur },
                 { name: 'Lucknow', desc: 'City of Nawabs', image: imgLucknow },
                 { name: 'Noida', desc: 'Tech & Commerce', image: imgNoida },
                 { name: 'Agra', desc: 'City of Taj', image: imgAgra },
                 { name: 'Pune', desc: 'Oxford of the East', image: imgPune },
                 { name: 'Hyderabad', desc: 'City of Pearls', image: imgHyderabad },
               ].map((dest, i) => (
                  <motion.div 
                    key={dest.name} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => {
                      onStartSearch(dest.name, 'India');
                    }} 
                    className="relative rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden h-64"
                  >
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                       <h4 className="text-2xl font-semibold mb-1 tracking-wide">{dest.name}</h4>
                       <div className="flex items-center justify-between">
                         <p className="text-sm font-medium text-white/80">{dest.desc}</p>
                         <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white flex items-center justify-center transition-colors">
                           <ArrowRight className="w-4 h-4 text-white group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                         </div>
                       </div>
                    </div>
                  </motion.div>
               ))}
             </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-20 mt-auto border-t-4 border-[#2d497c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-3xl font-medium text-white hover:text-blue-400 transition-colors duration-300 tracking-wide mb-6 inline-flex items-center gap-2 cursor-pointer">
            TravelX
          </div>
          <p className="text-base text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
            AI Travel Itinerary Generator strictly adhering to schema constraints. Build your dream trip in seconds.
          </p>
          <div className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} TravelX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
