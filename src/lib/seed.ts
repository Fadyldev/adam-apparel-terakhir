import { DEFAULT_PIN } from '@/lib/constants';
import { calculatePricing } from '@/lib/pricing';
import { formatSpkId } from '@/lib/spk';
import type { AppDb, Fabric, SpkRecord, Sizes, StageId } from '@/lib/schema';

const FABRICS: Fabric[] = [
  { id: 'fab-cotton-24s', name: 'Cotton Combed 24s', gsm: 180, addOnPerPcs: 0, note: 'Adem, menyerap keringat, tidak luntur' },
  { id: 'fab-cotton-30s', name: 'Cotton Combed 30s', gsm: 160, addOnPerPcs: 3000, note: 'Lebih halus dan ringan' },
  { id: 'fab-cvc-pique', name: 'CVC Lacoste Pique', gsm: 220, addOnPerPcs: 8000, note: 'Tekstur pique untuk polo premium' },
  { id: 'fab-american-drill', name: 'American Drill', gsm: 280, addOnPerPcs: 10000, note: 'Kuat dan rapi untuk seragam dinas' },
  { id: 'fab-japan-drill', name: 'Japan Drill Verlando', gsm: 300, addOnPerPcs: 15000, note: 'Jatuh kain rapi, standar kampus' },
  { id: 'fab-fleece-280', name: 'Cotton Fleece 280 gsm', gsm: 280, addOnPerPcs: 25000, note: 'Tebal, hangat, bulu awet' },
  { id: 'fab-fleece-330', name: 'Cotton Fleece 330 gsm', gsm: 330, addOnPerPcs: 35000, note: 'Paling tebal untuk jaket angkatan' },
  { id: 'fab-dryfit-milano', name: 'Dryfit Milano', gsm: 150, addOnPerPcs: 5000, note: 'Ringan dan cepat kering untuk jersey' },
  { id: 'fab-dryfit-sublim', name: 'Dryfit Sublimasi Full Print', gsm: 140, addOnPerPcs: 8000, note: 'Cocok untuk cetak full print' },
];

const COLORS = [
  { id: 'col-jet-black', name: 'Jet Black', code: 'JB-01', hex: '#111827' },
  { id: 'col-deep-navy', name: 'Deep Navy', code: 'DN-02', hex: '#1e293b' },
  { id: 'col-emerald', name: 'Emerald Bottle Green', code: 'EB-03', hex: '#064e3b' },
  { id: 'col-maroon', name: 'Crimson Maroon', code: 'CM-04', hex: '#881337' },
  { id: 'col-sage', name: 'Earth Sage', code: 'ES-05', hex: '#4b5563' },
  { id: 'col-broken-white', name: 'Broken White', code: 'BW-06', hex: '#f8fafc' },
  { id: 'col-mustard', name: 'Mustard Gold', code: 'MG-07', hex: '#b45309' },
];

const EMPTY_SIZES: Sizes = { S: 0, M: 0, L: 0, XL: 0, XXL: 0, '3XL': 0 };

function buildSpk(
  number: number,
  stage: StageId,
  dpPaid: boolean,
  fullyPaid: boolean,
  input: {
    createdAt: string;
    name: string;
    instansi: string;
    wa: string;
    alamat: string;
    courier: string;
    deadline: string;
    notes: string;
    catalogId: string;
    productName: string;
    basePrice: number;
    fabricId: string;
    variation: string;
    variationDetail: string;
    sizes: Partial<Sizes>;
  },
): SpkRecord {
  const sizes: Sizes = { ...EMPTY_SIZES, ...input.sizes };
  const fabric = FABRICS.find((f) => f.id === input.fabricId);
  const color = COLORS[0];
  const pricing = calculatePricing(input.basePrice, fabric?.addOnPerPcs ?? 0, sizes);
  return {
    id: formatSpkId(number),
    createdAt: input.createdAt,
    stage,
    dpPaid,
    fullyPaid,
    customer: {
      name: input.name,
      instansi: input.instansi,
      wa: input.wa,
      alamat: input.alamat,
      courier: input.courier,
      deadline: input.deadline,
      notes: input.notes,
    },
    item: {
      catalogId: input.catalogId,
      productName: input.productName,
      fabricName: fabric?.name ?? '',
      isCustomFabric: false,
      colorName: color.name,
      colorCode: color.code,
      variation: input.variation,
      variationDetail: input.variationDetail,
      designLink: '',
      sizes,
      totalPcs: pricing.totalPcs,
      unitPrice: pricing.unitPrice,
      bigSizeFee: pricing.bigSizeFee,
      total: pricing.total,
      dp: pricing.dp,
      remaining: pricing.remaining,
      tierLabel: pricing.tier.label,
    },
  };
}

