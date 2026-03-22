import React from 'react';
import { Search, Bell, HelpCircle, Grid } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full glass-effect border-b border-surface-low px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-xl font-extrabold tracking-tight text-on-surface font-headline">Mường Thanh Luxury</span>
        <div className="hidden md:flex items-center bg-surface-low px-4 py-1.5 rounded-full border border-secondary/10">
          <Search size={16} className="text-secondary mr-2" />
          <input 
            type="text" 
            placeholder="Search rooms or guests..." 
            className="bg-transparent border-none text-sm focus:ring-0 p-0 text-on-surface w-48"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-surface-low transition-colors text-secondary relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 rounded-full hover:bg-surface-low transition-colors text-secondary">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-surface-low transition-colors text-secondary">
          <Grid size={20} />
        </button>
        <div className="h-8 w-px bg-surface-low mx-1"></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface leading-none">Admin Staff</p>
            <p className="text-[10px] text-secondary font-medium">ID: #MTL-442</p>
          </div>
          <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-surface-low shadow-sm">
            <img 
              src="https://picsum.photos/seed/staff/100/100" 
              alt="Profile" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
