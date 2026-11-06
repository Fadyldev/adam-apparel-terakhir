import { MessageCircle } from 'lucide-react';
import { useDb } from '@/store/useDb';
import { buildWaLink } from '@/lib/spk';

export default function FloatingWaButton() {
  const { db } = useDb();
  const { shopName, waNumber } = db.shopSettings;

  return (
    <a
      href={buildWaLink(waNumber, `Halo Admin ${shopName}, saya ingin konsultasi order/desain pakaian.`)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 z-40 flex cursor-pointer items-center gap-2.5 rounded-full bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white shadow-2xl shadow-emerald-700/40 transition hover:bg-emerald-500 hover:scale-105 active:scale-95 sm:bottom-6 sm:left-6"
      title="Chat WhatsApp Admin / Konsultasi Desain"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
      </span>
      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 fill-white text-emerald-600" />
      <span className="font-bold text-xs sm:text-sm">
        <span className="hidden sm:inline">Konsultasi </span>WhatsApp
      </span>
    </a>
  );
}
