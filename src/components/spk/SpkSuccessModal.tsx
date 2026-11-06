import { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Printer, 
  Search, 
  Share2, 
  CreditCard, 
  Check, 
  Building2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { formatRupiah } from '@/lib/format';
import { buildWaLink, buildStatusMessage } from '@/lib/spk';
import type { SpkRecord, ShopSettings } from '@/lib/schema';

interface SpkSuccessModalProps {
  spk: SpkRecord;
  settings: ShopSettings;
  onClose: () => void;
  onOpenPrint: () => void;
  onTrackNow?: (spkId: string) => void;
}

export default function SpkSuccessModal({
  spk,
  settings,
  onClose,
  onOpenPrint,
  onTrackNow,
}: SpkSuccessModalProps) {
  const [copiedId, setCopiedId] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(spk.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSendWa = () => {
    const waText = `Halo ${settings.shopName}, saya sudah input pesanan baru:\n*Nomor SPK:* ${spk.id}\n*Pemesan:* ${spk.customer.name} (${spk.customer.instansi})\n*Item:* ${spk.item.productName} (${spk.item.fabricName})\n*Total:* ${spk.item.totalPcs} pcs - ${formatRupiah(spk.item.total)}\n*DP (50%):* ${formatRupiah(spk.item.dp)}\n\nMohon konfirmasi dan info nomor rekening untuk pelunasan DP. Terima kasih!`;
    const link = buildWaLink(settings.waNumber, waText);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal open={true} title="Pesanan Berhasil Disimpan" onClose={onClose}>
      <div className="space-y-5">
        {/* Success Header banner */}
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200/80 p-4 flex items-center gap-3.5">
          <div className="rounded-xl bg-emerald-500 text-white p-2.5 shadow-sm">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">SPK Masuk ke Antrean Produksi</h4>
            <p className="text-xs text-emerald-800">
              Surat Perintah Kerja telah dibuat dan tersimpan aman di database kasir.
            </p>
          </div>
        </div>

        {/* SPK ID Card */}
        <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>KODE PELACAKAN / NOMOR SPK</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
              STATUS: {spk.stage.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 tracking-wider">
              {spk.id}
            </span>
            <button
              type="button"
              onClick={copyId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition active:scale-95"
            >
              {copiedId ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin ID</span>
                </>
              )}
            </button>
          </div>
          <div className="text-xs text-slate-300 pt-1 border-t border-slate-800 flex justify-between">
            <span>{spk.customer.name} — {spk.customer.instansi}</span>
            <span className="font-medium text-slate-200">{spk.item.totalPcs} Pcs</span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Total Nilai Pesanan:</span>
            <span className="font-bold text-slate-900">{formatRupiah(spk.item.total)}</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Kewajiban DP (50%):</span>
            <span className="font-bold text-emerald-800">{formatRupiah(spk.item.dp)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Sisa Pelunasan:</span>
            <span className="font-semibold text-slate-800">{formatRupiah(spk.item.remaining)}</span>
          </div>
        </div>

        {/* Bank Account Info */}
        {settings.accounts && settings.accounts.length > 0 && (
          <div className="rounded-2xl border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <CreditCard className="h-4 w-4 text-violet-600" />
              <span>Rekening Pembayaran DP</span>
            </div>
            <div className="space-y-1.5">
              {settings.accounts.slice(0, 2).map((acc, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800">{acc.bank}</span>
                    <span className="text-slate-500 block text-[11px]">a.n. {acc.owner}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 select-all">{acc.number}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleSendWa}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 active:scale-98"
          >
            <Share2 className="h-4 w-4" />
            Kirim Rincian ke WhatsApp
          </button>

          <button
            type="button"
            onClick={onOpenPrint}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md active:scale-98"
          >
            <Printer className="h-4 w-4" />
            Cetak SPK / Invoice
          </button>

          {onTrackNow && (
            <button
              type="button"
              onClick={() => onTrackNow(spk.id)}
              className="sm:col-span-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
            >
              <Search className="h-3.5 w-3.5 text-violet-600" />
              Lacak Pesanan Ini Sekarang
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
