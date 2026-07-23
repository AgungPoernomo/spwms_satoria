import { create } from 'zustand';
import useLogStore from './useLogStore';

// Mock Data untuk riwayat opname
const INITIAL_SESSIONS = [
  {
    id: 'SO-202607-001',
    tanggal: '2026-07-20T08:00:00Z',
    pic: 'Budi Santoso',
    status: 'Selesai',
    catatan: 'Opname rutin bulanan',
    items: [
      { sparePartId: 1, kode_part: 'SP-001', nama_part: 'Oil Filter', stok_sistem: 50, stok_fisik: 48, selisih: -2 },
      { sparePartId: 2, kode_part: 'SP-002', nama_part: 'Brake Pad', stok_sistem: 20, stok_fisik: 20, selisih: 0 },
    ]
  }
];

const useOpnameStore = create((set, get) => ({
  sessions: INITIAL_SESSIONS,
  activeSession: null, // Berisi detail draft session jika ada yang sedang berjalan
  
  // Memulai sesi baru
  startSession: (pic, catatan, sparePartsList) => {
    // Generate draft items from current spare parts
    const items = sparePartsList.map(p => ({
      sparePartId: p.id,
      kode_part: p.kode_part,
      nama_part: p.nama_part,
      stok_sistem: p.stok_saat_ini,
      stok_fisik: p.stok_saat_ini, // default fisik sama dengan sistem
      selisih: 0,
      kategori: p.kategori
    }));

    const newSession = {
      id: `SO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      tanggal: new Date().toISOString(),
      pic,
      catatan,
      status: 'Draft',
      items
    };

    set({ activeSession: newSession });
    useLogStore.getState().addLog('Stock Opname', 'Mulai Sesi', `Sesi opname baru dimulai (${newSession.id}) oleh PIC: ${pic}`);
  },

  // Update stok fisik saat draft berjalan
  updateStokFisik: (sparePartId, stokFisikBaru) => {
    set(state => {
      if (!state.activeSession) return state;

      const updatedItems = state.activeSession.items.map(item => {
        if (item.sparePartId === sparePartId) {
          return {
            ...item,
            stok_fisik: stokFisikBaru,
            selisih: stokFisikBaru - item.stok_sistem
          };
        }
        return item;
      });

      return {
        activeSession: { ...state.activeSession, items: updatedItems }
      };
    });
  },

  // Cancel sesi
  cancelSession: () => {
    const session = get().activeSession;
    if (session) {
      useLogStore.getState().addLog('Stock Opname', 'Batal Sesi', `Sesi opname dibatalkan (${session.id})`);
    }
    set({ activeSession: null });
  },

  // Finalisasi sesi -> memindahkan dari active ke history
  finalizeSession: () => {
    let finalizedSessionId = '';
    set(state => {
      if (!state.activeSession) return state;

      const finalizedSession = {
        ...state.activeSession,
        status: 'Selesai',
        tanggal_selesai: new Date().toISOString()
      };
      
      finalizedSessionId = finalizedSession.id;

      return {
        sessions: [finalizedSession, ...state.sessions],
        activeSession: null
      };
    });
    
    if (finalizedSessionId) {
      useLogStore.getState().addLog('Stock Opname', 'Finalisasi Sesi', `Sesi opname diselesaikan (${finalizedSessionId}). Stok fisik telah diperbarui di master data.`);
    }
  }
}));

export default useOpnameStore;
