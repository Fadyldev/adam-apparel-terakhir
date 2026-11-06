import { AnimatePresence, motion } from 'framer-motion';
import { useDb } from '@/store/useDb';
import TiltCard from '@/components/ui/TiltCard';
import { CUSTOM_OPTION } from '@/lib/spk';
import { Check, Palette, ArrowRight, Shirt } from 'lucide-react';

// SVG paths for different garment models
function GarmentSilhouette({
  catalogId,
  fill,
  stroke = '#cbd5e1',
}: {
  catalogId: string;
  fill: string;
  stroke?: string;
}) {
  // 1. Jubah Pria Salaf / Gamis Thobe (Ankle-length flowing robe, mandarin collar, buttons, long sleeves)
  if (catalogId === 'cat-jubah') {
    return (
      <svg viewBox="0 0 300 360" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Jubah Salaf">
        {/* Main Body & Long Sleeves down to ankles */}
        <path
          d="M115 35 L45 70 L5 200 L45 212 L62 145 L58 335 Q58 350 80 350 L220 350 Q242 350 242 335 L238 145 L255 212 L295 200 L255 70 L185 35 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {/* Mandarin / Shanghai Stand Collar */}
        <path d="M115 35 Q150 48 185 35 L182 22 Q150 35 118 22 Z" fill="#ffffff" fillOpacity="0.3" stroke="#334155" strokeWidth="2" />
        {/* Concealed Front Placket */}
        <rect x="144" y="42" width="12" height="110" rx="2" fill="#ffffff" fillOpacity="0.15" stroke="#475569" strokeWidth="1.5" />
        <circle cx="150" cy="55" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="85" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="115" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="145" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        {/* Chest Welt Pocket */}
        <line x1="88" y1="85" x2="122" y2="85" stroke="#475569" strokeWidth="2.5" />
        {/* Cuffs */}
        <line x1="5" y1="200" x2="45" y2="212" stroke="#475569" strokeWidth="2" />
        <line x1="295" y1="200" x2="255" y2="212" stroke="#475569" strokeWidth="2" />
        {/* Vertical Center Drape */}
        <line x1="150" y1="155" x2="150" y2="345" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.4" />
      </svg>
    );
  }

  // 2. Khimar & Hijab Syar'i (Graceful draped triangle veil closing over chest & shoulders)
  if (catalogId === 'cat-khimar') {
    return (
      <svg viewBox="0 0 300 360" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Khimar Syar'i">
        {/* Head and Flowing Drape */}
        <path
          d="M150 20 Q95 20 85 90 Q75 180 35 240 Q90 285 150 335 Q210 285 265 240 Q225 180 215 90 Q205 20 150 20 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {/* Soft Face Opening */}
        <ellipse cx="150" cy="95" rx="34" ry="44" fill="#f8fafc" fillOpacity="0.95" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Under-chin Stitched Seam */}
        <line x1="150" y1="140" x2="150" y2="325" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 3" />
        {/* Pet / Antem Forehead Band */}
        <path d="M120 62 Q150 48 180 62 Q150 56 120 62 Z" fill="#ffffff" fillOpacity="0.3" stroke="#475569" strokeWidth="1.5" />
        {/* Draped Layer Folds */}
        <path d="M90 190 Q120 220 150 225 Q180 220 210 190" fill="none" stroke="#475569" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M75 235 Q115 265 150 270 Q185 265 225 235" fill="none" stroke="#475569" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
    );
  }

  // 3. Kemeja Koko Kurta Modern (Mandarin collar, placket, side slits)
  if (catalogId === 'cat-kurta') {
    return (
      <svg viewBox="0 0 300 340" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Koko Kurta">
        {/* Body with Side Slits */}
        <path
          d="M115 40 L50 72 L15 155 L55 170 L68 135 L68 250 L60 250 L60 315 Q60 325 80 325 L135 325 L135 270 L165 270 L165 325 L220 325 Q240 325 240 315 L240 250 L232 250 L232 135 L245 170 L285 155 L250 72 L185 40 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {/* Mandarin Collar */}
        <path d="M115 40 Q150 52 185 40 L180 28 Q150 38 120 28 Z" fill="#ffffff" fillOpacity="0.25" stroke="#334155" strokeWidth="2" />
        {/* Kurta 3-Button Placket */}
        <rect x="143" y="44" width="14" height="80" rx="2" fill="#ffffff" fillOpacity="0.2" stroke="#475569" strokeWidth="1.5" />
        <circle cx="150" cy="58" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="84" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="110" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        {/* Chest Pocket */}
        <rect x="85" y="95" width="38" height="40" rx="3" fill="none" stroke="#475569" strokeWidth="1.5" />
        {/* Side Slits Details */}
        <line x1="68" y1="250" x2="68" y2="325" stroke="#334155" strokeWidth="2" />
        <line x1="232" y1="250" x2="232" y2="325" stroke="#334155" strokeWidth="2" />
      </svg>
    );
  }

  // 4. Gamis Akhwat & Set Syar'i (Long A-line flared dress with cuffed sleeves)
  if (catalogId === 'cat-gamis') {
    return (
      <svg viewBox="0 0 300 360" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Gamis Akhwat">
        {/* A-line dress */}
        <path
          d="M125 40 L60 75 L15 195 L50 205 L68 140 L45 340 Q45 350 65 350 L235 350 Q255 350 255 340 L232 140 L250 205 L285 195 L240 75 L175 40 Q150 55 125 40 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {/* Round Collar */}
        <path d="M125 40 Q150 55 175 40" fill="none" stroke="#475569" strokeWidth="2" />
        {/* Front Hidden Zipper */}
        <line x1="150" y1="48" x2="150" y2="135" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
        {/* Waist Gather Line */}
        <path d="M85 140 Q150 152 215 140" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Sleeve Cuffs (Wudhu Friendly) */}
        <line x1="15" y1="195" x2="50" y2="205" stroke="#475569" strokeWidth="2.5" />
        <circle cx="35" cy="200" r="1.5" fill="#f8fafc" />
        <line x1="285" y1="195" x2="250" y2="205" stroke="#475569" strokeWidth="2.5" />
        <circle cx="265" cy="200" r="1.5" fill="#f8fafc" />
      </svg>
    );
  }

  // 5. Kemeja PDH/PDL with collar, placket, chest pockets
  if (catalogId === 'cat-pdh') {
    return (
      <svg viewBox="0 0 300 340" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Kemeja PDH">
        {/* Main Body & Sleeves */}
        <path
          d="M110 45 L50 75 L15 145 L55 165 L68 135 L68 310 Q68 325 85 325 L215 325 Q232 325 232 310 L232 135 L245 165 L285 145 L250 75 L190 45 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {/* Center Placket */}
        <line x1="150" y1="45" x2="150" y2="325" stroke="#475569" strokeWidth="2" strokeDasharray="6 3" />
        {/* Buttons */}
        <circle cx="150" cy="95" r="3" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="140" r="3" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="185" r="3" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="230" r="3" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="275" r="3" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        {/* Left Pocket */}
        <rect x="90" y="115" width="40" height="42" rx="4" fill="none" stroke="#475569" strokeWidth="1.5" />
        <path d="M88 115 L110 125 L132 115" fill="none" stroke="#475569" strokeWidth="1.5" />
        {/* Right Pocket */}
        <rect x="170" y="115" width="40" height="42" rx="4" fill="none" stroke="#475569" strokeWidth="1.5" />
        <path d="M168 115 L190 125 L212 115" fill="none" stroke="#475569" strokeWidth="1.5" />
        {/* Shoulder straps (Lidah Pundak PDH) */}
        <line x1="65" y1="80" x2="105" y2="50" stroke="#475569" strokeWidth="2" />
        <line x1="235" y1="80" x2="195" y2="50" stroke="#475569" strokeWidth="2" />
        {/* Collar */}
        <path d="M110 45 L150 78 L190 45 L165 40 L150 48 L135 40 Z" fill="#ffffff" fillOpacity="0.25" stroke="#334155" strokeWidth="2" />
        <path d="M110 45 L135 78 L150 78 L165 78 L190 45" fill="none" stroke="#334155" strokeWidth="2" />
      </svg>
    );
  }

  // 6. Polo Shirt with collar and placket
  if (catalogId === 'cat-polo') {
    return (
      <svg viewBox="0 0 300 340" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Polo Shirt">
        {/* Main Body & Short Sleeves */}
        <path
          d="M115 45 L55 75 L20 140 L60 160 L70 130 L70 305 Q70 320 90 320 L210 320 Q230 320 230 305 L230 130 L240 160 L280 140 L245 75 L185 45 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {/* Sleeve Ribs */}
        <path d="M20 140 L60 160" stroke="#475569" strokeWidth="3" />
        <path d="M280 140 L240 160" stroke="#475569" strokeWidth="3" />
        {/* Polo Placket */}
        <rect x="142" y="60" width="16" height="60" rx="2" fill="#ffffff" fillOpacity="0.15" stroke="#475569" strokeWidth="1.5" />
        <circle cx="150" cy="75" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <circle cx="150" cy="100" r="2.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        {/* Ribbed Collar */}
        <path d="M115 45 L142 65 L150 65 L158 65 L185 45 L160 38 Q150 45 140 38 Z" fill="#ffffff" fillOpacity="0.25" stroke="#334155" strokeWidth="2.5" />
      </svg>
    );
  }

  // 7. Hoodie with hood contour and kangaroo pocket
  if (catalogId === 'cat-hoodie') {
    return (
      <svg viewBox="0 0 300 340" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Hoodie">
        {/* Hood at top */}
        <path d="M110 50 Q150 15 190 50 Q150 65 110 50 Z" fill="#ffffff" fillOpacity="0.15" stroke="#334155" strokeWidth="2" />
        {/* Main Body & Long Sleeves */}
        <path
          d="M115 48 L45 80 L10 185 L50 200 L65 160 L65 310 Q65 325 85 325 L215 325 Q235 325 235 310 L235 160 L250 200 L290 185 L255 80 L185 48 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {/* Drawstrings */}
        <line x1="140" y1="55" x2="135" y2="105" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="160" y1="55" x2="165" y2="105" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        {/* Kangaroo Pocket */}
        <path d="M95 210 L205 210 L220 270 L80 270 Z" fill="#ffffff" fillOpacity="0.12" stroke="#475569" strokeWidth="1.5" />
        {/* Bottom Rib */}
        <rect x="65" y="305" width="170" height="20" rx="3" fill="#ffffff" fillOpacity="0.1" stroke="#475569" strokeWidth="1.5" />
      </svg>
    );
  }

  // 8. Jersey Sport with athletic V-neck
  if (catalogId === 'cat-jersey') {
    return (
      <svg viewBox="0 0 300 340" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Jersey Sport">
        {/* Main Body */}
        <path
          d="M120 40 L60 70 L20 140 L60 160 L70 130 L70 305 Q70 320 90 320 L210 320 Q230 320 230 305 L230 130 L240 160 L280 140 L240 70 L180 40 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {/* Raglan Shoulder Seams */}
        <path d="M120 40 L60 160" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
        <path d="M180 40 L240 160" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
        {/* V-neck collar */}
        <path d="M120 40 L150 72 L180 40" fill="none" stroke="#f8fafc" strokeWidth="3" />
        {/* Side Athletic Accents */}
        <path d="M70 180 L70 305 L80 305 L80 180 Z" fill="#ffffff" fillOpacity="0.25" />
        <path d="M230 180 L230 305 L220 305 L220 180 Z" fill="#ffffff" fillOpacity="0.25" />
      </svg>
    );
  }

  // 9. Kaos Custom & Kaos Dakwah (Crewneck)
  return (
    <svg viewBox="0 0 300 340" className="h-auto w-3/4 drop-shadow-2xl" role="img" aria-label="Mockup Kaos Custom">
      <path
        d="M120 40 L60 70 L20 140 L60 160 L70 130 L70 300 Q70 320 90 320 L210 320 Q230 320 230 300 L230 130 L240 160 L280 140 L240 70 L180 40 Q150 62 120 40 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* Rib collar */}
      <path d="M120 40 Q150 62 180 40" fill="none" stroke="#64748b" strokeWidth="2.5" />
      <path d="M120 40 Q150 56 180 40" fill="none" stroke="#94a3b8" strokeWidth="1" />
    </svg>
  );
}

