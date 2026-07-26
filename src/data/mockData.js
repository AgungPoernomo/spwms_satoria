// =============================================
// MOCK DATA - Spare Parts WMS
// =============================================

export const KATEGORI_LIST = [
  'Engine',
  'Elektrikal',
  'Filter',
  'Rem',
  'Suspensi',
  'Transmisi',
  'Body & Interior',
];

export const SUPPLIERS = [
  { id: 1, nama_supplier: 'PT Sumber Suku Cadang', kontak: '021-5551234', email: 'info@sumbersuku.co.id' },
  { id: 2, nama_supplier: 'CV Elektrik Jaya', kontak: '021-5559876', email: 'sales@elektrikjaya.com' },
  { id: 3, nama_supplier: 'UD Rem Prima', kontak: '031-4445678', email: 'order@remprima.co.id' },
  { id: 4, nama_supplier: 'PT Auto Parts Indonesia', kontak: '021-7778888', email: 'info@autoparts.co.id' },
  { id: 5, nama_supplier: 'CV Mekar Mandiri', kontak: '022-3334455', email: 'sales@mekarmandiri.com' },
];

export const SPARE_PARTS = [
  {
    id: 1,
    kode_part: 'SP-001',
    nama_part: 'Filter Oli Mesin',
    kategori: 'Filter',
    merk_type: 'Sakura / Type A200',
    stok_saat_ini: 12,
    stok_minimum: 20,
    stok_maksimum: 100,
    lokasi_rak: 'Rak A-01-03',
    harga_satuan: 85000,
    supplier: 'PT Sumber Suku Cadang',
    supplier_id: 1,
    status: 'Kritis',
    tanggal_update_terakhir: '2026-07-18T09:15:00Z',
  },
  {
    id: 2,
    kode_part: 'SP-002',
    nama_part: 'Aki Kering 12V 45Ah',
    kategori: 'Elektrikal',
    merk_type: 'GS Astra / NS60',
    stok_saat_ini: 45,
    stok_minimum: 10,
    stok_maksimum: 60,
    lokasi_rak: 'Rak B-02-01',
    harga_satuan: 950000,
    supplier: 'CV Elektrik Jaya',
    supplier_id: 2,
    status: 'Normal',
    tanggal_update_terakhir: '2026-07-19T14:30:00Z',
  },
  {
    id: 3,
    kode_part: 'SP-003',
    nama_part: 'Van Belt Alternator',
    kategori: 'Engine',
    merk_type: 'Bando / VB-1220',
    stok_saat_ini: 130,
    stok_minimum: 15,
    stok_maksimum: 100,
    lokasi_rak: 'Rak A-03-02',
    harga_satuan: 120000,
    supplier: 'PT Sumber Suku Cadang',
    supplier_id: 1,
    status: 'Berlebih',
    tanggal_update_terakhir: '2026-07-17T11:00:00Z',
  },
  {
    id: 4,
    kode_part: 'SP-004',
    nama_part: 'Kampas Rem Depan',
    kategori: 'Rem',
    merk_type: 'Akebono / KRD-77',
    stok_saat_ini: 28,
    stok_minimum: 15,
    stok_maksimum: 80,
    lokasi_rak: 'Rak C-01-05',
    harga_satuan: 210000,
    supplier: 'UD Rem Prima',
    supplier_id: 3,
    status: 'Normal',
    tanggal_update_terakhir: '2026-07-20T08:00:00Z',
  },
  {
    id: 5,
    kode_part: 'SP-005',
    nama_part: 'Busi Iridium',
    kategori: 'Elektrikal',
    merk_type: 'NGK / IX-22',
    stok_saat_ini: 8,
    stok_minimum: 25,
    stok_maksimum: 150,
    lokasi_rak: 'Rak B-01-04',
    harga_satuan: 65000,
    supplier: 'CV Elektrik Jaya',
    supplier_id: 2,
    status: 'Kritis',
    tanggal_update_terakhir: '2026-07-20T07:45:00Z',
  },
  {
    id: 6,
    kode_part: 'SP-006',
    nama_part: 'Bearing Roda Depan',
    kategori: 'Suspensi',
    merk_type: 'NSK / 6205-2RS',
    stok_saat_ini: 35,
    stok_minimum: 10,
    stok_maksimum: 80,
    lokasi_rak: 'Rak D-02-01',
    harga_satuan: 185000,
    supplier: 'PT Auto Parts Indonesia',
    supplier_id: 4,
    status: 'Normal',
    tanggal_update_terakhir: '2026-07-16T13:30:00Z',
  },
  {
    id: 7,
    kode_part: 'SP-007',
    nama_part: 'Filter Udara',
    kategori: 'Filter',
    merk_type: 'Mann / CF1000',
    stok_saat_ini: 5,
    stok_minimum: 15,
    stok_maksimum: 75,
    lokasi_rak: 'Rak A-02-01',
    harga_satuan: 95000,
    supplier: 'CV Mekar Mandiri',
    supplier_id: 5,
    status: 'Kritis',
    tanggal_update_terakhir: '2026-07-19T10:00:00Z',
  },
  {
    id: 8,
    kode_part: 'SP-008',
    nama_part: 'Kopling Set',
    kategori: 'Transmisi',
    merk_type: 'Valeo / KS-123',
    stok_saat_ini: 18,
    stok_minimum: 5,
    stok_maksimum: 40,
    lokasi_rak: 'Rak E-01-03',
    harga_satuan: 1250000,
    supplier: 'PT Sumber Suku Cadang',
    supplier_id: 1,
    status: 'Normal',
    tanggal_update_terakhir: '2026-07-15T09:00:00Z',
  },
  {
    id: 9,
    kode_part: 'SP-009',
    nama_part: 'Lampu Depan LED',
    kategori: 'Elektrikal',
    merk_type: 'Osram / H4-LED',
    stok_saat_ini: 90,
    stok_minimum: 10,
    stok_maksimum: 60,
    lokasi_rak: 'Rak B-03-02',
    harga_satuan: 320000,
    supplier: 'CV Elektrik Jaya',
    supplier_id: 2,
    status: 'Berlebih',
    tanggal_update_terakhir: '2026-07-14T15:00:00Z',
  },
  {
    id: 10,
    kode_part: 'SP-010',
    nama_part: 'Shock Absorber Belakang',
    kategori: 'Suspensi',
    merk_type: 'KYB / SA-456',
    stok_saat_ini: 22,
    stok_minimum: 8,
    stok_maksimum: 50,
    lokasi_rak: 'Rak D-03-04',
    harga_satuan: 850000,
    supplier: 'PT Auto Parts Indonesia',
    supplier_id: 4,
    status: 'Normal',
    tanggal_update_terakhir: '2026-07-18T16:30:00Z',
  },
];

