// SIMPAH - SIPSN Waste Categories
// Standar Sistem Informasi Pengelolaan Sampah Nasional

export const SIPSN_CATEGORIES = [
  { code: 'SM', name: 'Sisa Makanan', emoji: '🍚', color: '#92400e' },
  { code: 'KR', name: 'Kayu / Ranting', emoji: '🪵', color: '#78350f' },
  { code: 'KK', name: 'Kertas / Karton', emoji: '📄', color: '#1e40af' },
  { code: 'PL', name: 'Plastik', emoji: '🧴', color: '#0369a1' },
  { code: 'LG', name: 'Logam', emoji: '🔩', color: '#475569' },
  { code: 'KT', name: 'Kain / Tekstil', emoji: '👕', color: '#7c3aed' },
  { code: 'KL', name: 'Karet / Kulit', emoji: '👟', color: '#b91c1c' },
  { code: 'KC', name: 'Kaca', emoji: '🪟', color: '#0d9488' },
  { code: 'LN', name: 'Lainnya', emoji: '📦', color: '#6b7280' }
];

export const WASTE_TYPES = [
  { id: 'masuk', label: 'Sampah Masuk', icon: '📥', color: 'green' },
  { id: 'pilah', label: 'Sampah Terpilah', icon: '♻️', color: 'blue' },
  { id: 'olah', label: 'Olah Sampah', icon: '🔄', color: 'orange' },
  { id: 'residu', label: 'Residu', icon: '🗑️', color: 'red' }
];

export const TREATMENT_METHODS = [
  { id: 'pakan_ternak', label: 'Pakan Ternak', emoji: '🐔', desc: 'Sisa makanan untuk pakan ayam, lele, sapi, dll' },
  { id: 'maggot_bsf', label: 'Maggot BSF', emoji: '🪱', desc: 'Biokonversi larva Black Soldier Fly' },
  { id: 'pengomposan', label: 'Pengomposan', emoji: '🍂', desc: 'Kompos aerob, takakura, komposter drum' },
  { id: 'biogas', label: 'Biogas / Biodigester', emoji: '⚡', desc: 'Pengolahan organik menjadi energi gas' },
  { id: 'insinerator', label: 'Insinerator', emoji: '🔥', desc: 'Pembakaran thermal tersertifikasi' },
  { id: 'pirolisis', label: 'Pirolisis', emoji: '🛢️', desc: 'Konversi plastik menjadi BBM alternatif' },
  { id: 'eco_enzyme', label: 'Eco-Enzyme', emoji: '🧴', desc: 'Fermentasi kulit buah menjadi cairan pembersih' },
  { id: 'kerajinan', label: 'Kerajinan / Upcycling', emoji: '🎨', desc: 'Daur kreatif menjadi produk kerajinan tangan' },
  { id: 'lainnya', label: 'Pengolahan Lainnya', emoji: '✨', desc: 'Metode pengolahan mandiri lain' }
];

export const LOCATION_TYPES = [
  { id: 'tps', label: 'TPS', color: '#f59e0b', icon: '📍' },
  { id: 'tps3r', label: 'TPS3R', color: '#10b981', icon: '♻️' },
  { id: 'bank_sampah', label: 'Bank Sampah', color: '#3b82f6', icon: '🏦' },
  { id: 'pengepul', label: 'Pengepul', color: '#8b5cf6', icon: '🏪' },
  { id: 'tpa', label: 'TPA', color: '#ef4444', icon: '🏭' }
];

export const INCIDENTAL_TYPES = [
  { id: 'kerja_bakti', label: 'Kerja Bakti', emoji: '🧹' },
  { id: 'event', label: 'Event / Acara', emoji: '🎪' },
  { id: 'bencana', label: 'Bencana', emoji: '⚠️' },
  { id: 'pembersihan', label: 'Pembersihan Khusus', emoji: '🧼' },
  { id: 'edukasi', label: 'Edukasi/Sosialisasi', emoji: '📢' },
  { id: 'lainnya', label: 'Lainnya', emoji: '✨' }
];

export const USER_ROLES = [
  { id: 'kader', label: 'Kader Lingkungan', icon: '🌿' },
  { id: 'petugas', label: 'Petugas Pengangkut', icon: '🚛' },
  { id: 'pemdes', label: 'Pemerintah Desa', icon: '🏛️' },
  { id: 'pengepul', label: 'Pengepul', icon: '🏪' },
  { id: 'dinas', label: 'Dinas Lingkungan', icon: '🏛️' }
];

export function getCategoryByCode(code) {
  return SIPSN_CATEGORIES.find(c => c.code === code);
}

export function getLocationTypeInfo(type) {
  return LOCATION_TYPES.find(l => l.id === type);
}
