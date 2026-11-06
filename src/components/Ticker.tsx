import { motion } from 'framer-motion';
import { useDb } from '@/store/useDb';

export const DEFAULT_TICKER_ITEMS = [
  "⚡ PROMO SPESIAL BULAN INI: FREE BIAYA DESAIN & SUBSIDI ONGKIR UNTUK ORDER DI ATAS 50 PCS",
  "GARANSI AKAD SYAR'I (ISTISHNA' & SALAM): BEBAS DENDA & JAMINAN RETUR JAHITAN",
  "SPESIALIS JUBAH SALAF, GAMIS AKHWAT, KEMEJA KOKO & SERAGAM PONDOK PESANTREN",
  "KONSULTASI DESAIN & PANDUAN SIZE CHART GRATIS 24/7 VIA WHATSAPP",
];

export default function Ticker() {
  const { db } = useDb();
  const rawPromo = db.shopSettings.promoTicker?.trim();

  let items: string[] = DEFAULT_TICKER_ITEMS;

  if (rawPromo) {
    const parsed = rawPromo
      .split(/[\n•]+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    if (parsed.length > 0) {
      items = parsed;
    }
  }

  // Double the array for smooth endless loop
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden bg-amber-400 py-3.5 shadow-md shadow-amber-500/20" aria-label="Pengumuman dan promo">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap text-xs font-black tracking-widest text-slate-900 sm:text-sm"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: Math.max(22, items.length * 7), ease: 'linear' }}
      >
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            <span>{item}</span>
            <span aria-hidden className="text-amber-800">&#10022;</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