export const TRANSAKSI_MASUK = [
  {
    id: 1,
    tanggal_masuk: '2026-07-19',
    kode_part: 'SP-002',
    nama_part: 'Aki Kering 12V 45Ah',
    jumlah: 20,
    supplier: 'CV Elektrik Jaya',
    no_po_invoice: 'PO-2026-0719-01',
    keterangan: 'Restock rutin bulanan',
  },
  {
    id: 2,
    tanggal_masuk: '2026-07-20',
    kode_part: 'SP-004',
    nama_part: 'Kampas Rem Depan',
    jumlah: 15,
    supplier: 'UD Rem Prima',
    no_po_invoice: 'PO-2026-0720-02',
    keterangan: '',
  },
  {
    id: 3,
    tanggal_masuk: '2026-07-18',
    kode_part: 'SP-006',
    nama_part: 'Bearing Roda Depan',
    jumlah: 25,
    supplier: 'PT Auto Parts Indonesia',
    no_po_invoice: 'PO-2026-0718-03',
    keterangan: 'Pengiriman batch Q3',
  },
  {
    id: 4,
    tanggal_masuk: '2026-07-17',
    kode_part: 'SP-008',
    nama_part: 'Kopling Set',
    jumlah: 10,
    supplier: 'PT Sumber Suku Cadang',
    no_po_invoice: 'PO-2026-0717-04',
    keterangan: 'Restock',
  },
  {
    id: 5,
    tanggal_masuk: '2026-07-15',
    kode_part: 'SP-009',
    nama_part: 'Lampu Depan LED',
    jumlah: 60,
    supplier: 'CV Elektrik Jaya',
    no_po_invoice: 'PO-2026-0715-05',
    keterangan: 'Overstock dari promo supplier',
  },
  {
    id: 6,
    tanggal_masuk: '2026-07-13',
    kode_part: 'SP-001',
    nama_part: 'Filter Oli Mesin',
    jumlah: 30,
    supplier: 'PT Sumber Suku Cadang',
    no_po_invoice: 'PO-2026-0713-06',
    keterangan: 'Restock mingguan',
  },
];

