import React, { useState, useEffect } from 'react';
import {
  Calculator,
  CheckCircle2,
  Copy,
  Check,
  Send,
  AlertCircle,
  FileText,
  Upload,
  Sparkles,
  Scissors,
  Building,
  User,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  DollarSign,
  Plus,
  Trash2,
} from 'lucide-react';
import type {
  ApparelType,
  Fabric,
  WorkshopConfig,
  SizeBreakdown,
  EmbroideryItem,
  Order,
} from '../types/index.ts';
import { formatRupiah, buildWhatsAppOrderMessage } from '../utils/formatters.ts';

interface OrderCalculatorProps {
  apparelTypes: ApparelType[];
  fabrics: Fabric[];
  config: WorkshopConfig;
  preselectedFabric?: Fabric | null;
  onOrderCreated: (order: Order) => void;
  onOpenTrackerWithOrder: (orderId: string) => void;
}

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({
  apparelTypes,
  fabrics,
  config,
  preselectedFabric,
  onOrderCreated,
  onOpenTrackerWithOrder,
}) => {
  // Selection states
  const [selectedApparel, setSelectedApparel] = useState<ApparelType>(
    apparelTypes[0] || {}
  );
  const [selectedFabric, setSelectedFabric] = useState<Fabric>(
    preselectedFabric || fabrics[0] || {}
  );
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [customColor, setCustomColor] = useState<string>('');
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);

  // Size breakdown states
  const [sizes, setSizes] = useState<SizeBreakdown>({
    S: 15,
    M: 30,
    L: 40,
    XL: 25,
    XXL: 10,
    XXXL: 0,
    custom: 0,
  });

  // Embroidery states
  const [embroideryType, setEmbroideryType] = useState<
    'tanpa_bordir' | 'nama_dada' | 'logo_sekolah' | 'nama_dan_logo'
  >('nama_dan_logo');
  const [rawNameList, setRawNameList] = useState<string>(
    '1. Ust. Muhammad Wildan (XL)\n2. Ahmad Raihan (L)\n3. Fikri Haikal (L)\n4. Zaid bin Tsabit (M)\n5. Salman Al-Farisi (M)'
  );
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('');

  // Customer info states
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 2 weeks default
    return d.toISOString().split('T')[0];
  });
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync when preselected fabric changes
  useEffect(() => {
    if (preselectedFabric) {
      setSelectedFabric(preselectedFabric);
      if (preselectedFabric.colors.length > 0) {
        setSelectedColor(preselectedFabric.colors[0].name);
      }
    }
  }, [preselectedFabric]);

  // Sync color when fabric changes
  useEffect(() => {
    if (selectedFabric?.colors?.length > 0 && !selectedColor) {
      setSelectedColor(selectedFabric.colors[0].name);
    }
  }, [selectedFabric]);

  // Calculate live totals
  const totalPcs = Object.values(sizes).reduce(
    (acc, val) => acc + (Number(val) || 0),
    0
  );

  // Calculate unit embroidery fee
  let embroideryFeePerPcs = 0;
  if (embroideryType === 'nama_dada') {
    embroideryFeePerPcs = config.embroideryPricePerName;
  } else if (embroideryType === 'logo_sekolah') {
    embroideryFeePerPcs = config.embroideryPricePerLogo;
  } else if (embroideryType === 'nama_dan_logo') {
    embroideryFeePerPcs =
      config.embroideryPricePerName + config.embroideryPricePerLogo;
  }

  // Base apparel unit price
  const baseUnitPrice = selectedApparel?.basePrice || 90000;
  const unitPriceTotal = baseUnitPrice + embroideryFeePerPcs;
  const totalPrice = totalPcs * unitPriceTotal;
  const dpAmountRequired = Math.round(
    totalPrice * (config.minDpPercent / 100)
  );

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Copy Account Number
  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountNumber);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  // Parse embroidery items from raw text
  const parseEmbroideryItems = (): EmbroideryItem[] => {
    if (
      embroideryType === 'tanpa_bordir' ||
      embroideryType === 'logo_sekolah'
    ) {
      return [];
    }

    const lines = rawNameList
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    return lines.map((line, idx) => {
      // extract size if in parentheses e.g. "Ahmad (L)"
      const sizeMatch = line.match(/\(([^)]+)\)/);
      const size = sizeMatch ? sizeMatch[1].trim() : 'L';
      const cleanName = line.replace(/^\d+[\.\-\)]\s*/, '').replace(/\([^)]+\)/, '').trim();

      return {
        id: String(idx + 1),
        name: cleanName || line,
        size,
        position: 'Dada Kanan',
      };
    });
  };

  // Submit Order to Backend
  const handleSubmitOrder = async () => {
    setFormError(null);

    if (!customerName.trim()) {
      setFormError('Nama lengkap pemesan/bendahara wajib diisi.');
      return;
    }
    if (!customerPhone.trim()) {
      setFormError('Nomor WhatsApp aktif wajib diisi untuk verifikasi SPK.');
      return;
    }
    if (!organizationName.trim()) {
      setFormError('Nama Lembaga, Pondok Pesantren, atau Instansi wajib diisi.');
      return;
    }
    if (totalPcs <= 0) {
      setFormError('Jumlah pcs seragam harus lebih dari 0.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeColor = customColor.trim() || selectedColor || 'Sesuai Sampel Kain';
      const activeColorObj = selectedFabric.colors?.find(
        (c) => c.name === activeColor
      );

      const payload = {
        customerName,
        customerPhone,
        organizationName,
        apparelTypeId: selectedApparel.id,
        apparelTypeName: selectedApparel.name,
        fabricId: selectedFabric.id,
        fabricName: selectedFabric.name,
        fabricColor: activeColor,
        fabricColorHex: activeColorObj?.hex || '#1E293B',
        sizeBreakdown: sizes,
        unitPrice: baseUnitPrice,
        embroideryType,
        embroideryFeePerPcs,
        embroideryLogoUrl: logoPreviewUrl,
        embroideryItems: parseEmbroideryItems(),
        specialNotes,
        deadlineDate,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan pesanan');
      }

      setCreatedOrder(data.data);
      onOrderCreated(data.data);
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Card
  if (createdOrder) {
    const waUrl = `https://wa.me/${config.ownerPhone.replace(
      /\D/g,
      ''
    )}?text=${buildWhatsAppOrderMessage(createdOrder, config)}`;

    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 sm:p-8 text-center relative">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
              <CheckCircle2 className="w-10 h-10 text-amber-300" />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
              Alhamdulillah, Pesanan Berhasil Didaftarkan!
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Nomor Order: {createdOrder.id}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-xl mx-auto">
              Data rincian ukuran & kain telah tercatat di sistem bengkel konveksi.
              Silakan selesaikan pembayaran DP 50% untuk mulai pemotongan kain.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* DP Notice Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900 text-sm">
                    Kewajiban DP 50% Belanja Bahan Kain
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Sesuai kesepakatan konveksi borongan, DP 50% sebesar{' '}
                    <span className="font-extrabold text-amber-950 text-sm">
                      {formatRupiah(createdOrder.dpAmountRequired)}
                    </span>{' '}
                    wajib ditransfer di awal. Ustadz akan langsung membelanjakan kain gulungan
                    ke distributor dan membuat pola potong di meja bengkel.
                  </p>
                </div>
              </div>
            </div>

            {/* Rekening Transfer */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Pilihan Rekening Pembayaran DP (Atas Nama Pemilik Usaha)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {config.bankAccounts.map((bank, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">
                        {bank.bank}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 font-mono tracking-wider block mt-1">
                        {bank.accountNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        a.n {bank.accountHolder}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyAccount(bank.accountNumber)}
                      className="mt-3 w-full py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      {copiedAccount === bank.accountNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">
                            Tersalin!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin No. Rekening</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rincian Ringkas Pesanan */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Lembaga / Pondok:</span>
                <span className="font-bold text-slate-900">
                  {createdOrder.organizationName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Pemesan & Kontak:</span>
                <span className="font-semibold text-slate-800">
                  {createdOrder.customerName} ({createdOrder.customerPhone})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Pakaian & Kain:</span>
                <span className="font-semibold text-slate-800">
                  {createdOrder.totalPcs} pcs {createdOrder.apparelTypeName} -{' '}
                  {createdOrder.fabricName} ({createdOrder.fabricColor})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Total Biaya Pesanan:</span>
                <span className="font-bold text-slate-900">
                  {formatRupiah(createdOrder.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-emerald-900 font-bold text-sm bg-emerald-100/60 px-3 py-2 rounded-lg">
                <span>Wajib DP 50% di Awal:</span>
                <span>{formatRupiah(createdOrder.dpAmountRequired)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesanan & Bukti ke WhatsApp Ustadz</span>
              </a>

              <button
                onClick={() => onOpenTrackerWithOrder(createdOrder.id)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Buka Pelacak Pesanan</span>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCreatedOrder(null)}
                className="text-xs text-slate-500 hover:text-emerald-800 font-medium underline"
              >
                + Buat Pesanan Borongan Lainnya
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HIGH-IMPACT ANIMATED HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border border-emerald-800/40 shadow-2xl p-6 sm:p-10 text-white">
        {/* Subtle animated aurora glow background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-float" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-300 border border-emerald-600/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              <span>SISTEM CS & KASIR DIGITAL 24 JAM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Hitung Biaya & Pesan Seragam Borongan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-200 to-teal-300">
                1-Klik Instan
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Solusi otomatis konveksi busana muslim, seragam santri pesantren, madrasah, dan kantor.
              Pecahan ukuran campur (S, M, L, XL, XXL) dihitung otomatis, anti-salah potong pola,
              langsung terbit SPK bengkel dan kalkulasi DP 50% belanja bahan kain.
            </p>

            {/* Quick trust metrics */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5 font-semibold">
                <Scissors className="w-4 h-4 text-amber-300" />
                <span>Obras 4 Benang Rapi</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <Layers className="w-4 h-4 text-amber-300" />
                <span>Kain Rol Distributor Grade A</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Bordir Komputer Tajam</span>
              </div>
            </div>
          </div>

          {/* Hero Right Floating Interactive Visual Cards */}
          <div className="lg:col-span-5 relative flex flex-col gap-3">
            {/* Floating Card 1 */}
            <div className="animate-float glass-dark border border-emerald-700/50 p-4 rounded-2xl shadow-xl hover:border-emerald-400 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center font-black">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Meja Potong & Pola Presisi</span>
                    <span className="text-[11px] text-emerald-300">Pecahan S/M/L/XL sinkron ke penjahit</span>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/40">
                  100% Valid
                </span>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="animate-float-delayed glass-dark border border-amber-500/40 p-4 rounded-2xl shadow-xl hover:border-amber-400 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Kalkulasi Wajib DP 50%</span>
                    <span className="text-[11px] text-amber-200">Beli bahan kain sebelum potong</span>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-600/40">
                  Transparan
                </span>
              </div>
            </div>

            {/* Floating Card 3 */}
            <div className="animate-float glass-dark border border-teal-500/40 p-4 rounded-2xl shadow-xl hover:border-teal-400 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-800/80 text-teal-200 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">SPK Bengkel Otomatis</span>
                    <span className="text-[11px] text-teal-300">Siap print A4 untuk kepala penjahit</span>
                  </div>
                </div>
                <span className="text-xs font-black text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-600/40">
                  1-Klik
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {formError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Sticky Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Wizard / Sections (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* SHOWCASE TEKSTUR BAHAN KAIN ASLI & SPESIFIKASI BENGKEL */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 rounded-3xl p-5 sm:p-6 text-white border border-emerald-900/40 shadow-xl overflow-hidden relative">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                    STANDAR MUTU KAIN BENGKEL ADAM COLLECTION
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {selectedFabric.name} ({selectedFabric.category})
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/60 text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Kain Rol Resmi Pabrik</span>
              </div>
            </div>

            {/* Split Grid: Left Real Texture Macro Photo, Right Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Macro Texture Photo Card */}
              <div className="sm:col-span-5 relative h-48 rounded-2xl overflow-hidden border border-emerald-700/40 shadow-inner group">
                <img
                  src={selectedFabric.image}
                  alt={selectedFabric.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="bg-black/60 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    Tekstur Fisik Asli
                  </span>
                  <span className="text-[11px] font-bold text-white">
                    ± {formatRupiah(selectedFabric.pricePerMeter)} / m
                  </span>
                </div>
              </div>

              {/* Specs & Characteristic Pillars */}
              <div className="sm:col-span-7 space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Sirkulasi Udara:</span>
                    <strong className="text-emerald-300 font-bold block">{selectedFabric.breathability}</strong>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Ketebalan:</span>
                    <strong className="text-white font-bold block">{selectedFabric.thickness}</strong>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Jatuh & Tekstur:</span>
                    <strong className="text-amber-200 font-bold block">{selectedFabric.drapability}</strong>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Komposisi Serat:</span>
                    <strong className="text-slate-200 font-bold block">{selectedFabric.composition}</strong>
                  </div>
                </div>

                <div className="bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/40 text-[11px] flex items-center justify-between">
                  <span className="text-emerald-300 font-medium">
                    Warna Terpilih: <strong className="text-white font-bold">{customColor || selectedColor || 'Putih Bersih'}</strong>
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    Garansi Obras 4 Benang Rapi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 1: MODEL PAKAIAN */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Pilih Model & Jenis Seragam
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Tersedia 5 model spesialis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {apparelTypes.map((apparel) => {
                const isSelected = selectedApparel.id === apparel.id;
                return (
                  <div
                    key={apparel.id}
                    onClick={() => setSelectedApparel(apparel)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900 line-clamp-1">
                          {apparel.name}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {apparel.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">Dasar:</span>
                      <span className="font-extrabold text-emerald-900">
                        {formatRupiah(apparel.basePrice)}/pcs
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 2: BAHAN KAIN & WARNA */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Pilih Bahan Kain & Pilihan Warna
                </h3>
              </div>
              <span className="text-xs text-emerald-800 font-semibold">
                Kain Rol Distributor Resmi
              </span>
            </div>

            {/* Fabrics selector */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {fabrics.map((fabric) => {
                  const isSelected = selectedFabric.id === fabric.id;
                  return (
                    <div
                      key={fabric.id}
                      onClick={() => {
                        setSelectedFabric(fabric);
                        if (fabric.colors?.length > 0) {
                          setSelectedColor(fabric.colors[0].name);
                        }
                      }}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 line-clamp-1">
                          {fabric.name}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                        )}
                      </div>
                      <span className="inline-block text-[10px] text-emerald-800 font-medium bg-emerald-100/70 px-1.5 py-0.5 rounded mt-1">
                        {fabric.category}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {fabric.breathability}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Color swatches */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Pilih Warna Kain ({selectedFabric.name}):
                </span>

                <div className="flex flex-wrap gap-2.5">
                  {selectedFabric.colors?.map((col, idx) => {
                    const isColSelected = selectedColor === col.name && !customColor;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedColor(col.name);
                          setCustomColor('');
                        }}
                        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 transform active:scale-95 ${
                          isColSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/40 shadow-sm -translate-y-0.5'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span className="relative flex items-center justify-center">
                          {isColSelected && (
                            <span className="absolute -inset-1 rounded-full bg-emerald-500/50 animate-radar" />
                          )}
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs relative z-10"
                            style={{ backgroundColor: col.hex }}
                          />
                        </span>
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="Atau ketik warna khusus (misal: Hijau Tosca Pesantren / Mocca Tua)..."
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* STEP 3: GRID INPUT UKURAN (BORONGAN S, M, L, XL, XXL) */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Grid Input Ukuran Seragam Borongan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live Counter otomatis mencegah salah hitung antara nota dan kain bengkel.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSizeChart(true)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1"
                >
                  <span>📏 Panduan Size Chart (cm)</span>
                </button>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Total Pcs</span>
                  <span className="text-xl font-extrabold text-emerald-900">
                    {totalPcs} pcs
                  </span>
                </div>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {(['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'custom'] as (keyof SizeBreakdown)[]).map(
                (sizeKey) => {
                  const label = sizeKey === 'custom' ? 'Custom' : sizeKey;
                  return (
                    <div
                      key={sizeKey}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center focus-within:border-emerald-600 focus-within:bg-emerald-50/20 transition"
                    >
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Ukuran {label}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={sizes[sizeKey] === 0 ? '' : sizes[sizeKey]}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                          setSizes((prev) => ({ ...prev, [sizeKey]: val }));
                        }}
                        placeholder="0"
                        className="w-full text-center font-bold text-base bg-white border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        pcs
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            {/* Dynamic Animated Distribution Visualizer */}
            {totalPcs > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <span className="font-bold flex items-center gap-1.5 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                    Porsi Potong Pola Borongan ({totalPcs} pcs):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(sizes)
                      .filter(([_, qty]) => Number(qty) > 0)
                      .map(([sz, qty]) => {
                        const pct = Math.round((Number(qty) / totalPcs) * 100);
                        return (
                          <span
                            key={sz}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 transition-all hover:bg-emerald-50 hover:border-emerald-300"
                          >
                            <span>{sz}:</span>
                            <span className="text-emerald-900 font-extrabold">{qty} pcs</span>
                            <span className="text-slate-400 text-[10px]">({pct}%)</span>
                          </span>
                        );
                      })}
                  </div>
                </div>

                {/* Animated Segmented Multi-Color Bar */}
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner p-0.5 gap-0.5">
                  {Object.entries(sizes).map(([sz, qty], idx) => {
                    if (Number(qty) <= 0) return null;
                    const pct = (Number(qty) / totalPcs) * 100;
                    const colors = [
                      'bg-emerald-600',
                      'bg-teal-500',
                      'bg-cyan-600',
                      'bg-sky-600',
                      'bg-indigo-600',
                      'bg-purple-600',
                      'bg-amber-600',
                    ];
                    return (
                      <div
                        key={sz}
                        style={{ width: `${pct}%` }}
                        className={`${colors[idx % colors.length]} h-full rounded-xs transition-all duration-500 ease-out relative group`}
                        title={`${sz}: ${qty} pcs (${Math.round(pct)}%)`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* STEP 4: BORDIR KOMPUTER & LOGO */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Bordir Komputer & Logo Sekolah / Pondok
                </h3>
              </div>
              <span className="text-xs text-slate-500">Mesin Bordir Komputer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
              {[
                {
                  id: 'tanpa_bordir',
                  label: 'Tanpa Bordir',
                  fee: 0,
                  sub: 'Polosan standar',
                },
                {
                  id: 'nama_dada',
                  label: 'Bordir Nama Dada',
                  fee: config.embroideryPricePerName,
                  sub: '+Rp 5.000 / pcs',
                },
                {
                  id: 'logo_sekolah',
                  label: 'Bordir Logo Pondok/Sekolah',
                  fee: config.embroideryPricePerLogo,
                  sub: '+Rp 8.000 / pcs',
                },
                {
                  id: 'nama_dan_logo',
                  label: 'Nama + Logo Lengkap',
                  fee:
                    config.embroideryPricePerName + config.embroideryPricePerLogo,
                  sub: '+Rp 13.000 / pcs',
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setEmbroideryType(opt.id as any)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                    embroideryType === opt.id
                      ? 'border-emerald-700 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      {opt.label}
                    </span>
                    {embroideryType === opt.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
                    {opt.sub}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Daftar Nama Bordir */}
            {(embroideryType === 'nama_dada' ||
              embroideryType === 'nama_dan_logo') && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Daftar Nama Bordir Dada (Bisa Tempel / Paste Sekaligus):
                  </label>
                  <span className="text-[11px] text-slate-400">
                    1 nama per baris (cantumkan ukuran di tanda kurung)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={rawNameList}
                  onChange={(e) => setRawNameList(e.target.value)}
                  placeholder="Contoh:&#10;1. Ust. Muhammad Wildan (XL)&#10;2. Ahmad Raihan (L)&#10;3. Fikri Haikal (M)"
                  className="w-full text-xs font-mono border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50/50"
                />
              </div>
            )}

            {/* Upload Logo Sekolah / Pondok */}
            {(embroideryType === 'logo_sekolah' ||
              embroideryType === 'nama_dan_logo') && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Upload Gambar Logo Sekolah / Pondok Pesantren:
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-600 transition bg-slate-50/50 hover:bg-emerald-50/20">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Pilih File Gambar (PNG / JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {logoPreviewUrl && (
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <img
                        src={logoPreviewUrl}
                        alt="Logo Preview"
                        className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-slate-200"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block line-clamp-1">
                          {logoFileName || 'logo-bordir.png'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Siap diprogram ke mesin bordir
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* STEP 5: DATA PEMESAN & DEADLINE */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                  5
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Identitas Lembaga & Deadline
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Lengkap Pemesan / PIC / Bendahara *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Ust. Zulkifli / Bpk. Rudi"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nomor WhatsApp Aktif *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Lembaga / Pondok Pesantren / Sekolah *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Contoh: Ponpes Darul Huffaz / SMA IT Al-Falah"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Target Tanggal Dibutuhkan (Deadline) *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  Catatan Khusus Penjahit & Finishing:
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Misal: Saku baju koko minta sebelah kanan juga ada, resleting gamis wudhu friendly, dll..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Sticky Column: Summary & DP Calculator (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-emerald-800/20 shadow-lg p-6 space-y-5">
            {/* Header Ringkasan */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800">
                  KASIR DIGITAL 24 JAM
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Rincian Biaya Borongan
                </h3>
              </div>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full">
                {totalPcs} pcs
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Model Pakaian:</span>
                <span className="font-bold text-slate-800 text-right">
                  {selectedApparel.name}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Bahan Kain:</span>
                <span className="font-bold text-slate-800 text-right">
                  {selectedFabric.name}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Pilihan Warna:</span>
                <span className="font-bold text-slate-800 text-right">
                  {customColor || selectedColor || '-'}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Harga Dasar / pcs:</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(baseUnitPrice)}
                </span>
              </div>

              {embroideryFeePerPcs > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Bordir / pcs:</span>
                  <span className="font-semibold text-slate-800">
                    +{formatRupiah(embroideryFeePerPcs)}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-between font-semibold text-slate-700">
                <span>Harga Satuan Lengkap:</span>
                <span className="text-emerald-900 font-bold">
                  {formatRupiah(unitPriceTotal)} / pcs
                </span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Total Pcs Masuk Potong:</span>
                <span>× {totalPcs} pcs</span>
              </div>
            </div>

            {/* Total Price Grand */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-slate-500">Total Biaya Pesanan:</span>
                <span className="text-lg font-extrabold text-slate-900">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              {/* DP 50% HIGHLIGHT */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center text-emerald-950 bg-emerald-100/70 p-3 rounded-xl border border-emerald-300">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Wajib DP 50% Awal:
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    Untuk Belanja Roll Kain
                  </span>
                </div>
                <span className="text-lg font-black text-emerald-900">
                  {formatRupiah(dpAmountRequired)}
                </span>
              </div>

              <div className="mt-2 text-right text-[11px] text-slate-500">
                Sisa Pelunasan: {formatRupiah(totalPrice - dpAmountRequired)} (Saat Siap Kirim)
              </div>
            </div>

            {/* Rekening Info Mini */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">
                Rekening Resmi Ustadz:
              </span>
              <span>
                • {config.bankAccounts[0]?.bank}:{' '}
                <strong className="text-slate-900 font-mono">
                  {config.bankAccounts[0]?.accountNumber}
                </strong>{' '}
                (a.n {config.bankAccounts[0]?.accountHolder})
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || totalPcs <= 0}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition ${
                totalPcs <= 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/25 active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <span>Memproses Pesanan...</span>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>Daftarkan Pesanan & Buat SPK</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Setelah tombol diklik, nomor order resmi (ADAM-...) akan diterbitkan dan Anda
              dapat langsung meneruskan rincian lengkap ke WhatsApp Mas El / Bapak.
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY FLOATING BOTTOM BAR */}
      {totalPcs > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total:</span>
              <span className="text-sm font-extrabold text-slate-900">{totalPcs} pcs</span>
              <span className="text-xs text-slate-400">({formatRupiah(totalPrice)})</span>
            </div>
            <div className="text-[11px] text-emerald-800 font-extrabold">
              Wajib DP 50%: {formatRupiah(dpAmountRequired)}
            </div>
          </div>

          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center gap-1.5"
          >
            <span>Pesan Sekarang</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Panduan Ukuran Standar (Size Chart cm)
                </h3>
                <span className="text-xs text-slate-500">
                  Ukuran konveksi {selectedApparel.name}
                </span>
              </div>
              <button
                onClick={() => setShowSizeChart(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3 border border-slate-200">Ukuran</th>
                    <th className="py-2 px-3 border border-slate-200">Lebar Dada (LD)</th>
                    <th className="py-2 px-3 border border-slate-200">Panjang Baju</th>
                    <th className="py-2 px-3 border border-slate-200">Panjang Lengan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { size: 'S', ld: '100 - 102 cm', pj: '68 - 70 cm', pl: '56 cm' },
                    { size: 'M', ld: '104 - 106 cm', pj: '70 - 72 cm', pl: '58 cm' },
                    { size: 'L', ld: '108 - 110 cm', pj: '72 - 74 cm', pl: '60 cm' },
                    { size: 'XL', ld: '114 - 116 cm', pj: '74 - 76 cm', pl: '62 cm' },
                    { size: 'XXL', ld: '120 - 122 cm', pj: '76 - 78 cm', pl: '63 cm' },
                    { size: 'XXXL', ld: '126 - 128 cm', pj: '78 - 80 cm', pl: '64 cm' },
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-extrabold text-emerald-900 border border-slate-200 bg-emerald-50/50">
                        {row.size}
                      </td>
                      <td className="py-2 px-3 border border-slate-200">{row.ld}</td>
                      <td className="py-2 px-3 border border-slate-200">{row.pj}</td>
                      <td className="py-2 px-3 border border-slate-200">{row.pl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              *Toleransi jahitan standar konveksi ±1 cm. Jika ada ukuran khusus di luar standar (misal anak kecil / ukuran jumbo 4XL), silakan isi di kolom Custom.
            </p>

            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition"
            >
              Mengerti & Kembali ke Formulir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
