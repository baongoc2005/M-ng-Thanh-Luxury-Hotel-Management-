import React from 'react';
import { Filter, FileDown, Edit3, Ban, Eye, ChevronLeft, ChevronRight, Clock, Luggage, DoorOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface Booking {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  initials: string;
  color: string;
}

const bookings: Booking[] = [
  { id: 'MT-88291', guest: 'Jonathan Smith', room: 'Suite 405', checkIn: 'Oct 24, 2023', checkOut: 'Oct 28, 2023', status: 'Confirmed', initials: 'JS', color: 'bg-blue-100 text-blue-700' },
  { id: 'MT-88304', guest: 'Amelia Watson', room: 'Deluxe 202', checkIn: 'Oct 25, 2023', checkOut: 'Oct 26, 2023', status: 'Pending', initials: 'AW', color: 'bg-orange-100 text-orange-700' },
  { id: 'MT-88112', guest: 'Marcus K.', room: 'Twin 105', checkIn: 'Oct 22, 2023', checkOut: 'Oct 24, 2023', status: 'Cancelled', initials: 'MK', color: 'bg-slate-100 text-slate-500' },
  { id: 'MT-88310', guest: 'Elena Lopez', room: 'Presidential', checkIn: 'Nov 01, 2023', checkOut: 'Nov 05, 2023', status: 'Confirmed', initials: 'EL', color: 'bg-indigo-100 text-indigo-700' },
];

export const BookingManagement: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Booking Management</h2>
          <p className="text-secondary font-medium mt-1">Real-time overview of current and upcoming guest arrivals.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-secondary/10 rounded-lg text-sm font-semibold text-on-surface shadow-sm hover:bg-surface-low transition-colors flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-5 py-2.5 bg-white border border-secondary/10 rounded-lg text-sm font-semibold text-on-surface shadow-sm hover:bg-surface-low transition-colors flex items-center gap-2">
            <FileDown size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-secondary/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-low text-secondary border-b border-secondary/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Guest Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Check-out</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-low">
              {bookings.map((booking) => (
                <tr key={booking.id} className={`hover:bg-surface-low/30 transition-colors group ${booking.status === 'Pending' ? 'bg-orange-50/20' : ''} ${booking.status === 'Cancelled' ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-5 font-bold text-sm text-on-surface">{booking.id}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${booking.color}`}>
                        {booking.initials}
                      </div>
                      <span className="font-semibold text-on-surface text-sm">{booking.guest}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-sm text-secondary">{booking.room}</td>
                  <td className="px-6 py-5 text-sm text-secondary">{booking.checkIn}</td>
                  <td className="px-6 py-5 text-sm text-secondary">{booking.checkOut}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {booking.status === 'Pending' && (
                        <button className="px-3 py-1.5 bg-primary-container text-white text-xs font-bold rounded shadow-sm hover:brightness-110 transition-all">Confirm</button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Edit3 size={18} />
                      </button>
                      {booking.status !== 'Cancelled' ? (
                        <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Ban size={18} />
                        </button>
                      ) : (
                        <button className="p-2 text-slate-400 hover:text-on-surface transition-colors">
                          <Eye size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-low/50 flex items-center justify-between border-t border-secondary/10">
          <span className="text-xs font-medium text-secondary">Showing 1-4 of 124 bookings</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-secondary/10 hover:bg-white text-secondary transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-secondary/10 hover:bg-white text-secondary transition-colors text-xs font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-secondary/10 hover:bg-white text-secondary transition-colors text-xs font-medium">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-secondary/10 hover:bg-white text-secondary transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary/10 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-secondary text-sm font-medium">Action Required</p>
            <p className="text-2xl font-extrabold text-on-surface">12 <span className="text-sm font-normal text-slate-400 ml-1">bookings</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary/10 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Luggage size={24} />
          </div>
          <div>
            <p className="text-secondary text-sm font-medium">Today's Check-ins</p>
            <p className="text-2xl font-extrabold text-on-surface">45 <span className="text-sm font-normal text-slate-400 ml-1">guests</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary/10 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <DoorOpen size={24} />
          </div>
          <div>
            <p className="text-secondary text-sm font-medium">Occupancy Rate</p>
            <p className="text-2xl font-extrabold text-on-surface">88.4%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