export const TRANSAKSI_KELUAR = [
  {
    id: 1,
    tanggal_keluar: '2026-07-20',
    kode_part: 'SP-001',
    nama_part: 'Filter Oli Mesin',
    jumlah: 5,
    tujuan_departemen: 'Workshop Maintenance',
    no_permintaan: 'REQ-2026-0720-05',
    keterangan: 'Pemakaian servis berkala unit produksi',
  },
  {
    id: 2,
    tanggal_keluar: '2026-07-20',
    kode_part: 'SP-005',
    nama_part: 'Busi Iridium',
    jumlah: 12,
    tujuan_departemen: 'Workshop Maintenance',
    no_permintaan: 'REQ-2026-0720-06',
    keterangan: '',
  },
  {
    id: 3,
    tanggal_keluar: '2026-07-19',
    kode_part: 'SP-002',
    nama_part: 'Aki Kering 12V 45Ah',
    jumlah: 5,
    tujuan_departemen: 'Departemen Logistik',
    no_permintaan: 'REQ-2026-0719-03',
    keterangan: 'Penggantian aki forklift',
  },
  {
    id: 4,
    tanggal_keluar: '2026-07-18',
    kode_part: 'SP-004',
    nama_part: 'Kampas Rem Depan',
    jumlah: 8,
    tujuan_departemen: 'Workshop Maintenance',
    no_permintaan: 'REQ-2026-0718-04',
    keterangan: 'Servis kendaraan operasional',
  },
  {
    id: 5,
    tanggal_keluar: '2026-07-17',
    kode_part: 'SP-010',
    nama_part: 'Shock Absorber Belakang',
    jumlah: 4,
    tujuan_departemen: 'Fleet Management',
    no_permintaan: 'REQ-2026-0717-05',
    keterangan: 'Penggantian shock mobil dinas',
  },
  {
    id: 6,
    tanggal_keluar: '2026-07-16',
    kode_part: 'SP-003',
    nama_part: 'Van Belt Alternator',
    jumlah: 15,
    tujuan_departemen: 'Workshop Maintenance',
    no_permintaan: 'REQ-2026-0716-06',
    keterangan: 'Penggantian berkala',
  },
];

// Generate trend data for last 30 days
export const generateTrendData = () => {
  const data = [];
  const now = new Date('2026-07-20');
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      label: `${date.getDate()}/${date.getMonth() + 1}`,
      masuk: Math.floor(Math.random() * 40) + 5,
      keluar: Math.floor(Math.random() * 30) + 3,
    });
  }
  // Inject real data points
  data[data.length - 1] = { ...data[data.length - 1], masuk: 15, keluar: 17 };
  data[data.length - 2] = { ...data[data.length - 2], masuk: 45, keluar: 13 };
  return data;
};