export function createSeedDb(): AppDb {
  const spkList: SpkRecord[] = [
    buildSpk(1, 'siap', true, true, {
      createdAt: '2026-10-02T08:30:00.000Z',
      name: 'Rizky Pratama',
      instansi: 'Komunitas Pemuda Sehat Bandung',
      wa: '081234567801',
      alamat: 'Jl. Dago No. 12, Bandung',
      courier: 'JNE',
      deadline: '2026-10-25',
      notes: 'Kirim sebelum acara gathering',
      catalogId: 'cat-kaos',
      productName: 'Kaos Custom',
      basePrice: 85000,
      fabricId: 'fab-cotton-24s',
      variation: 'Sablon Plastisol',
      variationDetail: 'Logo depan dada 10x10 cm, nama punggung 25 cm',
      sizes: { S: 10, M: 20, L: 20, XL: 10, XXL: 5 },
    }),
    buildSpk(2, 'sablon', true, false, {
      createdAt: '2026-10-20T10:15:00.000Z',
      name: 'Dewi Anggraini',
      instansi: 'PT Maju Bersama Logistik',
      wa: '081234567802',
      alamat: 'Jl. Gatot Subroto, Jakarta Selatan',
      courier: 'J&T',
      deadline: '2026-11-20',
      notes: 'Seragam PDH untuk karyawan lapangan',
      catalogId: 'cat-pdh',
      productName: 'Kemeja PDH/PDL',
      basePrice: 150000,
      fabricId: 'fab-american-drill',
      variation: 'Bordir Komputer',
      variationDetail: 'Logo perusahaan dada kiri 6 cm, bordir nama dada kanan',
      sizes: { M: 30, L: 40, XL: 30, '3XL': 10 },
    }),
    buildSpk(3, 'antrean', false, false, {
      createdAt: '2026-11-01T14:45:00.000Z',
      name: 'Hendra Saputra',
      instansi: 'Angkatan 2016 SMA Negeri 3',
      wa: '081234567803',
      alamat: 'Jl. Veteran No. 4, Semarang',
      courier: 'Ambil Sendiri',
      deadline: '2026-12-05',
      notes: 'Jaket angkatan, lengan kiri ada nama',
      catalogId: 'cat-hoodie',
      productName: 'Hoodie & Zipper',
      basePrice: 185000,
      fabricId: 'fab-fleece-330',
      variation: 'Bordir Komputer',
      variationDetail: 'Logo angkatan punggung 20 cm, nama lengan kiri',
      sizes: { M: 15, L: 15, XL: 10 },
    }),
  ];

  return {
    shopSettings: {
      shopName: 'Adam Apparel & Collection',
      tagline: 'Solusi Konveksi & Garment Terpercaya',
      sinceYear: 2016,
      description:
        'Spesialis produksi Kaos Komunitas, Kemeja PDH/PDL Kantor, Polo Bordir Komputer, dan Jaket Angkatan. Jahitan rantai standar ekspor dan garansi bebas cacat.',
      address: 'Jl. Industri Garment No. 21, Kota Bandung, Jawa Barat',
      waNumber: '6281234567890',
      accounts: [
        { bank: 'BCA', number: '1234567890', owner: 'Adam Apparel' },
        { bank: 'BSI', number: '7188291029', owner: 'Adam Apparel' },
      ],
      stats: [
        { label: 'Tahun Pengalaman Industri Garment', value: 8, suffix: '+' },
        { label: 'Komunitas, Kampus & Perusahaan Puas', value: 450, suffix: '+' },
        { label: 'Pcs Pakaian Berhasil Diproduksi', value: 75000, suffix: '+' },
        { label: 'Garansi Bebas Cacat Jahit & Sablon', value: 100, suffix: '%' },
      ],
      adminPin: DEFAULT_PIN,
      spkCounter: spkList.length,
    },
    catalogItems: [
      {
        id: 'cat-kaos',
        name: 'Kaos Custom',
        iconKey: 'shirt',
        basePrice: 85000,
        minOrder: 12,
        description: 'Kaos komunitas dengan cotton combed yang adem dan nyaman dipakai seharian.',
        highlights: ['Jahitan rantai standar distro', 'Sablon plastisol dan DTF high-density', 'Tidak mudah luntur'],
        fabricIds: ['fab-cotton-24s', 'fab-cotton-30s'],
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        featured: true,
      },
      {
        id: 'cat-pdh',
        name: 'Kemeja PDH/PDL',
        iconKey: 'briefcase',
        basePrice: 150000,
        minOrder: 12,
        description: 'Seragam kantor dan kampus dari American Drill atau Japan Drill Verlando.',
        highlights: ['Kain kuat dan rapi', 'Pola standar dinas', 'Bordir logo dan nama'],
        fabricIds: ['fab-american-drill', 'fab-japan-drill'],
        imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
        featured: true,
      },
      {
        id: 'cat-polo',
        name: 'Polo Shirt',
        iconKey: 'award',
        basePrice: 120000,
        minOrder: 12,
        description: 'Polo CVC Lacoste pique dengan bordir komputer yang tajam dan presisi.',
        highlights: ['Bahan CVC Lacoste Pique', 'Bordir komputer tajam', 'Kerah tidak melar'],
        fabricIds: ['fab-cvc-pique', 'fab-cotton-30s'],
        imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-hoodie',
        name: 'Hoodie & Zipper',
        iconKey: 'flame',
        basePrice: 185000,
        minOrder: 12,
        description: 'Cotton fleece tebal 280-330 gsm yang hangat, seratnya halus, dan bulunya awet.',
        highlights: ['Fleece 280-330 gsm', 'Hangat dan halus', 'Bulu tetap awet'],
        fabricIds: ['fab-fleece-280', 'fab-fleece-330'],
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        featured: true,
      },
      {
        id: 'cat-jersey',
        name: 'Jersey Sport',
        iconKey: 'trophy',
        basePrice: 135000,
        minOrder: 12,
        description: 'Jersey olahraga dengan Dryfit Milano atau sublimasi full print.',
        highlights: ['Dryfit ringan dan cepat kering', 'Sublimasi full print', 'Nomor dan nama presisi'],
        fabricIds: ['fab-dryfit-milano', 'fab-dryfit-sublim'],
        imageUrl: 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-koko',
        name: 'Baju Koko Santri & Asatidz',
        iconKey: 'shirt',
        basePrice: 110000,
        minOrder: 12,
        description: 'Busana muslim pria bordir kerah shanghai dengan bahan katun toyobo sejuk.',
        highlights: ['Kain Toyobo Fodu adem', 'Bordir minimalis rapi', 'Pola nyaman untuk ibadah'],
        fabricIds: ['fab-cotton-24s', 'fab-cotton-30s'],
        imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-gamis',
        name: 'Gamis & Abaya Seragam',
        iconKey: 'layers',
        basePrice: 165000,
        minOrder: 12,
        description: 'Gamis seragam santriwati, majelis taklim, dan sekolah dengan potongan syar\'i.',
        highlights: ['Bahan flowy jatuh rapi', 'Tidak menerawang', 'Busui & wudhu friendly'],
        fabricIds: ['fab-cotton-24s', 'fab-cotton-30s'],
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'cat-jas',
        name: 'Jas Almamater',
        iconKey: 'briefcase',
        basePrice: 160000,
        minOrder: 12,
        description: 'Jas almamater kampus, pesantren, dan OSIS dengan furing dormeuil rapi.',
        highlights: ['Bahan American/Japan Drill', 'Lapisan furing & busa pundak', 'Bordir logo presisi'],
        fabricIds: ['fab-american-drill', 'fab-japan-drill'],
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      },
    ],
    fabricList: FABRICS,
    colorList: COLORS,
    portfolioList: [
      {
        id: 'port-1',
        client: 'Komunitas Pemuda Sehat Bandung',
        garment: 'Kaos Komunitas',
        quantity: 350,
        year: 2025,
        photoUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        note: 'Sablon plastisol 2 warna, selesai tepat waktu.',
      },
      {
        id: 'port-2',
        client: 'PT Maju Bersama Logistik',
        garment: 'Kemeja PDH/PDL',
        quantity: 240,
        year: 2025,
        photoUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        note: 'Seragam lapangan American Drill dengan bordir logo.',
      },
      {
        id: 'port-3',
        client: 'Angkatan 2016 SMA Negeri 3',
        garment: 'Hoodie Angkatan',
        quantity: 120,
        year: 2024,
        photoUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
        note: 'Fleece 330 gsm dengan bordir punggung.',
      },
      {
        id: 'port-4',
        client: 'Keluarga Alumni Pesantren Darul Ulum',
        garment: 'Polo Shirt Bordir',
        quantity: 180,
        year: 2025,
        photoUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
        note: 'Bahan CVC Lacoste Pique bordir komputer dada kiri dan punggung.',
      },
      {
        id: 'port-5',
        client: 'Lini Produksi Bengkel Adam Apparel',
        garment: 'QC & Finishing Jahit',
        quantity: 500,
        year: 2025,
        photoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
        note: 'Standar QC ketat bebas cacat jahitan sebelum pengemasan.',
      },
      {
        id: 'port-6',
        client: 'Distro & Clothing Line Lokal',
        garment: 'Kaos O-Neck Cotton 24s',
        quantity: 400,
        year: 2025,
        photoUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80',
        note: 'Jahitan rantai pundak dan sablon discharge super halus.',
      },
    ],
    spkList,
  };
}
