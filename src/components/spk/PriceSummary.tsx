import { motion } from 'framer-motion';
import { formatRupiah } from '@/lib/format';
import type { calculatePricing } from '@/lib/pricing';
import { Receipt, Sparkles, CheckCircle2 } from 'lucide-react';

type Pricing = ReturnType<typeof calculatePricing>;

interface PriceSummaryProps {
  pricing: Pricing | null;
  productName: string;
  minOrder?: number;
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-xs sm:text-sm">
      <span className="text-slate-600 font-medium">{label}</span>
      <span className={strong ? 'font-black text-slate-900 text-sm sm:text-base' : 'font-bold text-slate-800'}>
        {value}
      </span>
    </div>
  );
}

export default function PriceSummary({ pricing, productName, minOrder = 1 }: PriceSummaryProps) {
  if (!pricing) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-600">
        Pilih model pakaian untuk melihat simulasi kalkulasi nota SPK.
      </div>
    );
  }

  const belowMin = pricing.totalPcs < minOrder;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative rounded-3xl border border-slate-300/80 bg-gradient-to-b from-white via-slate-50/90 to-amber-50/20 shadow-xl shadow-slate-900/10 backdrop-blur-xl overflow-hidden"
    >
      {/* Top Paper Header Strip (Thermal Receipt Style) */}
      <div className="bg-slate-900 px-5 py-3.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            Kalkulasi Nota SPK
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          OTOMATIS 24 JAM
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Model Seragam:</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate max-w-[190px]">
            {productName}
          </span>
        </div>

        {/* Pricing Rows */}
        <div className="space-y-2.5 font-mono">
          <Row label="Volume Pesanan" value={`${pricing.totalPcs} pcs`} />
          <Row label="Harga per Pcs" value={formatRupiah(pricing.unitPrice)} />
          <Row label="Tier Diskon" value={pricing.tier.label} />
          {pricing.bigSizeFee > 0 && (
            <Row label="Tambahan Big Size" value={formatRupiah(pricing.bigSizeFee)} />
          )}
        </div>

        {/* Total & DP Card */}
        <div className="mt-4 space-y-3 border-t-2 border-dashed border-slate-300 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">Total Nilai Kontrak</span>
            <span className="text-lg sm:text-xl font-black text-slate-900">
              {formatRupiah(pricing.total)}
            </span>
          </div>

          {/* Golden/Emerald DP Highlight Box */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wide">
              <span>Uang Muka (DP 50% Mulai Produksi)</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-950 font-mono">
              {formatRupiah(pricing.dp)}
            </p>
            <p className="text-[10px] text-emerald-700 font-medium mt-1">
              *Produksi garmen langsung berjalan setelah verifikasi DP.
            </p>
          </div>

          <div className="flex items-baseline justify-between text-xs text-slate-600">
            <span>Sisa Pelunasan 50% (Saat Siap Kirim)</span>
            <span className="font-bold text-slate-800 font-mono">
              {formatRupiah(pricing.remaining)}
            </span>
          </div>
        </div>

        {belowMin && (
          <p className="rounded-xl bg-amber-100/70 border border-amber-300 px-3.5 py-2.5 text-xs font-semibold text-amber-900">
            Minimal order {minOrder} pcs untuk tipe produk ini.
          </p>
        )}

        {/* Decorative Barcode Line */}
        <div className="pt-3 border-t border-slate-200/80 flex flex-col items-center">
          <div className="flex gap-1 h-5 items-center opacity-40">
            {[2, 4, 1, 3, 5, 2, 6, 1, 3, 4, 2, 5, 1, 3, 6, 2, 4, 1].map((w, i) => (
              <span key={i} className="bg-slate-900 h-full" style={{ width: `${w}px` }} />
            ))}
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
            ADAM-SPK-DIGITAL-VERIFIED
          </span>
        </div>
      </div>

      {/* Zigzag Bottom Paper Cutout */}
      <div 
        className="h-3 w-full bg-slate-900/5"
        style={{
          clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)',
        }}
      />
    </motion.div>
  );
}
