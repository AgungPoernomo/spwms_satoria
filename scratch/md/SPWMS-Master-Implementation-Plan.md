# SPWMS — Master Implementation Plan (Konsolidasi Tim)

**Disusun oleh:** Lead Team (Claude), berdasarkan hasil kerja DeepSeek, ChatGPT, dan Gemini
**Tanggal:** 23 Juli 2026

---

## 1. Ringkasan Eksekutif

| Personil | Scope | Status Jawaban |
|---|---|---|
| **DeepSeek** | Fungsional 4 halaman placeholder: Data Master, Stock Gudang, Log Aktivitas, Pengaturan | ⚠️ **Terpotong** — hanya 3 dari 4 modul lengkap (Data Master, Stock Gudang, Log Aktivitas). Modul **Pengaturan** serta bagian **Integrasi Sidebar** dan **Prioritas Implementasi** hilang. **Sudah dilengkapi oleh Lead di dokumen ini (lihat Bagian 6).** |
| **ChatGPT** | UI/UX enhancement 9 halaman existing + komponen reusable (Toast, ConfirmDialog, SkeletonLoader) | ✅ Lengkap, walau beberapa spesifikasi bersifat ringkas (belum semua state dijabarkan sedetail brief awal — cukup untuk jadi acuan implementasi). |
| **Gemini** | Analitik Dashboard lanjutan, modul baru Stock Opname, enhancement Lifetime Part & Spare Parts Repair | ✅ Lengkap dan paling detail secara teknis. |

**Tindakan yang saya lakukan di dokumen ini:**
1. Mengisi gap Pengaturan dari DeepSeek.
2. Menyatukan struktur Zustand store agar tidak tumpang tindih/duplikat sumber data.
3. Menyatukan daftar komponen reusable dari ketiga tim jadi satu component library.
4. Menyusun ulang struktur Sidebar final yang mengakomodasi seluruh modul (lama + baru).
5. Menyusun roadmap gabungan lintas tim (bukan tiga roadmap terpisah).

---

## 2. Peta Modul & Kepemilikan (Ownership Map)

| Modul/Halaman | Route | PIC Spesifikasi | Jenis Pekerjaan |
|---|---|---|---|
| Dashboard | `/` | ChatGPT (UX polish) + Gemini (analitik lanjutan) | Enhancement |
| Login | `/login` | ChatGPT | Enhancement |
| Data Supplier | `/data-supplier` | ChatGPT | Enhancement |
| Data Spare Part | `/spare-parts` | ChatGPT | Enhancement |
| Barang Masuk | `/barang-masuk` | ChatGPT | Enhancement |
| Barang Keluar | `/stock-used` | ChatGPT | Enhancement |
| Lifetime Part | `/lifetime-part` | Gemini | Enhancement |
| Spare Parts Repair | `/spare-parts-repair` | Gemini | Enhancement |
| Laporan | `/laporan` | ChatGPT | Enhancement |
| **Data Master** | `/data-master` | DeepSeek | **Fitur baru (placeholder → jadi)** |
| **Stock Gudang** | `/stock-gudang` | DeepSeek | **Fitur baru (placeholder → jadi)** |
| **Stock Opname** | `/stock-opname` | Gemini | **Fitur baru (placeholder → jadi)** |
| **Log Aktivitas** | `/log-aktivitas` | DeepSeek | **Fitur baru (placeholder → jadi)** |
| **Pengaturan** | `/pengaturan` | DeepSeek *(dilengkapi Lead)* | **Fitur baru (placeholder → jadi)** |

---

## 3. Konsolidasi State Management (Zustand Stores)

Menggabungkan store yang sudah ada di blueprint awal dengan store baru yang diusulkan 3 tim. Beberapa penamaan disatukan agar konsisten, dan satu duplikasi sumber data dihindari.

