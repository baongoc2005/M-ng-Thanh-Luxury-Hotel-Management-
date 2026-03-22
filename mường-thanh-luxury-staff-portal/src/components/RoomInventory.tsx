import React from 'react';
import { Wifi, Tv, AirVent, ArrowRight, Sparkles, Wrench, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface Room {
  id: string;
  type: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  guest?: string;
  checkout?: string;
  progress?: number;
  issue?: string;
  est?: string;
  vip?: boolean;
}

const rooms: Room[] = [
  { id: '802', type: 'Deluxe King', status: 'available' },
  { id: '805', type: 'Executive Suite', status: 'occupied', guest: 'Mr. Nguyen V.', checkout: 'Tomorrow, 11:00 AM' },
  { id: '912', type: 'Standard Twin', status: 'cleaning', progress: 65, est: 'Housekeeping: Anna L.' },
  { id: '1001', type: 'Presidential', status: 'maintenance', issue: 'AC Unit replacement', est: 'EST: 4 hours' },
  { id: '704', type: 'Standard Double', status: 'available' },
  { id: '811', type: 'Deluxe King', status: 'cleaning', progress: 20, est: 'Pending Assignment' },
  { id: '610', type: 'Standard Twin', status: 'occupied', guest: 'Mrs. Chen L.', checkout: 'Today, 12:00 PM' },
  { id: '1101', type: 'Penthouse Suite', status: 'available', vip: true },
];

const StatusBadge: React.FC<{ status: Room['status'] }> = ({ status }) => {
  const styles = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    occupied: 'bg-red-50 text-red-700 border-red-100',
    cleaning: 'bg-amber-50 text-amber-700 border-amber-100',
    maintenance: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

const StatusDot: React.FC<{ status: Room['status'] }> = ({ status }) => {
  const colors = {
    available: 'bg-emerald-500',
    occupied: 'bg-red-500',
    cleaning: 'bg-amber-400',
    maintenance: 'bg-slate-400',
  };
  return <span className={`absolute top-3 right-3 h-3 w-3 rounded-full ${colors[status]}`}></span>;
};

export const RoomInventory: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline mb-1 tracking-tight">Room Inventory</h2>
          <p className="text-secondary font-medium">Real-time status of 124 rooms and suites</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white p-1 rounded-xl shadow-sm flex items-center border border-secondary/10">
            <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-container text-white shadow-md">All Rooms</button>
            <button className="px-4 py-2 text-sm font-medium text-secondary hover:bg-surface-low rounded-lg transition-colors">Deluxe</button>
            <button className="px-4 py-2 text-sm font-medium text-secondary hover:bg-surface-low rounded-lg transition-colors">Suite</button>
            <button className="px-4 py-2 text-sm font-medium text-secondary hover:bg-surface-low rounded-lg transition-colors">Standard</button>
          </div>
          <select className="bg-white border border-secondary/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none text-secondary">
            <option>Filter by Status</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room, idx) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`group rounded-xl p-5 border border-secondary/10 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
              room.vip ? 'bg-gradient-to-br from-orange-50 to-white border-orange-200' : 'bg-white'
            }`}
          >
            <StatusDot status={room.status} />
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-on-surface font-headline">{room.id}</h3>
                  <p className="text-xs font-bold text-primary tracking-widest uppercase mt-1">{room.type}</p>
                </div>
                <StatusBadge status={room.status} />
              </div>

              {room.status === 'occupied' && (
                <div className="pt-2">
                  <p className="text-[11px] text-slate-400 font-medium">Check-out: {room.checkout}</p>
                </div>
              )}

              {room.status === 'cleaning' && (
                <div className="pt-2">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all duration-1000" style={{ width: `${room.progress}%` }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium text-right">{room.progress}% Complete</p>
                </div>
              )}

              {room.status === 'maintenance' && (
                <div className="pt-2">
                  <p className="text-[11px] text-slate-500 font-medium">Issue: {room.issue}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                {room.status === 'available' ? (
                  <>
                    <div className="flex gap-3">
                      <Wifi size={16} className="text-slate-300" />
                      <Tv size={16} className="text-slate-300" />
                      <AirVent size={16} className="text-slate-300" />
                    </div>
                    <button className="text-primary font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                      VIEW DETAILS <ArrowRight size={14} />
                    </button>
                  </>
                ) : room.status === 'occupied' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://picsum.photos/seed/${room.guest}/40/40`} 
                        alt="Guest" 
                        className="w-6 h-6 rounded-full"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-semibold text-secondary">{room.guest}</span>
                    </div>
                    <button className="text-secondary font-bold text-xs">MANAGE</button>
                  </>
                ) : room.status === 'cleaning' ? (
                  <>
                    <span className="text-[11px] text-secondary font-medium italic">{room.est}</span>
                    <Sparkles size={18} className="text-amber-500" />
                  </>
                ) : (
                  <>
                    <span className="text-[11px] text-secondary font-medium italic">{room.est}</span>
                    <Wrench size={18} className="text-slate-400" />
                  </>
                )}
              </div>

              {room.vip && (
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-primary fill-primary" />
                    <span className="text-[10px] font-bold text-primary tracking-tighter">VIP READY</span>
                  </div>
                  <button className="bg-primary-container text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform">
                    BOOK NOW
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
