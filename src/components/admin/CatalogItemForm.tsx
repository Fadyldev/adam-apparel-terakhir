import { useState, type FormEvent, type ChangeEvent } from 'react';
import { createId, parseWholeNumber } from '@/lib/ids';
import { ICON_KEYS, type CatalogItem, type Fabric, type IconKey } from '@/lib/schema';
import Field, { inputClass } from '@/components/ui/Field';
import { adminPrimaryButton, adminSecondaryButton, AdminNotice } from '@/components/admin/adminUi';
import { Upload, X } from 'lucide-react';

const ICON_LABELS: Record<IconKey, string> = {
  jubah: '🥼 Jubah / Thobe Salaf Pria',
  koko: '👔 Kurta, Koko & Sirwal Pria',
  gamis: '👗 Gamis & Abaya Akhwat Syar’i',
  khimar: '🧕 Khimar, Hijab & Bergo Syar’i',
  pdh: '🧥 Kemeja PDH / Seragam Santri & Pondok',
  kaos: '👕 Kaos Dakwah & Komunitas Kajian',
  jaket: '🧥 Rompi & Jaket Angkatan Pesantren',
  custom: '✂️ Model Custom / Khusus',
  shirt: 'Kaos Standar Distro',
  briefcase: 'Kemeja Formal Kantor',
  award: 'Polo Shirt Bordir',
  flame: 'Hoodie & Zipper',
  trophy: 'Jersey Santri & Olahraga',
  layers: 'Koleksi Umum / Lainnya',
};

interface CatalogItemFormProps {
  initial: CatalogItem | null;
  fabricList: Fabric[];
  onSave: (item: CatalogItem) => void;
  onCancel: () => void;
}

export default function CatalogItemForm({ initial, fabricList, onSave, onCancel }: CatalogItemFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [iconKey, setIconKey] = useState<IconKey>(initial?.iconKey ?? 'jubah');
  const [basePrice, setBasePrice] = useState(String(initial?.basePrice ?? ''));
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [highlights, setHighlights] = useState((initial?.highlights ?? []).join('\n'));
  const [fabricIds, setFabricIds] = useState<string[]>(initial?.fabricIds ?? []);
  const [errors, setErrors] = useState<string[]>([]);

  const toggleFabric = (id: string) =>
    setFabricIds((current) => (current.includes(id) ? current.filter((f) => f !== id) : [...current, id]));

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = parseWholeNumber(basePrice);
    const problems: string[] = [];
    if (!name.trim()) problems.push('Nama produk wajib diisi.');
    if (price === null) problems.push('Harga dasar harus berupa angka.');
    if (problems.length > 0) {
      setErrors(problems);
      return;
    }
    onSave({
      id: initial?.id ?? createId('cat'),
      name: name.trim(),
      iconKey,
      basePrice: price ?? 0,
      minOrder: 1,
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim(),
      highlights: highlights.split('\n').map((line) => line.trim()).filter(Boolean),
      fabricIds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Nama Model Pakaian">
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Jubah Salaf Premium, Gamis Akhwat Fodu"
        />
      </Field>

      <Field label="Kategori Busana">
        <select className={inputClass} value={iconKey} onChange={(e) => setIconKey(e.target.value as IconKey)}>
          <optgroup label="Spesialis Busana Muslim &amp; Pondok Pesantren">
            <option value="jubah">{ICON_LABELS.jubah}</option>
            <option value="koko">{ICON_LABELS.koko}</option>
            <option value="gamis">{ICON_LABELS.gamis}</option>
            <option value="khimar">{ICON_LABELS.khimar}</option>
            <option value="pdh">{ICON_LABELS.pdh}</option>
            <option value="kaos">{ICON_LABELS.kaos}</option>
            <option value="jaket">{ICON_LABELS.jaket}</option>
            <option value="custom">{ICON_LABELS.custom}</option>
          </optgroup>
          <optgroup label="Kategori Tambahan Lainnya">
            <option value="award">{ICON_LABELS.award}</option>
            <option value="flame">{ICON_LABELS.flame}</option>
            <option value="trophy">{ICON_LABELS.trophy}</option>
            <option value="shirt">{ICON_LABELS.shirt}</option>
            <option value="briefcase">{ICON_LABELS.briefcase}</option>
            <option value="layers">{ICON_LABELS.layers}</option>
          </optgroup>
        </select>
      </Field>

      <Field label="Harga Estimasi per Pcs (Rp)" hint="Harga sebelum bahan tambahan dan variasi sablon/bordir.">
        <input
          inputMode="numeric"
          className={inputClass}
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          placeholder="165000"
        />
      </Field>

      {/* Upload Foto Produk */}
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-sm font-semibold text-slate-800">
          Foto Produk Busana (Upload Langsung dari Galeri HP/Laptop)
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-amber-400 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100">
            <Upload className="h-4 w-4" />
            <span>Pilih File Foto Baju</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <span className="text-xs text-slate-400 text-center sm:text-left">atau masukkan link URL foto:</span>
          <div className="relative flex-1">
            <input
              className={inputClass}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... atau hasil upload otomatis"
            />
          </div>
        </div>

        {/* Image Preview */}
        {imageUrl && (
          <div className="relative mt-2 h-40 w-52 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
            <img src={imageUrl} alt="Preview Foto Produk" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute right-1.5 top-1.5 cursor-pointer rounded-full bg-slate-900/80 p-1 text-white hover:bg-slate-900"
              title="Hapus foto"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <Field label="Deskripsi Produk" className="sm:col-span-2">
        <textarea
          rows={2}
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan karakteristik pakaian, kenyamanan bahan, dan potongan pola..."
        />
      </Field>

      <Field label="Keunggulan &amp; Spesifikasi Jahitan (Satu baris per poin)" className="sm:col-span-2">
        <textarea
          rows={3}
          className={inputClass}
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="Contoh:&#10;Kerah shanghai tegak rapi&#10;Bahan Toyobo Fodu adem tidak menerawang&#10;Jahitan stik balik kokoh & awet"
        />
      </Field>

      {/* Pilihan Bahan yang didukung */}
      <fieldset className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <legend className="px-1 text-sm font-bold text-slate-900">
          Kain yang Cocok untuk Model Ini (Otomatis dari Tab Bahan &amp; Warna)
        </legend>
        <p className="mb-3 text-xs text-slate-600">
          Centang kain yang boleh dipilih pemesan untuk model pakaian ini. Opsi kain ini otomatis sinkron dengan daftar bahan di tab "Bahan &amp; Warna".
        </p>

        {fabricList.length === 0 ? (
          <p className="text-sm text-slate-600">Belum ada bahan. Tambahkan bahan di tab Bahan &amp; Warna.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {fabricList.map((fabric) => (
              <label
                key={fabric.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                  fabricIds.includes(fabric.id)
                    ? 'border-amber-400 bg-amber-50/60 font-semibold text-amber-950'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-amber-600"
                  checked={fabricIds.includes(fabric.id)}
                  onChange={() => toggleFabric(fabric.id)}
                />
                <span className="flex-1">
                  <span>{fabric.name}</span>
                  <span className="ml-1 text-xs text-slate-500">({fabric.gsm} gsm)</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      {errors.length > 0 && (
        <div className="sm:col-span-2">
          <AdminNotice tone="error">{errors.join(' ')}</AdminNotice>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end pt-2">
        <button type="button" onClick={onCancel} className={adminSecondaryButton}>
          Batal
        </button>
        <button type="submit" className={adminPrimaryButton}>
          Simpan Produk
        </button>
      </div>
    </form>
  );
}
