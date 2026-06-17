import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

const WORKSTATION_STATUS: Record<string, string> = {
  available: 'Müsait',
  in_use: 'Kullanımda',
  cleaning: 'Temizleniyor',
  maintenance: 'Bakımda',
  closed: 'Kapalı',
};

export function formatWorkstationStatus(status: string): string {
  return WORKSTATION_STATUS[status] || status;
}

const WORKSTATION_SPECIALTY: Record<string, string> = {
  formal: 'Resmi Giyim',
  bridal: 'Gelinlik',
  casual: 'Gündelik',
  leather: 'Deri',
  denim: 'Denim',
  specialty: 'Özel İş',
};

export function formatWorkstationSpecialty(specialty: string): string {
  return WORKSTATION_SPECIALTY[specialty] || specialty;
}

const JOB_STATUS: Record<string, string> = {
  recorded: 'Kayıtlı',
  verified: 'Doğrulandı',
  disputed: 'İtirazlı',
};

export function formatJobStatus(status: string): string {
  return JOB_STATUS[status] || status;
}

const JOB_TYPE: Record<string, string> = {
  hem: 'Paça / Kenar',
  suit: 'Takım Elbise',
  wedding_dress: 'Gelinlik',
  leather: 'Deri İşi',
  denim: 'Denim',
  rush: 'Acil İş',
};

export function formatJobType(type: string): string {
  return JOB_TYPE[type] || type;
}

const EQUIPMENT_STATUS: Record<string, string> = {
  open: 'Açık',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export function formatEquipmentMaintenanceStatus(status: string): string {
  return EQUIPMENT_STATUS[status] || status;
}

const EQUIPMENT_PRIORITY: Record<string, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil',
};

export function formatEquipmentMaintenancePriority(priority: string): string {
  return EQUIPMENT_PRIORITY[priority] || priority;
}

const CHECKLIST_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatQualityChecklistStatus(status: string): string {
  return CHECKLIST_STATUS[status] || status;
}

const CHECKLIST_CATEGORY: Record<string, string> = {
  final_press: 'Son Pres',
  stitch_inspection: 'Dikiş Kontrolü',
  fitting_prep: 'Prova Hazırlığı',
  button_check: 'Düğme Kontrolü',
  lining_review: 'Astar İncelemesi',
  other: 'Diğer',
};

export function formatQualityChecklistCategory(category: string): string {
  return CHECKLIST_CATEGORY[category] || category;
}

const FABRIC_ORDER_STATUS: Record<string, string> = {
  pending: 'Beklemede',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  delivered: 'Teslim Edildi',
};

export function formatFabricOrderStatus(status: string): string {
  return FABRIC_ORDER_STATUS[status] || status;
}

const SERVICE_RATE_STATUS: Record<string, string> = {
  active: 'Aktif',
  upcoming: 'Yakında',
  archived: 'Arşiv',
};

export function formatServiceRateStatus(status: string): string {
  return SERVICE_RATE_STATUS[status] || status;
}

const SERVICE_CATEGORY: Record<string, string> = {
  basic_alteration: 'Temel Tadilat',
  bridal_package: 'Gelinlik Paketi',
  rush_service: 'Acil Hizmet',
  leather_work: 'Deri İşi',
  custom_fitting: 'Özel Prova',
  other: 'Diğer',
};

export function formatServiceCategory(category: string): string {
  return SERVICE_CATEGORY[category] || category;
}

const MONTH_NAMES: Record<number, string> = {
  1: 'Ocak',
  2: 'Şubat',
  3: 'Mart',
  4: 'Nisan',
  5: 'Mayıs',
  6: 'Haziran',
  7: 'Temmuz',
  8: 'Ağustos',
  9: 'Eylül',
  10: 'Ekim',
  11: 'Kasım',
  12: 'Aralık',
};

export function formatMonth(month: number): string {
  return MONTH_NAMES[month] || String(month);
}
