import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Supabase REST Client (Menggunakan Port 443 HTTPS standar - Bebas Blokir ISP/Firewall)
const supabaseUrl = process.env.SUPABASE_URL || 'https://oagvvshvmydsmmezdaal.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

let isDbConnected = false;
let dbErrorNotice = '';

async function checkDatabase() {
  if (!supabase) {
    isDbConnected = false;
    dbErrorNotice = 'SUPABASE_SERVICE_ROLE_KEY belum diisi di .env';
    return false;
  }
  try {
    // Tes query ringan ke tabel fabrics yang sudah dibuat di schema.sql
    const { error } = await supabase.from('fabrics').select('id').limit(1);
    if (error) {
      // Jika tabel belum ada atau permission issue
      isDbConnected = false;
      dbErrorNotice = error.message;
      console.warn('⚠️ [Supabase Notice]:', dbErrorNotice);
      return false;
    }
    isDbConnected = true;
    dbErrorNotice = '';
    console.log('✅ [Supabase Cloud] Terhubung sukses ke Cloud Database!');
    return true;
  } catch (err: any) {
    isDbConnected = false;
    dbErrorNotice = err.message || 'Koneksi gagal';
    console.warn('⚠️ [Supabase Notice]:', dbErrorNotice);
    return false;
  }
}

// Jalankan pengecekan koneksi secara non-blocking
setTimeout(() => {
  checkDatabase();
}, 200);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'ADAM COLLECTION - Apparel & Garment Management Platform',
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected,
      provider: 'Supabase PostgreSQL',
      error: dbErrorNotice || null,
    },
  });
});

app.get('/api/db-status', async (_req: Request, res: Response) => {
  if (!isDbConnected) {
    await checkDatabase();
  }
  res.json({
    connected: isDbConnected,
    provider: 'Supabase PostgreSQL',
    projectRef: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace('https://', '').split('.')[0] : 'oagvvshvmydsmmezdaal',
    message: isDbConnected ? 'Terhubung ke Supabase PostgreSQL' : dbErrorNotice || 'Offline / In-Memory Mode',
  });
});

// START SERVER & VITE INTEGRATION
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Adam Apparel Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
