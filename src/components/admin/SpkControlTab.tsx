import { useMemo, useState } from 'react';
import {
  Search,
  DollarSign,
  Wallet,
  Clock,
  CheckCircle,
  Package,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatDate, formatRupiah } from '@/lib/format';
import { stageLabel } from '@/lib/spk';
import { useDb } from '@/store/useDb';
import { inputClass } from '@/components/ui/Field';
import { AdminPanel } from '@/components/admin/adminUi';
import SpkDetailPanel from '@/components/admin/SpkDetailPanel';
import type { SpkRecord } from '@/lib/schema';

function getDaysUntil(deadlineStr: string): number {
  try {
    const d = new Date(deadlineStr.length === 10 ? `${deadlineStr}T00:00:00` : deadlineStr);
    const now = new Date();
    const today = new Date(now.toISOString().slice(0, 10) + 'T00:00:00');
    const diffTime = d.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 99;
  }
}

export default function SpkControlTab() {
  const { db, update } = useDb();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...db.spkList]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter(
        (spk) =>
          !needle ||
          spk.id.toLowerCase().includes(needle) ||
          spk.customer.name.toLowerCase().includes(needle) ||
          spk.customer.instansi.toLowerCase().includes(needle),
      );
  }, [db.spkList, query]);

  const selected = db.spkList.find((spk) => spk.id === selectedId) ?? null;
  const inProduction = db.spkList.filter((spk) => spk.stage !== 'siap').length;
  const completed = db.spkList.filter((spk) => spk.stage === 'siap').length;

  // Financial Metrics for the Owner
  const totalOmzet = db.spkList.reduce((acc, s) => acc + (s.item?.total || 0), 0);
  const totalDpDiterima = db.spkList.reduce((acc, s) => acc + (s.dpPaid ? (s.item?.dp || 0) : 0), 0);
  const totalPiutang = db.spkList.reduce((acc, s) => {
    if (s.fullyPaid) return acc;
    if (s.dpPaid) return acc + (s.item?.remaining || 0);
    return acc + (s.item?.total || 0);
  }, 0);
  const totalPcs = db.spkList.reduce((acc, s) => acc + (s.item?.totalPcs || 0), 0);

  const patchSpk = (id: string, patch: Partial<SpkRecord>) =>
    update((current) => ({
      ...current,
      spkList: current.spkList.map((spk) => (spk.id === id ? { ...spk, ...patch } : spk)),
    }));

  const deleteSpk = (id: string) => {
    update((current) => ({
      ...current,
      spkList: current.spkList.filter((spk) => spk.id !== id),
    }));
    setSelectedId(null);
  };

  // IF AN ORDER IS SELECTED: RENDER ONLY THE DEDICATED FULL SUBPAGE
  if (selected) {
    return (
      <SpkDetailPanel
        spk={selected}
        onPatch={(patch) => patchSpk(selected.id, patch)}
        onDelete={deleteSpk}
        onClose={() => setSelectedId(null)}
      />
    );
  }

  // DEFAULT DASHBOARD VIEW
  return (
    <div className="space-y-6">
      {/* Financial & Operational Overview Cards for Owner */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          Ringkasan Keuangan &amp; Operasional Garment
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Total Nilai Pesanan</span>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">{formatRupiah(totalOmzet)}</p>
            <p className="mt-1 text-xs text-slate-500">Dari {db.spkList.length} SPK masuk</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-xs">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-semibold uppercase">Kas DP 50% Diterima</span>
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-emerald-950">{formatRupiah(totalDpDiterima)}</p>
            <p className="mt-1 text-xs text-emerald-700">Uang muka siap operasional</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-semibold uppercase">Sisa Pelunasan Tertunda</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-amber-950">{formatRupiah(totalPiutang)}</p>
            <p className="mt-1 text-xs text-amber-700">Diterima saat barang selesai</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Produksi Pakaian</span>
              <Package className="h-4 w-4 text-slate-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">{totalPcs.toLocaleString('id-ID')} pcs</p>
            <p className="mt-1 text-xs text-slate-500">{inProduction} aktif • {completed} selesai</p>
          </div>
        </div>
      </div>

      {/* SPK Table List */}
      <AdminPanel
        title="Daftar SPK Masuk"
        description="Klik salah satu pesanan untuk membuka halaman kontrol penuh produksi, pembayaran DP, cetak nota thermal/PDF, atau kirim kabar WA."
        action={
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari no. SPK, nama, instansi..."
              aria-label="Cari SPK"
              className={`${inputClass} pl-10`}
            />
          </div>
        }
      >
        {rows.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">
            {db.spkList.length === 0 ? 'Belum ada SPK masuk.' : 'Tidak ada SPK yang cocok dengan pencarian.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-600">
                  <th className="py-3 pr-3 font-semibold">No SPK</th>
                  <th className="py-3 pr-3 font-semibold">Pemesan &amp; Lembaga</th>
                  <th className="py-3 pr-3 font-semibold">Target Jadi</th>
                  <th className="py-3 pr-3 text-right font-semibold">Pcs</th>
                  <th className="py-3 pr-3 text-right font-semibold">Total Biaya</th>
                  <th className="py-3 pr-3 font-semibold">Status Pembayaran</th>
                  <th className="py-3 pr-3 font-semibold">Tahap Produksi</th>
                  <th className="py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((spk) => {
                  const days = getDaysUntil(spk.customer.deadline);
                  return (
                    <tr
                      key={spk.id}
                      onClick={() => setSelectedId(spk.id)}
                      className="group cursor-pointer border-b border-slate-100 transition hover:bg-amber-50/60"
                    >
                      <td className="py-3.5 pr-3 font-mono font-bold text-slate-900 group-hover:text-amber-700">
                        #{spk.id}
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="font-bold text-slate-900">{spk.customer.name}</p>
                        {spk.customer.instansi && <p className="text-xs text-slate-500">{spk.customer.instansi}</p>}
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="text-slate-800 font-medium">{formatDate(spk.customer.deadline)}</p>
                        {spk.stage !== 'siap' && (
                          <span
                            className={`inline-block text-[11px] font-bold ${
                              days < 0 ? 'text-rose-600' : days <= 3 ? 'text-amber-700' : 'text-slate-400'
                            }`}
                          >
                            {days < 0 ? `Telat ${Math.abs(days)} hari` : days === 0 ? 'Hari ini!' : `Sisa ${days} hari`}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-3 text-right font-semibold text-slate-900">{spk.item.totalPcs} pcs</td>
                      <td className="py-3.5 pr-3 text-right font-black text-slate-900">{formatRupiah(spk.item.total)}</td>
                      <td className="py-3.5 pr-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              spk.dpPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {spk.dpPaid ? '✓ DP 50% Masuk' : '⏳ Belum DP'}
                          </span>
                          {spk.fullyPaid && (
                            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              Lunas
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {spk.stage === 'siap' && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                          {stageLabel(spk.stage)}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(spk.id);
                          }}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600 active:scale-95"
                        >
                          <span>Edit SPK</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
