import { useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { createId } from '@/lib/ids';
import { useDb } from '@/store/useDb';
import type { ColorItem } from '@/lib/schema';
import Field, { inputClass } from '@/components/ui/Field';
import { AdminNotice, AdminPanel, adminDangerButton, adminPrimaryButton, adminSecondaryButton } from '@/components/admin/adminUi';

type Editing = { mode: 'new' } | { mode: 'edit'; color: ColorItem } | null;

// Preset warna garmen terpopuler di Indonesia
const GARMENT_COLOR_PRESETS = [
  { name: 'Hitam Jetblack', hex: '#0f172a', code: 'JB' },
  { name: 'Putih Solid', hex: '#f8fafc', code: 'WH' },
  { name: 'Abu Misty Muda (M71)', hex: '#cbd5e1', code: 'M71' },
  { name: 'Abu Misty Tua (M81)', hex: '#64748b', code: 'M81' },
  { name: 'Abu Semen', hex: '#94a3b8', code: 'AS' },
  { name: 'Biru Navy / Dongker', hex: '#1e293b', code: 'NV' },
  { name: 'Biru Benhur / Royal', hex: '#2563eb', code: 'BH' },
  { name: 'Biru Turkis', hex: '#0284c7', code: 'TK' },
  { name: 'Biru Baby / Pastel', hex: '#93c5fd', code: 'BB' },
  { name: 'Merah Maroon', hex: '#881337', code: 'MR' },
  { name: 'Merah Cabe / Scarlet', hex: '#dc2626', code: 'RC' },
  { name: 'Hijau Army / Tentara', hex: '#3f4f34', code: 'AR' },
  { name: 'Hijau Botol / Emerald', hex: '#064e3b', code: 'BG' },
  { name: 'Hijau Sage / Earth', hex: '#78866b', code: 'SG' },
  { name: 'Kuning Mustard / Kunyit', hex: '#d97706', code: 'MS' },
  { name: 'Cokelat Mocca / Coffee', hex: '#78543e', code: 'MC' },
  { name: 'Terracotta / Merah Bata', hex: '#9a3412', code: 'TC' },
  { name: 'Ungu Lilac / Lavender', hex: '#c084fc', code: 'LL' },
  { name: 'Cokelat Kopi Tua', hex: '#451a03', code: 'CK' },
];

export default function ColorSection() {
  const { db, update } = useDb();
  const [editing, setEditing] = useState<Editing>(null);

  const saveColor = (color: ColorItem) => {
    update((current) => {
      const exists = current.colorList.some((c) => c.id === color.id);
      return {
        ...current,
        colorList: exists ? current.colorList.map((c) => (c.id === color.id ? color : c)) : [...current.colorList, color],
      };
    });
    setEditing(null);
  };

  const deleteColor = (color: ColorItem) => {
    if (!window.confirm(`Hapus warna "${color.name}" dari palet?`)) return;
    update((current) => ({ ...current, colorList: current.colorList.filter((c) => c.id !== color.id) }));
  };

  const quickAddPreset = (preset: typeof GARMENT_COLOR_PRESETS[0]) => {
    if (db.colorList.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) {
      alert(`Warna "${preset.name}" sudah ada di daftar.`);
      return;
    }
    const nextNumber = db.colorList.length + 1;
    saveColor({
      id: createId('col'),
      name: preset.name,
      code: `${preset.code}-${String(nextNumber).padStart(2, '0')}`,
      hex: preset.hex,
    });
  };

  return (
    <AdminPanel
      title="Palet Warna Kain Garment"
      description="Pilih dari katalog warna standar konveksi atau buat warna baru secara visual tanpa perlu menghafal kode HEX internet."
      action={
        editing === null ? (
          <button type="button" onClick={() => setEditing({ mode: 'new' })} className={adminPrimaryButton}>
            <Plus className="h-4 w-4" />
            Tambah Warna Manual
          </button>
        ) : null
      }
    >
      {/* 1-Click Preset Colors for Easy Operation */}
      <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50/60 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
          <Sparkles className="h-4 w-4 text-amber-600" />
          Koleksi Warna Standar Konveksi (1-Klik Tambah ke Web):
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Bapak atau admin tinggal klik tombol warna di bawah ini, warna langsung masuk ke katalog tanpa perlu ngetik kode hex atau kode warna.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {GARMENT_COLOR_PRESETS.map((preset) => {
            const alreadyExists = db.colorList.some(
              (c) => c.name.toLowerCase() === preset.name.toLowerCase() || c.hex.toLowerCase() === preset.hex.toLowerCase(),
            );
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => quickAddPreset(preset)}
                disabled={alreadyExists}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                  alreadyExists
                    ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-default'
                    : 'border-slate-300 bg-white text-slate-800 shadow-sm hover:border-amber-400 hover:bg-amber-50 cursor-pointer'
                }`}
              >
                <span className="h-3.5 w-3.5 rounded-full border border-black/20" style={{ backgroundColor: preset.hex }} />
                <span>{preset.name}</span>
                {alreadyExists && <Check className="h-3 w-3 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {editing && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-white p-5 shadow-md">
          <h4 className="mb-4 text-sm font-extrabold text-slate-900">
            {editing.mode === 'new' ? 'Tambah Warna Baru' : `Edit ${editing.color.name}`}
          </h4>
          <ColorForm
            key={editing.mode === 'new' ? 'new' : editing.color.id}
            initial={editing.mode === 'edit' ? editing.color : null}
            existingCount={db.colorList.length}
            onSave={saveColor}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {db.colorList.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">Belum ada warna. Klik salah satu warna cepat di atas.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {db.colorList.map((color) => (
            <li key={color.id} className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <span className="h-10 w-10 shrink-0 rounded-full border-2 border-white ring-2 ring-slate-300 shadow" style={{ backgroundColor: color.hex }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-900">{color.name}</p>
                <p className="text-xs text-slate-500">Kode: {color.code}</p>
              </div>
              <button type="button" aria-label={`Edit ${color.name}`} onClick={() => setEditing({ mode: 'edit', color })} className={`${adminSecondaryButton} px-2.5 py-1.5`}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button type="button" aria-label={`Hapus ${color.name}`} onClick={() => deleteColor(color)} className={`${adminDangerButton} px-2.5 py-1.5`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </AdminPanel>
  );
}

function ColorForm({
  initial,
  existingCount,
  onSave,
  onCancel,
}: {
  initial: ColorItem | null;
  existingCount: number;
  onSave: (c: ColorItem) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [code, setCode] = useState(initial?.code ?? '');
  const [hex, setHex] = useState(initial?.hex ?? '#0f172a');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return setError('Nama warna wajib diisi.');
    const generatedCode = code.trim() || `WRN-${String(existingCount + 1).padStart(2, '0')}`;
    const validHex = hex.startsWith('#') ? hex : `#${hex}`;

    onSave({
      id: initial?.id ?? createId('col'),
      name: name.trim(),
      code: generatedCode,
      hex: validHex.toLowerCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nama Warna Kain">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Misal: Hijau Botol, Abu Misty" />
      </Field>

      <Field label="Kode Warna (Opsional, Otomatis)" hint="Boleh dikosongkan, sistem akan buat kode otomatis.">
        <input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Contoh: HB-01" />
      </Field>

      <Field label="Pilih Warna Visual" className="sm:col-span-2" hint="Klik lingkaran warna di bawah untuk memilih warna yang diinginkan.">
        <div className="flex items-center gap-3">
          <input
            type="color"
            aria-label="Pilih warna visual"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="h-12 w-16 cursor-pointer rounded-xl border border-slate-300 bg-white p-1"
          />
          <span className="text-xs text-slate-500">Klik kotak untuk membuka pemilih warna.</span>
        </div>
      </Field>

      {error && (
        <div className="sm:col-span-2">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={adminSecondaryButton}>
          Batal
        </button>
        <button type="submit" className={adminPrimaryButton}>
          Simpan Warna
        </button>
      </div>
    </form>
  );
}
