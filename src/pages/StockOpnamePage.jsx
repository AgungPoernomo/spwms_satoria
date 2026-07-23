import { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, History, CheckCircle, XCircle } from 'lucide-react';
import useOpnameStore from '../store/useOpnameStore';
import useSparePartStore from '../store/useSparePartStore';
import useToastStore from '../store/useToastStore';
import EditableDataGrid from '../components/common/EditableDataGrid';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function StockOpnamePage() {
  const { sessions, activeSession, startSession, updateStokFisik, cancelSession, finalizeSession } = useOpnameStore();
  const { spareParts, updatePart } = useSparePartStore();
  const { addToast } = useToastStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showStartForm, setShowStartForm] = useState(false);
  const [picName, setPicName] = useState('');
  const [catatan, setCatatan] = useState('');
  const [isConfirmFinalizeOpen, setIsConfirmFinalizeOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartSession = () => {
    if (!picName.trim()) {
      addToast('Nama PIC wajib diisi', 'warning');
      return;
    }
    startSession(picName, catatan, spareParts);
    setShowStartForm(false);
    setPicName('');
    setCatatan('');
  };

  const handleFinalize = () => {
    if (!activeSession) return;
    
    // Update stok di master data spare parts
    activeSession.items.forEach(item => {
      if (item.selisih !== 0) {
        updatePart(item.sparePartId, { stok_saat_ini: item.stok_fisik });
      }
    });

    finalizeSession();
    addToast('Sesi Stock Opname berhasil difinalisasi', 'success');
    setIsConfirmFinalizeOpen(false);
  };

  const handleCancel = () => {
    cancelSession();
    addToast('Sesi Stock Opname dibatalkan', 'warning');
    setIsConfirmCancelOpen(false);
  };

  // Kolom untuk grid pengerjaan (Aktif)
  const activeColumns = [
    { header: 'Kode', accessor: 'kode_part', editable: false, className: 'font-mono text-slate-500 text-xs' },
    { header: 'Nama Part', accessor: 'nama_part', editable: false, className: 'font-bold' },
    { header: 'Stok Sistem', accessor: 'stok_sistem', editable: false, className: 'text-slate-500' },
    { header: 'Stok Fisik', accessor: 'stok_fisik', type: 'number', required: true, className: 'font-bold text-primary-600' },
    { 
      header: 'Selisih', 
      accessor: 'selisih', 
      editable: false,
      format: (val) => (
        <span className={`font-bold ${val === 0 ? 'text-slate-400' : val > 0 ? 'text-success-600' : 'text-danger-600'}`}>
          {val > 0 ? `+${val}` : val}
        </span>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <SkeletonLoader type="text" lines={2} />
        </div>
        <SkeletonLoader type="table" lines={5} />
      </div>
    );
  }

  // Jika ada sesi yang sedang berjalan (Draft/Aktif)
  if (activeSession) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="badge-kritis bg-primary-50 text-primary-700 animate-pulse-glow">Sedang Berjalan</span>
              <h2 className="text-xl font-bold text-slate-800">Sesi: {activeSession.id}</h2>
            </div>
            <p className="text-slate-500 text-sm">PIC: {activeSession.pic} | Mulai: {new Date(activeSession.tanggal).toLocaleString('id-ID')}</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsConfirmCancelOpen(true)}
              className="btn-danger bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border-none"
            >
              <XCircle size={18} /> Batal
            </button>
            <button 
              onClick={() => setIsConfirmFinalizeOpen(true)}
              className="btn-success"
            >
              <CheckCircle size={18} /> Finalisasi Sesi
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800">Daftar Item Opname</h3>
            <p className="text-slate-500 text-sm">Klik ikon edit (pensil) pada kolom Stok Fisik untuk mengubah jumlah aktual di lapangan.</p>
          </div>
          <EditableDataGrid 
            data={activeSession.items}
            columns={activeColumns}
            primaryKey="sparePartId"
            onUpdateRow={(row) => {
              updateStokFisik(row.sparePartId, row.stok_fisik);
            }}
          />
        </div>

        {/* Modal Konfirmasi */}
        <ConfirmDialog 
          isOpen={isConfirmFinalizeOpen}
          title="Finalisasi Stock Opname"
          message="Apakah Anda yakin ingin menyelesaikan sesi ini? Perbedaan stok (selisih) akan secara otomatis memperbarui Master Data Spare Part."
          confirmText="Ya, Finalisasi"
          isDestructive={false}
          onConfirm={handleFinalize}
          onCancel={() => setIsConfirmFinalizeOpen(false)}
        />
        <ConfirmDialog 
          isOpen={isConfirmCancelOpen}
          title="Batalkan Sesi"
          message="Seluruh input stok fisik pada sesi ini akan hilang dan tidak disimpan. Yakin membatalkan?"
          confirmText="Ya, Batalkan"
          onConfirm={handleCancel}
          onCancel={() => setIsConfirmCancelOpen(false)}
        />
      </div>
    );
  }

  // Jika tidak ada sesi aktif, tampilkan histori
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Stock Opname</h2>
            <p className="text-slate-500 text-sm">Kelola penyesuaian stok fisik dan sistem.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowStartForm(!showStartForm)}
          className="btn-primary"
        >
          <Plus size={18} /> Mulai Opname Baru
        </button>
      </div>

      {showStartForm && (
        <div className="bg-slate-50 rounded-2xl border border-primary-100 p-6 animate-slide-up">
          <h3 className="font-bold text-slate-800 mb-4">Informasi Sesi Opname</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nama PIC (Penanggung Jawab)</label>
              <input 
                type="text" 
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="input-field" 
                placeholder="Masukkan nama pemeriksa..."
              />
            </div>
            <div>
              <label className="label">Catatan (Opsional)</label>
              <input 
                type="text" 
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="input-field" 
                placeholder="Contoh: Opname rak A dan B..."
                onKeyDown={(e) => e.key === 'Enter' ? handleStartSession() : null}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowStartForm(false)} className="btn-ghost">Batal</button>
            <button onClick={handleStartSession} className="btn-primary">Mulai Proses</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <History size={18} className="text-slate-400" />
          <h3 className="font-bold text-slate-800">Riwayat Opname Selesai</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">ID Sesi</th>
                <th className="px-6 py-4">Tanggal & Waktu</th>
                <th className="px-6 py-4">PIC</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Belum ada riwayat stock opname.</td>
                </tr>
              ) : (
                sessions.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{s.id}</td>
                    <td className="px-6 py-4">{new Date(s.tanggal).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 font-medium">{s.pic}</td>
                    <td className="px-6 py-4">
                      <span className="badge-normal">{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{s.catatan || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
