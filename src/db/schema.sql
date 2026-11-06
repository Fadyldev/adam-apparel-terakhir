-- ==============================================================================
-- AMANAH UNIFORM & APPAREL - B2B APPAREL & CONFECTION WORKSHOP
-- Database Schema for PostgreSQL / Supabase / Neon / Cloud SQL
-- ==============================================================================
--
-- Standard 4 Environment Variables used:
-- 1. DATABASE_URL: postgresql://postgres:password@localhost:5432/amanah_konveksi
-- 2. SUPABASE_URL: https://<project-id>.supabase.co
-- 3. SUPABASE_SERVICE_ROLE_KEY: <service-role-secret>
-- 4. JWT_SECRET: <secret-jwt-key>
--
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM (
        'menunggu_dp',
        'dp_lunas',
        'proses_jahit',
        'finishing_qc',
        'siap_kirim',
        'selesai',
        'dibatalkan'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE apparel_category_enum AS ENUM (
        'baju_koko',
        'gamis_abaya',
        'kemeja_pdh',
        'jas_almamater',
        'kaos_santri',
        'rompi_jaket',
        'custom'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. FABRICS TABLE (Katalog Bahan Kain Konveksi)
CREATE TABLE IF NOT EXISTS fabrics (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(60) NOT NULL,
    composition VARCHAR(150),
    thickness VARCHAR(50), -- e.g. "Sedang - Tebal", "Ringan"
    breathability VARCHAR(50), -- e.g. "Sangat Adem & Sejuk"
    drapability VARCHAR(50), -- e.g. "Jatuh & Lembut"
    texture VARCHAR(100), -- e.g. "Twill Diagonal Halus"
    recommended_use TEXT,
    price_per_meter NUMERIC(12, 2) NOT NULL DEFAULT 35000,
    colors JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. APPAREL TYPES TABLE (Jenis Model Pakaian Seragam)
CREATE TABLE IF NOT EXISTS apparel_types (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category apparel_category_enum NOT NULL,
    description TEXT,
    base_price NUMERIC(12, 2) NOT NULL DEFAULT 85000,
    default_fabric_id VARCHAR(64) REFERENCES fabrics(id) ON DELETE SET NULL,
    image_url TEXT,
    min_order_qty INT DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE (Pesanan Borongan Seragam)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(32) PRIMARY KEY, -- e.g. AMN-202611-001
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    organization_name VARCHAR(150) NOT NULL, -- Sekolah, Pondok Pesantren, Majelis Taklim, Instansi
    apparel_type_id VARCHAR(64) REFERENCES apparel_types(id),
    apparel_type_name VARCHAR(120) NOT NULL,
    fabric_id VARCHAR(64) REFERENCES fabrics(id),
    fabric_name VARCHAR(120) NOT NULL,
    fabric_color VARCHAR(60) NOT NULL,
    fabric_color_hex VARCHAR(10),
    
    -- Size Breakdown JSON
    -- Format: {"S": 20, "M": 20, "L": 40, "XL": 40, "XXL": 10, "custom": 5}
    size_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_pcs INT NOT NULL CHECK (total_pcs > 0),
    
    -- Pricing
    unit_price NUMERIC(12, 2) NOT NULL,
    embroidery_type VARCHAR(50) DEFAULT 'tanpa_bordir',
    embroidery_fee_per_pcs NUMERIC(12, 2) DEFAULT 0,
    total_price NUMERIC(12, 2) NOT NULL,
    dp_amount_required NUMERIC(12, 2) NOT NULL, -- 50%
    dp_paid_amount NUMERIC(12, 2) DEFAULT 0,
    remaining_payment NUMERIC(12, 2) NOT NULL,
    is_fully_paid BOOLEAN DEFAULT FALSE,
    
    -- Embroidery Details
    embroidery_logo_url TEXT,
    special_notes TEXT,
    deadline_date DATE NOT NULL,
    
    -- Status Pipeline
    status order_status_enum NOT NULL DEFAULT 'menunggu_dp',
    dp_paid_at TIMESTAMP WITH TIME ZONE,
    spk_printed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. EMBROIDERY ITEMS TABLE (Daftar Nama Bordir Dada Per Orang)
CREATE TABLE IF NOT EXISTS embroidery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(32) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    person_name VARCHAR(100) NOT NULL,
    size VARCHAR(20) NOT NULL,
    position VARCHAR(50) DEFAULT 'Dada Kanan',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDER HISTORY LOGS (Jejak Status & Operasional)
CREATE TABLE IF NOT EXISTS order_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(32) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    previous_status order_status_enum,
    new_status order_status_enum NOT NULL,
    notes TEXT,
    changed_by VARCHAR(80) DEFAULT 'Sistem Kasir Digital',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. WORKSHOP CONFIG TABLE (Pengaturan Toko, Rekening & Kontak)
CREATE TABLE IF NOT EXISTS workshop_config (
    id INT PRIMARY KEY DEFAULT 1,
    brand_name VARCHAR(120) NOT NULL DEFAULT 'Amanah Uniform & Konveksi',
    brand_tagline VARCHAR(200) DEFAULT 'Spesialis Busana Muslim Santri, Kemeja Pesantren & Seragam Borongan',
    owner_title VARCHAR(100) DEFAULT 'Ustadz Ahmad Fauzi, Lc.',
    owner_phone VARCHAR(30) DEFAULT '6281234567890',
    address TEXT DEFAULT 'Jl. Pesantren No. 45, Cibeunying, Bandung, Jawa Barat',
    bank_accounts JSONB DEFAULT '[
        {"bank": "BSI (Bank Syariah Indonesia)", "accountNumber": "7188291029", "accountHolder": "Ahmad Fauzi / Amanah Konveksi"},
        {"bank": "BCA", "accountNumber": "0461829012", "accountHolder": "Ahmad Fauzi"},
        {"bank": "Bank Mandiri", "accountNumber": "1310087654321", "accountHolder": "Ahmad Fauzi"}
    ]'::jsonb,
    min_dp_percent INT DEFAULT 50,
    min_wholesale_qty INT DEFAULT 12,
    embroidery_price_per_name NUMERIC(10, 2) DEFAULT 5000,
    embroidery_price_per_logo NUMERIC(10, 2) DEFAULT 8000,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_embroidery_items_order_id ON embroidery_items(order_id);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) CONFIGURATION
-- Mengizinkan pembacaan katalog publik & pembuatan pesanan tanpa terblokir satpam RLS
-- ==============================================================================
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE apparel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE embroidery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_config ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Public Read Fabrics" ON fabrics FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Read Apparel Types" ON apparel_types FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Read Workshop Config" ON workshop_config FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Update Orders" ON orders FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Read Order Logs" ON order_status_logs FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Insert Order Logs" ON order_status_logs FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Read Embroidery" ON embroidery_items FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Insert Embroidery" ON embroidery_items FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;
