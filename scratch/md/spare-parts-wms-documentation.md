# Spare Parts Warehouse Management System
### Dokumentasi Blueprint Proyek

**Versi:** 1.0.0
**Platform Pengembangan:** Google Antigravity
**Terakhir Diperbarui:** Juli 2026

---

## Daftar Isi

1. [Project Overview](#1-project-overview)
2. [Fitur & Spesifikasi](#2-fitur--spesifikasi)
3. [Tech Stack](#3-tech-stack)
4. [Database Schema](#4-database-schema)
5. [UI/UX Design Guidelines](#5-uiux-design-guidelines)
6. [Data Dummy](#6-data-dummy)
7. [Instalasi & Setup](#7-instalasi--setup)
8. [Struktur Folder](#8-struktur-folder)
9. [API Endpoints](#9-api-endpoints)
10. [Roadmap Pengembangan](#10-roadmap-pengembangan)

---

## 1. Project Overview

### 1.1 Deskripsi Proyek

**Spare Parts Warehouse Management System (SPWMS)** adalah aplikasi web untuk mengelola inventaris spare part di lingkungan gudang industri/manufaktur/otomotif. Aplikasi ini dirancang untuk menggantikan proses pencatatan manual (spreadsheet/paper-based) dengan sistem digital yang terpusat, real-time, dan mudah diakses.

### 1.2 Latar Belakang & Masalah yang Diselesaikan

| Masalah Umum di Gudang Spare Part | Solusi dari SPWMS |
|---|---|
| Stok tidak terpantau real-time | Dashboard dengan data live & status otomatis |
| Kehabisan stok mendadak (stockout) | Sistem alert stok kritis berbasis stok minimum |
| Penumpukan stok berlebih (overstock) | Alert stok berlebih berbasis stok maksimum |
| Sulit melacak riwayat keluar-masuk barang | Modul transaksi masuk/keluar dengan histori lengkap |
| Laporan manual memakan waktu | Modul laporan dengan filter otomatis & export |
| Tidak ada kontrol akses pengguna | Role-based access control (Admin, Staff, Viewer) |

### 1.3 Tujuan Proyek

- Menyediakan visibilitas stok secara real-time melalui dashboard.
- Mempermudah pencatatan transaksi barang masuk dan keluar.
- Memberikan peringatan dini terhadap kondisi stok kritis maupun berlebih.
- Menyediakan laporan historis yang dapat difilter untuk kebutuhan audit dan analisis.
- Membangun fondasi arsitektur yang scalable (frontend modular + backend cloud-native TiDB) untuk pengembangan lanjutan (barcode, multi-role, dsb).

### 1.4 Target Pengguna

- **Admin** — mengelola seluruh data master, pengguna, dan konfigurasi sistem.
- **Staff Gudang** — mencatat transaksi barang masuk/keluar, mengelola data spare part harian.
- **Viewer / Manajemen** — melihat dashboard dan laporan tanpa hak edit.

---

## 2. Fitur & Spesifikasi

### 2.1 Dashboard

Halaman utama yang menampilkan ringkasan kondisi gudang secara sekilas (at-a-glance).

**Komponen:**
- **Summary Cards:**
  - Total Spare Parts (jumlah SKU terdaftar)
  - Barang Masuk Hari Ini (total qty transaksi masuk hari berjalan)
  - Barang Keluar Hari Ini (total qty transaksi keluar hari berjalan)
  - Jumlah Item Status "Kritis" (item dengan stok ≤ stok minimum)
- **Grafik Tren Pergerakan Barang:**
  - Line/Bar chart pergerakan masuk vs keluar (7/30 hari terakhir)
  - Pie/Donut chart distribusi status stok (Kritis, Normal, Berlebih)
  - Top 5 spare part dengan pergerakan tertinggi
- **Tabel Alert Cepat:** daftar ringkas item kritis yang perlu tindakan segera

**Interaksi:** filter rentang tanggal untuk grafik, klik card untuk navigasi ke halaman terkait.

---

### 2.2 Manajemen Data Spare Part (Master Data)

CRUD penuh (Create, Read, Update, Delete) untuk data induk spare part.

**Field Data:**

| Field | Tipe | Keterangan |
|---|---|---|
| `kode_part` | String (unique) | Kode identifikasi unik, auto-generate atau manual |
| `nama_part` | String | Nama spare part |
| `kategori` | String / FK | Contoh: Engine, Elektrikal, Filter, dsb |
| `merk_type` | String | Merk dan tipe/model part |
| `stok_saat_ini` | Integer | Stok aktual di gudang |
| `stok_minimum` | Integer | Batas bawah — trigger status Kritis |
| `stok_maksimum` | Integer | Batas atas — trigger status Berlebih |
| `lokasi_rak` | String | Contoh: Rak A-01-03 |
| `harga_satuan` | Decimal | Harga per unit (untuk valuasi stok) |
| `supplier` | String / FK | Nama supplier utama |
| `status` | Enum | Kritis / Normal / Berlebih (auto-calculated) |
| `tanggal_update_terakhir` | Timestamp | Auto-update setiap perubahan stok |

**Fungsi:**
- Tambah, edit, hapus data spare part (via modal form).
- Pencarian (search) berdasarkan kode/nama/kategori.
- Sorting kolom (klik header tabel).
- Filter berdasarkan kategori, status, dan supplier.
- Validasi: kode part harus unik, stok minimum < stok maksimum.
- Status dihitung otomatis (lihat bagian 2.5).

---

### 2.3 Transaksi Barang Masuk

Mencatat penerimaan spare part ke gudang (dari supplier atau retur).

**Field Data:**

| Field | Tipe | Keterangan |
|---|---|---|
| `tanggal_masuk` | Date | Tanggal penerimaan barang |
| `kode_part` | String / FK | Referensi ke master spare part |
| `jumlah` | Integer | Kuantitas barang masuk |
| `supplier` | String | Nama supplier pengirim |
| `no_po_invoice` | String | Nomor Purchase Order / Invoice terkait |
| `keterangan` | Text | Catatan tambahan (opsional) |

**Fungsi:**
- Form input transaksi masuk (modal), dengan autocomplete kode part.
- Setelah disimpan → `stok_saat_ini` pada master part **otomatis bertambah**.
- Riwayat transaksi masuk ditampilkan dalam tabel dengan filter tanggal & supplier.

---

### 2.4 Transaksi Barang Keluar

Mencatat pengeluaran spare part dari gudang (untuk kebutuhan internal/departemen).

**Field Data:**

| Field | Tipe | Keterangan |
|---|---|---|
| `tanggal_keluar` | Date | Tanggal pengeluaran barang |
| `kode_part` | String / FK | Referensi ke master spare part |
| `jumlah` | Integer | Kuantitas barang keluar |
| `tujuan_departemen` | String | Departemen/unit yang meminta |
| `no_permintaan` | String | Nomor surat permintaan barang |
| `keterangan` | Text | Catatan tambahan (opsional) |

**Fungsi:**
- Form input transaksi keluar (modal), dengan autocomplete kode part.
- Validasi: jumlah keluar tidak boleh melebihi `stok_saat_ini`.
- Setelah disimpan → `stok_saat_ini` pada master part **otomatis berkurang**.
- Riwayat transaksi keluar ditampilkan dalam tabel dengan filter tanggal & departemen.

---

### 2.5 Status Kritis & Alert

Sistem otomatis untuk memantau kesehatan level stok.

**Logika Status (auto-calculated setiap ada perubahan stok):**

```

IF stok_saat_ini <= stok_minimum → Status = "Kritis"
ELSE IF stok_saat_ini >= stok_maksimum → Status = "Berlebih"
ELSE → Status = "Normal"

```

**Fitur Alert:**
- Badge warna pada tabel spare part (Merah = Kritis, Kuning = Berlebih, Hijau = Normal).
- Notifikasi/banner di Dashboard untuk item Kritis.
- (Nice to have) Notifikasi push/email harian ringkasan item kritis.

---

### 2.6 Laporan & Histori

Modul pelaporan gabungan transaksi masuk & keluar dengan kemampuan filter.

**Filter Tersedia:**
- Periode waktu (tanggal awal – tanggal akhir, atau preset: Hari ini/Minggu ini/Bulan ini)
- Kategori spare part
- Status stok (Kritis/Normal/Berlebih)
- Jenis transaksi (Masuk/Keluar/Semua)

**Output:**
- Tabel laporan dengan pagination.
- Ringkasan total qty masuk, keluar, dan selisih (net movement).
- Export ke Excel/CSV (fitur tambahan).

---

## 3. Tech Stack

| Layer | Teknologi | Alasan Pemilihan |
|---|---|---|
| **Frontend Framework** | React.js (functional components + Hooks) | Ekosistem matang, component-based, mudah dikembangkan di Google Antigravity |
| **Styling** | Tailwind CSS | Utility-first, cepat membangun UI responsif dan konsisten |
| **State Management** | **Zustand** (direkomendasikan) | Lebih ringan dari Redux, boilerplate minim, cocok untuk state global seperti data spare part, filter, dan auth tanpa context re-render berlebih. Context API tetap digunakan untuk state sederhana seperti tema atau auth session. |
| **Backend/Database** | TiDB (Cloud-native Distributed SQL) | Kompatibel MySQL protocol, scalable secara horizontal, cocok untuk pertumbuhan data transaksi gudang jangka panjang |
| **API Layer (rencana)** | REST API (Node.js/Express *atau* serverless function) | Menjembatani frontend React dengan TiDB |
| **Charting** | Recharts / Chart.js | Untuk grafik tren pergerakan barang di dashboard |
| **Icon** | Lucide React | Ikon modern, ringan, konsisten dengan Tailwind |
| **Data Awal** | Mock data (JSON lokal) | Pengembangan UI tanpa dependency backend di tahap awal |

### Catatan Pemilihan State Management

> **Zustand direkomendasikan sebagai state management utama** untuk data yang sering berubah dan diakses lintas komponen (daftar spare part, transaksi, filter aktif). **Context API** cukup digunakan untuk state yang jarang berubah, seperti informasi user yang login dan preferensi tema. Kombinasi ini menghindari re-render berlebihan yang biasa terjadi jika seluruh state global ditaruh di Context API.

---

## 4. Database Schema

Skema dirancang untuk TiDB (kompatibel sintaks MySQL).

### 4.1 Tabel `spare_parts`

```sql
CREATE TABLE spare_parts (
    id              BIGINT AUTO_RANDOM PRIMARY KEY,
    kode_part       VARCHAR(50) NOT NULL UNIQUE,
    nama_part       VARCHAR(150) NOT NULL,
    kategori        VARCHAR(100) NOT NULL,
    merk_type       VARCHAR(100),
    stok_saat_ini   INT NOT NULL DEFAULT 0,
    stok_minimum    INT NOT NULL DEFAULT 0,
    stok_maksimum   INT NOT NULL DEFAULT 0,
    lokasi_rak      VARCHAR(50),
    harga_satuan    DECIMAL(15,2) NOT NULL DEFAULT 0,
    supplier_id     BIGINT,
    status          ENUM('Kritis','Normal','Berlebih') NOT NULL DEFAULT 'Normal',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_kategori (kategori),
    INDEX idx_status (status)
);
```

### 4.2 Tabel `suppliers`

```sql
CREATE TABLE suppliers (
    id              BIGINT AUTO_RANDOM PRIMARY KEY,
    nama_supplier   VARCHAR(150) NOT NULL,
    kontak          VARCHAR(100),
    alamat          TEXT,
    email           VARCHAR(100),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 Tabel `transaksi_masuk`

```sql
CREATE TABLE transaksi_masuk (
    id              BIGINT AUTO_RANDOM PRIMARY KEY,
    tanggal_masuk   DATE NOT NULL,
    spare_part_id   BIGINT NOT NULL,
    jumlah          INT NOT NULL,
    supplier_id     BIGINT,
    no_po_invoice   VARCHAR(100),
    keterangan      TEXT,
    created_by      BIGINT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    INDEX idx_tanggal_masuk (tanggal_masuk)
);
```

### 4.4 Tabel `transaksi_keluar`

```sql
CREATE TABLE transaksi_keluar (
    id                  BIGINT AUTO_RANDOM PRIMARY KEY,
    tanggal_keluar      DATE NOT NULL,
    spare_part_id       BIGINT NOT NULL,
    jumlah              INT NOT NULL,
    tujuan_departemen   VARCHAR(150),
    no_permintaan       VARCHAR(100),
    keterangan          TEXT,
    created_by          BIGINT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id),
    INDEX idx_tanggal_keluar (tanggal_keluar)
);
```

### 4.5 Tabel `users` (untuk role-based access — fitur tambahan)

```sql
CREATE TABLE users (
    id              BIGINT AUTO_RANDOM PRIMARY KEY,
    nama            VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('Admin','Staff','Viewer') NOT NULL DEFAULT 'Viewer',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.6 Tabel `kategori` (opsional, jika kategori ingin dinormalisasi)

```sql
CREATE TABLE kategori (
    id      BIGINT AUTO_RANDOM PRIMARY KEY,
    nama    VARCHAR(100) NOT NULL UNIQUE
);
```

### 4.7 Entity Relationship (ringkas)

```
suppliers (1) ──< (N) spare_parts
spare_parts (1) ──< (N) transaksi_masuk
spare_parts (1) ──< (N) transaksi_keluar
users (1) ──< (N) transaksi_masuk / transaksi_keluar  (created_by)
```

---

## 5. UI/UX Design Guidelines

### 5.1 Tema Warna

| Peran Warna | Kode Hex | Penggunaan |
|---|---|---|
| Primary | `#4F46E5` (Indigo 600) | Tombol utama, header sidebar, aksen aktif |
| Primary Hover | `#4338CA` (Indigo 700) | Hover state |
| Secondary | `#3B82F6` (Blue 500) | Aksen sekunder, link, ikon |
| Success | `#10B981` (Emerald 500) | Status Normal, notifikasi sukses |
| Warning | `#F59E0B` (Amber 500) | Status Berlebih |
| Danger | `#EF4444` (Red 500) | Status Kritis, error, hapus |
| Background | `#F8FAFC` (Slate 50) | Latar halaman |
| Surface/Card | `#FFFFFF` | Card, tabel, modal |
| Text Primary | `#1E293B` (Slate 800) | Teks utama |
| Text Secondary | `#64748B` (Slate 500) | Teks pendukung/label |
| Border | `#E2E8F0` (Slate 200) | Garis pembatas, border input |

### 5.2 Tipografi

- Font: **Inter** atau **Plus Jakarta Sans** (sans-serif modern, mudah dibaca)
- Heading: font-semibold hingga font-bold, ukuran 18–30px
- Body text: font-normal, 14–16px
- Label/caption: 12–13px, warna `text-secondary`

### 5.3 Layout Utama

- **Sidebar Navigation** (fixed, collapsible di tablet):
  - Logo/nama aplikasi di atas
  - Menu: Dashboard, Data Spare Part, Barang Masuk, Barang Keluar, Laporan, (Pengaturan)
  - Highlight menu aktif dengan background indigo muda + teks indigo
- **Topbar:** breadcrumb/judul halaman, search global, profil user, notifikasi alert
- **Content Area:** padding konsisten (24px desktop, 16px tablet)

### 5.4 Komponen Reusable

- **Card:** rounded-xl, shadow-sm, border tipis, padding 16–24px
- **Tabel:**
  - Header sticky, sortable (klik kolom menampilkan ikon panah)
  - Search bar di atas tabel
  - Pagination di bawah tabel
  - Badge warna untuk kolom status
  - Row hover highlight
- **Modal Form (CRUD):**
  - Overlay gelap semi-transparan
  - Modal rounded-xl, max-width responsif
  - Header modal + tombol close (X)
  - Footer dengan tombol "Batal" (outline) dan "Simpan" (solid indigo)
- **Button:**
  - Primary: bg-indigo-600, text-white, rounded-lg
  - Secondary/Outline: border-indigo-600, text-indigo-600
  - Danger: bg-red-500, text-white (untuk aksi hapus)
- **Badge Status:**
  - Kritis → bg-red-100 text-red-700
  - Normal → bg-emerald-100 text-emerald-700
  - Berlebih → bg-amber-100 text-amber-700

### 5.5 Responsivitas

- **Desktop (≥1280px):** sidebar penuh terbuka, tabel menampilkan semua kolom
- **Tablet (768–1279px):** sidebar collapsible (icon-only), tabel dengan horizontal scroll atau kolom prioritas
- **Prinsip:** gunakan Tailwind breakpoints `md:` dan `lg:` secara konsisten; hindari breakpoint mobile-first penuh karena target utama adalah desktop & tablet

---

## 6. Data Dummy

### 6.1 Contoh Data `spare_parts` (JSON)

```json
[
  {
    "id": 1,
    "kode_part": "SP-001",
    "nama_part": "Filter Oli Mesin",
    "kategori": "Filter",
    "merk_type": "Sakura / Type A200",
    "stok_saat_ini": 12,
    "stok_minimum": 20,
    "stok_maksimum": 100,
    "lokasi_rak": "Rak A-01-03",
    "harga_satuan": 85000,
    "supplier": "PT Sumber Suku Cadang",
    "status": "Kritis",
    "tanggal_update_terakhir": "2026-07-18T09:15:00Z"
  },
  {
    "id": 2,
    "kode_part": "SP-002",
    "nama_part": "Aki Kering 12V 45Ah",
    "kategori": "Elektrikal",
    "merk_type": "GS Astra / NS60",
    "stok_saat_ini": 45,
    "stok_minimum": 10,
    "stok_maksimum": 60,
    "lokasi_rak": "Rak B-02-01",
    "harga_satuan": 950000,
    "supplier": "CV Elektrik Jaya",
    "status": "Normal",
    "tanggal_update_terakhir": "2026-07-19T14:30:00Z"
  },
  {
    "id": 3,
    "kode_part": "SP-003",
    "nama_part": "Van Belt Alternator",
    "kategori": "Engine",
    "merk_type": "Bando / VB-1220",
    "stok_saat_ini": 130,
    "stok_minimum": 15,
    "stok_maksimum": 100,
    "lokasi_rak": "Rak A-03-02",
    "harga_satuan": 120000,
    "supplier": "PT Sumber Suku Cadang",
    "status": "Berlebih",
    "tanggal_update_terakhir": "2026-07-17T11:00:00Z"
  },
  {
    "id": 4,
    "kode_part": "SP-004",
    "nama_part": "Kampas Rem Depan",
    "kategori": "Rem",
    "merk_type": "Akebono / KRD-77",
    "stok_saat_ini": 28,
    "stok_minimum": 15,
    "stok_maksimum": 80,
    "lokasi_rak": "Rak C-01-05",
    "harga_satuan": 210000,
    "supplier": "UD Rem Prima",
    "status": "Normal",
    "tanggal_update_terakhir": "2026-07-20T08:00:00Z"
  },
  {
    "id": 5,
    "kode_part": "SP-005",
    "nama_part": "Busi Iridium",
    "kategori": "Elektrikal",
    "merk_type": "NGK / IX-22",
    "stok_saat_ini": 8,
    "stok_minimum": 25,
    "stok_maksimum": 150,
    "lokasi_rak": "Rak B-01-04",
    "harga_satuan": 65000,
    "supplier": "CV Elektrik Jaya",
    "status": "Kritis",
    "tanggal_update_terakhir": "2026-07-20T07:45:00Z"
  }
]
```

### 6.2 Contoh Data `transaksi_masuk` (JSON)

```json
[
  {
    "id": 1,
    "tanggal_masuk": "2026-07-19",
    "kode_part": "SP-002",
    "nama_part": "Aki Kering 12V 45Ah",
    "jumlah": 20,
    "supplier": "CV Elektrik Jaya",
    "no_po_invoice": "PO-2026-0719-01",
    "keterangan": "Restock rutin bulanan"
  },
  {
    "id": 2,
    "tanggal_masuk": "2026-07-20",
    "kode_part": "SP-004",
    "nama_part": "Kampas Rem Depan",
    "jumlah": 15,
    "supplier": "UD Rem Prima",
    "no_po_invoice": "PO-2026-0720-02",
    "keterangan": ""
  }
]
```

### 6.3 Contoh Data `transaksi_keluar` (JSON)

```json
[
  {
    "id": 1,
    "tanggal_keluar": "2026-07-20",
    "kode_part": "SP-001",
    "nama_part": "Filter Oli Mesin",
    "jumlah": 5,
    "tujuan_departemen": "Workshop Maintenance",
    "no_permintaan": "REQ-2026-0720-05",
    "keterangan": "Pemakaian servis berkala unit produksi"
  },
  {
    "id": 2,
    "tanggal_keluar": "2026-07-20",
    "kode_part": "SP-005",
    "nama_part": "Busi Iridium",
    "jumlah": 12,
    "tujuan_departemen": "Workshop Maintenance",
    "no_permintaan": "REQ-2026-0720-06",
    "keterangan": ""
  }
]
```

### 6.4 Contoh Data Kategori

```json
["Engine", "Elektrikal", "Filter", "Rem", "Suspensi", "Transmisi", "Body & Interior"]
```

---

## 7. Instalasi & Setup

### 7.1 Prasyarat

- Node.js v18+ dan npm/yarn/pnpm
- Akun Google Antigravity (untuk workspace pengembangan)
- Akun TiDB Cloud (untuk tahap integrasi backend, opsional di tahap awal)
- Git

### 7.2 Setup Proyek Awal (Mock Data)

```bash
# 1. Inisialisasi proyek React dengan Vite
npm create vite@latest spare-parts-wms -- --template react

cd spare-parts-wms

# 2. Install dependencies utama
npm install

# 3. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Install state management (Zustand)
npm install zustand

# 5. Install library pendukung
npm install react-router-dom recharts lucide-react

# 6. (Opsional) Library export & barcode untuk fitur tambahan
npm install xlsx file-saver qrcode.react

# 7. Jalankan development server
npm run dev
```

### 7.3 Konfigurasi Tailwind (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF2FF",
          600: "#4F46E5",
          700: "#4338CA",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
```

### 7.4 Environment Variables (`.env`) — untuk tahap integrasi TiDB

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_TIDB_HOST=your-tidb-host.tidbcloud.com
VITE_TIDB_PORT=4000
VITE_TIDB_USER=your_username
VITE_TIDB_PASSWORD=your_password
VITE_TIDB_DATABASE=spare_parts_wms
```

> **Catatan:** Kredensial database sebaiknya hanya digunakan di sisi backend/API, bukan langsung diekspos di frontend React.

### 7.5 Menjalankan Proyek

```bash
npm run dev       # Menjalankan development server (default: http://localhost:5173)
npm run build      # Build untuk production
npm run preview    # Preview hasil build production
```

---

## 8. Struktur Folder

```
src/
├── components/
│   ├── dashboard/
│   │   ├── SummaryCard.jsx
│   │   ├── TrendChart.jsx
│   │   ├── StatusDistributionChart.jsx
│   │   └── CriticalAlertList.jsx
│   ├── spareparts/
│   │   ├── SparePartTable.jsx
│   │   ├── SparePartFormModal.jsx
│   │   ├── SparePartFilter.jsx
│   │   └── StatusBadge.jsx
│   ├── transactions/
│   │   ├── IncomingTransactionTable.jsx
│   │   ├── IncomingTransactionFormModal.jsx
│   │   ├── OutgoingTransactionTable.jsx
│   │   └── OutgoingTransactionFormModal.jsx
│   ├── reports/
│   │   ├── ReportFilterBar.jsx
│   │   ├── ReportTable.jsx
│   │   └── ExportButton.jsx
│   └── common/
│       ├── Sidebar.jsx
│       ├── Topbar.jsx
│       ├── DataTable.jsx
│       ├── Modal.jsx
│       ├── Button.jsx
│       ├── SearchInput.jsx
│       └── Pagination.jsx
│
├── pages/
│   ├── DashboardPage.jsx
│   ├── SparePartsPage.jsx
│   ├── IncomingTransactionPage.jsx
│   ├── OutgoingTransactionPage.jsx
│   ├── ReportsPage.jsx
│   └── LoginPage.jsx
│
├── context/
│   └── AuthContext.jsx          # Context API untuk sesi user & role
│
├── store/                        # Zustand stores
│   ├── useSparePartStore.js
│   ├── useTransactionStore.js
│   └── useFilterStore.js
│
├── hooks/
│   ├── useSpareParts.js
│   ├── useTransactions.js
│   ├── useDashboardSummary.js
│   └── useDebounce.js
│
├── utils/
│   ├── calculateStatus.js       # Logika status Kritis/Normal/Berlebih
│   ├── formatCurrency.js
│   ├── formatDate.js
│   └── exportToExcel.js
│
├── services/
│   ├── api.js                    # Konfigurasi axios/fetch base
│   ├── sparePartService.js
│   ├── transactionService.js
│   └── reportService.js
│
├── data/
│   └── mockData.js               # Data dummy tahap awal
│
├── styles/
│   └── index.css                 # Import Tailwind base/components/utilities
│
├── App.jsx
└── main.jsx
```

### 8.1 Penjelasan Direktori Kunci

| Folder | Fungsi |
|---|---|
| `components/` | Komponen UI, dikelompokkan per modul fitur agar mudah dikelola |
| `pages/` | Komponen tingkat halaman yang dirender oleh React Router |
| `context/` | Context API — khusus state global yang jarang berubah (auth, tema) |
| `store/` | Zustand store — state global yang sering berubah (data part, transaksi, filter) |
| `hooks/` | Custom hooks untuk logika reusable (fetch data, debounce, dsb) |
| `utils/` | Fungsi murni/helper (format, kalkulasi status) |
| `services/` | Layer komunikasi API — mudah diganti dari mock data ke TiDB API nantinya |
| `data/` | Sumber data dummy sebelum backend terintegrasi |

---

## 9. API Endpoints

Rancangan endpoint REST API untuk integrasi dengan TiDB pada tahap lanjutan.

### 9.1 Dashboard

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/dashboard/summary` | Ringkasan total part, masuk/keluar hari ini, jumlah kritis |
| GET | `/api/dashboard/trend?range=30d` | Data grafik tren pergerakan barang |
| GET | `/api/dashboard/status-distribution` | Distribusi jumlah item per status |

### 9.2 Spare Parts

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/spare-parts` | Daftar semua spare part (mendukung query `?search=&kategori=&status=&page=`) |
| GET | `/api/spare-parts/:id` | Detail satu spare part |
| POST | `/api/spare-parts` | Tambah spare part baru |
| PUT | `/api/spare-parts/:id` | Update data spare part |
| DELETE | `/api/spare-parts/:id` | Hapus spare part |

### 9.3 Transaksi Barang Masuk

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/transactions/incoming` | Daftar transaksi masuk (filter tanggal/supplier) |
| GET | `/api/transactions/incoming/:id` | Detail transaksi masuk |
| POST | `/api/transactions/incoming` | Tambah transaksi masuk (auto update stok) |
| PUT | `/api/transactions/incoming/:id` | Update transaksi masuk |
| DELETE | `/api/transactions/incoming/:id` | Hapus transaksi masuk |

### 9.4 Transaksi Barang Keluar

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/transactions/outgoing` | Daftar transaksi keluar (filter tanggal/departemen) |
| GET | `/api/transactions/outgoing/:id` | Detail transaksi keluar |
| POST | `/api/transactions/outgoing` | Tambah transaksi keluar (validasi stok + auto update) |
| PUT | `/api/transactions/outgoing/:id` | Update transaksi keluar |
| DELETE | `/api/transactions/outgoing/:id` | Hapus transaksi keluar |

### 9.5 Laporan

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/reports?start=&end=&kategori=&status=&type=` | Data laporan gabungan sesuai filter |
| GET | `/api/reports/export?format=xlsx` | Export laporan ke Excel/CSV |

### 9.6 Master Data Pendukung

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/suppliers` | Daftar supplier |
| POST | `/api/suppliers` | Tambah supplier baru |
| GET | `/api/categories` | Daftar kategori spare part |

### 9.7 Autentikasi & User (fitur tambahan)

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/login` | Login user, mengembalikan token & role |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/users` | Daftar user (khusus Admin) |
| POST | `/api/users` | Tambah user baru (khusus Admin) |
| PUT | `/api/users/:id/role` | Ubah role user (khusus Admin) |

### 9.8 Format Response Standar

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": { },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 145
  }
}
```

---

## 10. Roadmap Pengembangan

### **Fase 1 — Setup & UI Foundation (Minggu 1–2)**
- Setup proyek React + Vite + Tailwind CSS di Google Antigravity
- Implementasi struktur folder & routing dasar (React Router)
- Membangun komponen common: Sidebar, Topbar, Modal, DataTable, Button
- Setup Zustand store & Context API (auth)
- Integrasi mock data (`data/mockData.js`)

### **Fase 2 — Modul Dashboard (Minggu 2–3)**
- Summary cards dengan data dari mock/store
- Grafik tren pergerakan barang (Recharts)
- Grafik distribusi status stok
- Daftar alert kritis

### **Fase 3 — Modul Manajemen Spare Part (Minggu 3–4)**
- Tabel spare part dengan search, sort, filter, pagination
- Modal form tambah/edit spare part
- Validasi form (kode unik, stok minimum < maksimum)
- Logika auto-calculate status (`utils/calculateStatus.js`)

### **Fase 4 — Modul Transaksi (Minggu 4–5)**
- Form & tabel transaksi barang masuk (dengan update stok otomatis)
- Form & tabel transaksi barang keluar (dengan validasi stok & update otomatis)
- Riwayat transaksi dengan filter tanggal/supplier/departemen

### **Fase 5 — Modul Laporan (Minggu 5–6)**
- Filter laporan (periode, kategori, status, jenis transaksi)
- Tabel laporan gabungan
- Export ke Excel/CSV

### **Fase 6 — Integrasi Backend TiDB (Minggu 6–8)**
- Setup database TiDB Cloud & migrasi schema (bagian 4)
- Bangun REST API (Node.js/Express) sesuai endpoint di bagian 9
- Ganti layer `services/` dari mock data ke pemanggilan API sungguhan
- Testing end-to-end CRUD dan transaksi

### **Fase 7 — Fitur Tambahan (Minggu 8–10)**
- Role-based access control (Admin, Staff, Viewer) + halaman login
- Barcode/QR Code generator per spare part
- Notifikasi alert (banner/email) untuk stok kritis
- Optimasi performa (lazy loading, caching data dashboard)

### **Fase 8 — Testing, Polish & Deployment (Minggu 10–12)**
- Responsive testing (desktop & tablet)
- User Acceptance Testing (UAT) bersama tim gudang
- Perbaikan bug & refinement UI/UX
- Deployment ke hosting (Vercel/Netlify untuk frontend, backend sesuai infrastruktur)

---

## Lampiran: Checklist Pengembangan Cepat

- [ ] Setup proyek & Tailwind config
- [ ] Struktur folder sesuai blueprint
- [ ] Mock data siap pakai
- [ ] Komponen common (Sidebar, Topbar, Modal, Table)
- [ ] Dashboard lengkap dengan grafik
- [ ] CRUD Spare Part lengkap + validasi
- [ ] Transaksi Masuk + auto update stok
- [ ] Transaksi Keluar + validasi & auto update stok
- [ ] Logika status otomatis (Kritis/Normal/Berlebih)
- [ ] Modul Laporan + filter + export
- [ ] Skema database TiDB dieksekusi
- [ ] REST API terhubung ke frontend
- [ ] Role-based access (Admin/Staff/Viewer)
- [ ] Barcode/QR Code
- [ ] Testing responsif & deployment

---

*Dokumen ini merupakan blueprint pengembangan dan dapat disesuaikan seiring kebutuhan proyek berkembang.*
