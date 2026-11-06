import React from 'react';
import {
  Scissors,
  Calculator,
  Search,
  Lock,
  PhoneCall,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { WorkshopConfig } from '../types/index.ts';

interface HeaderProps {
  activeTab: 'order' | 'catalog' | 'track' | 'admin';
  setActiveTab: (tab: 'order' | 'catalog' | 'track' | 'admin') => void;
  config: WorkshopConfig;
  onOpenAdminAuth: () => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenAdminAuth,
  isAdminLoggedIn,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      {/* Top Banner: CS 24 Jam & Islamic Trust Badge */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-emerald-800 text-amber-300 tracking-wider">
              ⚡ CS & KASIR DIGITAL 24 JAM
            </span>
            <span className="hidden sm:inline text-slate-200">
              Pesan seragam borongan pesantren & instansi langsung dihitung instan, hemat waktu tanpa bolak-balik tanya di WA.
            </span>
            <span className="sm:hidden text-slate-200">Kasir Borongan Otomatis</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="hidden md:flex items-center gap-1 text-emerald-200">
              <Clock className="w-3.5 h-3.5" /> Buka 24 Jam Nonstop
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Akad Jual Beli Amanah
            </span>
            <a
              href={`https://wa.me/${config.ownerPhone.replace(/\D/g, '')}?text=Assalamu'alaikum%20${encodeURIComponent(
                config.ownerTitle
              )},%20mohon%20info%20pesanan%20seragam`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded transition font-medium"
            >
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>WA Pengelola</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand & Logo */}
          <div
            onClick={() => setActiveTab('order')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 group-hover:scale-105 transition">
              <span className="font-serif font-black text-lg tracking-wider text-amber-300">
                AC
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-tight">
                  {config.brandName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200">
                  Konveksi B2B
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                {config.brandTagline}
              </p>
            </div>
          </div>

          {/* Customer Navigation Tabs (Clean & Professional) */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('order')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'order'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-emerald-950 hover:bg-white/60'
              }`}
            >
              <Calculator className="w-4 h-4 text-amber-300" />
              <span>Kalkulator & Kasir Borongan</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'catalog'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-emerald-950 hover:bg-white/60'
              }`}
            >
              <Scissors className="w-4 h-4 text-emerald-400" />
              <span>Katalog Bahan Kain</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'track'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-emerald-950 hover:bg-white/60'
              }`}
            >
              <Search className="w-4 h-4 text-sky-400" />
              <span>Lacak Progres Jahitan</span>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-1.5 px-2 text-center rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center justify-center gap-1 ${
              activeTab === 'order'
                ? 'bg-emerald-900 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Kalkulator</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-1.5 px-2 text-center rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center justify-center gap-1 ${
              activeTab === 'catalog'
                ? 'bg-emerald-900 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Bahan Kain</span>
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-1.5 px-2 text-center rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center justify-center gap-1 ${
              activeTab === 'track'
                ? 'bg-emerald-900 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Lacak Status</span>
          </button>
        </div>
      </div>
    </header>
  );
};