| Store | Dipakai di Halaman | Sumber | Catatan Harmonisasi |
|---|---|---|---|
| `useSparePartStore.js` | Data Spare Part, Dashboard | Sudah ada (blueprint awal) | Tetap jadi *single source of truth* untuk data item part |
| `useTransactionStore.js` | Barang Masuk, Barang Keluar, Laporan | Sudah ada (blueprint awal) | — |
| `AuthContext.jsx` | Login, Pengaturan (role) | Sudah ada (blueprint awal) | Diperluas untuk role-based visibility (lihat Bagian 6) |
| `useMasterDataStore.js` | Data Master, **Stock Gudang** | DeepSeek | ⚠️ **Harmonisasi:** DeepSeek awalnya mengisyaratkan Stock Gudang punya store sendiri, tapi field `locations` (lengkap dengan `jumlah_terpakai`, `persentase_terpakai`, `status_kepenuhan`) **sudah ada** di `useMasterDataStore`. **Keputusan: Stock Gudang TIDAK butuh store baru** — cukup consume `useMasterDataStore.locations` + join dengan `useSparePartStore.spareParts` untuk drill-down. Ini mencegah dua sumber data lokasi yang bisa desync. |
| `useLogAktivitasStore.js` | Log Aktivitas | DeepSeek | Disarankan diberi 1 action tambahan `logAction()` yang bisa dipanggil dari store lain (spare part, transaksi, opname, dll) setiap kali ada CRUD, supaya log benar-benar tercatat otomatis lintas modul — bukan cuma dummy statis. |
| `useOpnameStore.js` | Stock Opname | **Baru (dilengkapi Lead, karena Gemini hanya kasih skema data, belum kode store)** | Lihat Bagian 6.5 |
| `useSettingsStore.js` | Pengaturan | **Baru (dilengkapi Lead)** | Lihat Bagian 6 |
| *(state lokal per-halaman)* | Lifetime Part, Spare Parts Repair | Gemini | Karena masih dummy dan tidak dipakai lintas halaman, **tidak wajib** dibuatkan Zustand store terpisah — cukup `useState` di level halaman untuk saat ini. Upgrade ke store hanya jika nanti butuh diakses dari Dashboard (misalnya badge counter "harus diganti"). |

---

## 4. Konsolidasi Component Library (Reusable Components)

| Komponen | Diusulkan Oleh | Fungsi | Prioritas |
|---|---|---|---|
| `Toast.jsx` | ChatGPT | Notifikasi sukses/gagal setelah aksi CRUD | P1 |
| `ConfirmDialog.jsx` | ChatGPT | Konfirmasi aksi destruktif (hapus data) | P1 |
| `SkeletonLoader.jsx` | ChatGPT | Loading state generik (tabel, card, chart) | P1 |
| `Tabs.jsx` | *(tersirat dari DeepSeek — Data Master pakai tab, belum dikodekan)* | Navigasi tab di halaman Data Master | P1 — **perlu dibuat, belum ada kode dari tim manapun** |
| `ProgressGauge.jsx` | Gemini | Progress bar/gauge umur pakai part (Lifetime Part) | P2 |
| `DonutChartValuation.jsx` | Gemini | Wrapper Recharts Pie khusus format Rupiah (valuasi stok) | P2 |
| `KanbanBoard.jsx` + `KanbanCard.jsx` | Gemini | Tampilan Kanban untuk Spare Parts Repair | P4 (opsional/nice-to-have) |
| `EditableDataGrid.jsx` | *(tersirat dari Gemini — tabel Stock Opname dengan input langsung, belum dikodekan sebagai komponen reusable)* | Tabel dengan cell yang bisa diedit langsung (dipakai di Stock Opname, bisa dipakai ulang di modul lain nantinya) | P1 — **perlu dibuat, belum ada kode dari tim manapun** |
| `CapacityProgressBar.jsx` | *(tersirat dari DeepSeek — Stock Gudang pakai progress bar kapasitas rak, belum dikodekan sebagai komponen reusable terpisah)* | Progress bar kapasitas rak (beda dari `ProgressGauge` milik Gemini yang untuk lifetime — perlu dibedakan agar tidak duplikat) | P2 |

> **Catatan harmonisasi penting:** Jangan sampai tim membuat 2 komponen progress bar yang mirip tapi terpisah (`ProgressGauge` dari Gemini untuk lifetime vs progress bar kapasitas dari DeepSeek untuk Stock Gudang). Rekomendasi: buat **satu komponen dasar** `ProgressBar.jsx` yang menerima props `percentage`, `colorMap` (aturan warna berbeda per konteks), lalu `ProgressGauge` (lifetime, bentuk radial/gauge) dan `CapacityProgressBar` (linear, untuk rak) bisa jadi varian tampilan di atasnya, atau cukup 2 komponen berbeda jika bentuknya memang beda (gauge vs linear bar) — **keputusan final: pertahankan sebagai 2 komponen terpisah karena bentuk visualnya berbeda (radial vs linear), tapi keduanya WAJIB memakai token warna yang sama**: hijau `#22C55E` / kuning `#EAB308` / merah `#EF4444` (ini sudah konsisten dipakai DeepSeek maupun Gemini, tidak perlu diubah).

