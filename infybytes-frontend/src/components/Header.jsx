import React from 'react';
import { UtensilsCrossed, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'menu', label: 'Food Menu', icon: UtensilsCrossed },
    { id: 'order', label: 'Place Order', icon: ShoppingBag },
    { id: 'track', label: 'Track Orders', icon: Truck },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Infy<span className="text-rose-500">Bytes</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Online Food
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Doorstep Food Delivery Service</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl glass-panel text-slate-300 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Backend API Connected</span>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium ${
                  isActive ? 'text-rose-500' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