export const SPARE_PARTS_REPAIR = [
  { id: 1, kode_part: 'SP-002', nama_part: 'Aki Kering 12V 45Ah', tanggal_masuk: '2026-07-15', masalah: 'Tegangan drop', status: 'Dalam Pengerjaan', teknisi: 'Agung' },
  { id: 2, kode_part: 'SP-010', nama_part: 'Shock Absorber Belakang', tanggal_masuk: '2026-07-18', masalah: 'Bocor oli', status: 'Menunggu Sparepart', teknisi: 'Mas sayid' },
  { id: 3, kode_part: 'SP-003', nama_part: 'Van Belt Alternator', tanggal_masuk: '2026-07-19', masalah: 'Retak', status: 'Selesai', teknisi: 'Mas samsu' },
  { id: 4, kode_part: 'SP-008', nama_part: 'Kopling Set', tanggal_masuk: '2026-07-20', masalah: 'Aus', status: 'Baru Masuk', teknisi: 'Belum Ditugaskan' },
];

export const LIFETIME_PARTS = [
  { id: 1, kode_part: 'SP-003', nama_part: 'Van Belt Alternator', mesin: 'Mesin Produksi A', umur_hari: 120, estimasi_maksimal: 180, status: 'Aman' },
  { id: 2, kode_part: 'SP-006', nama_part: 'Bearing Roda Depan', mesin: 'Forklift 01', umur_hari: 350, estimasi_maksimal: 365, status: 'Peringatan' },
  { id: 3, kode_part: 'SP-001', nama_part: 'Filter Oli Mesin', mesin: 'Genset Utama', umur_hari: 95, estimasi_maksimal: 90, status: 'Kritis' },
  { id: 4, kode_part: 'SP-004', nama_part: 'Kampas Rem Depan', mesin: 'Mesin A', umur_hari: 180, estimasi_maksimal: 240, status: 'Aman' },
  { id: 5, kode_part: 'SP-010', nama_part: 'Shock Absorber Belakang', mesin: 'Mesin B', umur_hari: 410, estimasi_maksimal: 400, status: 'Kritis' },
  { id: 6, kode_part: 'SP-009', nama_part: 'Lampu Depan LED', mesin: 'Forklift 02', umur_hari: 10, estimasi_maksimal: 730, status: 'Aman' },
];

// =============================================
// TRACKING DATA — Part Lifecycle
// =============================================

// Lifecycle stage definitions (order matters)
export const LIFECYCLE_STAGES = [
  { id: 'po',                label: 'PO Dibuat',      desc: 'Purchase order diterbitkan' },
  { id: 'pengiriman',        label: 'Dikirim',         desc: 'Dalam pengiriman dari supplier' },
  { id: 'masuk_gudang',      label: 'Tiba di Gudang',  desc: 'Diterima & dicek di gudang' },
  { id: 'di_rak',            label: 'Tersimpan di Rak',desc: 'Sudah diinventory & di rak' },
  { id: 'keluar',            label: 'Digunakan',        desc: 'Dikeluarkan untuk pemakaian' },
  { id: 'perbaikan',         label: 'Perbaikan',        desc: 'Dalam proses perbaikan/servis' },
  { id: 'selesai_perbaikan', label: 'Selesai Perbaikan',desc: 'Perbaikan selesai, kembali ke rak' },
  { id: 'afkir',             label: 'Afkir',            desc: 'Part dinyatakan tidak layak' },
];

