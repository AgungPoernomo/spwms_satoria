import { create } from 'zustand';
import { SPARE_PARTS } from '../data/mockData';
import { calculateStatus } from '../utils/calculateStatus';

const useSparePartStore = create((set, get) => ({
  spareParts: SPARE_PARTS,

  // Filters
  filters: {
    search: '',
    kategori: '',
    status: '',
    supplier: '',
  },

  setFilter: (key, value) =>
    set(state => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({
      filters: { search: '', kategori: '', status: '', supplier: '' },
    }),

  // CRUD
  addPart: (partData) => {
    const newPart = {
      ...partData,
      id: Date.now(),
      status: calculateStatus(partData.stok_saat_ini, partData.stok_minimum, partData.stok_maksimum),
      tanggal_update_terakhir: new Date().toISOString(),
    };
    set(state => ({ spareParts: [...state.spareParts, newPart] }));
  },

  updatePart: (id, updates) =>
    set(state => ({
      spareParts: state.spareParts.map(p => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates, tanggal_update_terakhir: new Date().toISOString() };
        updated.status = calculateStatus(updated.stok_saat_ini, updated.stok_minimum, updated.stok_maksimum);
        return updated;
      }),
    })),

  deletePart: (id) =>
    set(state => ({
      spareParts: state.spareParts.filter(p => p.id !== id),
    })),

  // Update stock (called from transaction store)
  adjustStock: (kodePart, delta) =>
    set(state => ({
      spareParts: state.spareParts.map(p => {
        if (p.kode_part !== kodePart) return p;
        const newStok = Math.max(0, p.stok_saat_ini + delta);
        return {
          ...p,
          stok_saat_ini: newStok,
          status: calculateStatus(newStok, p.stok_minimum, p.stok_maksimum),
          tanggal_update_terakhir: new Date().toISOString(),
        };
      }),
    })),

  // Computed selectors
  getFilteredParts: () => {
    const { spareParts, filters } = get();
    return spareParts.filter(p => {
      const search = filters.search.toLowerCase();
      if (search && !p.kode_part.toLowerCase().includes(search) &&
          !p.nama_part.toLowerCase().includes(search) &&
          !p.kategori.toLowerCase().includes(search)) return false;
      if (filters.kategori && p.kategori !== filters.kategori) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.supplier && p.supplier !== filters.supplier) return false;
      return true;
    });
  },

  getCriticalParts: () => get().spareParts.filter(p => p.status === 'Kritis'),
  getTodayStats: () => ({ totalParts: get().spareParts.length }),
}));

export default useSparePartStore;
