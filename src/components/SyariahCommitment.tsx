import { useState } from 'react';
import { ShieldCheck, Scale, Award, RefreshCw, ChevronDown } from 'lucide-react';

export default function SyariahCommitment() {
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  return (
    <section className="relative overflow-hidden bg-slate-900 py-10 sm:py-14 text-white border-y border-slate-800">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Banner Ringkas / Compact Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <span>Integritas Bisnis &amp; Standar Mutu Garment</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Komitmen Transparansi Akad &amp; Garansi Produksi
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
                Memastikan setiap meter kain asli sesuai spesifikasi pesanan, bebas riba, dan bergaransi retur cacat jahit.
              </p>
            </div>
          </div>

          {/* Tombol Toggle Detail (Hemat Ruang di Layar HP) */}
          <button
            onClick={() => setIsOpenDetail(!isOpenDetail)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-bold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
          >
            <span>{isOpenDetail ? 'Tutup Rincian Komitmen' : 'Lihat 3 Standar Pelayanan'}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpenDetail ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 3 Pilar Komitmen - Tampil Ringkas (Bisa di-expand) */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 transition-all duration-300 ${isOpenDetail ? 'block' : 'hidden md:grid'}`}>
          {/* Pilar 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-amber-400 shrink-0" />
              <h4 className="text-sm font-bold text-white">Kejujuran Spek Kain</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Kain menggunakan rol pabrik distributor resmi. Ketebalan, gramasi, dan komposisi katun dijamin 100% otentik tanpa oplosan bahan murah.
            </p>
          </div>

          {/* Pilar 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-emerald-400 shrink-0" />
              <h4 className="text-sm font-bold text-white">Kepastian Biaya di Awal</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Harga final tercantum jelas pada Lembar SPK resmi. Tidak ada biaya siluman atau tambahan harga tak terduga di tengah proses jahit.
            </p>
          </div>

          {/* Pilar 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-sky-400 shrink-0" />
              <h4 className="text-sm font-bold text-white">Garansi Retur Cacat Jahit</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Kancing lepas, resleting macet, atau logo bordir salah eja siap kami perbaiki atau ganti baru tanpa membebani biaya tambahan ke pemesan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
