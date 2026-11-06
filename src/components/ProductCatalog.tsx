import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { CATALOG_ICONS } from '@/lib/icons';
import { formatRupiah } from '@/lib/format';
import { useDb } from '@/store/useDb';
import SpringTabs from '@/components/ui/SpringTabs';
import TiltCard from '@/components/ui/TiltCard';

const ALL_TAB = 'all';

const FALLBACK_CATALOG_IMAGES: Record<string, string> = {
  'cat-kaos': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  'cat-pdh': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
  'cat-polo': 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
  'cat-hoodie': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  'cat-jersey': 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=800&q=80',
  'cat-koko': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
  'cat-gamis': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  'cat-jas': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
};

export default function ProductCatalog() {
  const { db, setSelection } = useDb();
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [currentIndex, setCurrentIndex] = useState(0);

  const tabs = useMemo(
    () => [{ id: ALL_TAB, label: 'Semua Produk' }, ...db.catalogItems.map((item) => ({ id: item.id, label: item.name }))],
    [db.catalogItems],
  );

  const filteredItems = useMemo(() => {
    return activeTab === ALL_TAB ? db.catalogItems : db.catalogItems.filter((item) => item.id === activeTab);
  }, [db.catalogItems, activeTab]);

  // Reset index when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentIndex(0);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const pickForOrder = (catalogId: string, fabricIds: string[]) => {
    setSelection({ catalogId, fabricId: fabricIds[0] ?? '' });
    document.getElementById('spk')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="katalog" className="mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6 py-14 sm:py-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Katalog Pakaian &amp; Seragam</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Pilih Model Pakaian &amp; Tentukan Bahannya
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Dikerjakan oleh penjahit berpengalaman dengan standar mutu jahitan distro dan garmen ekspor.
          </p>
        </div>

        {/* Navigation Buttons for the Catalog Slider */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={prevCard}
            aria-label="Model sebelumnya"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <span className="text-xs font-bold tabular-nums text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
            {currentIndex + 1} / {filteredItems.length} Model
          </span>
          <button
            type="button"
            onClick={nextCard}
            aria-label="Model berikutnya"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Tabs on Mobile */}
      <div className="mt-6 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <SpringTabs tabs={tabs} active={activeTab} onChange={handleTabChange} layoutId="activeTab" className="flex-nowrap sm:flex-wrap" />
      </div>

      {/* Elegant Horizontal Card Slider Container */}
      <div className="relative mt-8">
        {/* Subtle Vignette Gradient Masks */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-12 bg-gradient-to-r from-slate-100/90 to-transparent sm:block" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-12 bg-gradient-to-l from-slate-100/90 to-transparent sm:block" />

        {/* Horizontal Carousel Tracks */}
        <div className="flex items-stretch gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none sm:gap-6">
          {filteredItems.map((item, index) => {
            const fabrics = db.fabricList.filter((fabric) => item.fabricIds.includes(fabric.id));
            const displayImage = item.imageUrl || FALLBACK_CATALOG_IMAGES[item.id] || FALLBACK_CATALOG_IMAGES['cat-kaos'];
            const isCenter = index === currentIndex;

            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex w-[82vw] xs:w-[320px] sm:w-[360px] shrink-0 cursor-pointer snap-center flex-col transition-all duration-300 ${
                  isCenter
                    ? 'scale-100 opacity-100 ring-2 ring-amber-500/40'
                    : 'scale-[0.96] opacity-75 sm:opacity-70 hover:opacity-100'
                } rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden`}
              >
                {/* Photo area */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={displayImage}
                    alt={`Produksi ${item.name}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback to high-reliability unsplash image if original blocked
                      const target = e.currentTarget;
                      if (!target.src.includes('photo-1521572267360-ee0c2909d518')) {
                        target.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-amber-400 shadow-md backdrop-blur-md">
                    Mulai {formatRupiah(item.basePrice)}
                  </div>
                  {isCenter && (
                    <div className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-sm">
                      Pilihan Fokus
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{item.name}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">{item.description}</p>

                  <ul className="mt-3.5 space-y-1.5">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span className="truncate">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {fabrics.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {fabrics.map((fabric) => (
                        <span key={fabric.id} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {fabric.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        pickForOrder(item.id, item.fabricIds);
                      }}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-xs sm:text-sm font-extrabold text-slate-900 shadow-md shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95"
                    >
                      Pilih &amp; Hitung di Form SPK
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots Pagination */}
        <div className="mt-2 flex justify-center items-center gap-1.5">
          {filteredItems.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-amber-500' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Model ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
