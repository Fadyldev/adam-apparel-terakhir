import { CloudOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function NetworkBadge() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-40 flex max-w-[calc(100%-9rem)] items-center gap-2 rounded-full border border-amber-300 bg-amber-50/95 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-md backdrop-blur-xl sm:bottom-6 sm:left-6"
    >
      <CloudOff className="h-3.5 w-3.5 shrink-0 text-amber-700" />
      <span className="truncate">Mode Offline (Data Tersimpan Aman)</span>
    </div>
  );
}
