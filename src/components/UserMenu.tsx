import { useState, useRef, useEffect } from 'react';
import { LogOut, RefreshCw, Clock, ChevronDown } from 'lucide-react';
import accountIcon from '../assets/account.png';

interface UserMenuProps {
  currentUser: any;
  onLogout: () => void;
  onSwitchAccount: () => void;
}

export function UserMenu({ currentUser, onLogout, onSwitchAccount }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-100/50 p-1.5 pr-2 rounded-full transition-colors cursor-pointer border border-transparent hover:border-slate-200"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm border border-slate-200/50">
          <img src={accountIcon} alt="User Account" className="w-full h-full object-cover" />
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-semibold text-slate-700 leading-tight">
            {currentUser.displayName || 'Traveler'}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-slate-100">
          <div className="px-4 py-3 border-b border-slate-100 mb-2">
            <p className="text-sm font-semibold text-slate-800">{currentUser.displayName || 'Traveler'}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser.email}</p>
          </div>
          
          <button 
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-400" />
            Recent
          </button>
          
          <button 
            onClick={() => {
              setIsOpen(false);
              onSwitchAccount();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            Switch Account
          </button>
          
          <div className="h-px bg-slate-100 my-2 mx-4" />
          
          <button 
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
