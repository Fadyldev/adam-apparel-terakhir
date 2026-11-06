import { useState, type ReactNode } from 'react';
import { COURIERS, VARIATIONS } from '@/lib/constants';
import type { SizeKey, Sizes, SpkRecord } from '@/lib/schema';
import { calculatePricing } from '@/lib/pricing';
import {
  buildSpkRecord,
  CUSTOM_OPTION,
  nextSpkId,
  spkNumber,
  validateSpkForm,
  type SpkFormState,
} from '@/lib/spk';
import { useDb } from '@/store/useDb';
import type { SpkCustomer } from '@/lib/schema';
import CustomerFields from '@/components/spk/CustomerFields';
import ProductFields from '@/components/spk/ProductFields';
import SizeGrid from '@/components/spk/SizeGrid';
import PriceSummary from '@/components/spk/PriceSummary';
import SpkActions, { type PrintVariant, type SpkNotice } from '@/components/spk/SpkActions';
import SpkSuccessModal from '@/components/spk/SpkSuccessModal';
import SpkPrintModal from '@/components/spk/SpkPrintModal';

const EMPTY_SIZES: Sizes = { S: 0, M: 0, L: 0, XL: 0, XXL: 0, '3XL': 0 };

const EMPTY_CUSTOMER: SpkCustomer = {
  name: '',
  instansi: '',
  wa: '',
  alamat: '',
  courier: COURIERS[0],
  deadline: '',
  notes: '',
};

const EMPTY_FORM: SpkFormState = {
  customer: EMPTY_CUSTOMER,
  catalogId: '',
  customProduct: '',
  fabricId: '',
  customFabric: '',
  colorId: '',
  customColor: '',
  variation: VARIATIONS[0],
  variationDetail: '',
  designLink: '',
  sizes: EMPTY_SIZES,
};

