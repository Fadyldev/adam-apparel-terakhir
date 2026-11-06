import { useState, type FormEvent } from 'react';
import { ArrowLeft, ImageOff, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { createId, parseWholeNumber } from '@/lib/ids';
import { useDb } from '@/store/useDb';
import type { PortfolioItem } from '@/lib/schema';
import Field, { inputClass } from '@/components/ui/Field';
import { AdminNotice, AdminPanel, adminDangerButton, adminPrimaryButton, adminSecondaryButton } from '@/components/admin/adminUi';

type Editing = { mode: 'new' } | { mode: 'edit'; item: PortfolioItem } | null;

export default function PortfolioTab() {
  const { db, update } = useDb();
  const [editing, setEditing] = useState<Editing>(null);

  const savePortfolio = (item: PortfolioItem) => {
    update((current) => {
      const exists = current.portfolioList.some((p) => p.id === item.id);
      return {
        ...current,
        portfolioList: exists
          ? current.portfolioList.map((p) => (p.id === item.id ? item : p))
          : [...current.portfolioList, item],
      };
    });
    setEditing(null);
  };

  const deletePortfolio = (item: PortfolioItem) => {
    if (!window.confirm(`Hapus proyek "${item.client}" dari portofolio?`)) return;
    update((current) => ({ ...current, portfolioList: current.portfolioList.filter((p) => p.id !== item.id) }));
  };

  // IF EDITING OR CREATING: RENDER AS DEDICATED FULL SUBPAGE
  if (editing) {
    return (
      <div className="space-y-4">
        {/* Top Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 text-amber-400" />
            <span>← Kembali ke Galeri Portofolio</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span>Portofolio</span>
            <span>/</span>
            <span className="font-bold text-slate-900">
              {editing.mode === 'new' ? 'Tambah Proyek Baru' : `Edit: ${editing.item.client}`}
            </span>
          </div>
        </div>

        <AdminPanel
          title={editing.mode === 'new' ? 'Tambah Dokumentasi Hasil Produksi' : `Edit Proyek: ${editing.item.client}`}
          description="Masukkan nama klien/pesantren, jenis pakaian, jumlah pcs, serta upload foto hasil jadi produk."
        >
          <PortfolioForm
            key={editing.mode === 'new' ? 'new' : editing.item.id}
            initial={editing.mode === 'edit' ? editing.item : null}
            onSave={savePortfolio}
            onCancel={() => setEditing(null)}
          />
        </AdminPanel>
      </div>
    );
  }

  // DEFAULT VIEW: PORTFOLIO GRID
  return (
    <div className="space-y-6">
      <AdminPanel
        title="Portofolio Proyek Busana"
        description="Dokumentasi proyek yang pernah dikerjakan oleh bengkel konveksi. Tampil di bagian Portofolio website."
        action={
          <button type="button" onClick={() => setEditing({ mode: 'new' })} className={adminPrimaryButton}>
            <Plus className="h-4 w-4" />
            Tambah Proyek
          </button>
        }
      >
        {db.portfolioList.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">
            Belum ada proyek di portofolio.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {db.portfolioList.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="flex aspect-[4/3] items-center justify-center bg-slate-100">
                  {item.photoUrl ? (
                    <img src={item.photoUrl} alt={item.client} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <ImageOff className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-extrabold text-slate-900">{item.client}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-600">
                    {item.garment} &bull; {item.quantity} pcs &bull; {item.year}
                  </p>
                  {item.note && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{item.note}</p>}
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing({ mode: 'edit', item })}
                      className={`${adminSecondaryButton} flex-1`}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Foto &amp; Data
                    </button>
                    <button type="button" onClick={() => deletePortfolio(item)} className={adminDangerButton}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

function PortfolioForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: PortfolioItem | null;
  onSave: (p: PortfolioItem) => void;
  onCancel: () => void;
}) {
  const [client, setClient] = useState(initial?.client ?? '');
  const [garment, setGarment] = useState(initial?.garment ?? '');
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ''));
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? '');
  const [note, setNote] = useState(initial?.note ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const qty = parseWholeNumber(quantity);
    const yr = parseWholeNumber(year);
    if (!client.trim()) return setError('Nama instansi, pesantren, atau komunitas wajib diisi.');
    if (!garment.trim()) return setError('Jenis pakaian wajib diisi.');
    if (qty === null || qty < 1) return setError('Jumlah produksi harus berupa angka lebih dari 0.');
    if (yr === null || yr < 2000) return setError('Tahun proyek tidak valid.');
    const url = photoUrl.trim();
    if (url && !/^(https?:\/\/|data:image\/)/.test(url)) {
      return setError('Alamat foto harus diawali http://, https:// atau upload file.');
    }
    onSave({
      id: initial?.id ?? createId('pf'),
      client: client.trim(),
      garment: garment.trim(),
      quantity: qty,
      year: yr,
      photoUrl: url,
      note: note.trim(),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Nama Klien / Lembaga / Pesantren">
        <input
          className={inputClass}
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Contoh: Pondok Pesantren Al-Ihsan, Majelis Taklim An-Nur"
        />
      </Field>

      <Field label="Jenis Pakaian">
        <input
          className={inputClass}
          value={garment}
          onChange={(e) => setGarment(e.target.value)}
          placeholder="Jubah Salaf Toyobo, Gamis Santriwati, Kemeja PDH"
        />
      </Field>

      <Field label="Jumlah Produksi (Pcs)">
        <input
          inputMode="numeric"
          className={inputClass}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="100"
        />
      </Field>

      <Field label="Tahun Selesai">
        <input
          inputMode="numeric"
          className={inputClass}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder={String(new Date().getFullYear())}
        />
      </Field>

      {/* Upload Foto Hasil Jadi */}
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-sm font-semibold text-slate-800">
          Foto Hasil Jadi Busana (Upload dari HP/Laptop)
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-amber-400 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100">
            <Upload className="h-4 w-4" />
            <span>Pilih File Foto Busana</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <span className="text-xs text-slate-400 text-center sm:text-left">atau masukkan link URL foto:</span>
          <div className="relative flex-1">
            <input
              className={inputClass}
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://... atau otomatis terisi"
            />
          </div>
        </div>

        {photoUrl && (
          <div className="relative mt-2 h-44 w-60 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs">
            <img src={photoUrl} alt="Preview Portofolio" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setPhotoUrl('')}
              className="absolute right-1.5 top-1.5 cursor-pointer rounded-full bg-slate-900/80 p-1 text-white hover:bg-slate-900"
              title="Hapus foto"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <Field label="Catatan Proyek (Opsional)" className="sm:col-span-2">
        <textarea
          rows={2}
          className={inputClass}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: Produksi 150 pcs jubah salaf katun Toyobo untuk wisuda santri tahfidz angkatan VII."
        />
      </Field>

      {error && (
        <div className="sm:col-span-2">
          <AdminNotice tone="error">{error}</AdminNotice>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end pt-2">
        <button type="button" onClick={onCancel} className={adminSecondaryButton}>
          Batal
        </button>
        <button type="submit" className={adminPrimaryButton}>
          Simpan Proyek
        </button>
      </div>
    </form>
  );
}
