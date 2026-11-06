export type OrderStatus =
  | 'menunggu_dp'
  | 'dp_lunas'
  | 'proses_jahit'
  | 'finishing_qc'
  | 'siap_kirim'
  | 'selesai';

export interface FabricColor {
  name: string;
  hex: string;
}

export interface Fabric {
  id: string;
  name: string;
  category: string;
  composition: string;
  thickness: string;
  breathability: string;
  drapability: string;
  texture: string;
  recommendedUse: string;
  pricePerMeter: number;
  colors: FabricColor[];
  image: string;
  inStock: boolean;
  popularFor?: string;
}

export interface ApparelType {
  id: string;
  name: string;
  category: 'baju_koko' | 'gamis_abaya' | 'kemeja_pdh' | 'jas_almamater' | 'kaos_santri' | 'custom';
  description: string;
  basePrice: number;
  minQty: number;
  image: string;
  defaultFabricId: string;
  sizeGuide?: {
    size: string;
    chest: string;
    length: string;
    sleeve: string;
  }[];
}

export interface SizeBreakdown {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
  XXXL: number;
  custom: number;
}

export interface EmbroideryItem {
  id: string;
  name: string;
  size: string;
  position?: string;
  notes?: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountHolder: string;
  logo?: string;
}

export interface WorkshopConfig {
  brandName: string;
  brandTagline: string;
  ownerTitle: string;
  ownerPhone: string;
  address: string;
  bankAccounts: BankAccount[];
  minDpPercent: number;
  minWholesaleQty: number;
  embroideryPricePerName: number;
  embroideryPricePerLogo: number;
  announcement?: string;
  adminPin?: string;
}

export interface OrderHistoryLog {
  status: OrderStatus;
  timestamp: string;
  notes: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  organizationName: string;
  apparelTypeId: string;
  apparelTypeName: string;
  fabricId: string;
  fabricName: string;
  fabricColor: string;
  fabricColorHex?: string;
  sizeBreakdown: SizeBreakdown;
  totalPcs: number;
  unitPrice: number;
  embroideryType: 'tanpa_bordir' | 'nama_dada' | 'logo_sekolah' | 'nama_dan_logo';
  embroideryFeePerPcs: number;
  totalPrice: number;
  dpAmountRequired: number; // 50%
  dpPaidAmount: number;
  dpPaidAt?: string;
  paymentMethod?: string;
  remainingPayment: number;
  isFullyPaid: boolean;
  embroideryLogoUrl?: string;
  embroideryItems: EmbroideryItem[];
  specialNotes?: string;
  deadlineDate: string;
  status: OrderStatus;
  history: OrderHistoryLog[];
  spkPrintedAt?: string;
}

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  pendingDpOrders: number;
  inProductionOrders: number;
  readyOrders: number;
  totalRevenue: number;
  totalDpReceived: number;
  totalPendingRemaining: number;
  totalPcsInProduction: number;
}
