-- ==============================================================================
-- ADAM APPAREL & COLLECTION - SEED DATA FOR SUPABASE / POSTGRESQL
-- Script untuk mengisi data awal: Bahan Kain, Model Pakaian, Config Toko, & Demo Pesanan
-- Jalankan di SQL Editor Supabase SETELAH menjalankan schema.sql
-- ==============================================================================

-- 1. SEED WORKSHOP CONFIG (Identitas Toko & Rekening)
INSERT INTO workshop_config (
    id, brand_name, brand_tagline, owner_title, owner_phone, address, bank_accounts,
    min_dp_percent, min_wholesale_qty, embroidery_price_per_name, embroidery_price_per_logo
) VALUES (
    1,
    'Adam Apparel & Collection',
    'Solusi Konveksi & Garment Terpercaya Borongan Pesantren, Sekolah & Instansi',
    'Mas El / Tim Kasir Adam Apparel',
    '6281234567890',
    'Jl. Industri Garment No. 21, Kota Bandung, Jawa Barat',
    '[
        {"bank": "BCA", "accountNumber": "1234567890", "accountHolder": "Adam Apparel"},
        {"bank": "Bank Mandiri", "accountNumber": "1234567891", "accountHolder": "Adam Apparel"},
        {"bank": "BRI", "accountNumber": "1234567892", "accountHolder": "Adam Apparel"},
        {"bank": "BSI (Bank Syariah Indonesia)", "accountNumber": "1234567893", "accountHolder": "Adam Apparel"}
    ]'::jsonb,
    50,
    12,
    5000,
    8000
) ON CONFLICT (id) DO UPDATE SET
    brand_name = EXCLUDED.brand_name,
    brand_tagline = EXCLUDED.brand_tagline,
    owner_phone = EXCLUDED.owner_phone,
    address = EXCLUDED.address,
    bank_accounts = EXCLUDED.bank_accounts;

