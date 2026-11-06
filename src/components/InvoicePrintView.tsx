import React, { useState } from 'react';
import { Printer, X, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Order, WorkshopConfig } from '../types/index.ts';
import { formatDate, formatRupiah } from '../utils/formatters.ts';

interface InvoicePrintViewProps {
  order: Order | null;
  config: WorkshopConfig;
  onClose: () => void;
}

export const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({
  order,
  config,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  if (!order) return null;

  const isDpPaid = order.dpPaidAmount >= order.dpAmountRequired;
  const isFullPaid = order.isFullyPaid || order.status === 'selesai';

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      setPrintNotice('Browser memblokir dialog cetak di dalam preview. Gunakan tombol "Tab Baru" atau "Salin Kwitansi".');
    }
  };

  const handleOpenCleanTab = () => {
    const printArea = document.getElementById('invoice-printable-area');
    if (!printArea) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Kwitansi Invoice - ${order.id}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; margin: 15mm; color: #111; line-height: 1.3; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { border: 1px solid #ddd; padding: 8px 12px; font-size: 12px; }
              th { background: #064e3b; color: white; }
              .header { border-bottom: 2px solid #064e3b; padding-bottom: 12px; margin-bottom: 20px; }
              @page { size: A4 portrait; margin: 12mm; }
            </style>
          </head>
          <body>
            ${printArea.innerHTML}
            <script>window.onload = function() { window.print(); };</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      setPrintNotice('Pop-up tab baru diblokir oleh browser. Silakan gunakan tombol "Salin Kwitansi".');
    }
  };

  const handleCopyText = () => {
    const text = `=========================================
KWITANSI RESMI & INVOICE TAGIHAN DP
${config.brandName.toUpperCase()}
No. Invoice: INV/${order.id}
Tanggal: ${formatDate(order.createdAt)}
=========================================
Tagihan Ditujukan Kepada:
${order.organizationName}
Up: ${order.customerName} (${order.customerPhone})

RINCIAN PESANAN:
- Model: ${order.apparelTypeName}
- Bahan Kain: ${order.fabricName} (${order.fabricColor})
- Jumlah: ${order.totalPcs} pcs
- Rincian Ukuran: ${Object.entries(order.sizeBreakdown).filter(([_, q]) => Number(q) > 0).map(([s, q]) => `${s}=${q}`).join(', ')}

TOTAL NILAI KONTRAK: ${formatRupiah(order.totalPrice)}
WAJIB DP 50%: ${formatRupiah(order.dpAmountRequired)}
DP DITERIMA: ${formatRupiah(order.dpPaidAmount)} (${isDpPaid ? 'LUNAS' : 'BELUM DITERIMA'})
SISA PELUNASAN: ${formatRupiah(order.remainingPayment)}

REKENING TRANSFER RESMI:
${config.bankAccounts.map((b) => `• ${b.bank}: ${b.accountNumber} (a.n ${b.accountHolder})`).join('\n')}

Target Selesai: ${formatDate(order.deadlineDate)}
=========================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white animate-in fade-in duration-150">
      {/* Floating Control Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 no-print bg-slate-900/95 p-2 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md">
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>Cetak Langsung</span>
        </button>

        <button
          onClick={handleOpenCleanTab}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
          title="Buka lembar cetak di tab baru"
        >
          <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          <span>Tab Baru</span>
        </button>

        <button
          onClick={handleCopyText}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Salin Kwitansi</span>
            </>
          )}
        </button>

        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition cursor-pointer"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {printNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-900 text-amber-100 text-xs px-4 py-2 rounded-xl shadow-xl border border-amber-600 max-w-md text-center no-print">
          {printNotice}
        </div>
      )}

      {/* A4 PRINTABLE INVOICE SHEET */}
      <div
        id="invoice-printable-area"
        className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-2xl print:rounded-none print:shadow-none print:p-0 border border-slate-300 font-sans leading-tight mt-12 mb-12 relative"
      >
        {/* KOP RESMI INVOICE */}
        <div className="border-b-2 border-emerald-900 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                INVOICE RESMI & BUKTI PEMBAYARAN DP
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {config.brandName}
              </h1>
              <p className="text-xs font-semibold text-slate-700">
                {config.brandTagline}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Alamat Bengkel: {config.address} • Kontak: +{config.ownerPhone}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                NO. INVOICE / KWITANSI
              </span>
              <span className="text-lg font-black font-mono text-emerald-950 block">
                INV/{order.id}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Tanggal: {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* BILLED TO & DEADLINE */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
              Tagihan Ditujukan Kepada:
            </span>
            <strong className="text-sm font-extrabold text-slate-900 block">
              {order.organizationName}
            </strong>
            <span className="text-slate-700 block">
              Up: {order.customerName}
            </span>
            <span className="text-slate-500 font-mono text-[11px] block">
              WhatsApp: {order.customerPhone}
            </span>
          </div>

          <div className="text-right sm:text-left sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
              Ketentuan Waktu & Produksi:
            </span>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Target Serah Terima:</span>
              <strong className="text-rose-900 font-bold">{formatDate(order.deadlineDate)}</strong>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Status Pembayaran:</span>
              <strong className={isFullPaid ? 'text-emerald-700' : isDpPaid ? 'text-blue-700' : 'text-amber-700'}>
                {isFullPaid ? 'LUNAS 100%' : isDpPaid ? 'DP 50% TERVERIFIKASI' : 'MENUNGGU TRANSFER DP'}
              </strong>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Metode Bayar:</span>
              <span className="font-semibold text-slate-700">{order.paymentMethod || 'Transfer Bank'}</span>
            </div>
          </div>
        </div>

        {/* TABEL RINCIAN ITEM */}
        <div className="mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white font-bold text-[10px] uppercase">
                <th className="py-2.5 px-3 rounded-tl">No</th>
                <th className="py-2.5 px-3">Deskripsi Pesanan Seragam</th>
                <th className="py-2.5 px-3 text-center">Bahan & Warna</th>
                <th className="py-2.5 px-3 text-center">Qty (Pcs)</th>
                <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                <th className="py-2.5 px-3 text-right rounded-tr">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-b border-slate-300">
              <tr>
                <td className="py-3 px-3 font-bold text-slate-500">1</td>
                <td className="py-3 px-3">
                  <strong className="font-extrabold text-slate-900 block text-sm">
                    {order.apparelTypeName}
                  </strong>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    Rincian Ukuran: {Object.entries(order.sizeBreakdown)
                      .filter(([_, q]) => Number(q) > 0)
                      .map(([s, q]) => `${s}: ${q}`)
                      .join(', ')}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                    Opsi Bordir: {order.embroideryType.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="font-semibold text-slate-800 block">
                    {order.fabricName}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {order.fabricColor}
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-bold text-base text-slate-900">
                  {order.totalPcs}
                </td>
                <td className="py-3 px-3 text-right font-medium text-slate-700">
                  {formatRupiah(order.unitPrice + order.embroideryFeePerPcs)}
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">
                  {formatRupiah(order.totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SUMMARY FINANCIAL TOTAL */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-80 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Total Nilai Kontrak Borongan:</span>
              <strong className="text-slate-900">{formatRupiah(order.totalPrice)}</strong>
            </div>

            <div className="flex justify-between py-1 text-emerald-900 font-bold bg-emerald-100/70 px-2 py-1.5 rounded-lg border border-emerald-200">
              <span>Wajib Uang Muka (DP 50%):</span>
              <span>{formatRupiah(order.dpAmountRequired)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Pembayaran DP Diterima:</span>
              <strong className={isDpPaid ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                {formatRupiah(order.dpPaidAmount)}
              </strong>
            </div>

            <div className="flex justify-between py-1 text-rose-900 font-bold">
              <span>Sisa Tagihan (Saat Selesai):</span>
              <span>{formatRupiah(order.remainingPayment)}</span>
            </div>
          </div>
        </div>

        {/* REKENING PEMBAYARAN RESMI */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-[11px] text-amber-950 mb-8 space-y-1">
          <strong className="block font-bold uppercase tracking-wider text-amber-900">
            Rekening Resmi Pembayaran DP & Pelunasan:
          </strong>
          {config.bankAccounts.map((b, idx) => (
            <div key={idx} className="flex justify-between">
              <span>• {b.bank}: <strong className="font-mono">{b.accountNumber}</strong></span>
              <span className="text-amber-800">a.n {b.accountHolder}</span>
            </div>
          ))}
          <p className="text-[10px] text-amber-800 pt-1 italic">
            *Kwitansi ini sah sebagai lampiran Laporan Pertanggungjawaban (SPJ) Dana Yayasan / Komite Sekolah.
          </p>
        </div>

        {/* STEMPEL CAP DIGITAL & TANDA TANGAN */}
        <div className="pt-6 border-t-2 border-slate-300 relative">
          {/* DIGITAL STAMP */}
          {isDpPaid && (
            <div className="absolute left-1/3 top-2 border-4 border-emerald-600 rounded-full px-5 py-2 rotate-[-12deg] text-center opacity-85 select-none pointer-events-none">
              <span className="text-[10px] font-black uppercase text-emerald-700 block tracking-widest">
                {config.brandName}
              </span>
              <span className="text-base font-black text-emerald-800 block leading-tight">
                {isFullPaid ? '★ LUNAS 100% ★' : '✓ TERBAYAR DP 50%'}
              </span>
              <span className="text-[8px] font-mono font-bold text-emerald-600 block">
                {formatDate(order.dpPaidAt || order.createdAt)}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Diterima & Disetujui Pemesan,</span>
              <span className="font-bold text-slate-800 block text-xs">{order.organizationName}</span>
              <div className="h-16 border-b border-dashed border-slate-400" />
              <span className="text-slate-900 font-bold block mt-1.5">{order.customerName}</span>
              <span className="text-[10px] text-slate-400">Ketua Panitia / Bendahara</span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Pengelola & Kasir Bengkel,</span>
              <span className="font-bold text-emerald-950 block text-xs">{config.brandName}</span>
              <div className="h-16 border-b border-dashed border-slate-400" />
              <span className="text-slate-900 font-bold block mt-1.5">{config.ownerTitle}</span>
              <span className="text-[10px] text-slate-400">Pimpinan Konveksi & Tailoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
