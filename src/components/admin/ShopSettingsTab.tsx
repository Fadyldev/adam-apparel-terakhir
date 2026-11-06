import { useState, type FormEvent } from 'react';
import { normalizeWa } from '@/lib/format';
import { parseWholeNumber } from '@/lib/ids';
import { useDb } from '@/store/useDb';
import type { BankAccount, ShopSettings, ShopStat } from '@/lib/schema';
import Field, { inputClass } from '@/components/ui/Field';
import { AdminNotice, AdminPanel, adminPrimaryButton, adminSecondaryButton } from '@/components/admin/adminUi';
import { Plus, Trash2 } from 'lucide-react';
import { DEFAULT_TICKER_ITEMS } from '@/components/Ticker';

type Draft = Pick<
  ShopSettings,
  'shopName' | 'tagline' | 'sinceYear' | 'description' | 'address' | 'waNumber' | 'accounts' | 'stats' | 'promoTicker'
>;

export default function ShopSettingsTab() {
  const { db, update } = useDb();
  const { shopSettings } = db;
  const [draft, setDraft] = useState<Draft>({
    shopName: shopSettings.shopName,
    tagline: shopSettings.tagline,
    sinceYear: shopSettings.sinceYear,
    description: shopSettings.description,
    address: shopSettings.address,
    waNumber: shopSettings.waNumber,
    accounts: shopSettings.accounts.length > 0 ? shopSettings.accounts : [{ bank: 'BCA', number: '7825-182-990', owner: 'Fadil Anugrah (Adam Apparel)' }],
    stats: shopSettings.stats,
    promoTicker: shopSettings.promoTicker ?? DEFAULT_TICKER_ITEMS.join('\n'),
  });
  const [sinceInput, setSinceInput] = useState(String(shopSettings.sinceYear));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setSaved(false);
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const setAccount = (index: number, patch: Partial<BankAccount>) =>
    setField('accounts', draft.accounts.map((account, i) => (i === index ? { ...account, ...patch } : account)));

  const addAccount = () => {
    if (draft.accounts.length >= 2) {
      alert('Maksimal 2 rekening resmi agar invoice dan nota tetap ringkas.');
      return;
    }
    setField('accounts', [...draft.accounts, { bank: 'BSI', number: '', owner: draft.shopName }]);
  };

  const removeAccount = (index: number) => {
    if (draft.accounts.length <= 1) {
      alert('Minimal harus ada 1 rekening resmi untuk pembayaran DP.');
      return;
    }
    setField('accounts', draft.accounts.filter((_, i) => i !== index));
  };

  const setStat = (index: number, patch: Partial<ShopStat>) =>
    setField('stats', draft.stats.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const since = parseWholeNumber(sinceInput);
    const wa = normalizeWa(draft.waNumber);
    if (!draft.shopName.trim()) return setError('Nama usaha wajib diisi.');
    if (since === null || since < 1900 || since > new Date().getFullYear()) return setError('Tahun berdiri tidak valid.');
    if (!wa) return setError('Nomor WhatsApp tidak valid. Masukkan nomor HP Indonesia yang aktif, misal 081234567890.');
    if (draft.accounts.some((a) => !a.number.trim() || !a.owner.trim())) return setError('Nomor rekening dan nama pemilik rekening wajib diisi.');

    setError('');
    update((current) => ({
      ...current,
      shopSettings: {
        ...current.shopSettings,
        shopName: draft.shopName.trim(),
        tagline: draft.tagline.trim(),
        sinceYear: since,
        description: draft.description.trim(),
        address: draft.address.trim(),
        waNumber: wa,
        promoTicker: draft.promoTicker?.trim() || undefined,
        accounts: draft.accounts.map((a) => ({ bank: a.bank.trim(), number: a.number.trim(), owner: a.owner.trim() })),
        stats: draft.stats.map((s) => ({ ...s, label: s.label.trim(), suffix: s.suffix.trim() })),
      },
    }));
    setSaved(true);
  };

  const [tickerSaved, setTickerSaved] = useState(false);

  const handleSaveTickerOnly = () => {
    update((current) => ({
      ...current,
      shopSettings: {
        ...current.shopSettings,
        promoTicker: draft.promoTicker?.trim() || undefined,
      },
    }));
    setTickerSaved(true);
    setTimeout(() => setTickerSaved(false), 3000);
  };

  const handleResetTicker = () => {
    const defaultText = DEFAULT_TICKER_ITEMS.join('\n');
    setField('promoTicker', defaultText);
  };

  return (
    <div className="space-y-6">
      {/* Teks Promo Berjalan (Ticker) */}
      <AdminPanel
        title="Pengumuman &amp; Promo Berjalan (Running Ticker)"
        description="Tulisan ini berjalan di pita kuning website. Anda bisa mengubah teks yang sedang aktif atau menambah pengumuman baru (satu pengumuman per baris)."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetTicker}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Kembalikan ke Teks Standar
            </button>
            <button
              type="button"
              onClick={handleSaveTickerOnly}
              className="cursor-pointer rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700 active:scale-95"
            >
              {tickerSaved ? '✓ Pengumuman Tersimpan!' : 'Simpan Teks Pengumuman'}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <Field
            label="Daftar Teks Pengumuman (Satu baris = satu teks berjalan)"
            hint="Setiap baris kalimat di bawah ini akan bergulir bergantian di pita kuning website."
          >
            <textarea
              rows={4}
              className={`${inputClass} font-mono text-xs`}
              value={draft.promoTicker || ''}
              onChange={(e) => {
                setTickerSaved(false);
                setField('promoTicker', e.target.value);
              }}
              placeholder="Ketik teks pengumuman per baris..."
            />
          </Field>

          {tickerSaved && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-bold text-emerald-900">
              ✓ Teks pengumuman berhasil disimpan dan langsung berjalan di pita kuning website!
            </div>
          )}
        </div>
      </AdminPanel>

      <form onSubmit={handleSubmit} className="space-y-6">

      <AdminPanel
        title="Identitas Usaha Konveksi"
        description="Nama, deskripsi, dan kontak ini tampil di halaman utama website dan tercetak di Surat Perintah Kerja (SPK)."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama Usaha / Brand">
            <input className={inputClass} value={draft.shopName} onChange={(e) => setField('shopName', e.target.value)} />
          </Field>
          <Field label="Tagline">
            <input className={inputClass} value={draft.tagline} onChange={(e) => setField('tagline', e.target.value)} />
          </Field>
          <Field label="Tahun Berdiri" hint="Ditampilkan sebagai badge Sejak tahun ini.">
            <input inputMode="numeric" className={inputClass} value={sinceInput} onChange={(e) => setSinceInput(e.target.value)} />
          </Field>
          <Field label="Nomor WhatsApp Admin (08xx...)" hint="Bisa ketik 0812... langsung tanpa perlu ngetik kode negara.">
            <input
              inputMode="tel"
              className={inputClass}
              value={draft.waNumber}
              onChange={(e) => setField('waNumber', e.target.value)}
              placeholder="081234567890"
            />
          </Field>
          <Field label="Deskripsi Profil Usaha" className="sm:col-span-2">
            <textarea rows={3} className={inputClass} value={draft.description} onChange={(e) => setField('description', e.target.value)} />
          </Field>
          <Field label="Alamat Workshop / Kantor" className="sm:col-span-2">
            <textarea rows={2} className={inputClass} value={draft.address} onChange={(e) => setField('address', e.target.value)} />
          </Field>
        </div>
      </AdminPanel>

      {/* Rekening Pembayaran DP (Maksimal 2 rekening resmi) */}
      <AdminPanel
        title="Rekening Resmi Pembayaran DP (Maksimal 2 Rekening)"
        description="Dibatasi maksimal 2 rekening resmi (misal: BCA & BSI) agar invoice dan nota cetak thermal tetap rapi dan ringkas."
        action={
          draft.accounts.length < 2 ? (
            <button type="button" onClick={addAccount} className={adminSecondaryButton}>
              <Plus className="h-4 w-4" />
              Tambah Rekening ke-2
            </button>
          ) : undefined
        }
      >
        <div className="space-y-4">
          {draft.accounts.map((account, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {index === 0 ? 'Rekening Utama (Default)' : `Rekening Tambahan #${index + 1}`}
                </span>
                {draft.accounts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAccount(index)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Nama Bank">
                  <input
                    className={inputClass}
                    value={account.bank}
                    onChange={(e) => setAccount(index, { bank: e.target.value })}
                    placeholder="BCA / Mandiri / BRI"
                  />
                </Field>
                <Field label="Nomor Rekening">
                  <input
                    inputMode="numeric"
                    className={inputClass}
                    value={account.number}
                    onChange={(e) => setAccount(index, { number: e.target.value })}
                    placeholder="Contoh: 7825-182-990"
                  />
                </Field>
                <Field label="Atas Nama (Pemilik Rekening)">
                  <input
                    className={inputClass}
                    value={account.owner}
                    onChange={(e) => setAccount(index, { owner: e.target.value })}
                    placeholder="Nama lengkap pemilik rekening"
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminPanel title="Statistik Pengalaman" description="Angka yang tampil pada counter di bawah hero.">
        <div className="grid gap-4 md:grid-cols-2">
          {draft.stats.map((stat, index) => (
            <div key={index} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:grid-cols-3">
              <Field label="Label" className="sm:col-span-3">
                <input className={inputClass} value={stat.label} onChange={(e) => setStat(index, { label: e.target.value })} />
              </Field>
              <Field label="Angka">
                <input
                  inputMode="numeric"
                  className={inputClass}
                  value={String(stat.value)}
                  onChange={(e) => setStat(index, { value: parseWholeNumber(e.target.value) ?? 0 })}
                />
              </Field>
              <Field label="Akhiran">
                <input className={inputClass} value={stat.suffix} onChange={(e) => setStat(index, { suffix: e.target.value })} placeholder="+" />
              </Field>
            </div>
          ))}
        </div>
      </AdminPanel>

      {error && <AdminNotice tone="error">{error}</AdminNotice>}
      {saved && !error && <AdminNotice tone="success">Pengaturan bengkel konveksi berhasil disimpan.</AdminNotice>}

      <div className="flex justify-end">
        <button type="submit" className={adminPrimaryButton}>
          Simpan Semua Pengaturan Bengkel
        </button>
      </div>
    </form>
    </div>
  );
}
