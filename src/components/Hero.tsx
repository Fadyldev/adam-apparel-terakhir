import { ArrowRight, MessageCircle, ShieldCheck, Clock, Scissors, Sparkles } from 'lucide-react';
import { useDb } from '@/store/useDb';
import { buildWaLink } from '@/lib/spk';

export default function Hero() {
  const { db } = useDb();
  const { shopName, tagline, waNumber } = db.shopSettings;

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Badge Kepercayaan & Jam Layanan */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Workshop Garment &amp; Konveksi Terstandarisasi</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">Layanan SPK Digital 24 Jam</span>
        </div>

        {/* Headline Utama */}
        <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.1]">
          {shopName}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          {tagline}. Spesialis produksi seragam kemeja kantor, busana santri pesantren, jas almamater, dan kaos polo borongan bergaransi bebas cacat.
        </p>

        {/* 3 Value Proposition Bullets */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Bahan Otentik Rol Pabrik
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
            <Clock className="h-4 w-4 text-amber-600" />
            Kalkulasi Estimasi Instan
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
            <Scissors className="h-4 w-4 text-sky-600" />
            Bordir Komputer Presisi Tinggi
          </span>
        </div>

        {/* Call To Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#spk"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 active:scale-95"
          >
            Buat SPK &amp; Hitung Estimasi
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={buildWaLink(waNumber, `Halo Layanan Pelanggan ${shopName}, saya ingin konsultasi spesifikasi seragam dan estimasi harga.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            Konsultasi Layanan Pelanggan (CS)
          </a>
        </div>
      </div>
    </section>
  );
}