---

## 5. Struktur Sidebar Final (Gabungan)

ChatGPT sudah mengusulkan pengelompokan dasar, tapi belum memasukkan 5 modul baru (Data Master, Stock Gudang, Stock Opname, Log Aktivitas, Pengaturan). Berikut struktur final gabungan:

```
📊 Dashboard

📁 MASTER DATA
   • Data Master (Kategori, Lokasi Rak, Satuan)
   • Data Supplier
   • Data Spare Part

🏬 GUDANG
   • Stock Gudang
   • Stock Opname

🔄 TRANSAKSI
   • Barang Masuk
   • Barang Keluar
   • Spare Parts Repair
   • Lifetime Part

📈 LAPORAN & AUDIT
   • Laporan
   • Log Aktivitas

⚙️ SISTEM
   • Pengaturan            (hanya tampil jika role = Admin, kecuali sub-tab "Profil Saya" yang tampil untuk semua role)
```

**Badge notifikasi yang perlu berjalan real-time (gabungan dari 3 tim):**
- Menu **Data Spare Part**: jumlah item status "Kritis" (dari `useSparePartStore`, sudah ada di blueprint awal & disebut ulang oleh ChatGPT).
- Menu **Stock Gudang**: jumlah lokasi rak berstatus "Penuh" (dari `useMasterDataStore`, usulan tambahan Lead agar konsisten dengan pola badge yang sama).
- Menu **Log Aktivitas**: *tidak perlu badge* (bukan actionable alert, cukup informatif).

---

## 6. Melengkapi Gap: Modul Pengaturan (Sebelumnya Hilang dari DeepSeek)

> Bagian ini saya susun mengikuti gaya dan konvensi yang sama persis dengan 3 modul DeepSeek lainnya (penamaan field snake_case, struktur Zustand store dengan `set`/`get`, validasi eksplisit), agar terasa seperti satu kesatuan karya tim yang sama.

### 6.1 Sub-Bagian & Field

#### Tab 1: Profil User
| Field | Tipe | Deskripsi | Wajib |
|---|---|---|---|
| `nama_lengkap` | string | Nama user yang login | ✅ |
| `email` | string | Email login | ✅ |
| `role` | enum | Admin/Staff/Viewer (read-only, tidak bisa diubah sendiri) | Auto |
| `password_baru` | string | Diisi hanya jika ingin ganti password | ❌ |
| `konfirmasi_password` | string | Harus sama dengan `password_baru` | ❌ |

#### Tab 2: Manajemen User & Role (khusus role = Admin)
| Field | Tipe | Deskripsi | Wajib |
|---|---|---|---|
| `id_user` | string (UUID) | ID unik user | Auto |
| `nama_lengkap` | string | Nama user | ✅ |
| `email` | string | Email (unik) | ✅ |
| `role` | enum | Admin / Staff / Viewer | ✅ |
| `status_aktif` | boolean | Aktif/nonaktif (nonaktifkan tanpa hapus akun) | Auto (default true) |
| `tanggal_dibuat` | datetime | Timestamp akun dibuat | Auto |

#### Tab 3: Preferensi Aplikasi
| Field | Tipe | Deskripsi | Wajib |
|---|---|---|---|
| `default_stok_minimum` | number | Nilai default saat tambah spare part baru | ❌ (default 10) |
| `default_stok_maksimum` | number | Nilai default saat tambah spare part baru | ❌ (default 100) |
| `format_tanggal` | enum | `DD/MM/YYYY` atau `YYYY-MM-DD` | ❌ (default `DD/MM/YYYY`) |
| `item_per_halaman` | number | Jumlah baris default di semua tabel (10/25/50/100) | ❌ (default 10) |

#### Tab 4: Notifikasi
| Field | Tipe | Deskripsi | Wajib |
|---|---|---|---|
| `notif_stok_kritis` | boolean | Toggle alert stok kritis di Dashboard/Sidebar | Auto (default true) |
| `notif_gudang_penuh` | boolean | Toggle alert lokasi rak penuh | Auto (default true) |
| `notif_lifetime_part` | boolean | Toggle alert part yang harus diganti (dari modul Lifetime Part Gemini) | Auto (default true) |

### 6.2 Validasi
- `email` harus format valid dan unik antar user (kecuali email milik sendiri saat edit profil).
- `password_baru` dan `konfirmasi_password` harus identik, minimal 8 karakter.
- Tidak bisa menonaktifkan (`status_aktif=false`) akun yang sedang login (diri sendiri).
- Minimal harus ada 1 user dengan role Admin aktif (validasi saat nonaktifkan/hapus/ubah role Admin terakhir).
- `default_stok_minimum` harus lebih kecil dari `default_stok_maksimum`.

