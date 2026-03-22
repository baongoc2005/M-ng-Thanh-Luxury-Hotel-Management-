import React from 'react';
import { User, Phone, Bed, Calendar, Info, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

export const WalkIn: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight font-headline">Create Walk-in Booking</h2>
        <p className="text-secondary font-medium">Instantly register a new guest and assign a room.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-surface-low p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <User size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Guest Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary px-1">Guest Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border-0 rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-slate-400 outline-none" 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary px-1">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full bg-white border-0 rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-slate-400 outline-none" 
                  placeholder="+84 000 000 000"
                />
              </div>
            </div>
          </section>

          <section className="bg-surface-low p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Bed size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Stay Details</h3>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary px-1">Room Type Selection</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'deluxe', label: 'Deluxe King', price: '$120/night' },
                  { id: 'suite', label: 'Executive Suite', price: '$250/night', active: true },
                  { id: 'presidential', label: 'Presidential', price: '$550/night' },
                ].map((room) => (
                  <label key={room.id} className={`relative flex flex-col p-4 bg-white rounded-xl cursor-pointer border-2 transition-all ${room.active ? 'border-primary' : 'border-transparent hover:border-secondary/20'}`}>
                    <input type="radio" name="room_type" className="absolute opacity-0" defaultChecked={room.active} />
                    <Bed size={20} className={`mb-2 ${room.active ? 'text-primary' : 'text-slate-400'}`} />
                    <span className="font-bold text-sm">{room.label}</span>
                    <span className="text-xs text-slate-500">{room.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary px-1">Check-in Date</label>
                <div className="relative">
                  <input type="date" className="w-full bg-white border-0 rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary px-1">Check-out Date</label>
                <div className="relative">
                  <input type="date" className="w-full bg-white border-0 rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary px-1">Number of Guests</label>
              <div className="flex items-center gap-4 bg-white p-2 rounded-lg max-w-[200px]">
                <button className="w-10 h-10 rounded-md bg-surface-low flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center font-bold">2</span>
                <button className="w-10 h-10 rounded-md bg-surface-low flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl sticky top-24 border border-secondary/10">
            <h3 className="text-xl font-bold mb-6 text-on-surface">Reservation Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Executive Suite (2 nights)</span>
                <span className="font-bold">$500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Service Fee (10%)</span>
                <span className="font-bold">$50.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">VAT (8%)</span>
                <span className="font-bold">$40.00</span>
              </div>
              <div className="h-px bg-surface-low"></div>
              <div className="flex justify-between items-end pt-2">
                <span className="font-bold text-on-surface">Total Amount</span>
                <span className="text-3xl font-extrabold text-primary-container">$590.00</span>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Calculate Total
              </button>
              <button className="w-full py-4 rounded-full border-2 border-secondary/20 text-on-surface font-bold hover:bg-slate-50 transition-all">
                Confirm & Print Receipt
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <Info size={20} className="text-blue-600 shrink-0" />
              <p className="text-[11px] leading-relaxed text-blue-800">
                Confirming this will block the room immediately in the inventory. Ensure guest ID is verified before final check-in.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden relative aspect-video group shadow-lg">
            <img 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              src="https://picsum.photos/seed/suite/600/400" 
              alt="Room Preview"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest mb-1">Preview Selection</p>
              <h4 className="text-white font-bold text-lg">Executive Suite - Room 402</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
