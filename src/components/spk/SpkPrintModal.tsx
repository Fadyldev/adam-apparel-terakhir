import { useState, useRef } from 'react';
import { 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Receipt, 
  ExternalLink, 
  Scissors,
  Building,
  User,
  Calendar,
  Phone,
  Layers
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { formatDate, formatRupiah, normalizeWa } from '@/lib/format';
import { SIZE_KEYS, type SpkRecord, type ShopSettings } from '@/lib/schema';

interface SpkPrintModalProps {
  spk: SpkRecord;
  settings: ShopSettings;
  initialVariant?: 'thermal' | 'a4' | null;
  onClose: () => void;
}

export default function SpkPrintModal({
  spk,
  settings,
  initialVariant = 'a4',
  onClose,
}: SpkPrintModalProps) {
  const [variant, setVariant] = useState<'a4' | 'thermal'>(initialVariant === 'thermal' ? 'thermal' : 'a4');
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const { customer, item } = spk;

  const handlePrint = () => {
    window.print();
  };

  const handleOpenNewTab = () => {
    const printContent = printAreaRef.current?.innerHTML;
    if (!printContent) return;

    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SPK ${spk.id} - ${settings.shopName}</title>
          <style>
            body {
              font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: ${variant === 'thermal' ? '8mm' : '15mm'};
              background: #fff;
              font-size: ${variant === 'thermal' ? '12px' : '13px'};
              line-height: 1.4;
            }
            .thermal-container {
              max-width: 80mm;
              margin: 0 auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 8px 0;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 6px 8px;
              text-align: left;
            }
            th {
              background-color: #f8fafc;
            }
            .header-title {
              font-size: 18px;
              font-weight: 800;
              text-align: center;
              margin-bottom: 4px;
            }
            .header-sub {
              font-size: 11px;
              text-align: center;
              color: #64748b;
              margin-bottom: 12px;
            }
            .divider {
              border-bottom: 1px dashed #94a3b8;
              margin: 10px 0;
            }
            @media print {
              @page {
                size: ${variant === 'thermal' ? '80mm auto' : 'A4 portrait'};
                margin: ${variant === 'thermal' ? '5mm' : '10mm'};
              }
            }
          </style>
        </head>
        <body>
          <div class="${variant === 'thermal' ? 'thermal-container' : ''}">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const copySpkText = () => {
    const text = `=========================================
SURAT PERINTAH KERJA (SPK BENGKEL)
${settings.shopName.toUpperCase()}
No. SPK: ${spk.id}
Tanggal: ${formatDate(spk.createdAt)}
Deadline: ${customer.deadline || '-'}
=========================================
PEMESAN:
Nama: ${customer.name}
Instansi: ${customer.instansi}
WhatsApp: ${customer.wa}
Alamat: ${customer.alamat || '-'}
Pengiriman: ${customer.courier}

DETAIL PRODUKSI:
Produk: ${item.productName}
Bahan: ${item.fabricName}
Warna: ${item.colorName} ${item.colorCode ? `(${item.colorCode})` : ''}
Variasi: ${item.variation || '-'} ${item.variationDetail ? `(${item.variationDetail})` : ''}

RINCIAN UKURAN:
${SIZE_KEYS.map((s) => `${s}: ${item.sizes[s] || 0} pcs`).join(' | ')}
TOTAL: ${item.totalPcs} PCS

BIAYA & PEMBAYARAN:
Harga Satuan: ${formatRupiah(item.unitPrice)}
Total Biaya: ${formatRupiah(item.total)}
Kewajiban DP: ${formatRupiah(item.dp)} (${spk.dpPaid ? 'LUNAS' : 'BELUM DIBAYAR'})
Sisa Pelunasan: ${formatRupiah(item.remaining)} (${spk.fullyPaid ? 'LUNAS' : 'BELUM LUNAS'})
Catatan: ${customer.notes || '-'}
=========================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal open={true} title={`Cetak Dokumen SPK (${spk.id})`} onClose={onClose}>
      <div className="space-y-4">
        {/* Variant toggle bar */}
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setVariant('a4')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
              variant === 'a4'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            Dokumen A4 Standar
          </button>
          <button
            type="button"
            onClick={() => setVariant('thermal')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
              variant === 'thermal'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="h-4 w-4" />
            Struk Kasir Thermal
          </button>
        </div>

        {/* Printable preview box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 max-h-[50vh] overflow-y-auto text-slate-900 shadow-inner">
          <div ref={printAreaRef} id="printable-spk-container">
            {variant === 'a4' ? (
              /* A4 Layout View */
              <div className="space-y-4 text-xs font-sans">
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-black text-slate-950 uppercase tracking-tight">
                      {settings.shopName}
                    </h2>
                    <p className="text-[11px] text-slate-600">{settings.tagline}</p>
                    <p className="text-[10px] text-slate-500">{settings.address} • WA: {settings.waNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono font-bold text-xs">
                      {spk.id}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">Tgl: {formatDate(spk.createdAt)}</p>
                    <p className="text-[10px] font-semibold text-rose-600">Deadline: {customer.deadline || '-'}</p>
                  </div>
                </div>

                {/* Customer & Item Grid */}
                <div className="grid grid-cols-2 gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pemesan & Instansi</p>
                    <p className="font-bold text-slate-900">{customer.name}</p>
                    <p className="text-slate-700">{customer.instansi}</p>
                    <p className="text-slate-600 text-[11px]">WA: {customer.wa}</p>
                    <p className="text-slate-600 text-[11px] truncate">{customer.alamat || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Detail Spesifikasi Pakaian</p>
                    <p className="font-bold text-slate-900">{item.productName}</p>
                    <p className="text-slate-700">Kain: {item.fabricName}</p>
                    <p className="text-slate-700">Warna: {item.colorName} {item.colorCode && `(${item.colorCode})`}</p>
                    <p className="text-slate-600 text-[11px]">Variasi: {item.variation || '-'}</p>
                  </div>
                </div>

                {/* Size breakdown table */}
                <div>
                  <p className="text-[11px] font-bold text-slate-900 mb-1">Rincian Ukuran & Jumlah Pcs</p>
                  <table className="w-full text-center border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-[10px] font-bold text-slate-700">
                        {SIZE_KEYS.map((k) => (
                          <th key={k} className="border border-slate-300 py-1">{k}</th>
                        ))}
                        <th className="border border-slate-300 py-1 bg-slate-200">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="font-bold text-xs text-slate-900">
                        {SIZE_KEYS.map((k) => (
                          <td key={k} className="border border-slate-300 py-1.5">{item.sizes[k] || 0}</td>
                        ))}
                        <td className="border border-slate-300 py-1.5 bg-slate-100 text-slate-950 font-black">
                          {item.totalPcs}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Financial overview */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Harga Satuan (Pcs)</span>
                    <span className="font-bold text-slate-800">{formatRupiah(item.unitPrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Total Nilai Pesanan</span>
                    <span className="font-bold text-slate-900">{formatRupiah(item.total)}</span>
                  </div>
                  <div>
                    <span className="text-emerald-600 block text-[10px] font-semibold">DP (50%)</span>
                    <span className="font-bold text-emerald-700">{formatRupiah(item.dp)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sisa Pelunasan</span>
                    <span className="font-bold text-slate-900">{formatRupiah(item.remaining)}</span>
                  </div>
                </div>

                {/* Notes and signatures */}
                {customer.notes && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                    <strong>Catatan Khusus:</strong> {customer.notes}
                  </div>
                )}

                <div className="grid grid-cols-2 pt-4 text-center text-[10px] text-slate-500">
                  <div>
                    <p>Pemesan / Penanggung Jawab,</p>
                    <div className="h-12"></div>
                    <p className="font-bold text-slate-800">({customer.name})</p>
                  </div>
                  <div>
                    <p>Kepala Bengkel / Kasir,</p>
                    <div className="h-12"></div>
                    <p className="font-bold text-slate-800">({settings.shopName})</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Thermal Receipt View */
              <div className="space-y-2 text-[11px] font-mono text-slate-900 leading-tight">
                <div className="text-center border-b border-dashed border-slate-400 pb-2">
                  <p className="font-black text-sm">{settings.shopName}</p>
                  <p className="text-[10px] text-slate-500">{settings.tagline}</p>
                  <p className="text-[10px] text-slate-500">WA: {settings.waNumber}</p>
                </div>

                <div className="py-1 border-b border-dashed border-slate-300">
                  <p>NO SPK  : {spk.id}</p>
                  <p>TGL     : {formatDate(spk.createdAt)}</p>
                  <p>DEADLINE: {customer.deadline || '-'}</p>
                  <p>PEMESAN : {customer.name} ({customer.instansi})</p>
                </div>

                <div className="py-1 border-b border-dashed border-slate-300">
                  <p className="font-bold">{item.productName}</p>
                  <p>Kain: {item.fabricName}</p>
                  <p>Warna: {item.colorName}</p>
                  <p className="pt-1 font-semibold">UKURAN:</p>
                  <p>{SIZE_KEYS.map((k) => `${k}:${item.sizes[k] || 0}`).join(' ')}</p>
                  <p className="font-bold">TOTAL PCS: {item.totalPcs} PCS</p>
                </div>

                <div className="py-1 border-b border-dashed border-slate-300">
                  <div className="flex justify-between">
                    <span>TOTAL:</span>
                    <span className="font-bold">{formatRupiah(item.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DP (50%):</span>
                    <span className="font-bold">{formatRupiah(item.dp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SISA:</span>
                    <span>{formatRupiah(item.remaining)}</span>
                  </div>
                </div>

                <div className="text-center pt-2 text-[10px] text-slate-500">
                  <p>Terima Kasih atas Kepercayaan Anda</p>
                  <p>Simpan struk ini sebagai bukti pengambilan</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action button toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md active:scale-95"
          >
            <Printer className="h-4 w-4" />
            Cetak Dialog
          </button>

          <button
            type="button"
            onClick={handleOpenNewTab}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition shadow-md shadow-violet-600/20 active:scale-95"
          >
            <ExternalLink className="h-4 w-4" />
            Tab Baru Cetak
          </button>

          <button
            type="button"
            onClick={copySpkText}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Salin Teks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
