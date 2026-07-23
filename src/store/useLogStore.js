import { create } from 'zustand';

// Mock data for initial logs
const INITIAL_LOGS = [
  {
    id: 1,
    tanggal: new Date(Date.now() - 86400000).toISOString(),
    pengguna: 'Budi Santoso',
    modul: 'Data Master',
    aksi: 'Tambah Data',
    deskripsi: 'Menambahkan kategori baru: Transmisi'
  },
  {
    id: 2,
    tanggal: new Date(Date.now() - 3600000).toISOString(),
    pengguna: 'Siti Aminah',
    modul: 'Transaksi',
    aksi: 'Barang Masuk',
    deskripsi: 'Menerima 50 pcs Oil Filter dari PT. Auto Parts'
  }
];

const useLogStore = create((set, get) => ({
  logs: INITIAL_LOGS,

  // modul: 'Data Master' | 'Spare Part' | 'Transaksi' | 'Stock Opname'
  // aksi: string singkat, e.g., 'Tambah', 'Edit', 'Hapus', 'Barang Masuk', 'Finalisasi Sesi'
  // deskripsi: detail aktivitas
  addLog: (modul, aksi, deskripsi, pengguna = 'System / Admin') => {
    const newLog = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      pengguna,
      modul,
      aksi,
      deskripsi
    };

    set(state => ({
      logs: [newLog, ...state.logs]
    }));
  },
  
  getFilteredLogs: (search, modulFilter) => {
    const { logs } = get();
    return logs.filter(log => {
      const matchSearch = !search || 
        log.aksi.toLowerCase().includes(search.toLowerCase()) || 
        log.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
        log.pengguna.toLowerCase().includes(search.toLowerCase());
        
      const matchModul = !modulFilter || log.modul === modulFilter;
      
      return matchSearch && matchModul;
    });
  },
  
  getRecentLogs: (limit = 5) => {
    return get().logs.slice(0, limit);
  }
}));

export default useLogStore;