// Individual tracked units (Per Unit — Serial Number)
export const TRACKING_UNITS = [
  // SP-002 units (Aki Kering 12V 45Ah)
  {
    id: 'TU-001', kode_part: 'SP-002', nama_part: 'Aki Kering 12V 45Ah',
    kategori: 'Elektrikal', serial_number: 'AK-2026-001',
    batch_ref: 'PO-2026-0719-01', supplier: 'CV Elektrik Jaya',
    status: 'di_rak', lokasi_saat_ini: 'Rak B-02-01',
    pengguna: null, mesin: null, kondisi: 'Baik',
    tanggal_masuk: '2026-07-19', tanggal_keluar: null,
  },
  {
    id: 'TU-002', kode_part: 'SP-002', nama_part: 'Aki Kering 12V 45Ah',
    kategori: 'Elektrikal', serial_number: 'AK-2026-002',
    batch_ref: 'PO-2026-0719-01', supplier: 'CV Elektrik Jaya',
    status: 'keluar', lokasi_saat_ini: 'Departemen Logistik',
    pengguna: 'Mas Budi', mesin: 'Forklift 01', kondisi: 'Baik',
    tanggal_masuk: '2026-07-19', tanggal_keluar: '2026-07-20',
  },
  {
    id: 'TU-003', kode_part: 'SP-002', nama_part: 'Aki Kering 12V 45Ah',
    kategori: 'Elektrikal', serial_number: 'AK-2026-003',
    batch_ref: 'PO-2026-0719-01', supplier: 'CV Elektrik Jaya',
    status: 'perbaikan', lokasi_saat_ini: 'Workshop Maintenance',
    pengguna: 'Agung', mesin: 'Forklift 02', kondisi: 'Rusak',
    tanggal_masuk: '2026-07-15', tanggal_keluar: '2026-07-16',
  },
  // SP-001 units (Filter Oli Mesin)
  {
    id: 'TU-004', kode_part: 'SP-001', nama_part: 'Filter Oli Mesin',
    kategori: 'Filter', serial_number: 'FO-2026-001',
    batch_ref: 'PO-2026-0713-06', supplier: 'PT Sumber Suku Cadang',
    status: 'di_rak', lokasi_saat_ini: 'Rak A-01-03',
    pengguna: null, mesin: null, kondisi: 'Baik',
    tanggal_masuk: '2026-07-13', tanggal_keluar: null,
  },
  {
    id: 'TU-005', kode_part: 'SP-001', nama_part: 'Filter Oli Mesin',
    kategori: 'Filter', serial_number: 'FO-2026-002',
    batch_ref: 'PO-2026-0713-06', supplier: 'PT Sumber Suku Cadang',
    status: 'keluar', lokasi_saat_ini: 'Workshop Maintenance',
    pengguna: 'Mas Samsu', mesin: 'Genset Utama', kondisi: 'Baik',
    tanggal_masuk: '2026-07-13', tanggal_keluar: '2026-07-20',
  },
  // SP-004 units (Kampas Rem Depan)
  {
    id: 'TU-006', kode_part: 'SP-004', nama_part: 'Kampas Rem Depan',
    kategori: 'Rem', serial_number: 'KR-2026-001',
    batch_ref: 'PO-2026-0720-02', supplier: 'UD Rem Prima',
    status: 'masuk_gudang', lokasi_saat_ini: 'Area Penerimaan Gudang',
    pengguna: null, mesin: null, kondisi: 'Baik',
    tanggal_masuk: '2026-07-20', tanggal_keluar: null,
  },
  {
    id: 'TU-007', kode_part: 'SP-004', nama_part: 'Kampas Rem Depan',
    kategori: 'Rem', serial_number: 'KR-2026-002',
    batch_ref: 'PO-2026-0720-02', supplier: 'UD Rem Prima',
    status: 'afkir', lokasi_saat_ini: 'Area Disposal',
    pengguna: 'Teknisi A', mesin: 'Mobil Operasional', kondisi: 'Rusak Parah',
    tanggal_masuk: '2026-06-01', tanggal_keluar: '2026-06-15',
  },
];

