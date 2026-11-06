import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDb } from '@/store/useDb';
import type { PortfolioItem } from '@/lib/schema';
import { 
  Building2, 
  Layers, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Maximize2, 
  X, 
  ShieldCheck 
} from 'lucide-react';

// Single 3D Parallax Card Component
function PortfolioCard3D({ 
  item, 
  onOrderSimilar, 
  onZoom 
}: { 
  item: PortfolioItem; 
  onOrderSimilar: (item: PortfolioItem) => void;
  onZoom: (item: PortfolioItem) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // max 12 deg
    const rY = ((x - centerX) / centerX) * 12;
    setRotateX(rX);
    setRotateY(rY);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.6,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div className="w-[84vw] xs:w-[320px] sm:w-[360px] shrink-0 snap-center [perspective:1200px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="group relative flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl hover:border-amber-400/80 overflow-hidden"
      >
        {/* Dynamic Light Glare Effect on Desktop */}
        <div
          className="pointer-events-none absolute inset-0 z-30 hidden md:block transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />

        {/* Image Area with 3D Pop Layer */}
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900"
        >
          <img
            src={item.photoUrl}
            alt={`${item.garment} - ${item.client}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('photo-1503342217505-b0a15ec3261c')) {
                target.src = 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80';
              }
            }}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
          />

          {/* Floating Badges (Z-depth 45px) */}
          <div 
            style={{ transform: 'translateZ(45px)' }}
            className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-amber-300 shadow-md backdrop-blur-md"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{item.garment}</span>
          </div>

          <div 
            style={{ transform: 'translateZ(45px)' }}
            className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md"
          >
            <Calendar className="h-3 w-3 text-slate-500" />
            <span>{item.year}</span>
          </div>

          {/* Zoom button on hover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onZoom(item);
            }}
            className="absolute bottom-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-900/75 text-white backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity"
            title="Perbesar Foto"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content Details (Z-depth 25px) */}
        <div 
          style={{ transform: 'translateZ(25px)' }}
          className="flex flex-1 flex-col p-5 bg-gradient-to-b from-white to-slate-50/60"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wide">
            <Building2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{item.client}</span>
          </div>

          <h3 className="mt-1 text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
            {item.client}
          </h3>

          <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-emerald-50 border border-emerald-200/80 rounded-lg px-2.5 py-1 self-start">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            <span>Selesai Diproduksi: <strong>{item.quantity.toLocaleString('id-ID')} Pcs</strong></span>
          </div>

          {item.note && (
            <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-2 border-t border-slate-100 pt-2">
              {item.note}
            </p>
          )}

          {/* Action CTA */}
          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={() => onOrderSimilar(item)}
              className="w-full inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-extrabold text-white transition hover:bg-slate-800 active:scale-95 shadow-sm group-hover:bg-amber-600 group-hover:shadow-md"
            >
              <span>Pesan Model Seperti Ini</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-300 group-hover:text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PortfolioGallery() {
  const { db, setSelection } = useDb();
  const { portfolioList, catalogItems } = db;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedZoom, setSelectedZoom] = useState<PortfolioItem | null>(null);

  if (portfolioList.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const handleOrderSimilar = (item: PortfolioItem) => {
    // Find matching catalog or default
    const matched = catalogItems.find((c) => 
      c.name.toLowerCase().includes(item.garment.toLowerCase()) || 
      item.garment.toLowerCase().includes(c.name.toLowerCase())
    );
    if (matched) {
      setSelection({
        catalogId: matched.id,
        fabricId: matched.fabricIds[0] ?? '',
      });
    }
    const spkEl = document.getElementById('spk');
    if (spkEl) {
      spkEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="portofolio" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 py-16 sm:py-24">
      {/* Background Accent */}
      <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            Dokumentasi Produksi Asli &amp; Terpercaya
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Hasil Pengerjaan Busana &amp; Seragam Borongan
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Foto asli dari workshop Adam Collection. Dikerjakan amanah dengan jaminan bahan adem dan jahitan standar garmen ekspor.
          </p>
        </div>

        {/* Carousel Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Geser ke kiri"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hidden xs:inline">
            {portfolioList.length} Proyek Tuntas
          </span>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Geser ke kanan"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3D Carousel Horizontal Track */}
      <div className="relative mt-8">
        {/* Edge gradient masks */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-10 bg-gradient-to-r from-slate-50 to-transparent sm:block" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-10 bg-gradient-to-l from-slate-50 to-transparent sm:block" />

        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 pt-3 scrollbar-none"
          style={{ scrollPadding: '1rem' }}
        >
          {portfolioList.map((item) => (
            <PortfolioCard3D
              key={item.id}
              item={item}
              onOrderSimilar={handleOrderSimilar}
              onZoom={(item) => setSelectedZoom(item)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {selectedZoom && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
            onClick={() => setSelectedZoom(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-3xl bg-white p-4 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedZoom(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-900/80 text-white transition hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>

              <img
                src={selectedZoom.photoUrl}
                alt={selectedZoom.garment}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('photo-1503342217505-b0a15ec3261c')) {
                    target.src = 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80';
                  }
                }}
                className="max-h-[65vh] w-full rounded-2xl object-cover"
              />

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase">{selectedZoom.garment}</p>
                  <h4 className="text-lg font-black text-slate-900">{selectedZoom.client}</h4>
                  <p className="text-xs text-slate-500">Tahun {selectedZoom.year} • Volume: {selectedZoom.quantity} pcs</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleOrderSimilar(selectedZoom);
                    setSelectedZoom(null);
                  }}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  Pesan Model Ini ke SPK &rarr;
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