### 6.3 Struktur Zustand Store

```javascript
// stores/useSettingsStore.js
import { create } from 'zustand';

const useSettingsStore = create((set, get) => ({
  // State
  users: [],
  preferences: {
    default_stok_minimum: 10,
    default_stok_maksimum: 100,
    format_tanggal: 'DD/MM/YYYY',
    item_per_halaman: 10
  },
  notificationSettings: {
    notif_stok_kritis: true,
    notif_gudang_penuh: true,
    notif_lifetime_part: true
  },
  isLoading: false,
  error: null,

  // Actions - User Management (Admin only)
  addUser: (newUser) => {
    const { users } = get();
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      throw new Error('Email sudah terdaftar!');
    }
    set((state) => ({
      users: [...state.users, {
        id_user: crypto.randomUUID(),
        ...newUser,
        status_aktif: true,
        tanggal_dibuat: new Date().toISOString()
      }]
    }));
  },

  updateUserRole: (id, role) => {
    const { users } = get();
    const adminCount = users.filter(u => u.role === 'Admin' && u.status_aktif).length;
    const target = users.find(u => u.id_user === id);

    if (target.role === 'Admin' && role !== 'Admin' && adminCount <= 1) {
      throw new Error('Tidak dapat mengubah role Admin terakhir!');
    }

    set((state) => ({
      users: state.users.map(u => u.id_user === id ? { ...u, role } : u)
    }));
  },

  toggleUserActive: (id, currentUserId) => {
    if (id === currentUserId) {
      throw new Error('Tidak dapat menonaktifkan akun sendiri!');
    }
    set((state) => ({
      users: state.users.map(u =>
        u.id_user === id ? { ...u, status_aktif: !u.status_aktif } : u
      )
    }));
  },

  // Actions - Preferences
  updatePreferences: (newPrefs) => {
    if (newPrefs.default_stok_minimum >= newPrefs.default_stok_maksimum) {
      throw new Error('Stok minimum harus lebih kecil dari stok maksimum!');
    }
    set((state) => ({
      preferences: { ...state.preferences, ...newPrefs }
    }));
  },

  // Actions - Notifications
  toggleNotification: (key) => {
    set((state) => ({
      notificationSettings: {
        ...state.notificationSettings,
        [key]: !state.notificationSettings[key]
      }
    }));
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));

export default useSettingsStore;
```

### 6.4 Contoh Data Dummy (JSON)

```json
{
  "users": [
    {
      "id_user": "usr-001",
      "nama_lengkap": "Andi Wijaya",
      "email": "andi.wijaya@spwms.com",
      "role": "Admin",
      "status_aktif": true,
      "tanggal_dibuat": "2026-01-05T08:00:00Z"
    },
    {
      "id_user": "usr-002",
      "nama_lengkap": "Budi Santoso",
      "email": "budi.santoso@spwms.com",
      "role": "Staff",
      "status_aktif": true,
      "tanggal_dibuat": "2026-02-10T09:30:00Z"
    },
    {
      "id_user": "usr-003",
      "nama_lengkap": "Citra Lestari",
      "email": "citra.lestari@spwms.com",
      "role": "Viewer",
      "status_aktif": true,
      "tanggal_dibuat": "2026-03-01T10:00:00Z"
    },
    {
      "id_user": "usr-004",
      "nama_lengkap": "Dedi Kurniawan",
      "email": "dedi.kurniawan@spwms.com",
      "role": "Staff",
      "status_aktif": false,
      "tanggal_dibuat": "2026-01-20T11:15:00Z"
    }
  ],
  "preferences": {
    "default_stok_minimum": 10,
    "default_stok_maksimum": 100,
    "format_tanggal": "DD/MM/YYYY",
    "item_per_halaman": 10
  },
  "notificationSettings": {
    "notif_stok_kritis": true,
    "notif_gudang_penuh": true,
    "notif_lifetime_part": true
  }
}
```

### 6.5 Struktur Zustand Store — Stock Opname (Gemini hanya beri skema, belum kode store)

Untuk melengkapi modul Stock Opname dari Gemini agar bisa langsung dieksekusi (mengikuti gaya store DeepSeek):

