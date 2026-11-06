import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Eye, Layers, Rotate3d, Image as ImageIcon } from 'lucide-react';
import { useDb } from '@/store/useDb';
import Mannequin3DCanvas from './Mannequin3DCanvas';

interface OutfitLook {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  recommendedFabric: string;
  minOrder: number;
  pricePerPcs: number;
  models: {
    label: string;
    image: string;
    desc: string;
  }[];
  palette: {
    name: string;
    hex: string;
  }[];
  specPoints: string[];
}

export default function InteractiveShowcase() {
  const { db, setSelection } = useDb();

  // Koleksi Tampilan Busana Berdasarkan Data Konveksi Adam Apparel
  const outfitLooks: OutfitLook[] = useMemo(() => [
    {
      id: 'kemeja-pdh',
      name: 'Kemeja PDH & PDL Korporat',
      subtitle: 'Standar Seragam Kantor, Mahasiswa & Instansi Pemerintah',
      category: 'Kemeja & Seragam Kantor',
      recommendedFabric: 'American Drill 1919 / Japan Drill Original',
      minOrder: 12,
      pricePerPcs: 95000,
      models: [
        {
          label: 'Tampak Depan (Saku Tutup & Pangkat)',
          image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
          desc: 'Jahitan stik balik ganda dengan ventilasi jaring punggung adem.',
        },
        {
          label: 'Detail Bordir Komputer Tajam',
          image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
          desc: 'Kerapatan benang 12.000 tusukan, presisi logo dada & lengan.',
        },
        {
          label: 'Paduan Warna Navy & Khaki',
          image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
          desc: 'Pola slim-fit atau reguler ergonomis untuk mobilitas tinggi.',
        },
      ],
      palette: [
        { name: 'Midnight Navy', hex: '#0f172a' },
        { name: 'Khaki Pemda', hex: '#a38f78' },
        { name: 'Pure White', hex: '#f8fafc' },
        { name: 'Army Olive', hex: '#3f4e3c' },
      ],
      specPoints: [
        'Kain tebal bertekstur twill halus, tidak mudah kusut',
        'Kancing laser grafir atau kancing standar serasi warna kain',
        'Double jahitan rantai pada bahu dan lengan anti-jebol',
      ],
    },
    {
      id: 'jubah-gamis',
      name: 'Jubah & Gamis Santri Premium',
      subtitle: 'Spesialis Busana Pesantren, Asatidz & Majelis Taklim',
      category: 'Busana Muslim & Santri',
      recommendedFabric: 'Toyobo Fodu Import / Katun Madinah Eksklusif',
      minOrder: 12,
      pricePerPcs: 110000,
      models: [
        {
          label: 'Model Saudi Kerah Kaku',
          image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=1000&q=80',
          desc: 'Potongan A-Line longgar syar’i dengan manset kancing elegan.',
        },
        {
          label: 'Tekstur Kain Jatuh & Adem',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
          desc: 'Serat katun alami menyerap keringat seharian di cuaca tropis.',
        },
        {
          label: 'Jubah Pesantren Kombinasi',
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
          desc: 'Pilihan list kerah minimalis atau bordir kaligrafi dada.',
        },
      ],
      palette: [
        { name: 'Putih Bersih', hex: '#ffffff' },
        { name: 'Hitam Jetblack', hex: '#111827' },
        { name: 'Sage Green', hex: '#78866b' },
        { name: 'Abu Semen Melange', hex: '#94a3b8' },
      ],
      specPoints: [
        'Kerah dilapisi viselin premium tidak letoy dicuci berkali-kali',
        'Kain jatuh lemas, tidak menerawang saat beribadah',
        'Kantong dalam multifungsi untuk handphone & kitab saku',
      ],
    },
    {
      id: 'jas-almamater',
      name: 'Jas Almamater & Blazer Angkatan',
      subtitle: 'Standar Kampus, Pondok Modern, BEM & Organisasi Profesi',
      category: 'Jas & Blazer Formal',
      recommendedFabric: 'Nagoya / High Twist Millenium Berfuring Penuh',
      minOrder: 20,
      pricePerPcs: 125000,
      models: [
        {
          label: 'Tampak Depan Penuh Wibawa',
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
          desc: 'Bahu terstruktur dengan busa padding impor tidak kempes.',
        },
        {
          label: 'Furing Dormeuil Sejuk',
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
          desc: 'Lapisan dalam licin, sejuk bersentuhan kulit saat acara formal.',
        },
        {
          label: 'Emblem Bordir Padat',
          image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
          desc: 'Warna benang bordir metalik emas/perak anti-luntur.',
        },
      ],
      palette: [
        { name: 'Kuning Kunyit Kampus', hex: '#eab308' },
        { name: 'Maroon Kebanggaan', hex: '#831843' },
        { name: 'Biru Benhur', hex: '#1d4ed8' },
        { name: 'Hijau Lumut', hex: '#14532d' },
      ],
      specPoints: [
        'Dilengkapi furing dormeuil full body hingga ujung lengan',
        'Busa pundak kualitas garmen untuk siluet gagah dan tegap',
        'Saku dalam paspor/dompet plus dua saku tutup luar rapi',
      ],
    },
    {
      id: 'kaos-polo',
      name: 'Kaos Santri & Polo Shirt Acara',
      subtitle: 'Outfit Seragam Olahraga, Outbound, Reuni & Kegiatan Komunitas',
      category: 'Kaos & Polo Garment',
      recommendedFabric: 'Cotton Combed 24s Reaktif / Lacoste Pique CVC',
      minOrder: 24,
      pricePerPcs: 65000,
      models: [
        {
          label: 'Polo Shirt Kerah Rajut',
          image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80',
          desc: 'Kerah tidak mudah keriting setelah puluhan kali siklus cuci.',
        },
        {
          label: 'Kaos Santri Cotton Combed',
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
          desc: '100% serat kapas reaktif lembut, adem luar biasa menyerap keringat.',
        },
        {
          label: 'Sablon DTF & Plastisol HD',
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
          desc: 'Teknologi sablon tahan tarik mesin cuci tanpa retak.',
        },
      ],
      palette: [
        { name: 'Hitam Solid', hex: '#18181b' },
        { name: 'Putih Natural', hex: '#fafafa' },
        { name: 'Navy Blue', hex: '#1e3a8a' },
        { name: 'Merah Cabe', hex: '#b91c1c' },
      ],
      specPoints: [
        'Kain cotton combed murni 100% tanpa campuran polyester panas',
        'Jahitan pundak rantai dengan rib leher elastis kuat anti-melar',
        'Pilihan sablon plastisol elastis atau bordir emblem komputer',
      ],
    },
  ], []);

  // State
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d'); // DEFAULT: 3D MANNEQUIN INTERACTIVE

  const currentOutfit = outfitLooks[selectedOutfitIndex];
  const activeColor = currentOutfit.palette[activeColorIndex] || currentOutfit.palette[0];

  // Aksi Klik: Transfer data langsung ke Formulir Pembuatan SPK di bawah
  const handleSelectToOrder = () => {
    const matchedCatalog = db.catalogItems.find(
      (c) => c.name.toLowerCase().includes(currentOutfit.name.split(' ')[0].toLowerCase())
    ) || db.catalogItems[0];

    if (matchedCatalog) {
      setSelection({
        catalogId: matchedCatalog.id,
        fabricId: matchedCatalog.fabricIds[0] || '',
      });
    }

    const spkSection = document.getElementById('spk');
    if (spkSection) {
      spkSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="portofolio" className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 text-white">
      {/* Background Studio Grid & Ambient Light */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[45rem] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Seksi - Gaya Minimalis & Mewah */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/60 px-3.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Studio Pameran Busana Interaktif 3D</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Portofolio Produksi &amp; Karakter Busana
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-400">
              Putar manekin 3D 360° secara langsung, sesuaikan warna tekstur bahan, atau beralih ke galeri foto hasil jahit garmen riil.
            </p>
          </div>

          {/* Toggle Mode: 3D Manekin vs Galeri Foto */}
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setViewMode('3d')}
              className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all ${
                viewMode === '3d'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rotate3d className="h-4 w-4" />
              <span>Manekin 3D Interaktif</span>
            </button>
            <button
              onClick={() => setViewMode('photo')}
              className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all ${
                viewMode === 'photo'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Foto Asli Garment</span>
            </button>
          </div>
        </div>

        {/* Navigasi Kategori Cepat */}
        <div className="mt-6 flex flex-wrap gap-2">
          {outfitLooks.map((outfit, idx) => {
            const active = idx === selectedOutfitIndex;
            return (
              <button
                key={outfit.id}
                onClick={() => {
                  setSelectedOutfitIndex(idx);
                  setActiveModelIndex(0);
                  setActiveColorIndex(0);
                }}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  active
                    ? 'bg-white text-slate-950 shadow-lg scale-105'
                    : 'border border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {outfit.name.split('&')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Panggung Interaktif Utama (Spatial Stage Model) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* KOLOM KIRI & TENGAH (Panggung 3D / Foto) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="relative rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 p-3 sm:p-5 shadow-2xl backdrop-blur-xl">
              {/* LAYAR UTAMA: 3D WebGL vs Foto 2D */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950">
                {viewMode === '3d' ? (
                  // KANVAS 3D REAL (THREE.JS)
                  <Mannequin3DCanvas
                    colorHex={activeColor.hex}
                    category={currentOutfit.category}
                    name={currentOutfit.name}
                  />
                ) : (
                  // TAMPILAN FOTO ASLI (2D HIGH-RES)
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentOutfit.id}-${activeModelIndex}-${activeColor.name}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative h-full w-full"
                    >
                      <img
                        src={currentOutfit.models[activeModelIndex].image}
                        alt={currentOutfit.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
                      <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
                        <p className="text-xs font-bold text-amber-400">
                          {currentOutfit.models[activeModelIndex].label}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-300">
                          {currentOutfit.models[activeModelIndex].desc}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Thumbnails Pemilih Sudut Pandang Foto (Jika di mode foto) atau Panduan di Mode 3D */}
              {viewMode === 'photo' ? (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                  {currentOutfit.models.map((mod, mIdx) => {
                    const isCurrent = mIdx === activeModelIndex;
                    return (
                      <button
                        key={mod.label}
                        onClick={() => setActiveModelIndex(mIdx)}
                        className={`group relative cursor-pointer overflow-hidden rounded-xl border p-2 text-left transition-all ${
                          isCurrent
                            ? 'border-amber-400 bg-amber-400/10 shadow-md shadow-amber-400/10'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                            <img
                              src={mod.image}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[11px] font-bold truncate ${isCurrent ? 'text-amber-400' : 'text-slate-300'}`}>
                              {mod.label.split('(')[0].trim()}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Eye className="h-2.5 w-2.5" /> Lihat Detil
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-400">
                  <span className="flex items-center gap-2 font-medium">
                    <Rotate3d className="h-4 w-4 text-amber-400" />
                    Manekin 3D berputar otomatis. Drag mouse / usap layar HP untuk melihat detail jahitan dari segala arah.
                  </span>
                  <button
                    onClick={() => setViewMode('photo')}
                    className="cursor-pointer font-bold text-amber-400 hover:text-amber-300 underline"
                  >
                    Buka Foto Asli
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: Panel Spesifikasi & Tombol Tindakan Cepat */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between h-full space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                <Layers className="h-3.5 w-3.5" /> Standar Garment Grade A
              </span>
              <h3 className="mt-1 text-2xl font-black text-white">{currentOutfit.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{currentOutfit.subtitle}</p>

              {/* Rekomendasi Kain */}
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Rekomendasi Kain Baku:
                </p>
                <p className="mt-0.5 text-sm font-bold text-amber-300">
                  {currentOutfit.recommendedFabric}
                </p>
              </div>

              {/* Selector Warna Interaktif (Merubah Warna 3D Langsung) */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Ubah Warna Manekin 3D:</span>
                  <span className="text-xs font-semibold text-amber-400">{activeColor.name}</span>
                </div>
                <div className="mt-2.5 flex items-center gap-2.5">
                  {currentOutfit.palette.map((col, cIdx) => (
                    <button
                      key={col.name}
                      onClick={() => setActiveColorIndex(cIdx)}
                      title={col.name}
                      className={`group relative h-9 w-9 cursor-pointer rounded-full border-2 transition-all ${
                        cIdx === activeColorIndex
                          ? 'border-amber-400 scale-110 shadow-lg shadow-amber-400/30'
                          : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    >
                      {cIdx === activeColorIndex && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className={`h-4 w-4 ${col.hex === '#ffffff' || col.hex === '#fafafa' ? 'text-slate-900' : 'text-white'}`} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Poin Keunggulan Jahitan */}
              <div className="mt-5 space-y-2 border-t border-slate-800 pt-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Spesifikasi Jahit Konveksi:
                </p>
                {currentOutfit.specPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Info Estimasi & Minimal Order */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                <div>
                  <p className="text-[11px] text-slate-400">Estimasi Mulai Dari:</p>
                  <p className="text-xl font-black text-amber-400">
                    Rp {currentOutfit.pricePerPcs.toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-slate-400"> /pcs</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Min. Order Borongan:</p>
                  <p className="text-sm font-bold text-white">{currentOutfit.minOrder} pcs</p>
                </div>
              </div>

              {/* Tombol Aksi 1 Pintu Menuju SPK */}
              <button
                onClick={handleSelectToOrder}
                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3.5 px-4 text-sm font-black text-slate-950 shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-400 hover:scale-[1.02] active:scale-95"
              >
                <span>Pesan &amp; Hitung Estimasi SPK Model Ini</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Langsung terhubung ke kalkulator otomatis &amp; draft cetak SPK</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
