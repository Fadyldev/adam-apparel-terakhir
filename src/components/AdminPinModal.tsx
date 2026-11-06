import React, { useState } from 'react';
import { Lock, ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  savedPin: string;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  savedPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = savedPin || '1234';

    if (pin === correctPin) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('PIN Otorisasi salah! Silakan hubungi Administrator atau gunakan PIN default: 1234');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Modal */}
        <div className="bg-slate-950 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 rounded-full hover:bg-slate-850"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Otorisasi Manajemen Workshop</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Akses khusus tim manajemen dan administrasi konveksi untuk verifikasi SPK, antrean jahit, dan pengaturan toko.
          </p>
        </div>

        {/* Body Formulir PIN */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Masukkan PIN Keamanan
            </label>
            <div className="relative max-w-xs mx-auto">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 px-4 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-amber-500 focus:bg-white focus:outline-none transition-all text-slate-900"
                autoFocus
              />
              <KeyRound className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition text-sm cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-amber-500 text-slate-950 font-black rounded-2xl hover:bg-amber-400 transition text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Buka Akses
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-4">
            PIN standar awal: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-600">1234</code>
          </p>
        </form>
      </div>
    </div>
  );
};
