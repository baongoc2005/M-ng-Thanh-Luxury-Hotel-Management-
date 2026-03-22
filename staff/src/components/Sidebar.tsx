import React from 'react';
import { 
  LayoutGrid, 
  CalendarDays, 
  Key, 
  PlusCircle, 
  Users, 
  Settings, 
  LogOut,
  Hotel
} from 'lucide-react';

export type ViewType = 'inventory' | 'bookings' | 'reception' | 'walk-in' | 'profiles';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'inventory', label: 'Room Inventory', icon: LayoutGrid },
    { id: 'bookings', label: 'Booking Management', icon: CalendarDays },
    { id: 'reception', label: 'Check-in/Out', icon: Key },
    { id: 'walk-in', label: 'Walk-in', icon: PlusCircle },
    { id: 'profiles', label: 'Guest Profiles', icon: Users },
  ];

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r border-surface-low z-50 p-4">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white shadow-lg">
          <Hotel size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-on-surface leading-tight">Staff Portal</h1>
          <p className="text-[10px] uppercase tracking-wider text-secondary font-bold">Luxury Concierge</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-surface-low font-bold shadow-sm translate-x-1' 
                  : 'text-secondary hover:bg-surface-low/50 font-medium'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-surface-low space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-low/50 rounded-xl transition-all font-medium">
          <Settings size={20} />
          <span className="text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-low/50 rounded-xl transition-all font-medium">
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};