```javascript
// stores/useOpnameStore.js
import { create } from 'zustand';

const useOpnameStore = create((set, get) => ({
  sesiOpname: [],
  activeSesiId: null,
  isLoading: false,

  createSesi: (dilakukanOleh, catatanUmum, items) => {
    const id = `SO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(get().sesiOpname.length + 1).padStart(3, '0')}`;
    const newSesi = {
      id_sesi: id,
      tanggal_opname: new Date().toISOString().split('T')[0],
      status_sesi: 'Draft',
      dilakukan_oleh: dilakukanOleh,
      catatan_umum: catatanUmum,
      items: items.map(item => ({ ...item, stok_fisik: item.stok_sistem, selisih: 0, keterangan_selisih: '' }))
    };
    set((state) => ({ sesiOpname: [...state.sesiOpname, newSesi], activeSesiId: id }));
  },

  updateStokFisik: (sesiId, kodePart, stokFisik, keterangan = '') => {
    set((state) => ({
      sesiOpname: state.sesiOpname.map(sesi =>
        sesi.id_sesi === sesiId
          ? {
              ...sesi,
              items: sesi.items.map(item =>
                item.kode_part === kodePart
                  ? { ...item, stok_fisik: stokFisik, selisih: stokFisik - item.stok_sistem, keterangan_selisih: keterangan }
                  : item
              )
            }
          : sesi
      )
    }));
  },

  finalisasiSesi: (sesiId, updateStokSparePart) => {
    const { sesiOpname } = get();
    const sesi = sesiOpname.find(s => s.id_sesi === sesiId);
    // Terapkan selisih ke stok sistem via callback ke useSparePartStore
    sesi.items.forEach(item => {
      if (item.selisih !== 0) updateStokSparePart(item.kode_part, item.stok_fisik);
    });
    set((state) => ({
      sesiOpname: state.sesiOpname.map(s =>
        s.id_sesi === sesiId ? { ...s, status_sesi: 'Selesai' } : s
      )
    }));
  },

  setLoading: (isLoading) => set({ isLoading })
}));

export default useOpnameStore;
```

> Catatan: `finalisasiSesi` sengaja menerima `updateStokSparePart` sebagai parameter (dependency injection), bukan mengimpor `useSparePartStore` langsung di dalam store lain — ini praktik yang lebih aman untuk menghindari circular dependency antar store Zustand.

---

## 7. Tabel Resolusi Konflik

| # | Konflik/Isu | Ditemukan Dari | Keputusan Final |
|---|---|---|---|
| 1 | Stock Gudang nyaris dibuatkan store data lokasi sendiri, padahal `useMasterDataStore` sudah punya data itu | DeepSeek | Stock Gudang **konsumsi `useMasterDataStore`**, tidak buat store baru |
| 2 | Progress bar untuk 2 konteks beda (lifetime vs kapasitas rak) berisiko dibuat duplikat/tumpang tindih | Gemini vs DeepSeek | Tetap 2 komponen (`ProgressGauge` radial, `CapacityProgressBar` linear), **tapi wajib pakai token warna sama** |
| 3 | Gemini tidak menyediakan kode Zustand store untuk Stock Opname (hanya skema data) | Gemini | **Dilengkapi Lead** di Bagian 6.5 |
| 4 | DeepSeek terpotong di modul Pengaturan + integrasi sidebar + prioritas | DeepSeek | **Dilengkapi Lead** di Bagian 6.1–6.4 dan Bagian 5 (Sidebar) |
| 5 | Log Aktivitas dari DeepSeek hanya berisi dummy statis, belum ada mekanisme auto-logging saat CRUD terjadi di modul lain | DeepSeek | Ditambahkan rekomendasi `logAction()` (Bagian 3) — perlu dikerjakan saat integrasi antar store, masuk roadmap Sprint 4 |
| 6 | Penamaan ID: DeepSeek pakai `crypto.randomUUID()`, Gemini pakai kode bisnis manual (`SO-202607-001`, `REP-001`) | DeepSeek vs Gemini | **Keduanya dipertahankan** — kode bisnis (`SO-xxx`, `REP-xxx`) tetap dipakai sebagai *display ID* yang mudah dibaca user, tidak perlu diseragamkan jadi UUID |

---

## 8. Master Roadmap Terpadu (Gabungan 3 Tim)

Roadmap ini menggantikan 3 roadmap terpisah dari masing-masing tim, disusun berdasarkan dependency antar modul (bukan berdasarkan siapa yang mengerjakan).

