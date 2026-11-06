import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Info,
  Droplets,
  Layers,
  Wind,
  ShieldCheck,
  ArrowRight,
  Shirt,
} from 'lucide-react';
import type { Fabric } from '../types/index.ts';
import { formatRupiah } from '../utils/formatters.ts';

interface FabricCatalogProps {
  fabrics: Fabric[];
  onSelectFabric: (fabric: Fabric) => void;
}

export const FabricCatalog: React.FC<FabricCatalogProps> = ({
  fabrics,
  onSelectFabric,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFabricModal, setActiveFabricModal] = useState<Fabric | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Bahan Kain' },
    { id: 'Katun Premium', label: 'Katun Premium (Koko & Asatidz)' },
    { id: 'Drill Katun Tinggi', label: 'Drill Kuat (Kemeja PDH & Jas)' },
    { id: 'Kain Muslimah Flowy', label: 'Syar\'i Flowy (Gamis & Abaya)' },
    { id: 'Kaos 100% Cotton Murni', label: 'Kaos Santri (Combed 24s)' },
  ];

  const filteredFabrics =
    selectedCategory === 'all'
      ? fabrics
      : fabrics.filter((f) => f.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Explainer */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Katalog Kain Konveksi Standar Pesantren & Instansi
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pilihan Bahan Kain Grade A Terbaik
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Ustadz hanya menggunakan kain asli rol-rolan distributor resmi yang sudah teruji tahan cuci ratusan kali,
          adem dipakai kegiatan santri dari pagi sampai malam, dan warna tidak cepat pudar.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/10'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Fabric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFabrics.map((fabric) => (
          <div
            key={fabric.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden group"
          >
            {/* Image Banner */}
            <div className="relative h-52 bg-slate-100 overflow-hidden">
              <img
                src={fabric.image}
                alt={fabric.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              
              {/* Badge Popular */}
              {fabric.popularFor && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-200 animate-spin-slow" />
                  {fabric.popularFor}
                </div>
              )}

              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-emerald-950 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-md border border-white/60">
                ± {formatRupiah(fabric.pricePerMeter)} / meter
              </div>

              {/* Title on Image */}
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-bold text-amber-300 block uppercase tracking-wider">
                  {fabric.category}
                </span>
                <h3 className="font-extrabold text-lg leading-tight">
                  {fabric.name}
                </h3>
              </div>
            </div>

            {/* Body Specs */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              {/* Characteristic Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Wind className="w-3.5 h-3.5 text-sky-600" />
                    <span>Sirkulasi Udara</span>
                  </div>
                  <span className="font-semibold text-slate-800 line-clamp-1">
                    {fabric.breathability}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ketebalan Kain</span>
                  </div>
                  <span className="font-semibold text-slate-800 line-clamp-1">
                    {fabric.thickness}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Jatuh & Tekstur</span>
                  </div>
                  <span className="font-semibold text-slate-800 line-clamp-1">
                    {fabric.drapability}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Komposisi</span>
                  </div>
                  <span className="font-semibold text-slate-800 line-clamp-1">
                    {fabric.composition}
                  </span>
                </div>
              </div>

              {/* Recommended Use */}
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-900 block mb-0.5">
                  Rekomendasi Pemakaian:
                </span>
                <p className="text-xs text-emerald-800">
                  {fabric.recommendedUse}
                </p>
              </div>

              {/* Colors preview */}
              <div>
                <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Pilihan Warna Kain Siap Jahit:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {fabric.colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectFabric(fabric)}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs group-hover:bg-emerald-700"
                >
                  <Shirt className="w-4 h-4" />
                  <span>Pilih Bahan Ini di Kasir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
