import { type ChangeEvent } from 'react';
import { VARIATIONS } from '@/lib/constants';
import { formatRupiah } from '@/lib/format';
import { CUSTOM_OPTION, type SpkFormState } from '@/lib/spk';
import type { CatalogItem, ColorItem, Fabric } from '@/lib/schema';
import type { Selection } from '@/store/context';
import Field, { inputClass } from '@/components/ui/Field';
import { Upload, X, Image as ImageIcon, Video, Sparkles } from 'lucide-react';

interface ProductFieldsProps {
  values: SpkFormState;
  catalogItems: CatalogItem[];
  productFabrics: Fabric[];
  colorList: ColorItem[];
  onSelection: (patch: Partial<Selection>) => void;
  onChange: (patch: Partial<SpkFormState>) => void;
}

export default function ProductFields({
  values,
  catalogItems,
  productFabrics,
  colorList,
  onSelection,
  onChange,
}: ProductFieldsProps) {
  const isCustomCatalog = values.catalogId === CUSTOM_OPTION;
  const isCustomFabric = values.fabricId === CUSTOM_OPTION;
  const isCustomColor = values.colorId === CUSTOM_OPTION;

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran file foto maksimal 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ customPhotoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {/* 1. Model Pakaian (Katalog Toko ATAU Custom Sendiri) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">1. Model Pakaian</span>
          {isCustomCatalog && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Mode Custom
            </span>
          )}
        </div>
        <select
          className={inputClass}
          value={values.catalogId}
          onChange={(e) => {
            const val = e.target.value;
            onSelection({ catalogId: val, fabricId: val === CUSTOM_OPTION ? CUSTOM_OPTION : '' });
            if (val !== CUSTOM_OPTION) {
              onChange({ customProduct: '' });
            }
          }}
        >
          {catalogItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
          <option value={CUSTOM_OPTION}>+ Model Khusus / Custom Desain Sendiri</option>
        </select>
        {isCustomCatalog && (
          <input
            className={inputClass}
            value={values.customProduct || ''}
            onChange={(e) => onChange({ customProduct: e.target.value })}
            placeholder="Tulis nama model baju, misal: Jubah Salaf Kancing Kayu / Rompi Santri"
            autoFocus
          />
        )}
      </div>

      {/* 2. Pilihan Bahan Kain (Pilihan Toko ATAU Custom Sendiri) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">2. Pilihan Bahan Kain</span>
          {isCustomFabric && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Kain Custom
            </span>
          )}
        </div>
        <select
          className={inputClass}
          disabled={isCustomFabric}
          value={isCustomFabric ? '' : values.fabricId}
          onChange={(e) => onSelection({ fabricId: e.target.value })}
        >
          {productFabrics.map((fabric) => (
            <option key={fabric.id} value={fabric.id}>
              {fabric.name} ({fabric.gsm} gsm){fabric.addOnPerPcs > 0 ? ` +${formatRupiah(fabric.addOnPerPcs)}/pcs` : ''}
            </option>
          ))}
        </select>
        <label className="mt-1 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200">
          <input
            type="checkbox"
            className="h-4 w-4 accent-amber-600 rounded"
            checked={isCustomFabric}
            onChange={(e) =>
              onSelection({ fabricId: e.target.checked ? CUSTOM_OPTION : (productFabrics[0]?.id ?? '') })
            }
          />
          Request Kain Lain / Bawa Bahan Sendiri
        </label>
        {isCustomFabric && (
          <input
            className={inputClass}
            value={values.customFabric}
            onChange={(e) => onChange({ customFabric: e.target.value })}
            placeholder="Tulis jenis kain, misal: Katun Toyobo Fodu, Drill Verlando, Oxford"
          />
        )}
      </div>

      {/* 3. Pilihan Warna Kain (Palet Toko ATAU Custom) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">3. Warna Kain</span>
          {isCustomColor && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Warna Khusus
            </span>
          )}
        </div>
        <select
          className={inputClass}
          value={values.colorId}
          onChange={(e) => onSelection({ colorId: e.target.value })}
        >
          {colorList.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name} ({color.code})
            </option>
          ))}
          <option value={CUSTOM_OPTION}>+ Warna Khusus / Kombinasi Warna Custom</option>
        </select>
        {isCustomColor && (
          <input
            className={inputClass}
            value={values.customColor}
            onChange={(e) => onChange({ customColor: e.target.value })}
            placeholder="Tulis nama warna, misal: Hijau Sage Tua / Navy Kombinasi Putih"
          />
        )}
      </div>

      {/* 4. Variasi Sablon / Bordir Komputer */}
      <Field label="4. Variasi Sablon / Bordir Komputer">
        <select className={inputClass} value={values.variation} onChange={(e) => onChange({ variation: e.target.value })}>
          {VARIATIONS.map((variation) => (
            <option key={variation} value={variation}>
              {variation}
            </option>
          ))}
        </select>
      </Field>

      {/* 5. Detail Spesifikasi Bordir / Kantong / Kancing */}
      <Field 
        label="5. Detail Spesifikasi Bordir, Kantong &amp; Kancing" 
        className="sm:col-span-2" 
        hint="Tulis letak logo bordir (misal dada kiri 7cm), posisi kantong, kancing, atau puring."
      >
        <textarea
          rows={3}
          className={inputClass}
          value={values.variationDetail}
          onChange={(e) => onChange({ variationDetail: e.target.value })}
          placeholder="Contoh: Bordir logo pesantren di dada kiri 7x7 cm, saku samping kanan-kiri, kancing kerah shanghai tersembunyi"
        />
      </Field>

      {/* 6. UPLOAD FOTO CONTOH DESAIN / SKETSA SENDIRI (Fitur Unggulan Pembeli) */}
      <div className="sm:col-span-2 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
              <ImageIcon className="h-4 w-4 text-amber-600" />
              Upload Foto / Sketsa Desain Anda Sendiri
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Punya contoh baju sendiri? Foto dan upload langsung dari galeri HP Anda (JPG/PNG).
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95 shrink-0">
            <Upload className="h-4 w-4 text-amber-400" />
            <span>Pilih Foto dari HP</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {/* Live Image Preview if uploaded */}
        {values.customPhotoUrl && (
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-amber-200 bg-white p-3 shadow-xs">
            <img
              src={values.customPhotoUrl}
              alt="Preview Desain Pembeli"
              className="h-16 w-16 rounded-lg object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Foto Desain Berhasil Dilampirkan!
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Foto ini akan otomatis tercatat di nota SPK digital Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ customPhotoUrl: '' })}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600"
              title="Hapus foto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 7. Link Video / Google Drive / File Desain Besar */}
      <Field 
        label="7. Link Video / Google Drive Desain (Opsional)" 
        className="sm:col-span-2"
        hint="Jika punya video detail pakaian atau file desain besar di Google Drive / Canva, tempel linknya di sini."
      >
        <div className="relative">
          <input
            className={inputClass}
            value={values.designLink}
            onChange={(e) => onChange({ designLink: e.target.value })}
            placeholder="https://drive.google.com/... atau https://canva.com/..."
          />
        </div>
      </Field>
    </div>
  );
}
