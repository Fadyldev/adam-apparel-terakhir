import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Scissors,
  Sparkles,
  Package,
  Send,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  Printer,
  Copy,
  Check,
  Building,
  User,
  Phone,
} from 'lucide-react';
import type { Order, OrderStatus, WorkshopConfig } from '../types/index.ts';
import {
  formatRupiah,
  formatDate,
  formatDateTime,
  ORDER_STATUS_MAP,
  buildWhatsAppOrderMessage,
} from '../utils/formatters.ts';

interface OrderTrackerProps {
  initialOrderId?: string;
  config: WorkshopConfig;
  onOpenSpk: (order: Order) => void;
  onOpenInvoice?: (order: Order) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  initialOrderId,
  config,
  onOpenSpk,
  onOpenInvoice,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialOrderId || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Auto search if initialOrderId provided
  useEffect(() => {
    if (initialOrderId) {
      setSearchQuery(initialOrderId);
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const cleanQ = query.trim().toUpperCase();
      const res = await fetch(`/api/orders/${cleanQ}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        // Try searching by phone query
        const phoneRes = await fetch(`/api/orders?phone=${encodeURIComponent(query.trim())}`);
        const phoneData = await phoneRes.json();
        if (phoneData.success && phoneData.data.length > 0) {
          setSearchedOrder(phoneData.data[0]);
          return;
        }
        throw new Error(data.message || 'Pesanan tidak ditemukan. Mohon cek kembali No. Order atau No. WA.');
      }

      setSearchedOrder(data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mencari pesanan.');
      setSearchedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchQuery);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(text);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  // Pipeline step order definition
  const pipelineSteps: { key: OrderStatus; title: string; icon: any }[] = [
    { key: 'menunggu_dp', title: '1. Menunggu DP 50%', icon: Clock },
    { key: 'dp_lunas', title: '2. Antrean Potong Pola', icon: Scissors },
    { key: 'proses_jahit', title: '3. Sedang Jahit & Bordir', icon: Layers },
    { key: 'finishing_qc', title: '4. Finishing & Setrika Uap', icon: Sparkles },
    { key: 'siap_kirim', title: '5. Siap Kirim & Pelunasan', icon: Package },
  ];

  const getStepIndex = (st: OrderStatus): number => {
    switch (st) {
      case 'menunggu_dp':
        return 0;
      case 'dp_lunas':
        return 1;
      case 'proses_jahit':
        return 2;
      case 'finishing_qc':
        return 3;
      case 'siap_kirim':
      case 'selesai':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tracker Search Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
          <Search className="w-3.5 h-3.5" />
          Pelacak Transparan Seragam Borongan
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cek Progres Jahitan & Bordir Anda
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          Masukkan Nomor Order (misal:{' '}
          <span className="font-mono font-bold text-emerald-900">ADAM-202611-001</span>
          ) atau Nomor WhatsApp Anda untuk melihat tahapan pengerjaan di bengkel konveksi secara real-time.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-5 max-w-lg mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik No. Order (ADAM-...) atau No. HP..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center gap-1.5"
          >
            {loading ? 'Mencari...' : 'Lacak'}
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span>Contoh No. Order:</span>
          {['ADAM-202611-001', 'ADAM-202611-002', 'ADAM-202611-003'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setSearchQuery(code);
                fetchOrder(code);
              }}
              className="font-mono font-semibold text-emerald-800 hover:underline"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-3 max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tracker Details Card */}
      {searchedOrder && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-6">
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs uppercase tracking-wider font-extrabold bg-emerald-700/80 text-amber-300 px-2 py-0.5 rounded">
                  {searchedOrder.id}
                </span>
                <span className="text-xs text-emerald-200">
                  Didaftarkan: {formatDate(searchedOrder.createdAt)}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                {searchedOrder.organizationName}
              </h3>
              <p className="text-xs text-emerald-100 flex items-center gap-2 mt-1">
                <span>Pemesan: {searchedOrder.customerName}</span>
                <span>•</span>
                <span>WA: {searchedOrder.customerPhone}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenSpk(searchedOrder)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-xs"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>SPK Bengkel</span>
              </button>

              {onOpenInvoice && (
                <button
                  onClick={() => onOpenInvoice(searchedOrder)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Kwitansi / Invoice</span>
                </button>
              )}

              <a
                href={`https://wa.me/${config.ownerPhone.replace(
                  /\D/g,
                  ''
                )}?text=${buildWhatsAppOrderMessage(searchedOrder, config)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WA Mas El / Pengelola</span>
              </a>
            </div>
          </div>

          <div className="px-6 sm:px-8 space-y-8 pb-8">
            {/* 5-Step Visual Pipeline Stepper */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Progres Pengerjaan di Bengkel
                </h4>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    ORDER_STATUS_MAP[searchedOrder.status]?.badgeBg
                  }`}
                >
                  {ORDER_STATUS_MAP[searchedOrder.status]?.label}
                </span>
              </div>

              {/* Stepper Line & Dots */}
              <div className="relative pt-2 pb-4">
                {/* Animated Shimmer Stepper Bar */}
                <div className="overflow-hidden h-3 mb-5 text-xs flex rounded-full bg-slate-100 p-0.5 shadow-inner">
                  <div
                    style={{
                      width: `${((getStepIndex(searchedOrder.status) + 1) / 5) * 100}%`,
                    }}
                    className="shadow-sm rounded-full flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-800 via-teal-600 to-emerald-600 transition-all duration-700 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {pipelineSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(searchedOrder.status);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    const IconComponent = step.icon;

                    return (
                      <div
                        key={step.key}
                        className={`relative p-3 rounded-2xl border transition-all duration-300 transform ${
                          isCurrent
                            ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/30 shadow-md scale-102'
                            : isDone
                            ? 'bg-slate-50 border-emerald-300 text-slate-800'
                            : 'bg-white border-slate-200 opacity-50'
                        }`}
                      >
                        {isCurrent && (
                          <span className="absolute -inset-0.5 rounded-2xl bg-emerald-500/20 animate-radar pointer-events-none" />
                        )}
                        <div
                          className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-1.5 transition-all ${
                            isCurrent
                              ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-amber-300 shadow-md scale-105'
                              : isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-xs font-bold block leading-tight ${
                            isCurrent
                              ? 'text-emerald-950 font-black'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block mb-0.5">
                  Keterangan Tahap Saat Ini:
                </strong>
                {ORDER_STATUS_MAP[searchedOrder.status]?.description}
              </div>
            </div>

            {/* Payment & DP Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status Pembayaran DP 50%
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Biaya Pesanan:</span>
                    <span className="font-bold text-slate-900">
                      {formatRupiah(searchedOrder.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Wajib DP 50%:</span>
                    <span className="font-extrabold text-emerald-900">
                      {formatRupiah(searchedOrder.dpAmountRequired)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DP Terverifikasi:</span>
                    <span
                      className={`font-bold ${
                        searchedOrder.dpPaidAmount >= searchedOrder.dpAmountRequired
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {formatRupiah(searchedOrder.dpPaidAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
                    <span className="text-slate-600">Sisa Pelunasan:</span>
                    <span className="text-slate-900">
                      {formatRupiah(searchedOrder.remainingPayment)}
                    </span>
                  </div>
                </div>

                {searchedOrder.status === 'menunggu_dp' && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Belum Terverifikasi</span>
                    </div>
                    <span>
                      Silakan kirim bukti transfer DP 50% ke WhatsApp Ustadz agar pola kain segera
                      dipotong oleh tim bengkel.
                    </span>
                  </div>
                )}
              </div>

              {/* Rincian Pakaian & Kain */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Spesifikasi Jahitan & Bahan
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model Seragam:</span>
                    <span className="font-bold text-slate-900">
                      {searchedOrder.apparelTypeName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bahan Kain:</span>
                    <span className="font-bold text-slate-900">
                      {searchedOrder.fabricName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Warna Kain:</span>
                    <span className="font-semibold text-slate-800">
                      {searchedOrder.fabricColor}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Selesai (Deadline):</span>
                    <span className="font-bold text-slate-900">
                      {formatDate(searchedOrder.deadlineDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bordir:</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {searchedOrder.embroideryType.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rincian Grid Ukuran */}
            <div className="border border-slate-200 rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Tabel Pembagian Ukuran ({searchedOrder.totalPcs} pcs)
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
                {Object.entries(searchedOrder.sizeBreakdown).map(([size, qty]) => (
                  <div key={size} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Size {size}
                    </span>
                    <span className="text-base font-extrabold text-slate-800">
                      {qty}
                    </span>
                    <span className="text-[10px] text-slate-500 block">pcs</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Log Catatan */}
            <div className="border border-slate-200 rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Riwayat & Catatan Operasional
              </h4>
              <div className="space-y-3">
                {searchedOrder.history?.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {ORDER_STATUS_MAP[log.status]?.label || log.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateTime(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{log.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
