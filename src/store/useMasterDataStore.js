import { create } from 'zustand';
import useLogStore from './useLogStore';

// Mock initial data
const INITIAL_KATEGORI = [
  { id: 1, nama: 'Engine' },
  { id: 2, nama: 'Elektrikal' },
  { id: 3, nama: 'Filter' },
  { id: 4, nama: 'Rem' },
  { id: 5, nama: 'Suspensi' },
  { id: 6, nama: 'Transmisi' },
  { id: 7, nama: 'Body & Interior' },
];

const INITIAL_LOKASI = [
  { id: 1, nama: 'Rak A-01-01', jumlah_terpakai: 15, kapasitas_maks: 50, status_kepenuhan: 'Normal' },
  { id: 2, nama: 'Rak A-01-02', jumlah_terpakai: 48, kapasitas_maks: 50, status_kepenuhan: 'Penuh' },
  { id: 3, nama: 'Rak A-01-03', jumlah_terpakai: 12, kapasitas_maks: 50, status_kepenuhan: 'Normal' },
  { id: 4, nama: 'Rak B-01-01', jumlah_terpakai: 100, kapasitas_maks: 100, status_kepenuhan: 'Penuh' },
  { id: 5, nama: 'Rak B-01-02', jumlah_terpakai: 45, kapasitas_maks: 100, status_kepenuhan: 'Normal' },
  { id: 6, nama: 'Rak C-01-01', jumlah_terpakai: 5, kapasitas_maks: 20, status_kepenuhan: 'Normal' },
];

const INITIAL_SATUAN = [
  { id: 1, nama: 'Pcs' },
  { id: 2, nama: 'Set' },
  { id: 3, nama: 'Liter' },
  { id: 4, nama: 'Box' },
  { id: 5, nama: 'Roll' },
];

const updateStatusKepenuhan = (jumlah, kapasitas) => {
  if (kapasitas === 0) return 'Penuh'; // Prevent division by zero
  const persentase = (jumlah / kapasitas) * 100;
  return persentase >= 90 ? 'Penuh' : 'Normal';
};

const useMasterDataStore = create((set, get) => ({
  kategori: INITIAL_KATEGORI,
  lokasi: INITIAL_LOKASI,
  satuan: INITIAL_SATUAN,
  isLoading: false,

  // Kategori Actions
  addKategori: (nama) => {
    set((state) => ({
      kategori: [...state.kategori, { id: Date.now(), nama }]
    }));
    useLogStore.getState().addLog('Data Master', 'Tambah Kategori', `Menambahkan kategori baru: ${nama}`);
  },
  updateKategori: (id, nama) => {
    set((state) => ({
      kategori: state.kategori.map((k) => k.id === id ? { ...k, nama } : k)
    }));
    useLogStore.getState().addLog('Data Master', 'Update Kategori', `Mengubah nama kategori menjadi: ${nama}`);
  },
  deleteKategori: (id) => {
    let deletedName = '';
    set((state) => {
      const target = state.kategori.find(k => k.id === id);
      if (target) deletedName = target.nama;
      return { kategori: state.kategori.filter((k) => k.id !== id) };
    });
    if (deletedName) {
      useLogStore.getState().addLog('Data Master', 'Hapus Kategori', `Menghapus kategori: ${deletedName}`);
    }
  },

  // Lokasi Actions
  addLokasi: (nama, kapasitas_maks) => {
    set((state) => ({
      lokasi: [
        ...state.lokasi, 
        { 
          id: Date.now(), 
          nama, 
          jumlah_terpakai: 0, 
          kapasitas_maks, 
          status_kepenuhan: 'Normal' 
        }
      ]
    }));
    useLogStore.getState().addLog('Data Master', 'Tambah Lokasi', `Menambahkan lokasi rak baru: ${nama} (Kapasitas: ${kapasitas_maks})`);
  },
  updateLokasi: (id, data) => {
    set((state) => ({
      lokasi: state.lokasi.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...data };
          if (data.kapasitas_maks !== undefined || data.jumlah_terpakai !== undefined) {
            updated.status_kepenuhan = updateStatusKepenuhan(updated.jumlah_terpakai, updated.kapasitas_maks);
          }
          return updated;
        }
        return l;
      })
    }));
    useLogStore.getState().addLog('Data Master', 'Update Lokasi', `Mengubah data lokasi/rak ID: ${id}`);
  },
  deleteLokasi: (id) => {
    let deletedName = '';
    set((state) => {
      const target = state.lokasi.find(l => l.id === id);
      if (target) deletedName = target.nama;
      return { lokasi: state.lokasi.filter((l) => l.id !== id) };
    });
    if (deletedName) {
      useLogStore.getState().addLog('Data Master', 'Hapus Lokasi', `Menghapus lokasi rak: ${deletedName}`);
    }
  },

  // Satuan Actions
  addSatuan: (nama) => {
    set((state) => ({
      satuan: [...state.satuan, { id: Date.now(), nama }]
    }));
    useLogStore.getState().addLog('Data Master', 'Tambah Satuan', `Menambahkan satuan baru: ${nama}`);
  },
  updateSatuan: (id, nama) => {
    set((state) => ({
      satuan: state.satuan.map((s) => s.id === id ? { ...s, nama } : s)
    }));
    useLogStore.getState().addLog('Data Master', 'Update Satuan', `Mengubah nama satuan menjadi: ${nama}`);
  },
  deleteSatuan: (id) => {
    let deletedName = '';
    set((state) => {
      const target = state.satuan.find(s => s.id === id);
      if (target) deletedName = target.nama;
      return { satuan: state.satuan.filter((s) => s.id !== id) };
    });
    if (deletedName) {
      useLogStore.getState().addLog('Data Master', 'Hapus Satuan', `Menghapus satuan: ${deletedName}`);
    }
  },
}));

export default useMasterDataStore;
