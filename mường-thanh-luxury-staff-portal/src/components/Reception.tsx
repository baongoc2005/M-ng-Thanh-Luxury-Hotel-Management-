import React from 'react';
import { X, BadgeCheck, CreditCard, CheckCircle2, Receipt, DoorOpen, Lock, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const Reception: React.FC = () => {
  return (
    <div className="p-8 space-y-8 relative min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Reception Desk</h2>
          <p className="text-secondary font-medium">Active sessions and pending arrivals</p>
        </div>
        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-secondary/10">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span className="text-sm font-semibold">12 Arriving Today</span>
        </div>
      </div>

      {/* Background Dashboard Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-40 grayscale pointer-events-none">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl border border-secondary/10 shadow-sm">
            <div className="flex justify-between mb-4">
              <span className="text-xl font-bold font-headline">Suite {400 + i}</span>
              <span className="px-2 py-1 bg-surface-low text-secondary text-[10px] font-bold rounded uppercase tracking-wider">Reserved</span>
            </div>
            <p className="text-sm text-secondary mb-1">Guest: Nguyen Van {String.fromCharCode(64 + i)}</p>
            <p className="text-xs text-slate-400">Arriving: 14:00 Today</p>
          </div>
        ))}
      </div>

      {/* Overlays */}
      <div className="fixed inset-0 z-[60] flex pointer-events-none overflow-x-auto no-scrollbar">
        <div className="flex min-w-max h-full">
          {/* Check-in Drawer */}
          <motion.div 
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            className="w-[400px] bg-white h-screen shadow-2xl pointer-events-auto border-r border-secondary/10 flex flex-col"
          >
            <div className="p-6 bg-surface-low">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">Procedure: 01</span>
                  <h3 className="text-2xl font-headline font-extrabold text-on-surface">Guest Check-In</h3>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-secondary/10 hover:bg-slate-50 transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <img 
                  className="w-12 h-12 rounded-lg object-cover" 
                  src="https://picsum.photos/seed/alexandra/100/100" 
                  alt="Guest"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-bold text-on-surface">Alexandra V. Rose</p>
                  <p className="text-xs text-secondary">Booking #MTL-882910 • Suite 402</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-secondary/10 pb-2">
                  <BadgeCheck size={18} className="text-primary" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface">Identity Verification</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1.5 ml-1">Document Type</label>
                    <select className="w-full bg-surface-low border border-secondary/10 rounded-lg py-2.5 px-3 text-sm focus:ring-primary focus:border-primary outline-none">
                      <option>International Passport</option>
                      <option>National Identity Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1.5 ml-1">ID/Passport Number</label>
                    <input 
                      type="text" 
                      className="w-full bg-surface-low border border-secondary/10 rounded-lg py-2.5 px-3 text-sm focus:ring-primary focus:border-primary outline-none" 
                      placeholder="e.g. B82716442"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-secondary/10 pb-2">
                  <CreditCard size={18} className="text-primary" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface">Payment Status</h4>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-600 fill-emerald-600/10" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">Reservation Paid</p>
                      <p className="text-xs text-emerald-600">Credit Card Ending in 4242</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-800">$1,450.00</span>
                </div>
                <div className="p-4 rounded-xl border border-secondary/10 space-y-3">
                  <p className="text-xs font-bold text-secondary uppercase tracking-tight">Incidental Deposit Required</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg border border-secondary/20 text-xs font-semibold hover:bg-slate-50 transition-colors">Pre-authorize Card</button>
                    <button className="flex-1 py-2 rounded-lg border border-secondary/20 text-xs font-semibold hover:bg-slate-50 transition-colors">Cash Deposit</button>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-6 bg-white border-t border-secondary/10">
              <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-primary-container/20 active:scale-95 transition-transform">
                Complete Check-in
              </button>
            </div>
          </motion.div>

          {/* Spacer */}
          <div className="w-12"></div>

          {/* Checkout Drawer */}
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            className="w-[450px] bg-white h-screen shadow-2xl pointer-events-auto border-l border-secondary/10 flex flex-col"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-secondary to-slate-400"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Procedure: 02</span>
                  <h3 className="text-2xl font-headline font-extrabold text-on-surface">Final Checkout</h3>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-low hover:bg-slate-200 transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="bg-surface-low rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <DoorOpen size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary uppercase">Room & Guest</p>
                    <p className="text-lg font-bold text-on-surface">Deluxe 305 • Elena Smith</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary">Stay Duration</p>
                  <p className="text-sm font-bold">4 Nights</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-secondary/10 pb-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-secondary">Summary of Charges</h4>
                  <Receipt size={18} className="text-slate-400" />
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Accommodation (4 Nights @ $250)', value: '$1,000.00' },
                    { label: 'Mini-Bar Consumption', value: '$45.00' },
                    { label: 'Express Laundry Service', value: '$32.50' },
                    { label: 'Room Service (Order #552)', value: '$68.00' },
                    { label: 'City Tax & Tourism Fee', value: '$12.00' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-secondary">{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400">Total Outstanding</span>
                  <span className="text-2xl font-headline font-extrabold">$1,157.50</span>
                </div>
                <div className="relative z-10 pt-4 border-t border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Applied Credits</p>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Security Deposit (Refundable)</span>
                    <span>-$200.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-low/50 rounded-2xl p-5 border border-secondary/10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs font-bold text-secondary uppercase mb-1">Final Amount Due</p>
                    <p className="text-3xl font-headline font-extrabold text-primary-container">$957.50</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white text-secondary border border-secondary/10">
                      <CreditCard size={14} className="mr-1" />
                      VISA **** 4242
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-secondary">Guest Digital Signature</p>
                  <div className="h-24 bg-white rounded-xl border-2 border-dashed border-secondary/10 flex items-center justify-center group cursor-pointer hover:border-primary/40 transition-colors">
                    <span className="text-slate-300 text-xs font-medium">Click to capture guest signature</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-secondary/10">
              <button className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-slate-900/10 active:scale-95 transition-transform flex items-center justify-center gap-3">
                <Lock size={18} />
                Finalize Payment & Check-out
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">Invoice will be automatically sent to elena.s@email.com</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
