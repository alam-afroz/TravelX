import githubLogo from '../assets/footer/github.png';
import linkedinLogo from '../assets/footer/linkedin.png';

export interface FooterProps {
  currentUser: any;
  onNavigateToHome: () => void;
  onNavigateToExplore: () => void;
  onNavigateToSearch: () => void;
  onNavigateToCommunity: () => void;
  onNavigateToAbout: () => void;
  onNavigateToRecent: () => void;
  onNavigateToLogin: () => void;
}

export function Footer({ 
  currentUser,
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToSearch,
  onNavigateToCommunity,
  onNavigateToAbout,
  onNavigateToRecent,
  onNavigateToLogin
}: FooterProps) {
  const handleRecentClick = () => {
    if (currentUser) {
      onNavigateToRecent();
    } else {
      onNavigateToLogin();
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-16 mt-16 border-t-4 border-[#2d497c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start justify-between w-full">
        
        {/* Left Section: Logo and Links */}
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-32 w-full">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <button 
              className="text-2xl font-medium text-white hover:text-blue-400 transition-colors duration-300 tracking-wide cursor-pointer" 
              onClick={onNavigateToHome}
            >
              TravelX
            </button>
          </div>
          
          {/* Links Grid */}
          <div className="w-full max-w-sm pt-1">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <button onClick={onNavigateToHome} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Home</button>
              <button onClick={onNavigateToCommunity} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Community</button>
              
              <button onClick={onNavigateToExplore} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Explore</button>
              <button onClick={onNavigateToAbout} className="text-left text-sm text-slate-400 hover:text-white transition-colors">About Us</button>
              
              <button onClick={onNavigateToSearch} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Search</button>
              <button onClick={handleRecentClick} className="text-left text-sm text-slate-400 hover:text-white transition-colors">Recent</button>
            </div>
          </div>
        </div>

        {/* Right: Social Icons */}
        <div className="flex-shrink-0 flex items-center justify-end gap-5 mt-12 md:mt-20 self-end">
          <a href="https://github.com/alam-afroz/TravelX.git" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src={githubLogo} alt="GitHub" className="w-[34px] h-[34px] object-contain rounded-full bg-white p-[2px]" />
          </a>
          <a href="https://www.linkedin.com/in/profile-afroz-alam" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src={linkedinLogo} alt="LinkedIn" className="w-[34px] h-[34px] object-contain rounded-sm" />
          </a>
        </div>
      </div>
    </footer>
  );
}
