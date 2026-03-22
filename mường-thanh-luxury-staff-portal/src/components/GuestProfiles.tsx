import React from 'react';
import { Search, Plus, Group, Award, Star, TrendingUp, History, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Guest {
  id: string;
  name: string;
  status: 'Current Stay' | 'Checkout Oct 05' | 'Last Seen 2022' | 'Check-in Tomorrow';
  tier: 'GOLD MEMBER' | 'PLATINUM MEMBER' | null;
  lastStay: string;
  totalVisits: number;
  notes: string;
  image: string;
}

const guests: Guest[] = [
  { 
    id: 'MT-88291', 
    name: 'Alexandre Dubois', 
    status: 'Current Stay', 
    tier: 'GOLD MEMBER', 
    lastStay: 'Oct 12 - Oct 18, 2023', 
    totalVisits: 14, 
    notes: 'Prefers high-floor suites, allergic to lilies. Always requests late check-out at 2 PM.',
    image: 'https://picsum.photos/seed/alexandre/200/200'
  },
  { 
    id: 'MT-90412', 
    name: 'Sarah Nguyen', 
    status: 'Checkout Oct 05', 
    tier: null, 
    lastStay: 'Sep 28 - Oct 05, 2023', 
    totalVisits: 3, 
    notes: 'Traveling for business. Requires stable high-speed Wi-Fi and quiet room far from elevators.',
    image: 'https://picsum.photos/seed/sarah/200/200'
  },
  { 
    id: 'MT-77120', 
    name: 'Hiroshi Tanaka', 
    status: 'Last Seen 2022', 
    tier: null, 
    lastStay: 'Dec 20 - Jan 02, 2022', 
    totalVisits: 22, 
    notes: 'Executive Platinum member. Prefers Southeast Asian cuisine in-room dining. Spa regular.',
    image: 'https://picsum.photos/seed/hiroshi/200/200'
  },
  { 
    id: 'MT-11205', 
    name: 'Elena Rodriguez', 
    status: 'Check-in Tomorrow', 
    tier: 'PLATINUM MEMBER', 
    lastStay: 'May 15 - May 22, 2023', 
    totalVisits: 8, 
    notes: 'Celebrity guest. Requires discrete entrance. Prefers organic refreshments and extra feather pillows.',
    image: 'https://picsum.photos/seed/elena/200/200'
  },
];

export const GuestProfiles: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Guest Profiles</h1>
          <p className="text-secondary max-w-lg">Manage guest loyalty, preferences, and historical stay data within the Mường Thanh ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-full border border-secondary/10 text-on-surface font-semibold text-sm hover:bg-surface-low transition-all">
            Export CRM Data
          </button>
          <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-lg shadow-primary-container/20 hover:shadow-primary-container/40 transition-all active:scale-95">
            Add New Guest
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Guests', value: '12,842', icon: Group },
          { label: 'Repeat Guests', value: '42%', icon: Award },
          { label: 'VIP Members', value: '1,105', icon: Star },
          { label: 'Growth', value: '+12.5%', icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-low p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold font-headline">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold font-headline">Recent Activity</h3>
          <div className="flex gap-2 text-sm">
            <button className="px-4 py-1.5 bg-primary-container text-white rounded-full font-medium">All Guests</button>
            <button className="px-4 py-1.5 text-secondary hover:bg-surface-low rounded-full font-medium transition-colors">Currently In-house</button>
            <button className="px-4 py-1.5 text-secondary hover:bg-surface-low rounded-full font-medium transition-colors">VIP Only</button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {guests.map((guest, idx) => (
            <motion.div 
              key={guest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-xl flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all group border border-secondary/10"
            >
              <div className="relative shrink-0">
                <img 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover" 
                  src={guest.image} 
                  alt={guest.name}
                  referrerPolicy="no-referrer"
                />
                {guest.tier && (
                  <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                    {guest.tier}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-on-surface">{guest.name}</h4>
                    <p className="text-sm text-secondary font-medium">ID: {guest.id}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                    guest.status === 'Current Stay' ? 'bg-green-100 text-green-700' :
                    guest.status === 'Check-in Tomorrow' ? 'bg-orange-50 text-orange-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {guest.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-secondary font-bold uppercase">Last Stay</p>
                    <p className="text-sm font-semibold">{guest.lastStay}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-secondary font-bold uppercase">Total Visits</p>
                    <p className="text-sm font-semibold">{guest.totalVisits} Stays</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-secondary font-bold uppercase">Notes</p>
                  <p className="text-xs text-secondary italic leading-relaxed">{guest.notes}</p>
                </div>
                <div className="pt-2 flex gap-3">
                  <button className="flex-1 bg-surface-low hover:bg-slate-200 text-on-surface text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <History size={16} />
                    View History
                  </button>
                  <button className="w-12 h-10 flex items-center justify-center border border-secondary/20 rounded-lg hover:border-primary transition-colors">
                    <Edit3 size={18} className="text-secondary" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="flex items-center justify-between py-6 px-4">
        <p className="text-sm text-secondary">Showing <span className="font-bold text-on-surface">1 - 4</span> of 12,842 guests</p>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center hover:bg-surface-low transition-all">
            <ChevronLeft size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold shadow-md">1</button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-low text-secondary font-medium transition-all">2</button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-low text-secondary font-medium transition-all">3</button>
          <span className="px-2 text-secondary">...</span>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-low text-secondary font-medium transition-all">321</button>
          <button className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center hover:bg-surface-low transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};
