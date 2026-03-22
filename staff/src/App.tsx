/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar, ViewType } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { RoomInventory } from './components/RoomInventory';
import { BookingManagement } from './components/BookingManagement';
import { Reception } from './components/Reception';
import { WalkIn } from './components/WalkIn';
import { GuestProfiles } from './components/GuestProfiles';
import { Plus, LayoutGrid, CalendarDays, Users, Settings } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('inventory');

  const renderView = () => {
    switch (currentView) {
      case 'inventory':
        return <RoomInventory />;
      case 'bookings':
        return <BookingManagement />;
      case 'reception':
        return <Reception />;
      case 'walk-in':
        return <WalkIn />;
      case 'profiles':
        return <GuestProfiles />;
      default:
        return <RoomInventory />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="lg:ml-64 min-h-screen flex flex-col relative">
        <TopBar />
        
        <div className="flex-1 pb-20 lg:pb-0">
          {renderView()}
        </div>

        {/* Floating Action Button - Only on Inventory and Bookings */}
        {(currentView === 'inventory' || currentView === 'bookings') && (
          <button className="fixed bottom-8 right-8 bg-primary-container text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 lg:bottom-10 lg:right-10">
            <Plus size={32} />
          </button>
        )}

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-surface-low flex justify-around items-center py-3 px-6 z-50">
          <button 
            onClick={() => setCurrentView('inventory')}
            className={`flex flex-col items-center gap-1 ${currentView === 'inventory' ? 'text-primary' : 'text-secondary'}`}
          >
            <LayoutGrid size={20} fill={currentView === 'inventory' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-bold">Inventory</span>
          </button>
          <button 
            onClick={() => setCurrentView('bookings')}
            className={`flex flex-col items-center gap-1 ${currentView === 'bookings' ? 'text-primary' : 'text-secondary'}`}
          >
            <CalendarDays size={20} fill={currentView === 'bookings' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-medium">Bookings</span>
          </button>
          <button 
            onClick={() => setCurrentView('profiles')}
            className={`flex flex-col items-center gap-1 ${currentView === 'profiles' ? 'text-primary' : 'text-secondary'}`}
          >
            <Users size={20} fill={currentView === 'profiles' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-medium">Guests</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-secondary">
            <Settings size={20} />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