### Sprint 1 — Fondasi & Komponen Reusable
- [ ] Bangun `Toast.jsx`, `ConfirmDialog.jsx`, `SkeletonLoader.jsx` (ChatGPT)
- [ ] Bangun `Tabs.jsx` dan `EditableDataGrid.jsx` (baru, prasyarat untuk Data Master & Stock Opname)
- [ ] Standardisasi design token: warna, radius, shadow, transition (ChatGPT)
- [ ] Bangun `useMasterDataStore.js` + halaman Data Master penuh (3 tab: Kategori, Lokasi, Satuan) (DeepSeek)

### Sprint 2 — Modul Gudang & Stok
- [ ] Halaman Stock Gudang (konsumsi `useMasterDataStore`, bukan store baru) (DeepSeek, direvisi)
- [ ] Modul Stock Opname penuh + `useOpnameStore.js` (Gemini + Lead) — **prioritas tinggi** karena mengunci akurasi stok fisik vs sistem
- [ ] Rollout Empty/Loading/Error state ke 9 halaman existing (ChatGPT)

### Sprint 3 — Analitik & Audit
- [ ] Dashboard Analitik Lanjutan: Top 5 Pergerakan, MoM, Valuasi Stok, Proyeksi Kehabisan (Gemini)
- [ ] Halaman Log Aktivitas + `useLogAktivitasStore.js` (DeepSeek)
- [ ] Integrasi `logAction()` ke seluruh store lain (Spare Part, Transaksi, Opname) agar log otomatis (Lead, dependency dari poin di atas)
- [ ] Validasi form realtime + pesan error human-friendly di seluruh form (ChatGPT)

### Sprint 4 — Pengaturan & Enhancement Lanjutan
- [ ] Halaman Pengaturan penuh (Profil, User & Role, Preferensi, Notifikasi) + `useSettingsStore.js` (Lead, melengkapi DeepSeek)
- [ ] Enhancement Lifetime Part: field baru, `ProgressGauge.jsx`, status logic (Gemini)
- [ ] Restrukturisasi Sidebar final (grup Master Data/Gudang/Transaksi/Laporan & Audit/Sistem) + badge notifikasi (ChatGPT + Lead)

### Sprint 5 — Polish & Nice-to-Have
- [ ] Spare Parts Repair: workflow status penuh + toggle Kanban/Tabel + `KanbanBoard.jsx`/`KanbanCard.jsx` (Gemini)
- [ ] `DonutChartValuation.jsx` untuk valuasi stok (Gemini)
- [ ] Aksesibilitas (focus trap, ARIA, kontras) + responsive tablet final polish (ChatGPT)

---

## 9. Checklist Final Terpadu

- [ ] Semua komponen reusable dari Bagian 4 sudah dibuat dan tidak ada duplikasi fungsi
- [ ] Tidak ada 2 store yang menyimpan data lokasi/rak secara terpisah
- [ ] Modul Pengaturan (hasil pelengkapan Lead) sudah divalidasi ulang oleh tim/eksekutor
- [ ] Sidebar final mencakup seluruh 14 halaman (9 existing + 5 placeholder yang sudah jadi)
- [ ] Badge notifikasi berjalan real-time untuk: Spare Part Kritis, Stock Gudang Penuh
- [ ] Log Aktivitas benar-benar tercatat otomatis dari aksi CRUD modul lain (bukan cuma dummy statis)
- [ ] Role-based visibility berfungsi: menu Pengaturan → User & Role hanya untuk Admin

---

## 10. Tindak Lanjut yang Disarankan

1. **Ke DeepSeek:** minta kirim ulang khusus bagian Pengaturan + Integrasi Sidebar + Prioritas (jika ingin dibandingkan dengan versi yang saya lengkapi di dokumen ini, untuk memastikan tidak ada requirement yang terlewat dari rencana asli DeepSeek).
2. **Ke Gemini:** minta lengkapi kode Zustand store untuk Stock Opname (saya sudah buatkan draft di Bagian 6.5, bisa diminta Gemini untuk mereview/menyempurnakan logikanya, terutama bagian `finalisasiSesi`).
3. **Ke ChatGPT:** minta detailkan ulang state Empty/Loading/Error untuk halaman **Lifetime Part** dan **Spare Parts Repair** — di jawaban awal kedua halaman ini paling ringkas dibanding 7 halaman lain.
4. **Eksekusi (Anda):** mulai dari Sprint 1 di roadmap Bagian 8 — ini murni membangun komponen reusable, tidak bergantung ke tim manapun, jadi bisa langsung jalan sambil menunggu klarifikasi poin 1–3 di atas.
