import React, { useState } from 'react';
import {
  Printer,
  X,
  Scissors,
  Check,
  Copy,
  ExternalLink,
  Calendar,
  Building,
  User,
  Phone,
  FileCheck,
} from 'lucide-react';
import type { Order, WorkshopConfig } from '../types/index.ts';
import { formatDate, formatRupiah } from '../utils/formatters.ts';

interface SpkPrintViewProps {
  order: Order | null;
  config: WorkshopConfig;
  onClose: () => void;
}

export const SpkPrintView: React.FC<SpkPrintViewProps> = ({
  order,
  config,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [printNotice, setPrintNotice] = useState<string | null>(null);
  const [qcChecks, setQcChecks] = useState<boolean[]>([false, false, false, false, false, false]);

  if (!order) return null;

  const handlePrint = () => {
    // Notify server that SPK was printed
    fetch(`/api/orders/${order.id}/spk-printed`, { method: 'PATCH' }).catch(() => {});
    try {
      window.print();
    } catch (e) {
      setPrintNotice('Browser memblokir dialog cetak di dalam preview. Gunakan tombol "Buka Tab Baru Cetak" atau "Salin Teks SPK".');
    }
  };

  const handleOpenCleanTab = () => {
    const printArea = document.getElementById('spk-printable-area');
    if (!printArea) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SPK Bengkel - ${order.id}</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; margin: 15mm; color: #111; line-height: 1.3; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #333; padding: 6px 10px; font-size: 11px; }
              th { background: #f0f0f0; }
              .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
              @page { size: A4 portrait; margin: 10mm; }
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
      setPrintNotice('Pop-up tab baru diblokir oleh browser. Silakan gunakan tombol "Salin Teks SPK".');
    }
  };

  const handleCopyText = () => {
    const sizeDetails = Object.entries(order.sizeBreakdown)
      .filter(([_, q]) => Number(q) > 0)
      .map(([s, q]) => `${s}: ${q} pcs`)
      .join(', ');

    const text = `=========================================
SURAT PERINTAH KERJA (SPK) - ${config.brandName.toUpperCase()}
No. SPK: ${order.id}
Tanggal: ${formatDate(order.createdAt)}
Target Deadline: ${formatDate(order.deadlineDate)}
=========================================
Pemesan: ${order.customerName} (${order.customerPhone})
Lembaga: ${order.organizationName}

SPESIFIKASI KAIN & MODEL:
- Model Seragam: ${order.apparelTypeName}
- Bahan Kain: ${order.fabricName}
- Warna Kain: ${order.fabricColor}

REKAPITULASI UKURAN (${order.totalPcs} PCS):
👉 ${sizeDetails}

BORDIR KOMPUTER:
Tipe: ${order.embroideryType}
${order.embroideryItems && order.embroideryItems.length > 0 ? `Daftar Nama Dada:\n${order.embroideryItems.map((n, i) => `${i + 1}. ${n.name} (${n.size})`).join('\n')}` : 'Tanpa daftar nama per orangan'}

Catatan Khusus: ${order.specialNotes || '-'}
Status DP: ${order.dpPaidAmount >= order.dpAmountRequired ? 'LUNAS DP 50%' : 'BELUM DP'}
=========================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Estimate fabric consumption: ± 1.6 meters for koko/kemeja, 2.5 meters for gamis
  const estMetersPerPiece =
    order.apparelTypeId.includes('gamis') ? 2.5 : 1.6;
  const totalEstFabricMeters = Math.round(order.totalPcs * estMetersPerPiece);

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
              <span>Salin Teks</span>
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

      {/* A4 PRINTABLE SHEET */}
      <div
        id="spk-printable-area"
        className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-10 shadow-2xl rounded-2xl print:rounded-none print:shadow-none print:p-0 border border-slate-300 font-sans leading-tight mt-12 mb-12"
      >
        {/* KOP SURAT BENGKEL RESMI */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                  AC
                </span>
                <h1 className="text-xl font-black tracking-tight uppercase">
                  {config.brandName}
                </h1>
              </div>
              <p className="text-[11px] font-bold text-slate-700 mt-1">
                {config.brandTagline}
              </p>
              <p className="text-[10px] text-slate-500">
                Bengkel Produksi: {config.address} • Kontak: +{config.ownerPhone} ({config.ownerTitle})
              </p>
            </div>

            <div className="text-right border-l-2 border-slate-900 pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">
                LEMBAR KERJA PRODUKSI BENGKEL
              </span>
              <span className="text-xl font-black font-mono tracking-wider block text-slate-900">
                {order.id}
              </span>
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded inline-block mt-0.5">
                STATUS: {order.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* METADATA ORDER GRID */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-300">
          <div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Lembaga / Pondok:</span>
              <strong className="text-slate-900">{order.organizationName}</strong>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Nama Pemesan (PIC):</span>
              <strong className="text-slate-900">{order.customerName}</strong>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">WhatsApp Pemesan:</span>
              <span className="font-mono text-slate-800">{order.customerPhone}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Tanggal Masuk:</span>
              <span className="font-semibold text-slate-800">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500 font-bold text-rose-800">TARGET DEADLINE:</span>
              <strong className="text-rose-900 font-extrabold text-xs">
                {formatDate(order.deadlineDate)}
              </strong>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Verifikasi DP 50%:</span>
              <strong className="text-emerald-800">
                {order.dpPaidAmount >= order.dpAmountRequired
                  ? `LUNAS (${formatRupiah(order.dpPaidAmount)})`
                  : `BELUM LUNAS (${formatRupiah(order.dpPaidAmount)})`}
              </strong>
            </div>
          </div>
        </div>

        {/* SPESIFIKASI KAIN & POTONGAN */}
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-2.5 py-1 mb-2 rounded">
            1. SPESIFIKASI BAHAN KAIN & POLA POTONG
          </h3>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="border border-slate-300 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Model Pakaian:</span>
              <strong className="text-slate-900 text-xs block">{order.apparelTypeName}</strong>
            </div>
            <div className="border border-slate-300 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Jenis & Merek Kain:</span>
              <strong className="text-slate-900 text-xs block">{order.fabricName}</strong>
            </div>
            <div className="border border-slate-300 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Warna Kain / Roll:</span>
              <strong className="text-slate-900 text-xs block">
                {order.fabricColor}
              </strong>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-600 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center justify-between">
            <span>
              Estimasi Pengambilan Kain Roll di Gudang: <strong>± {totalEstFabricMeters} Meter</strong> ({order.totalPcs} pcs × ~{estMetersPerPiece} m)
            </span>
            <span>Toleransi Jahit: ±1 cm standard</span>
          </div>
        </div>

        {/* TABEL REKAPITULASI UKURAN BESAR & JELAS */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-slate-900 text-white px-2.5 py-1.5 rounded-t-lg">
            <h3 className="text-xs font-extrabold uppercase tracking-wider">
              2. TABEL DISTRIBUSI UKURAN (TOTAL: {order.totalPcs} PCS)
            </h3>
            <span className="text-[10px] font-bold text-amber-300">
              *Wajib Dicocokkan Saat Pemotongan & Obras
            </span>
          </div>

          <table className="w-full text-center border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-slate-100 font-bold text-slate-800">
                <th className="border border-slate-400 py-1.5 px-2">Size S</th>
                <th className="border border-slate-400 py-1.5 px-2">Size M</th>
                <th className="border border-slate-400 py-1.5 px-2">Size L</th>
                <th className="border border-slate-400 py-1.5 px-2">Size XL</th>
                <th className="border border-slate-400 py-1.5 px-2">Size XXL</th>
                <th className="border border-slate-400 py-1.5 px-2">Size XXXL</th>
                <th className="border border-slate-400 py-1.5 px-2">Custom</th>
                <th className="border border-slate-900 py-1.5 px-2 bg-slate-800 text-white">
                  TOTAL PCS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-extrabold text-sm text-slate-900">
                <td className="border border-slate-400 py-2.5">{order.sizeBreakdown.S || 0}</td>
                <td className="border border-slate-400 py-2.5">{order.sizeBreakdown.M || 0}</td>
                <td className="border border-slate-400 py-2.5">{order.sizeBreakdown.L || 0}</td>
                <td className="border border-slate-400 py-2.5">{order.sizeBreakdown.XL || 0}</td>
                <td className="border border-slate-400 py-2.5">{order.sizeBreakdown.XXL || 0}</td>
                <td className="border border-slate-400 py-2.5">{order.sizeBreakdown.XXXL || 0}</td>
                <td className="border border-slate-400 py-2.5">{order.sizeBreakdown.custom || 0}</td>
                <td className="border border-slate-900 py-2.5 bg-slate-100 text-base font-black text-emerald-950">
                  {order.totalPcs} pcs
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BORDIR KOMPUTER & DAFTAR NAMA */}
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-2.5 py-1 mb-2 rounded flex items-center justify-between">
            <span>3. INSTRUKSI BORDIR KOMPUTER & LOGO</span>
            <span className="text-[10px] font-semibold text-slate-700 capitalize">
              Tipe: {order.embroideryType.replace(/_/g, ' ')}
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Daftar Nama Santri / Siswa */}
            <div className={order.embroideryLogoUrl ? 'sm:col-span-8' : 'sm:col-span-12'}>
              {order.embroideryItems && order.embroideryItems.length > 0 ? (
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="py-1 px-2 w-8 text-center">No</th>
                        <th className="py-1 px-2">Nama Lengkap Santri / Guru (Bordir Dada)</th>
                        <th className="py-1 px-2 w-16 text-center">Ukuran</th>
                        <th className="py-1 px-2 w-20 text-center">Posisi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {order.embroideryItems.slice(0, 15).map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-1 px-2 text-center text-slate-500">{idx + 1}</td>
                          <td className="py-1 px-2 font-bold text-slate-800">{item.name}</td>
                          <td className="py-1 px-2 text-center font-mono font-bold text-emerald-900">
                            {item.size}
                          </td>
                          <td className="py-1 px-2 text-center text-slate-500">
                            {item.position || 'Dada Kanan'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {order.embroideryItems.length > 15 && (
                    <div className="p-1 bg-slate-50 text-center text-[10px] text-slate-500">
                      (+ {order.embroideryItems.length - 15} nama lainnya terlampir pada lembar print lanjutan)
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 border border-dashed border-slate-300 rounded-lg text-[11px] text-slate-500 text-center">
                  Tidak ada daftar nama bordir per orangan (Bordir logo umum / polosan).
                </div>
              )}
            </div>

            {/* Logo Preview */}
            {order.embroideryLogoUrl && (
              <div className="sm:col-span-4 border border-slate-300 p-2.5 rounded-lg text-center">
                <span className="text-[10px] font-bold text-slate-600 block mb-1">
                  Sampel File Logo Bordir:
                </span>
                <img
                  src={order.embroideryLogoUrl}
                  alt="Logo"
                  className="max-h-24 mx-auto object-contain border border-slate-200 p-1 rounded-lg"
                />
                <span className="text-[9px] text-slate-500 block mt-1">
                  Posisi: Dada Kiri / Saku
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CATATAN KHUSUS */}
        {order.specialNotes && (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-[11px]">
            <strong className="text-amber-900 block font-bold text-[10px] uppercase">
              Catatan Khusus dari Pemesan:
            </strong>
            <p className="text-amber-950 mt-0.5">{order.specialNotes}</p>
          </div>
        )}

        {/* QUALITY CONTROL CHECKLIST */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-slate-200 px-2.5 py-1 mb-2 rounded">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              4. LEMBAR KONTROL MUTU & QUALITY CONTROL (QC) BENGKEL
            </h3>
            <span className="text-[10px] text-slate-500 italic no-print">
              (Bisa diklik untuk centang langsung di layar)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
            {[
              'Pola & Ukuran Sesuai Standar Konveksi (±1 cm)',
              'Jahitan Obras Rapi & Rapat (Benang 4)',
              'Bordir Nama & Logo Tajam, Benang Rapi',
              'Kancing & Lubang Kancing Kuat & Presisi',
              'Bersih Bebas Noda Minyak Mesin Jahit',
              'Setrika Uap & Packing Plastik Per Pcs',
            ].map((checkText, idx) => {
              const isChecked = qcChecks[idx];
              return (
                <div
                  key={idx}
                  onClick={() => {
                    const next = [...qcChecks];
                    next[idx] = !next[idx];
                    setQcChecks(next);
                  }}
                  className={`flex items-center gap-2 border p-2 rounded-lg cursor-pointer transition select-none ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                      : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </div>
                  <span>{checkText}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TANDA TANGAN TIM PRODUKSI */}
        <div className="pt-4 border-t-2 border-slate-900">
          <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
            <div>
              <span className="text-slate-500 block">1. Meja Potong</span>
              <div className="h-12 border-b border-dashed border-slate-400" />
              <span className="text-slate-800 font-semibold block mt-1">( ....................... )</span>
            </div>
            <div>
              <span className="text-slate-500 block">2. Penjahit & Bordir</span>
              <div className="h-12 border-b border-dashed border-slate-400" />
              <span className="text-slate-800 font-semibold block mt-1">( ....................... )</span>
            </div>
            <div>
              <span className="text-slate-500 block">3. QC & Setrika Uap</span>
              <div className="h-12 border-b border-dashed border-slate-400" />
              <span className="text-slate-800 font-semibold block mt-1">( ....................... )</span>
            </div>
            <div>
              <span className="text-slate-500 block">4. Pimpinan Bengkel</span>
              <div className="h-12 border-b border-dashed border-slate-400" />
              <span className="text-slate-900 font-bold block mt-1">
                {config.ownerTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
