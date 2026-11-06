import type { Order, OrderStatus, WorkshopConfig } from '../types/index.ts';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export interface StatusInfo {
  key: OrderStatus;
  label: string;
  stepNumber: number;
  badgeBg: string;
  badgeText: string;
  description: string;
  nextStepLabel?: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, StatusInfo> = {
  menunggu_dp: {
    key: 'menunggu_dp',
    label: 'Menunggu DP 50%',
    stepNumber: 1,
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    badgeText: 'Menunggu Pembayaran DP 50%',
    description: 'Pesanan terdaftar. Menunggu transfer DP 50% untuk pembelian kain gulungan ke distributor.',
    nextStepLabel: 'Konfirmasi DP 50% Diterima',
  },
  dp_lunas: {
    key: 'dp_lunas',
    label: 'DP Lunas / Antrean Potong Pola',
    stepNumber: 2,
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeText: 'DP Lunas / Antrean Potong Pola',
    description: 'DP 50% telah diterima. Kain telah disiapkan di meja potong untuk pembuatan pola.',
    nextStepLabel: 'Mulai Jahit & Bordir',
  },
  proses_jahit: {
    key: 'proses_jahit',
    label: 'Sedang Dijahit & Bordir',
    stepNumber: 3,
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    badgeText: 'Sedang Dijahit & Bordir Komputer',
    description: 'Pola kain sedang dijahit oleh penjahit bengkel dan dibordir nama/logo dengan mesin bordir komputer.',
    nextStepLabel: 'Masuk Tahap Finishing & QC',
  },
  finishing_qc: {
    key: 'finishing_qc',
    label: 'Finishing, QC & Setrika Uap',
    stepNumber: 4,
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeText: 'Finishing, QC & Setrika Uap',
    description: 'Pembersihan sisa benang obras, pemasangan kancing, pengecekan ukuran, dan setrika uap sebelum packing.',
    nextStepLabel: 'Siap Kirim / Diambil',
  },
  siap_kirim: {
    key: 'siap_kirim',
    label: 'Siap Kirim & Pelunasan',
    stepNumber: 5,
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    badgeText: 'Siap Kirim / Diambil & Pelunasan Sisa',
    description: 'Seragam selesai dipacking rapi per ukuran. Siap diambil di bengkel atau dikirim via ekspedisi setelah pelunasan sisa 50%.',
    nextStepLabel: 'Tandai Selesai (Lunas & Terkirim)',
  },
  selesai: {
    key: 'selesai',
    label: 'Selesai & Lunas',
    stepNumber: 6,
    badgeBg: 'bg-gray-100 text-gray-800 border-gray-200',
    badgeText: 'Selesai (Pesanan Telah Diterima & Lunas)',
    description: 'Seluruh pesanan seragam telah diserahterimakan dan pembayaran lunas 100%. Barakallahu fiikum.',
  },
};

export function buildWhatsAppOrderMessage(order: Order, config: WorkshopConfig): string {
  const sizes = Object.entries(order.sizeBreakdown)
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([size, qty]) => `${size}=${qty}`)
    .join(', ');

  const namesCount = order.embroideryItems?.length || 0;
  const embroideryText =
    order.embroideryType === 'tanpa_bordir'
      ? 'Tanpa Bordir'
      : order.embroideryType === 'nama_dada'
      ? `Bordir Nama Dada (${namesCount} nama)`
      : order.embroideryType === 'logo_sekolah'
      ? 'Bordir Logo Sekolah/Instansi'
      : `Bordir Nama Dada (${namesCount} nama) + Logo Sekolah`;

  const msg = `*PESANAN SERAGAM BORONGAN - ${config.brandName.toUpperCase()}*
_Kasir Digital & Formulir Resmi_

Assalamu'alaikum ${config.ownerTitle}, saya ingin konfirmasi pesanan seragam borongan:

📋 *No. Order:* ${order.id}
👤 *Pemesan:* ${order.customerName}
🏢 *Lembaga/Pondok:* ${order.organizationName}
📱 *No. WA Pemesan:* ${order.customerPhone}

👕 *Jenis Pakaian:* ${order.apparelTypeName}
🧵 *Bahan Kain:* ${order.fabricName}
🎨 *Warna Kain:* ${order.fabricColor}
📏 *Rincian Ukuran (${order.totalPcs} pcs):*
👉 ${sizes}

🪡 *Bordir Komputer:* ${embroideryText}
📅 *Target Selesai:* ${formatDate(order.deadlineDate)}
${order.specialNotes ? `📝 *Catatan Khusus:* ${order.specialNotes}\n` : ''}
💰 *RINCIAN BIAYA:*
- Total Harga: ${formatRupiah(order.totalPrice)}
- *WAJIB DP 50%:* *${formatRupiah(order.dpAmountRequired)}*
- Sisa Pelunasan: ${formatRupiah(order.remainingPayment)}

💳 *Rekening Transfer DP:*
${config.bankAccounts.map((b) => `• ${b.bank}: ${b.accountNumber} (a.n ${b.accountHolder})`).join('\n')}

Mohon verifikasi nomor order kami agar pola kain bisa segera dipotong di bengkel. Terima kasih.`;

  return encodeURIComponent(msg);
}

export function buildCustomerUpdateWhatsAppMessage(order: Order, config: WorkshopConfig, customNote?: string): string {
  const statusInfo = ORDER_STATUS_MAP[order.status];
  const msg = `*UPDATE STATUS PESANAN SERAGAM - ${config.brandName.toUpperCase()}*

Assalamu'alaikum Wr. Wb.
Yth. *${order.customerName}* (${order.organizationName}),

Berikut update pengerjaan seragam borongan Anda di bengkel konveksi kami:

📋 *No. Order:* ${order.id}
👕 *Pesanan:* ${order.totalPcs} pcs ${order.apparelTypeName} (${order.fabricName} - ${order.fabricColor})
⚡ *Status Saat Ini:* *${statusInfo.badgeText}*

${customNote ? `📌 *Pesan Bengkel:* ${customNote}\n` : ''}
${order.status === 'siap_kirim' ? `📦 *Pesanan siap dikirim/diambil!* Sisa pelunasan: *${formatRupiah(order.remainingPayment)}*\n` : ''}
📅 *Estimasi Selesai:* ${formatDate(order.deadlineDate)}

Terima kasih atas kepercayaannya.
Wassalamu'alaikum,
*${config.ownerTitle} - ${config.brandName}*`;

  return encodeURIComponent(msg);
}
