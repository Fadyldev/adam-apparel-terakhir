import { useState } from 'react';
import { Pencil, Plus, Trash2, Sparkles, ArrowLeft } from 'lucide-react';
import { CATALOG_ICONS } from '@/lib/icons';
import { formatRupiah } from '@/lib/format';
import { useDb } from '@/store/useDb';
import type { CatalogItem } from '@/lib/schema';
import CatalogItemForm from '@/components/admin/CatalogItemForm';
import { AdminPanel, adminDangerButton, adminPrimaryButton, adminSecondaryButton } from '@/components/admin/adminUi';

type Editing = { mode: 'new' } | { mode: 'edit'; item: CatalogItem } | null;

export default function CatalogTab() {
  const { db, update } = useDb();
  const [editing, setEditing] = useState<Editing>(null);

  const saveItem = (item: CatalogItem) => {
    update((current) => {
      const exists = current.catalogItems.some((existing) => existing.id === item.id);
      return {
        ...current,
        catalogItems: exists
          ? current.catalogItems.map((existing) => (existing.id === item.id ? item : existing))
          : [...current.catalogItems, item],
      };
    });
    setEditing(null);
  };

  const deleteItem = (item: CatalogItem) => {
    if (!window.confirm(`Hapus model pakaian "${item.name}" dari katalog?`)) return;
    update((current) => ({ ...current, catalogItems: current.catalogItems.filter((c) => c.id !== item.id) }));
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
            <span>← Kembali ke Daftar Katalog</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span>Katalog &amp; Harga</span>
            <span>/</span>
            <span className="font-bold text-slate-900">
              {editing.mode === 'new' ? 'Tambah Produk Baru' : `Edit: ${editing.item.name}`}
            </span>
          </div>
        </div>

        <AdminPanel
          title={editing.mode === 'new' ? 'Tambah Model Busana Baru' : `Edit Model: ${editing.item.name}`}
          description="Atur nama, kategori busana, harga dasar estimasi, upload foto langsung dari HP, dan centang kain yang cocok."
        >
          <CatalogItemForm
            key={editing.mode === 'new' ? 'new' : editing.item.id}
            initial={editing.mode === 'edit' ? editing.item : null}
            fabricList={db.fabricList}
            onSave={saveItem}
            onCancel={() => setEditing(null)}
          />
        </AdminPanel>
      </div>
    );
  }

  // DEFAULT VIEW: CATALOG ITEMS GRID
  return (
    <div className="space-y-6">
      <AdminPanel
        title="Katalog Produk &amp; Harga"
        description="Atur model pakaian yang tampil di website beserta foto produk, harga estimasi, dan spesifikasi bahannya."
        action={
          <button type="button" onClick={() => setEditing({ mode: 'new' })} className={adminPrimaryButton}>
            <Plus className="h-4 w-4" />
            Tambah Produk Baru
          </button>
        }
      >
        {db.catalogItems.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">
            Belum ada produk. Tambahkan produk pertama Anda.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {db.catalogItems.map((item) => {
              const Icon = CATALOG_ICONS[item.iconKey] || Sparkles;
              return (
                <article key={item.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-start gap-4">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
                        <Icon className="h-6 w-6" />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.fabricIds.length} pilihan bahan yang didukung</p>
                      <p className="mt-1 text-sm font-black text-amber-800">{formatRupiah(item.basePrice)}/pcs</p>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">{item.description}</p>

                  <div className="mt-4 flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditing({ mode: 'edit', item })}
                      className={`${adminSecondaryButton} flex-1`}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Foto &amp; Harga
                    </button>
                    <button type="button" onClick={() => deleteItem(item)} className={adminDangerButton}>
                      <Trash2 className="h-4 w-4" />
                      Hapus
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