export default function ColorMockup() {
  const { db, selection, setSelection } = useDb();
  const { colorList, catalogItems } = db;

  const isCustomColor = selection.colorId === CUSTOM_OPTION;
  const activeColor = colorList.find((c) => c.id === selection.colorId) ?? colorList[0];
  const fill = isCustomColor ? '#94a3b8' : (activeColor?.hex ?? '#0f172a');
  const label = isCustomColor ? 'Warna Khusus / Custom' : (activeColor?.name ?? 'Hitam Jetblack');
  const code = isCustomColor ? 'Custom' : (activeColor?.code ?? 'JB-01');

  // Currently active garment model in simulation
  const activeModelId = selection.catalogId || catalogItems[0]?.id || 'cat-kaos';
  const activeModel = catalogItems.find((m) => m.id === activeModelId) ?? catalogItems[0];

  const handleSelectModel = (catalogId: string) => {
    const matchedItem = catalogItems.find((i) => i.id === catalogId);
    setSelection({
      catalogId,
      fabricId: matchedItem?.fabricIds[0] ?? selection.fabricId,
    });
  };

  const handleApplyToSpk = () => {
    const spkEl = document.getElementById('spk');
    if (spkEl) {
      spkEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="simulasi-warna" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
            <Palette className="h-3.5 w-3.5 text-amber-600" />
            Simulasi Terhubung Langsung ke SPK
          </div>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Simulasi visual model pakaian &amp; warna kain
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Pilih model pakaian dan warna kain di bawah ini. Tampilan mockup otomatis menyesuaikan siluet pakaian dan <strong>langsung tersambung ke formulir SPK</strong> pemesanan Anda.
          </p>

          {/* Model Switcher inside Simulator */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Pilih Model Pakaian untuk Diuji:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {catalogItems.map((item) => {
                const isSelected = activeModelId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectModel(item.id)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Shirt className="h-3.5 w-3.5" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Color Info Box */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              2. Status Spesifikasi Terpilih
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="h-10 w-10 shrink-0 rounded-full border-2 border-white shadow-md ring-2 ring-slate-300"
                style={{ backgroundColor: fill }}
              />
              <div className="min-w-0">
                <p className="truncate text-base font-black text-slate-900">
                  {label} ({code})
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Model: <strong className="text-slate-800">{activeModel?.name || 'Kaos Custom'}</strong> • Bahan: Combed / Drill / Fleece
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyToSpk}
            className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 active:scale-95"
          >
            Gunakan Model &amp; Warna Ini di Form SPK
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mockup Display Box */}
        <div>
          <TiltCard>
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <div className="relative mx-auto flex aspect-[4/5] max-w-sm items-center justify-center rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/60 p-4">
                <div className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md">
                  Siluet: {activeModel?.name || 'Kaos'}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeModelId}-${isCustomColor ? 'custom' : activeColor?.id ?? 'none'}`}
                    className="flex w-full items-center justify-center"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <GarmentSilhouette
                      catalogId={activeModelId}
                      fill={fill}
                      stroke={fill === '#f8fafc' ? '#94a3b8' : '#cbd5e1'}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Grid of All 18 Indonesian Konveksi Colors */}
              {colorList.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Pilihan Palet Warna ({colorList.length} Warna Konveksi)
                    </p>
                    <span className="text-[11px] font-semibold text-slate-500">Klik warna untuk menguji</span>
                  </div>

                  <div role="radiogroup" aria-label="Pilih warna kain" className="flex flex-wrap gap-2.5">
                    {colorList.map((color) => {
                      const checked = !isCustomColor && activeColor?.id === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          aria-label={color.name}
                          title={`${color.name} (${color.code})`}
                          onClick={() => setSelection({ colorId: color.id })}
                          className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition active:scale-90 ${
                            checked
                              ? 'scale-110 border-amber-500 ring-4 ring-amber-500/30'
                              : 'border-white ring-1 ring-slate-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {checked && (
                            <Check className="h-3.5 w-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