// Event history per unit
export const TRACKING_EVENTS = [
  // TU-001 (AK-2026-001 — Di Rak)
  { id: 'TE-001', unit_id: 'TU-001', kode_part: 'SP-002', event_type: 'po',           tanggal: '2026-07-17T09:00:00', deskripsi: 'Purchase Order diterbitkan', petugas: 'Admin Gudang', departemen: 'Pengadaan', catatan: 'PO-2026-0719-01, qty: 20 pcs' },
  { id: 'TE-002', unit_id: 'TU-001', kode_part: 'SP-002', event_type: 'pengiriman',   tanggal: '2026-07-18T08:00:00', deskripsi: 'Dikirim oleh CV Elektrik Jaya', petugas: 'Driver Supplier', departemen: 'Eksternal', catatan: 'Estimasi tiba 19 Juli' },
  { id: 'TE-003', unit_id: 'TU-001', kode_part: 'SP-002', event_type: 'masuk_gudang', tanggal: '2026-07-19T10:15:00', deskripsi: 'Tiba & diperiksa kondisi fisik', petugas: 'Petugas Penerimaan', departemen: 'Gudang', catatan: 'Kondisi baik, tidak ada kerusakan fisik' },
  { id: 'TE-004', unit_id: 'TU-001', kode_part: 'SP-002', event_type: 'di_rak',       tanggal: '2026-07-19T14:00:00', deskripsi: 'Diinventory & disimpan di rak', petugas: 'Admin Gudang', departemen: 'Gudang', catatan: 'Lokasi Rak B-02-01, Serial AK-2026-001' },

  // TU-002 (AK-2026-002 — Digunakan)
  { id: 'TE-005', unit_id: 'TU-002', kode_part: 'SP-002', event_type: 'po',           tanggal: '2026-07-17T09:00:00', deskripsi: 'Purchase Order diterbitkan', petugas: 'Admin Gudang', departemen: 'Pengadaan', catatan: 'PO-2026-0719-01, qty: 20 pcs' },
  { id: 'TE-006', unit_id: 'TU-002', kode_part: 'SP-002', event_type: 'pengiriman',   tanggal: '2026-07-18T08:00:00', deskripsi: 'Dikirim oleh CV Elektrik Jaya', petugas: 'Driver Supplier', departemen: 'Eksternal', catatan: '' },
  { id: 'TE-007', unit_id: 'TU-002', kode_part: 'SP-002', event_type: 'masuk_gudang', tanggal: '2026-07-19T10:15:00', deskripsi: 'Tiba & diperiksa kondisi fisik', petugas: 'Petugas Penerimaan', departemen: 'Gudang', catatan: '' },
  { id: 'TE-008', unit_id: 'TU-002', kode_part: 'SP-002', event_type: 'di_rak',       tanggal: '2026-07-19T14:00:00', deskripsi: 'Disimpan di rak', petugas: 'Admin Gudang', departemen: 'Gudang', catatan: 'Rak B-02-01' },
  { id: 'TE-009', unit_id: 'TU-002', kode_part: 'SP-002', event_type: 'keluar',       tanggal: '2026-07-20T08:30:00', deskripsi: 'Dikeluarkan untuk pemakaian', petugas: 'Mas Budi', departemen: 'Departemen Logistik', catatan: 'Penggantian aki Forklift 01' },

  // TU-003 (AK-2026-003 — Perbaikan)
  { id: 'TE-010', unit_id: 'TU-003', kode_part: 'SP-002', event_type: 'po',           tanggal: '2026-07-10T09:00:00', deskripsi: 'Purchase Order diterbitkan', petugas: 'Admin Gudang', departemen: 'Pengadaan', catatan: '' },
  { id: 'TE-011', unit_id: 'TU-003', kode_part: 'SP-002', event_type: 'masuk_gudang', tanggal: '2026-07-15T10:00:00', deskripsi: 'Tiba & diperiksa', petugas: 'Petugas Penerimaan', departemen: 'Gudang', catatan: '' },
  { id: 'TE-012', unit_id: 'TU-003', kode_part: 'SP-002', event_type: 'di_rak',       tanggal: '2026-07-15T13:00:00', deskripsi: 'Disimpan di rak', petugas: 'Admin Gudang', departemen: 'Gudang', catatan: '' },
  { id: 'TE-013', unit_id: 'TU-003', kode_part: 'SP-002', event_type: 'keluar',       tanggal: '2026-07-16T07:45:00', deskripsi: 'Dipakai pada Forklift 02', petugas: 'Agung', departemen: 'Operasional', catatan: 'Penggantian aki lemah' },
  { id: 'TE-014', unit_id: 'TU-003', kode_part: 'SP-002', event_type: 'perbaikan',    tanggal: '2026-07-22T09:00:00', deskripsi: 'Tegangan drop, dibawa ke workshop', petugas: 'Agung', departemen: 'Workshop Maintenance', catatan: 'Kemungkinan sel rusak. Masalah: tidak bisa menyimpan daya' },

  // TU-004 (FO-2026-001 — Di Rak)
  { id: 'TE-015', unit_id: 'TU-004', kode_part: 'SP-001', event_type: 'po',           tanggal: '2026-07-12T09:00:00', deskripsi: 'PO diterbitkan', petugas: 'Admin Gudang', departemen: 'Pengadaan', catatan: 'PO-2026-0713-06' },
  { id: 'TE-016', unit_id: 'TU-004', kode_part: 'SP-001', event_type: 'masuk_gudang', tanggal: '2026-07-13T11:00:00', deskripsi: 'Tiba dari PT Sumber Suku Cadang', petugas: 'Petugas Penerimaan', departemen: 'Gudang', catatan: '' },
  { id: 'TE-017', unit_id: 'TU-004', kode_part: 'SP-001', event_type: 'di_rak',       tanggal: '2026-07-13T14:30:00', deskripsi: 'Disimpan Rak A-01-03', petugas: 'Admin Gudang', departemen: 'Gudang', catatan: '' },

  // TU-005 (FO-2026-002 — Digunakan)
  { id: 'TE-018', unit_id: 'TU-005', kode_part: 'SP-001', event_type: 'po',           tanggal: '2026-07-12T09:00:00', deskripsi: 'PO diterbitkan', petugas: 'Admin Gudang', departemen: 'Pengadaan', catatan: '' },
  { id: 'TE-019', unit_id: 'TU-005', kode_part: 'SP-001', event_type: 'masuk_gudang', tanggal: '2026-07-13T11:00:00', deskripsi: 'Tiba dari PT Sumber Suku Cadang', petugas: 'Petugas Penerimaan', departemen: 'Gudang', catatan: '' },
  { id: 'TE-020', unit_id: 'TU-005', kode_part: 'SP-001', event_type: 'di_rak',       tanggal: '2026-07-13T14:30:00', deskripsi: 'Disimpan Rak A-01-03', petugas: 'Admin Gudang', departemen: 'Gudang', catatan: '' },
  { id: 'TE-021', unit_id: 'TU-005', kode_part: 'SP-001', event_type: 'keluar',       tanggal: '2026-07-20T07:45:00', deskripsi: 'Dipakai untuk servis Genset Utama', petugas: 'Mas Samsu', departemen: 'Workshop Maintenance', catatan: 'Servis berkala 500 jam' },

  // TU-006 (KR-2026-001 — Baru tiba)
  { id: 'TE-022', unit_id: 'TU-006', kode_part: 'SP-004', event_type: 'po',           tanggal: '2026-07-18T09:00:00', deskripsi: 'PO diterbitkan', petugas: 'Admin Gudang', departemen: 'Pengadaan', catatan: 'PO-2026-0720-02' },
  { id: 'TE-023', unit_id: 'TU-006', kode_part: 'SP-004', event_type: 'pengiriman',   tanggal: '2026-07-19T10:00:00', deskripsi: 'Dikirim oleh UD Rem Prima', petugas: 'Driver Supplier', departemen: 'Eksternal', catatan: '' },
  { id: 'TE-024', unit_id: 'TU-006', kode_part: 'SP-004', event_type: 'masuk_gudang', tanggal: '2026-07-20T09:30:00', deskripsi: 'Tiba, menunggu proses inventori', petugas: 'Petugas Penerimaan', departemen: 'Gudang', catatan: 'Belum disimpan ke rak' },

  // TU-007 (KR-2026-002 — Afkir)
  { id: 'TE-025', unit_id: 'TU-007', kode_part: 'SP-004', event_type: 'po',           tanggal: '2026-05-30T09:00:00', deskripsi: 'PO diterbitkan', petugas: 'Admin Gudang', departemen: 'Pengadaan', catatan: '' },
  { id: 'TE-026', unit_id: 'TU-007', kode_part: 'SP-004', event_type: 'masuk_gudang', tanggal: '2026-06-01T10:00:00', deskripsi: 'Tiba dari UD Rem Prima', petugas: 'Petugas Penerimaan', departemen: 'Gudang', catatan: '' },
  { id: 'TE-027', unit_id: 'TU-007', kode_part: 'SP-004', event_type: 'di_rak',       tanggal: '2026-06-01T13:00:00', deskripsi: 'Disimpan Rak C-01-05', petugas: 'Admin Gudang', departemen: 'Gudang', catatan: '' },
  { id: 'TE-028', unit_id: 'TU-007', kode_part: 'SP-004', event_type: 'keluar',       tanggal: '2026-06-15T08:00:00', deskripsi: 'Dipakai di Mobil Operasional', petugas: 'Teknisi A', departemen: 'Workshop Maintenance', catatan: '' },
  { id: 'TE-029', unit_id: 'TU-007', kode_part: 'SP-004', event_type: 'perbaikan',    tanggal: '2026-07-10T09:00:00', deskripsi: 'Aus parah, dibawa ke workshop', petugas: 'Teknisi A', departemen: 'Workshop Maintenance', catatan: 'Kampas habis sepenuhnya' },
  { id: 'TE-030', unit_id: 'TU-007', kode_part: 'SP-004', event_type: 'afkir',        tanggal: '2026-07-12T10:00:00', deskripsi: 'Dinyatakan tidak layak pakai', petugas: 'Admin Gudang', departemen: 'Gudang', catatan: 'Sudah dikirim ke area disposal' },
];

