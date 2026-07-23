import { create } from 'zustand';
import { TRANSAKSI_MASUK, TRANSAKSI_KELUAR } from '../data/mockData';
import useSparePartStore from './useSparePartStore';
import useLogStore from './useLogStore';

const useTransactionStore = create((set, get) => ({
  transaksiMasuk: TRANSAKSI_MASUK,
  transaksiKeluar: TRANSAKSI_KELUAR,

  // Filters for incoming
  filterMasuk: { search: '', supplier: '', dateStart: '', dateEnd: '' },
  setFilterMasuk: (key, value) =>
    set(state => ({ filterMasuk: { ...state.filterMasuk, [key]: value } })),

  // Filters for outgoing
  filterKeluar: { search: '', departemen: '', dateStart: '', dateEnd: '' },
  setFilterKeluar: (key, value) =>
    set(state => ({ filterKeluar: { ...state.filterKeluar, [key]: value } })),

  addMasuk: (data) => {
    const newTx = { ...data, id: Date.now() };
    set(state => ({ transaksiMasuk: [newTx, ...state.transaksiMasuk] }));
    // Increase stock
    useSparePartStore.getState().adjustStock(data.kode_part, data.jumlah);
    useLogStore.getState().addLog('Transaksi', 'Barang Masuk', `Menerima ${data.jumlah} pcs ${data.nama_part} dari ${data.supplier || 'Supplier'}`);
  },

  addKeluar: (data) => {
    const newTx = { ...data, id: Date.now() };
    set(state => ({ transaksiKeluar: [newTx, ...state.transaksiKeluar] }));
    // Decrease stock
    useSparePartStore.getState().adjustStock(data.kode_part, -data.jumlah);
    useLogStore.getState().addLog('Transaksi', 'Barang Keluar', `Mengeluarkan ${data.jumlah} pcs ${data.nama_part} ke ${data.tujuan_departemen}`);
  },

  getFilteredMasuk: () => {
    const { transaksiMasuk, filterMasuk } = get();
    return transaksiMasuk.filter(t => {
      const search = filterMasuk.search.toLowerCase();
      if (search && !t.kode_part.toLowerCase().includes(search) &&
          !t.nama_part.toLowerCase().includes(search) &&
          !t.no_po_invoice?.toLowerCase().includes(search)) return false;
      if (filterMasuk.supplier && t.supplier !== filterMasuk.supplier) return false;
      if (filterMasuk.dateStart && t.tanggal_masuk < filterMasuk.dateStart) return false;
      if (filterMasuk.dateEnd && t.tanggal_masuk > filterMasuk.dateEnd) return false;
      return true;
    });
  },

  getFilteredKeluar: () => {
    const { transaksiKeluar, filterKeluar } = get();
    return transaksiKeluar.filter(t => {
      const search = filterKeluar.search.toLowerCase();
      if (search && !t.kode_part.toLowerCase().includes(search) &&
          !t.nama_part.toLowerCase().includes(search) &&
          !t.no_permintaan?.toLowerCase().includes(search)) return false;
      if (filterKeluar.departemen && t.tujuan_departemen !== filterKeluar.departemen) return false;
      if (filterKeluar.dateStart && t.tanggal_keluar < filterKeluar.dateStart) return false;
      if (filterKeluar.dateEnd && t.tanggal_keluar > filterKeluar.dateEnd) return false;
      return true;
    });
  },

  // For dashboard: today's totals
  getTodayTotals: () => {
    const today = new Date().toISOString().split('T')[0];
    const { transaksiMasuk, transaksiKeluar } = get();
    const masukHariIni = transaksiMasuk
      .filter(t => t.tanggal_masuk === today)
      .reduce((sum, t) => sum + t.jumlah, 0);
    const keluarHariIni = transaksiKeluar
      .filter(t => t.tanggal_keluar === today)
      .reduce((sum, t) => sum + t.jumlah, 0);
    return { masukHariIni, keluarHariIni };
  },
}));

export default useTransactionStore;
