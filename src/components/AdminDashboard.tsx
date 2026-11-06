import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Scissors,
  Printer,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Layers,
  Settings,
  Plus,
  Send,
  AlertCircle,
  Search,
  Filter,
  CreditCard,
  Building,
  User,
  Phone,
  Calendar,
  ExternalLink,
  Save,
  Trash2,
  Sparkles,
} from 'lucide-react';
import type {
  Order,
  OrderStatus,
  WorkshopConfig,
  DashboardStats,
  Fabric,
  BankAccount,
} from '../types/index.ts';
import {
  formatRupiah,
  formatDate,
  formatDateTime,
  ORDER_STATUS_MAP,
  buildCustomerUpdateWhatsAppMessage,
} from '../utils/formatters.ts';

interface AdminDashboardProps {
  config: WorkshopConfig;
  fabrics: Fabric[];
  onConfigUpdated: (newConfig: WorkshopConfig) => void;
  onFabricsUpdated: (newFabrics: Fabric[]) => void;
  onOpenSpk: (order: Order) => void;
  onOpenInvoice?: (order: Order) => void;
  onLockAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  fabrics,
  onConfigUpdated,
  onFabricsUpdated,
  onOpenSpk,
  onOpenInvoice,
  onLockAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'orders' | 'settings' | 'fabrics'>('pipeline');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const handleExportCSV = () => {
    const headers = ['No Order', 'Tanggal', 'Lembaga', 'Pemesan', 'WhatsApp', 'Pakaian', 'Bahan', 'Warna', 'Total Pcs', 'Total Harga', 'Wajib DP 50%', 'DP Terbayar', 'Sisa', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      o.createdAt.split('T')[0],
      `"${o.organizationName.replace(/"/g, '""')}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `'${o.customerPhone}`,
      `"${o.apparelTypeName}"`,
      `"${o.fabricName}"`,
      `"${o.fabricColor}"`,
      o.totalPcs,
      o.totalPrice,
      o.dpAmountRequired,
      o.dpPaidAmount,
      o.remainingPayment,
      o.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Pesanan_AdamCollection_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Payment Verification Modal State
  const [paymentModalOrder, setPaymentModalOrder] = useState<Order | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('BSI (Bank Syariah Indonesia)');
  const [paymentType, setPaymentType] = useState<'dp' | 'full'>('dp');

  // Status Change Modal State
  const [statusModalOrder, setStatusModalOrder] = useState<Order | null>(null);
  const [selectedNextStatus, setSelectedNextStatus] = useState<OrderStatus>('dp_lunas');
  const [statusNote, setStatusNote] = useState<string>('');

  // Settings State
  const [localConfig, setLocalConfig] = useState<WorkshopConfig>(config);
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);

  // Fabrics State
  const [localFabrics, setLocalFabrics] = useState<Fabric[]>(fabrics);
  const [newFabricName, setNewFabricName] = useState<string>('');
  const [newFabricCategory, setNewFabricCategory] = useState<string>('Katun Premium');
  const [newFabricPrice, setNewFabricPrice] = useState<number>(40000);

  // Fetch orders & stats
  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/stats'),
      ]);
      const ordersData = await ordersRes.json();
      const statsData = await statsRes.json();

      if (ordersData.success) setOrders(ordersData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync props config
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  useEffect(() => {
    setLocalFabrics(fabrics);
  }, [fabrics]);

  // Handle Verify DP / Payment
  const handleConfirmPayment = async () => {
    if (!paymentModalOrder) return;
    try {
      const amountNum = parseInt(paymentAmount.replace(/\D/g, ''), 10) || paymentModalOrder.dpAmountRequired;
      const res = await fetch(`/api/orders/${paymentModalOrder.id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: paymentType,
          amount: amountNum,
          paymentMethod,
          notes: `Pembayaran ${paymentType === 'dp' ? 'DP 50%' : 'Pelunasan'} diterima via ${paymentMethod}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentModalOrder(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Update Status
  const handleUpdateStatus = async () => {
    if (!statusModalOrder) return;
    try {
      const res = await fetch(`/api/orders/${statusModalOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedNextStatus,
          notes: statusNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusModalOrder(null);
        setStatusNote('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localConfig),
      });
      const data = await res.json();
      if (data.success) {
        onConfigUpdated(data.data);
        setConfigSuccessMsg('Pengaturan toko & nomor rekening berhasil disimpan!');
        setTimeout(() => setConfigSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add New Fabric
  const handleAddFabric = async () => {
    if (!newFabricName.trim()) return;
    try {
      const payload: Partial<Fabric> = {
        name: newFabricName.trim(),
        category: newFabricCategory,
        pricePerMeter: newFabricPrice,
        thickness: 'Sedang',
        breathability: 'Adem Nyaman',
        drapability: 'Rapi',
        composition: 'Bahan Konveksi Grade A',
        recommendedUse: 'Seragam Sekolah & Pesantren',
        colors: [
          { name: 'Putih', hex: '#FFFFFF' },
          { name: 'Hitam', hex: '#111827' },
          { name: 'Navy', hex: '#1E3A8A' },
        ],
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
        inStock: true,
      };

      const res = await fetch('/api/fabrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        const updated = [...localFabrics, data.data];
        setLocalFabrics(updated);
        onFabricsUpdated(updated);
        setNewFabricName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Pipeline columns
  const pipelineStages: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'menunggu_dp', label: '1. Menunggu DP 50%', icon: Clock },
    { status: 'dp_lunas', label: '2. Antrean Potong Pola', icon: Scissors },
    { status: 'proses_jahit', label: '3. Sedang Jahit & Bordir', icon: Layers },
    { status: 'finishing_qc', label: '4. Finishing & Setrika', icon: Sparkles },
    { status: 'siap_kirim', label: '5. Siap Kirim / Diambil', icon: Package },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Operasional */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
              PANEL KASIR & KEPALA PRODUKSI
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Operasional Konveksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Pantau arus pesanan borongan masuk, validasi DP 50% untuk belanja kain,
            dan cetak SPK resmi ke meja potong kepala penjahit.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pipeline Kanban</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Semua Pesanan ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fabrics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'fabrics'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Katalog Kain ({localFabrics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan Toko & Bank</span>
          </button>

          {onLockAdmin && (
            <button
              onClick={onLockAdmin}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60"
              title="Kunci Dashboard Admin"
            >
              <span>Kunci Sesi</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 block font-medium">Total Pesanan</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              {stats.totalOrders} order
            </span>
            <span className="text-[10px] text-slate-400">Semua riwayat</span>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs">
            <span className="text-[11px] text-amber-700 block font-bold">Menunggu DP 50%</span>
            <span className="text-xl font-extrabold text-amber-900 mt-1 block">
              {stats.pendingDpOrders} order
            </span>
            <span className="text-[10px] text-amber-800">Perlu diverifikasi</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-xs">
            <span className="text-[11px] text-blue-700 block font-bold">Sedang Diproduksi</span>
            <span className="text-xl font-extrabold text-blue-900 mt-1 block">
              {stats.inProductionOrders} order
            </span>
            <span className="text-[10px] text-blue-800">
              {stats.totalPcsInProduction} pcs di bengkel
            </span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-[11px] text-emerald-700 block font-bold">Siap Kirim / Diambil</span>
            <span className="text-xl font-extrabold text-emerald-900 mt-1 block">
              {stats.readyOrders} order
            </span>
            <span className="text-[10px] text-emerald-800">Siap pelunasan</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 block font-medium">Total DP Masuk</span>
            <span className="text-base font-extrabold text-emerald-900 mt-1 block truncate">
              {formatRupiah(stats.totalDpReceived)}
            </span>
            <span className="text-[10px] text-slate-400">Dana belanja kain</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 block font-medium">Total Omzet Pesanan</span>
            <span className="text-base font-extrabold text-slate-900 mt-1 block truncate">
              {formatRupiah(stats.totalRevenue)}
            </span>
            <span className="text-[10px] text-slate-400">Akumulasi total</span>
          </div>
        </div>
      )}

      {/* TAB 1: KANBAN PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Filter Pencarian:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari no. order / nama pondok..."
                className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <span className="text-xs text-slate-500">
              Geser / Klik tombol cepat pada tiap kartu untuk memindahkan tahap pengerjaan.
            </span>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
            {pipelineStages.map((stage) => {
              const stageOrders = filteredOrders.filter((o) => o.status === stage.status);
              const IconComp = stage.icon;

              return (
                <div
                  key={stage.status}
                  className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 min-w-[240px] flex flex-col max-h-[800px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <IconComp className="w-4 h-4 text-emerald-800" />
                      <h3 className="font-bold text-xs text-slate-900">
                        {stage.label}
                      </h3>
                    </div>
                    <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[11px] font-extrabold flex items-center justify-center shadow-xs">
                      {stageOrders.length}
                    </span>
                  </div>

                  {/* Order Cards */}
                  <div className="space-y-3 overflow-y-auto pr-1">
                    {stageOrders.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-400 italic">
                        Tidak ada pesanan di tahap ini
                      </div>
                    ) : (
                      stageOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-2.5"
                        >
                          {/* Card Head */}
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <span className="font-mono text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                {order.id}
                              </span>
                              <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                                {order.organizationName}
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                {order.customerName}
                              </p>
                            </div>

                            <span className="text-[11px] font-black text-slate-900">
                              {order.totalPcs} pcs
                            </span>
                          </div>

                          {/* Apparel & Fabric */}
                          <div className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-700 space-y-0.5">
                            <span className="font-semibold block truncate">
                              {order.apparelTypeName}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {order.fabricName} ({order.fabricColor})
                            </span>
                          </div>

                          {/* Financials & Deadline */}
                          <div className="text-[11px] space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Total:</span>
                              <span className="font-bold text-slate-800">
                                {formatRupiah(order.totalPrice)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Target Deadline:</span>
                              <span className="font-bold text-rose-800">
                                {formatDate(order.deadlineDate)}
                              </span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                            {/* If waiting DP -> button to verify */}
                            {order.status === 'menunggu_dp' && (
                              <button
                                onClick={() => {
                                  setPaymentModalOrder(order);
                                  setPaymentType('dp');
                                  setPaymentAmount(order.dpAmountRequired.toString());
                                }}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition shadow-2xs"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Verifikasi DP 50% Masuk</span>
                              </button>
                            )}

                            {/* 1-Click SPK Bengkel */}
                            <button
                              onClick={() => onOpenSpk(order)}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
                            >
                              <Printer className="w-3.5 h-3.5 text-amber-300" />
                              <span>Cetak SPK Bengkel</span>
                            </button>

                            {/* 1-Click Kwitansi Resmi Yayasan/BOS */}
                            {onOpenInvoice && (
                              <button
                                onClick={() => onOpenInvoice(order)}
                                className="w-full bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/60 font-semibold py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
                              >
                                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Cetak Kwitansi & Invoice</span>
                              </button>
                            )}

                            {/* Move to next stage button */}
                            {order.status !== 'selesai' && (
                              <button
                                onClick={() => {
                                  setStatusModalOrder(order);
                                  // recommend next status
                                  const currentIdx = pipelineStages.findIndex(
                                    (s) => s.status === order.status
                                  );
                                  const nextSt =
                                    pipelineStages[currentIdx + 1]?.status || 'selesai';
                                  setSelectedNextStatus(nextSt);
                                }}
                                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold py-1 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition"
                              >
                                <span>Ubah Tahap & Update</span>
                              </button>
                            )}

                            {/* Send WA Update to Customer */}
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(
                                /\D/g,
                                ''
                              )}?text=${buildCustomerUpdateWhatsAppMessage(
                                order,
                                config
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-slate-500 hover:text-emerald-700 flex items-center justify-center gap-1 py-0.5"
                            >
                              <Send className="w-3 h-3" />
                              <span>Kirim Notifikasi WA ke Pemesan</span>
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ALL ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">Semua Status ({orders.length})</option>
                <option value="menunggu_dp">Menunggu DP 50%</option>
                <option value="dp_lunas">DP Lunas / Antrean Potong</option>
                <option value="proses_jahit">Sedang Dijahit & Bordir</option>
                <option value="finishing_qc">Finishing & QC</option>
                <option value="siap_kirim">Siap Kirim & Pelunasan</option>
                <option value="selesai">Selesai</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari order..."
                className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition"
              >
                <span>Unduh Rekap Excel (CSV)</span>
              </button>

              <span className="text-xs text-slate-500">
                Total {filteredOrders.length} pesanan
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">No. Order & Tgl</th>
                  <th className="py-3 px-4">Lembaga & Pemesan</th>
                  <th className="py-3 px-4">Pakaian & Pcs</th>
                  <th className="py-3 px-4">Kain & Warna</th>
                  <th className="py-3 px-4">Total Biaya & DP</th>
                  <th className="py-3 px-4">Status Pipeline</th>
                  <th className="py-3 px-4 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {order.id}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {order.organizationName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {order.customerName} ({order.customerPhone})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {order.apparelTypeName}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800">
                        {order.totalPcs} pcs
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {order.fabricName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {order.fabricColor}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {formatRupiah(order.totalPrice)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        DP: {formatRupiah(order.dpAmountRequired)} (
                        {order.dpPaidAmount >= order.dpAmountRequired
                          ? '✓ Lunas'
                          : 'Belum'}
                        )
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          ORDER_STATUS_MAP[order.status]?.badgeBg
                        }`}
                      >
                        {ORDER_STATUS_MAP[order.status]?.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenSpk(order)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition"
                          title="Cetak SPK Bengkel"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-300" />
                        </button>

                        {onOpenInvoice && (
                          <button
                            onClick={() => onOpenInvoice(order)}
                            className="p-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg transition"
                            title="Cetak Kwitansi / Invoice DP"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-300" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setPaymentModalOrder(order);
                            setPaymentType('dp');
                            setPaymentAmount(order.dpAmountRequired.toString());
                          }}
                          className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition"
                          title="Input Pembayaran DP / Pelunasan"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KATALOG KAIN & HARGA */}
      {activeTab === 'fabrics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Tambah Pilihan Bahan Kain Baru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Admin / Ustadz dapat menambah jenis kain baru tanpa menyentuh kode.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Bahan Kain *
                </label>
                <input
                  type="text"
                  value={newFabricName}
                  onChange={(e) => setNewFabricName(e.target.value)}
                  placeholder="Misal: Oxford Poplin Grade A"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Kategori Kain
                </label>
                <select
                  value={newFabricCategory}
                  onChange={(e) => setNewFabricCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Katun Premium">Katun Premium</option>
                  <option value="Drill Katun Tinggi">Drill Katun Tinggi</option>
                  <option value="Kain Muslimah Flowy">Kain Muslimah Flowy</option>
                  <option value="Kaos 100% Cotton Murni">Kaos Cotton</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Estimasi Harga / Meter (Rp)
                </label>
                <input
                  type="number"
                  value={newFabricPrice}
                  onChange={(e) => setNewFabricPrice(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddFabric}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Kain</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {localFabrics.map((fabric) => (
              <div
                key={fabric.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      {fabric.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {fabric.name}
                    </h4>
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2 py-1 rounded">
                    {formatRupiah(fabric.pricePerMeter)}/m
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    <strong>Sirkulasi:</strong> {fabric.breathability}
                  </p>
                  <p>
                    <strong>Ketebalan:</strong> {fabric.thickness}
                  </p>
                  <p>
                    <strong>Penggunaan:</strong> {fabric.recommendedUse}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    {fabric.colors.length} Pilihan Warna
                  </span>
                  <span className="text-emerald-700 font-semibold">
                    ✓ Stok Distributor Tersedia
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PENGATURAN TOKO & NOMOR REKENING */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Pengaturan Toko, Nomor Rekening & Kontak
              </h3>
              <p className="text-xs text-slate-500">
                Perubahan nomor rekening & WhatsApp di sini akan langsung tampil pada formulir pembeli & format pesan WA.
              </p>
            </div>

            <button
              onClick={handleSaveConfig}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>

          {configSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{configSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nama Brand Konveksi
              </label>
              <input
                type="text"
                value={localConfig.brandName}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, brandName: e.target.value })
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Gelar / Nama Pemilik Usaha
              </label>
              <input
                type="text"
                value={localConfig.ownerTitle}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, ownerTitle: e.target.value })
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nomor WhatsApp Admin / Ustadz (Format: 628...)
              </label>
              <input
                type="text"
                value={localConfig.ownerPhone}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, ownerPhone: e.target.value })
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Syarat Minimal DP (%)
              </label>
              <input
                type="number"
                value={localConfig.minDpPercent}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    minDpPercent: Number(e.target.value) || 50,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Biaya Bordir Nama Dada (Rp / pcs)
              </label>
              <input
                type="number"
                value={localConfig.embroideryPricePerName}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    embroideryPricePerName: Number(e.target.value) || 0,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Biaya Bordir Logo Sekolah (Rp / pcs)
              </label>
              <input
                type="number"
                value={localConfig.embroideryPricePerLogo}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    embroideryPricePerLogo: Number(e.target.value) || 0,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Ganti Sandi / PIN Mas El & Bapak (4-6 Angka)
              </label>
              <input
                type="text"
                value={localConfig.adminPin || '1234'}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    adminPin: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Alamat Fisik Bengkel Konveksi
              </label>
              <input
                type="text"
                value={localConfig.address}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, address: e.target.value })
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Bank Accounts Editor */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
              Daftar Rekening Transfer DP Pembeli
            </h4>
            <div className="space-y-3">
              {localConfig.bankAccounts.map((bank, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs"
                >
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">
                      Nama Bank
                    </label>
                    <input
                      type="text"
                      value={bank.bank}
                      onChange={(e) => {
                        const updated = [...localConfig.bankAccounts];
                        updated[idx].bank = e.target.value;
                        setLocalConfig({ ...localConfig, bankAccounts: updated });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      value={bank.accountNumber}
                      onChange={(e) => {
                        const updated = [...localConfig.bankAccounts];
                        updated[idx].accountNumber = e.target.value;
                        setLocalConfig({ ...localConfig, bankAccounts: updated });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">
                      Atas Nama Rekening
                    </label>
                    <input
                      type="text"
                      value={bank.accountHolder}
                      onChange={(e) => {
                        const updated = [...localConfig.bankAccounts];
                        updated[idx].accountHolder = e.target.value;
                        setLocalConfig({ ...localConfig, bankAccounts: updated });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VERIFIKASI PEMBAYARAN DP */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Verifikasi Pembayaran Pesanan
              </h3>
              <button
                onClick={() => setPaymentModalOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-mono font-bold text-emerald-800 block">
                {paymentModalOrder.id}
              </span>
              <strong className="text-slate-900 block">
                {paymentModalOrder.organizationName}
              </strong>
              <span className="text-slate-600 block">
                Total Biaya: {formatRupiah(paymentModalOrder.totalPrice)}
              </span>
              <span className="text-emerald-900 font-bold block">
                Wajib DP 50%: {formatRupiah(paymentModalOrder.dpAmountRequired)}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Jenis Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('dp');
                      setPaymentAmount(paymentModalOrder.dpAmountRequired.toString());
                    }}
                    className={`py-2 rounded-xl font-bold border transition ${
                      paymentType === 'dp'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    DP 50% ({formatRupiah(paymentModalOrder.dpAmountRequired)})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('full');
                      setPaymentAmount(paymentModalOrder.remainingPayment.toString());
                    }}
                    className={`py-2 rounded-xl font-bold border transition ${
                      paymentType === 'full'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Pelunasan Sisa
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nominal Diterima (Rp)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Metode / Bank Masuk
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="BSI (Bank Syariah Indonesia)">BSI (Bank Syariah Indonesia)</option>
                  <option value="BCA">BCA</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="Tunai / Kasir Bengkel">Tunai / Kasir Bengkel</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentModalOrder(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Simpan & Loloskan ke Meja Potong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE TAHAP PIPELINE */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Pindahkan Tahap Pengerjaan
              </h3>
              <button
                onClick={() => setStatusModalOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-mono font-bold text-emerald-800">
                {statusModalOrder.id}
              </span>{' '}
              - {statusModalOrder.organizationName}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Tahap Baru:
                </label>
                <select
                  value={selectedNextStatus}
                  onChange={(e) => setSelectedNextStatus(e.target.value as OrderStatus)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="menunggu_dp">1. Menunggu Pembayaran DP 50%</option>
                  <option value="dp_lunas">2. DP Lunas / Antrean Potong Pola Kain</option>
                  <option value="proses_jahit">3. Sedang Dijahit & Bordir Komputer</option>
                  <option value="finishing_qc">4. Finishing, QC & Setrika Uap</option>
                  <option value="siap_kirim">5. Siap Kirim / Diambil & Pelunasan</option>
                  <option value="selesai">6. Selesai (Lunas & Serah Terima)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Catatan Progres Tambahan:
                </label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Misal: Kain 120 pcs sudah selesai dipotong, masuk antrean bordir komputer mesin 1..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleUpdateStatus}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