// Approval requests for status change
export const APPROVAL_REQUESTS = [
  {
    id: 'AR-001',
    unit_id: 'TU-001', kode_part: 'SP-002', nama_part: 'Aki Kering 12V 45Ah', serial_number: 'AK-2026-001',
    requested_by: 'Staff Gudang', requested_at: '2026-07-26T07:30:00',
    action: 'keluar', target_departemen: 'Workshop Maintenance', target_mesin: 'Forklift 03',
    reason: 'Penggantian aki forklift yang sudah lemah tegangan',
    status: 'pending', approved_by: null, approved_at: null, rejected_reason: null,
  },
  {
    id: 'AR-002',
    unit_id: 'TU-004', kode_part: 'SP-001', nama_part: 'Filter Oli Mesin', serial_number: 'FO-2026-001',
    requested_by: 'Staff Gudang', requested_at: '2026-07-25T14:00:00',
    action: 'keluar', target_departemen: 'Workshop Maintenance', target_mesin: 'Mesin Produksi A',
    reason: 'Ganti filter oli berkala 500 jam operasional mesin',
    status: 'approved', approved_by: 'Admin Gudang', approved_at: '2026-07-25T15:30:00', rejected_reason: null,
  },
  {
    id: 'AR-003',
    unit_id: 'TU-003', kode_part: 'SP-002', nama_part: 'Aki Kering 12V 45Ah', serial_number: 'AK-2026-003',
    requested_by: 'Agung', requested_at: '2026-07-22T08:45:00',
    action: 'afkir', target_departemen: null, target_mesin: null,
    reason: 'Sel aki sudah tidak bisa diperbaiki, perlu afkir',
    status: 'rejected', approved_by: 'Admin Gudang', approved_at: null, rejected_reason: 'Perlu cek ulang oleh teknisi senior sebelum diafkir',
  },
];