export default function SpkCalculator() {
  const { db, update, selection, setSelection } = useDb();
  const { shopSettings: settings, catalogItems, fabricList, colorList, spkList } = db;
  const [form, setForm] = useState<SpkFormState>(EMPTY_FORM);
  const [attempted, setAttempted] = useState(false);
  const [notice, setNotice] = useState<SpkNotice | null>(null);

  // Modals state
  const [createdSpk, setCreatedSpk] = useState<SpkRecord | null>(null);
  const [printModalSpk, setPrintModalSpk] = useState<{ spk: SpkRecord; variant: PrintVariant } | null>(null);

  const isCustomCatalog = selection.catalogId === CUSTOM_OPTION;
  const catalog = isCustomCatalog
    ? null
    : (catalogItems.find((item) => item.id === selection.catalogId) ?? catalogItems[0]);

  const productFabrics = catalog ? fabricList.filter((fabric) => catalog.fabricIds.includes(fabric.id)) : fabricList;
  const fabricId =
    selection.fabricId === CUSTOM_OPTION || productFabrics.some((f) => f.id === selection.fabricId)
      ? selection.fabricId
      : (productFabrics[0]?.id ?? CUSTOM_OPTION);
  const colorId =
    selection.colorId === CUSTOM_OPTION || colorList.some((c) => c.id === selection.colorId)
      ? selection.colorId
      : (colorList[0]?.id ?? CUSTOM_OPTION);
  const fabric = productFabrics.find((f) => f.id === fabricId);
  const color = colorList.find((c) => c.id === colorId);

  const currentCatalogId = isCustomCatalog ? CUSTOM_OPTION : (catalog?.id ?? '');
  const values: SpkFormState = { ...form, catalogId: currentCatalogId, fabricId, colorId };

  const basePrice = catalog ? catalog.basePrice : 100000;
  const pricing = calculatePricing(
    basePrice,
    fabricId === CUSTOM_OPTION ? 0 : (fabric?.addOnPerPcs ?? 0),
    form.sizes,
  );

  const errors = attempted ? validateSpkForm(values, 0, Boolean(catalog || isCustomCatalog)) : [];

  const updateCustomer = (patch: Partial<SpkCustomer>) =>
    setForm((prev) => ({ ...prev, customer: { ...prev.customer, ...patch } }));
  const updateSize = (key: SizeKey, value: number) =>
    setForm((prev) => ({ ...prev, sizes: { ...prev.sizes, [key]: value } }));
  const updateFields = (patch: Partial<SpkFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const readyToSubmit = () => {
    setAttempted(true);
    return validateSpkForm(values, 0, Boolean(catalog || isCustomCatalog)).length === 0;
  };

  const handleSend = () => {
    if (!readyToSubmit()) {
      setNotice({ tone: 'error', text: 'Mohon lengkapi data pemesan dan pilih jumlah ukuran.' });
      return;
    }
    const id = nextSpkId(settings, spkList);
    const record = buildSpkRecord(values, {
      id,
      createdAt: new Date().toISOString(),
      catalog: catalog ?? undefined,
      fabric,
      color,
    });

    update((current) => ({
      ...current,
      shopSettings: { ...current.shopSettings, spkCounter: spkNumber(id) },
      spkList: [...current.spkList, record],
    }));

    setCreatedSpk(record);
    setForm(EMPTY_FORM);
    setAttempted(false);
    setNotice(null);
  };

  const handlePrint = (variant: PrintVariant) => {
    if (!readyToSubmit()) {
      setNotice({ tone: 'error', text: 'Lengkapi data formulir sebelum mencetak atau preview.' });
      return;
    }
    const tempRecord = buildSpkRecord(values, {
      id: nextSpkId(settings, spkList),
      createdAt: new Date().toISOString(),
      catalog: catalog ?? undefined,
      fabric,
      color,
    });
    setPrintModalSpk({ spk: tempRecord, variant });
  };

  const handleTrackNow = (spkId: string) => {
    setCreatedSpk(null);
    const trackingSection = document.getElementById('lacak');
    if (trackingSection) {
      trackingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const input = document.getElementById('spk-query') as HTMLInputElement | null;
      if (input) {
        input.value = spkId;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const formEl = input.closest('form');
        if (formEl) formEl.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
  };

  return (
    <section id="spk" className="relative mx-auto max-w-6xl scroll-mt-28 px-5 py-20">
      <div id="simulasi-warna" className="absolute -top-28" />
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Kalkulator SPK Digital</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Hitung estimasi &amp; terbitkan SPK resmi dalam satu klik
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Harga dihitung transparan secara otomatis. Setelah terbit, Anda mendapatkan <strong>Nomor SPK resmi</strong> untuk memantau status pengerjaan mulai dari cutting bahan hingga siap dikirim.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <FormCard title="1. Data Pemesan &amp; Pengiriman">
            <CustomerFields customer={form.customer} onChange={updateCustomer} />
          </FormCard>
          <FormCard title="2. Detail Model Pakaian &amp; Bahan">
            <ProductFields
              values={values}
              catalogItems={catalogItems}
              productFabrics={productFabrics}
              colorList={colorList}
              onSelection={setSelection}
              onChange={updateFields}
            />
          </FormCard>
          <FormCard title="3. Rincian Ukuran Pakaian (S - 3XL)">
            <SizeGrid sizes={form.sizes} onChange={updateSize} />
          </FormCard>
        </div>

        <div className="space-y-6 lg:sticky lg:top-28">
          <PriceSummary
            pricing={pricing}
            productName={isCustomCatalog ? (form.customProduct || 'Model Custom') : (catalog?.name ?? 'Pakaian')}
          />
          <SpkActions
            shopName={settings.shopName}
            errors={errors}
            notice={notice}
            onSend={handleSend}
            onPrint={handlePrint}
          />
        </div>
      </div>

      {/* In-App Order Success Modal */}
      {createdSpk && (
        <SpkSuccessModal
          spk={createdSpk}
          settings={settings}
          onClose={() => setCreatedSpk(null)}
          onOpenPrint={() => {
            setPrintModalSpk({ spk: createdSpk, variant: 'a4' });
            setCreatedSpk(null);
          }}
          onTrackNow={handleTrackNow}
        />
      )}

      {/* In-App PDF / Thermal Print Modal */}
      {printModalSpk && (
        <SpkPrintModal
          spk={printModalSpk.spk}
          settings={settings}
          initialVariant={printModalSpk.variant}
          onClose={() => setPrintModalSpk(null)}
        />
      )}
    </section>
  );
}

function FormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur-xl sm:p-8">
      <h3 className="mb-6 text-base font-extrabold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}
