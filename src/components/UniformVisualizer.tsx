import React, { useState } from 'react';
import { Sparkles, Eye, Shield, Tag, Info, Check } from 'lucide-react';
import type { ApparelType, Fabric } from '../types/index.ts';

interface UniformVisualizerProps {
  apparel: ApparelType;
  fabric: Fabric;
  colorName: string;
  colorHex: string;
  embroideryType: string;
  sampleName?: string;
  logoPreviewUrl?: string;
  organizationName?: string;
}

export const UniformVisualizer: React.FC<UniformVisualizerProps> = ({
  apparel,
  fabric,
  colorName,
  colorHex,
  embroideryType,
  sampleName,
  logoPreviewUrl,
  organizationName,
}) => {
  const [viewAngle, setViewAngle] = useState<'front' | 'detail'>('front');

  // Determine dark or light color for embroidery thread contrast
  const isDarkColor = (hex: string) => {
    const c = hex.replace('#', '');
    if (c.length < 6) return false;
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 140;
  };

  const threadColor = isDarkColor(colorHex || '#FFFFFF') ? '#FBBF24' : '#1E3A8A'; // gold or navy thread
  const threadColorWhite = isDarkColor(colorHex || '#FFFFFF') ? '#FFFFFF' : '#0F172A';

  const showName =
    embroideryType === 'nama_dada' || embroideryType === 'nama_dan_logo';
  const showLogo =
    embroideryType === 'logo_sekolah' || embroideryType === 'nama_dan_logo';

  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl overflow-hidden relative">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Simulasi Visual Real-Time
            </h4>
            <span className="text-sm font-extrabold text-white">
              {apparel.name || 'Baju Koko Santri'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewAngle('front')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
              viewAngle === 'front'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Tampak Depan
          </button>
          <button
            type="button"
            onClick={() => setViewAngle('detail')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
              viewAngle === 'detail'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Detail Bordir
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative h-64 sm:h-72 w-full flex items-center justify-center bg-radial from-slate-800 to-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800/80">
        {/* Subtle cloth weave background grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        {/* SVG Interactive Uniform Illustration */}
        <div className="relative w-48 sm:w-56 h-full flex items-center justify-center transition-all duration-300">
          <svg
            viewBox="0 0 300 360"
            className="w-full h-full drop-shadow-2xl transition-all duration-300"
          >
            <defs>
              <linearGradient
                id="uniformShading"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
              </linearGradient>

              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="4"
                  floodOpacity="0.3"
                />
              </filter>
            </defs>

            {/* Sleeve Left */}
            <path
              d="M 90 60 L 25 130 L 55 155 L 95 105 Z"
              fill={colorHex || '#FFFFFF'}
              stroke="#0f172a"
              strokeWidth="2"
            />
            <path
              d="M 90 60 L 25 130 L 55 155 L 95 105 Z"
              fill="url(#uniformShading)"
            />

            {/* Sleeve Right */}
            <path
              d="M 210 60 L 275 130 L 245 155 L 205 105 Z"
              fill={colorHex || '#FFFFFF'}
              stroke="#0f172a"
              strokeWidth="2"
            />
            <path
              d="M 210 60 L 275 130 L 245 155 L 205 105 Z"
              fill="url(#uniformShading)"
            />

            {/* Main Torso */}
            <path
              d="M 90 55 L 210 55 L 225 310 L 75 310 Z"
              fill={colorHex || '#FFFFFF'}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <path
              d="M 90 55 L 210 55 L 225 310 L 75 310 Z"
              fill="url(#uniformShading)"
            />

            {/* Bottom Hem */}
            <path
              d="M 75 310 Q 150 320 225 310"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* Placket / Center Button Strip */}
            <path
              d="M 142 55 L 142 220 L 158 220 L 158 55 Z"
              fill={colorHex || '#FFFFFF'}
              stroke="#0f172a"
              strokeWidth="1.5"
              filter="brightness(0.95)"
            />

            {/* Buttons */}
            <circle cx="150" cy="85" r="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
            <circle cx="150" cy="120" r="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
            <circle cx="150" cy="155" r="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
            <circle cx="150" cy="190" r="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />

            {/* Collar (Mandarin / Shanghai or PDH) */}
            <path
              d="M 115 55 Q 150 70 185 55 Q 150 45 115 55"
              fill={colorHex || '#FFFFFF'}
              stroke="#0f172a"
              strokeWidth="2"
              filter="brightness(0.92)"
            />

            {/* Dada Kiri: Bordir Logo */}
            {showLogo && (
              <g transform="translate(175, 105)">
                <circle cx="15" cy="15" r="14" fill="#0f172a" fillOpacity="0.1" />
                <rect
                  x="2"
                  y="2"
                  width="26"
                  height="26"
                  rx="6"
                  fill="#ffffff"
                  stroke={threadColor}
                  strokeWidth="1.5"
                />
                <circle cx="15" cy="15" r="8" fill={threadColor} fillOpacity="0.2" />
                <text
                  x="15"
                  y="18"
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="bold"
                  fill={threadColor}
                  fontFamily="sans-serif"
                >
                  LOGO
                </text>
              </g>
            )}

            {/* Dada Kanan: Bordir Nama Dada Santri/Guru */}
            {showName && (
              <g transform="translate(95, 110)">
                <rect
                  x="0"
                  y="0"
                  width="42"
                  height="12"
                  rx="3"
                  fill={isDarkColor(colorHex) ? '#0f172a' : '#f8fafc'}
                  stroke={threadColor}
                  strokeWidth="1"
                />
                <text
                  x="21"
                  y="8.5"
                  textAnchor="middle"
                  fontSize="5"
                  fontWeight="bold"
                  fill={threadColorWhite}
                  fontFamily="sans-serif"
                >
                  {sampleName ? sampleName.slice(0, 10) : 'NAMA SANTRI'}
                </text>
              </g>
            )}

            {/* Indonesian Flag on Right Sleeve */}
            <g transform="translate(245, 115)">
              <rect x="0" y="0" width="16" height="5" fill="#DC2626" />
              <rect x="0" y="5" width="16" height="5" fill="#FFFFFF" stroke="#e2e8f0" strokeWidth="0.5" />
            </g>
          </svg>
        </div>

        {/* Real-time Color Swatch Indicator Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] flex items-center gap-2 shadow-lg">
          <span
            className="w-4 h-4 rounded-full border border-white/50 shadow-xs shrink-0"
            style={{ backgroundColor: colorHex || '#FFFFFF' }}
          />
          <div>
            <span className="font-extrabold text-white block leading-tight">
              {colorName || 'Putih Bersih'}
            </span>
            <span className="text-[10px] text-slate-400">
              {fabric.name || 'Toyobo Fodu'}
            </span>
          </div>
        </div>

        {/* Real-time Embroidery Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 text-[10px]">
          {showLogo && (
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
              <Check className="w-3 h-3 text-emerald-400" />
              Bordir Logo Dada Kiri
            </span>
          )}
          {showName && (
            <span className="bg-amber-950/80 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
              <Check className="w-3 h-3 text-amber-400" />
              Bordir Nama Dada Kanan
            </span>
          )}
        </div>
      </div>

      {/* Explainer Footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          Warna visual 95% presisi dengan kain gulungan fisik distributor.
        </span>
        <span className="text-emerald-400 font-semibold">
          Standar Jahitan Obras 4 Benang Rapi
        </span>
      </div>
    </div>
  );
};