-- 2. SEED FABRICS (Katalog Bahan Kain Konveksi)
INSERT INTO fabrics (
    id, name, category, composition, thickness, breathability, drapability, texture,
    recommended_use, price_per_meter, colors, image_url, in_stock
) VALUES
(
    'fab-cotton-24s',
    'Cotton Combed 24s',
    'Kaos 100% Cotton Murni',
    '100% Premium Combed Cotton Gramasi 180-190 gsm',
    'Sedang - Tebal',
    'Sangat Adem & Menyerap Keringat',
    'Jatuh Lembut & Rapi',
    'Permukaan Halus Bebas Bulu',
    'Kaos seragam santri, kaos angkatan, seragam komunitas harian.',
    38000,
    '[
        {"name": "Jet Black", "hex": "#111827"},
        {"name": "Deep Navy", "hex": "#1e293b"},
        {"name": "Bottle Green", "hex": "#064e3b"},
        {"name": "Maroon", "hex": "#881337"},
        {"name": "Broken White", "hex": "#f8fafc"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'fab-cotton-30s',
    'Cotton Combed 30s',
    'Kaos 100% Cotton Murni',
    '100% Ring Spun Cotton Gramasi 150-160 gsm',
    'Ringan - Lembut',
    'Ekstra Sejuk & Ringan',
    'Flowy Lembut',
    'Sangat Halus Sentuhan Kulit',
    'Kaos distro santai, merchandise event, kaos olahraga santri.',
    35000,
    '[
        {"name": "Jet Black", "hex": "#111827"},
        {"name": "Misty Grey", "hex": "#94a3b8"},
        {"name": "Sage Green", "hex": "#4b5563"},
        {"name": "Mustard Gold", "hex": "#b45309"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'fab-american-drill',
    'American Drill 1919 (Original)',
    'Drill Katun Tinggi',
    'Campuran Katun & Polyester Twist Kuat',
    'Tebal & Kokoh',
    'Nyaman Seharian Lapangan',
    'Tegak & Gagah',
    'Twill Diagonal Karakteristik Seragam',
    'Kemeja PDH, seragam kerja lapangan, jas praktikum pesantren.',
    45000,
    '[
        {"name": "Navy Gelap", "hex": "#0f172a"},
        {"name": "Khaki ASN / Krem", "hex": "#d4b996"},
        {"name": "Hitam Pekat", "hex": "#0a0a0a"},
        {"name": "Hijau Army", "hex": "#2d3a2e"},
        {"name": "Putih Dinas", "hex": "#ffffff"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'fab-japan-drill',
    'Japan Drill Verlando',
    'Drill Katun Tinggi',
    'Kadar Katun Lebih Tinggi (Adem & Jatuh Mewah)',
    'Tebal Mewah',
    'Sangat Sejuk & Lembut',
    'Jatuh Elegan & Rapi',
    'Serat Halus Padat',
    'Seragam dinas eksekutif, jas almamater universitas, kemeja ustadz.',
    55000,
    '[
        {"name": "Midnight Navy", "hex": "#09122c"},
        {"name": "Maroon Kemewahan", "hex": "#5e0f1d"},
        {"name": "Abu Rokok Formal", "hex": "#64748b"},
        {"name": "Hijau Lumut", "hex": "#1b3b22"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'fab-cvc-pique',
    'CVC Lacoste Pique 24s',
    'Katun Premium',
    'Porous Pique Knit Katun-Poly Sejuk',
    'Sedang - Berbobot',
    'Sirkulasi Udara Maksimal',
    'Mantap & Berkerah Rapi',
    'Pori Sarang Lebah Lembut',
    'Polo shirt semi-formal, seragam dosen/guru, pakaian panitia.',
    48000,
    '[
        {"name": "Hitam Solid", "hex": "#111827"},
        {"name": "Navy Klasik", "hex": "#1e293b"},
        {"name": "Maroon Tua", "hex": "#7f1d1d"},
        {"name": "Putih Bersih", "hex": "#ffffff"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'fab-fleece-280',
    'Cotton Fleece 280-330 gsm',
    'Katun Premium',
    'Serat Katun Tebal dengan Lapisan Bulu Hangat Lembut',
    'Sangat Tebal & Hangat',
    'Hangat Melindungi Angin',
    'Kokoh & Rapi',
    'Permukaan Luar Halus, Dalam Berbulu Lembut',
    'Jaket hoodie angkatan, zipper santri, crewneck komunitas.',
    65000,
    '[
        {"name": "Hitam Pekat", "hex": "#09090b"},
        {"name": "Abu Misty", "hex": "#cbd5e1"},
        {"name": "Hijau Botol", "hex": "#064e3b"},
        {"name": "Burgundy", "hex": "#4a0404"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'fab-dryfit-milano',
    'Dryfit Milano Super',
    'Kaos 100% Cotton Murni',
    'Polyester Microfiber Cepat Kering dengan Tekstur Zigzag',
    'Ringan Sport',
    'Super Cepat Kering & Dingin',
    'Jatuh Lentur',
    'Tekstur Milano Halus',
    'Jersey futsal santri, baju olahraga sekolah, seragam maraton.',
    32000,
    '[
        {"name": "Merah Cabe", "hex": "#dc2626"},
        {"name": "Biru Turkish", "hex": "#0284c7"},
        {"name": "Hitam", "hex": "#0f172a"},
        {"name": "Neon Volt", "hex": "#84cc16"}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=800&q=80',
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    price_per_meter = EXCLUDED.price_per_meter,
    colors = EXCLUDED.colors,
    image_url = EXCLUDED.image_url;

-- 3. SEED APPAREL TYPES (Jenis Model Pakaian)
INSERT INTO apparel_types (
    id, name, category, description, base_price, default_fabric_id, image_url, min_order_qty
) VALUES
(
    'cat-kaos',
    'Kaos Custom Komunitas & Santri',
    'kaos_santri',
    'Kaos oblong santri/komunitas dengan jahitan rantai distro dan sablon DTF/plastisol berstandar ekspor.',
    85000,
    'fab-cotton-24s',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    12
),
(
    'cat-pdh',
    'Kemeja PDH & PDL Dinas / Kampus',
    'kemeja_pdh',
    'Kemeja dinas resmi dengan pola ergonomis, jahitan stik ganda, dan bordir komputer logo dada/punggung.',
    150000,
    'fab-american-drill',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    12
),
(
    'cat-polo',
    'Polo Shirt Bordir Komputer',
    'kaos_santri',
    'Polo shirt kerah berbobot dengan bordir logo presisi tajam dan manset lengan yang tidak mudah melar.',
    120000,
    'fab-cvc-pique',
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
    12
),
(
    'cat-hoodie',
    'Hoodie & Zipper Angkatan',
    'rompi_jaket',
    'Jaket hoodie fleece tebal dengan tali serut premium, saku kangguru rapi, dan sablon/bordir punggung.',
    185000,
    'fab-fleece-280',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    12
),
(
    'cat-jersey',
    'Jersey Olahraga Full Print Sublim',
    'kaos_santri',
    'Jersey dryfit nyaman dengan warna sublimasi tajam cerah yang meresap ke serat kain tanpa pecah.',
    135000,
    'fab-dryfit-milano',
    'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=800&q=80',
    12
),
(
    'cat-koko',
    'Baju Koko Santri & Asatidz',
    'baju_koko',
    'Koko pria muslim bordir kerah shanghai dengan bahan katun sejuk dan kancing bungkus rapi.',
    110000,
    'fab-cotton-24s',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
    12
),
(
    'cat-gamis',
    'Gamis & Abaya Seragam Pesantren',
    'gamis_abaya',
    'Gamis seragam santriwati, majelis taklim, dan sekolah dengan potongan syar''i tidak menerawang.',
    165000,
    'fab-cotton-24s',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    12
),
(
    'cat-jas',
    'Jas Almamater Kampus & Sekolah',
    'jas_almamater',
    'Jas almamater dengan furing dormeuil, kancing kuningan timbul/logo, dan busa pundak profesional.',
    160000,
    'fab-japan-drill',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    12
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    base_price = EXCLUDED.base_price,
    default_fabric_id = EXCLUDED.default_fabric_id,
    image_url = EXCLUDED.image_url;

-- 4. SEED SAMPLE INITIAL ORDERS (Demo Pesanan di Sistem)
INSERT INTO orders (
    id, customer_name, customer_phone, organization_name, apparel_type_id, apparel_type_name,
    fabric_id, fabric_name, fabric_color, fabric_color_hex, size_breakdown, total_pcs,
    unit_price, embroidery_type, embroidery_fee_per_pcs, total_price, dp_amount_required,
    dp_paid_amount, remaining_payment, is_fully_paid, deadline_date, status, dp_paid_at
) VALUES
(
    'AMN-202611-001',
    'Rizky Pratama',
    '081234567801',
    'Komunitas Pemuda Sehat Bandung',
    'cat-kaos',
    'Kaos Custom Komunitas & Santri',
    'fab-cotton-24s',
    'Cotton Combed 24s',
    'Jet Black',
    '#111827',
    '{"S": 10, "M": 20, "L": 30, "XL": 15, "XXL": 5}'::jsonb,
    80,
    85000,
    'sablon_dtf',
    0,
    6800000,
    3400000,
    6800000,
    0,
    TRUE,
    CURRENT_DATE + INTERVAL '5 days',
    'siap_kirim',
    CURRENT_TIMESTAMP - INTERVAL '7 days'
),
(
    'AMN-202611-002',
    'Ustadz Abdullah Hakim',
    '081234567802',
    'Pondok Pesantren Al-Hidayah',
    'cat-pdh',
    'Kemeja PDH & PDL Dinas / Kampus',
    'fab-american-drill',
    'American Drill 1919 (Original)',
    'Navy Gelap',
    '#0f172a',
    '{"S": 15, "M": 35, "L": 40, "XL": 20, "XXL": 10}'::jsonb,
    120,
    150000,
    'nama_dan_logo',
    10000,
    19200000,
    9600000,
    9600000,
    9600000,
    FALSE,
    CURRENT_DATE + INTERVAL '12 days',
    'proses_jahit',
    CURRENT_TIMESTAMP - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED LOGS
INSERT INTO order_status_logs (order_id, previous_status, new_status, notes, changed_by)
SELECT 'AMN-202611-001', 'menunggu_dp', 'siap_kirim', 'Pesanan selesai QC dan siap kirim', 'Kasir Digital'
WHERE EXISTS (SELECT 1 FROM orders WHERE id = 'AMN-202611-001')
ON CONFLICT DO NOTHING;
