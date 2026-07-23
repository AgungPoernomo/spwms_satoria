import { useState } from 'react';
import { Database, FolderTree, MapPin, Scale, Plus } from 'lucide-react';
import useMasterDataStore from '../store/useMasterDataStore';
import useToastStore from '../store/useToastStore';
import Tabs from '../components/common/Tabs';
import EditableDataGrid from '../components/common/EditableDataGrid';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function DataMasterPage() {
  const { 
    kategori, lokasi, satuan, 
    addKategori, updateKategori, deleteKategori,
    addLokasi, updateLokasi, deleteLokasi,
    addSatuan, updateSatuan, deleteSatuan
  } = useMasterDataStore();
  
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState('kategori');
  
  // Modal/Dialog states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { type, row }
  
  // Add new item state (simple inline form approach)
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newLokasiKapasitas, setNewLokasiKapasitas] = useState('');

  const TABS = [
    { id: 'kategori', label: 'Kategori', icon: <FolderTree size={16} /> },
    { id: 'lokasi', label: 'Lokasi Rak', icon: <MapPin size={16} /> },
    { id: 'satuan', label: 'Satuan', icon: <Scale size={16} /> },
  ];

  // Handlers for deleting
  const handleDeleteClick = (type, row) => {
    setItemToDelete({ type, row });
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    const { type, row } = itemToDelete;
    if (type === 'kategori') {
      deleteKategori(row.id);
      addToast(`Kategori "${row.nama}" berhasil dihapus`, 'success');
    } else if (type === 'lokasi') {
      deleteLokasi(row.id);
      addToast(`Lokasi "${row.nama}" berhasil dihapus`, 'success');
    } else if (type === 'satuan') {
      deleteSatuan(row.id);
      addToast(`Satuan "${row.nama}" berhasil dihapus`, 'success');
    }
    
    setIsConfirmOpen(false);
    setItemToDelete(null);
  };

  // Handlers for Adding
  const handleAddNew = () => {
    if (!newItemName.trim()) {
      addToast('Nama tidak boleh kosong', 'warning');
      return;
    }

    if (activeTab === 'kategori') {
      addKategori(newItemName);
      addToast('Kategori baru berhasil ditambahkan', 'success');
    } else if (activeTab === 'satuan') {
      addSatuan(newItemName);
      addToast('Satuan baru berhasil ditambahkan', 'success');
    } else if (activeTab === 'lokasi') {
      const kapasitas = Number(newLokasiKapasitas);
      if (!newLokasiKapasitas || isNaN(kapasitas) || kapasitas <= 0) {
        addToast('Kapasitas maksimal harus berupa angka positif', 'warning');
        return;
      }
      addLokasi(newItemName, kapasitas);
      addToast('Lokasi rak baru berhasil ditambahkan', 'success');
      setNewLokasiKapasitas('');
    }
    
    setNewItemName('');
    setIsAdding(false);
  };

  // Columns Definitions
  const kategoriColumns = [
    { header: 'ID', accessor: 'id', editable: false, className: 'font-mono text-slate-500' },
    { header: 'Nama Kategori', accessor: 'nama', type: 'string', required: true, className: 'font-bold text-slate-800' }
  ];

  const satuanColumns = [
    { header: 'ID', accessor: 'id', editable: false, className: 'font-mono text-slate-500' },
    { header: 'Nama Satuan', accessor: 'nama', type: 'string', required: true, className: 'font-bold text-slate-800' }
  ];

  const lokasiColumns = [
    { header: 'ID', accessor: 'id', editable: false, className: 'font-mono text-slate-500' },
    { header: 'Nama Lokasi/Rak', accessor: 'nama', type: 'string', required: true, className: 'font-bold text-slate-800' },
    { header: 'Kapasitas Max', accessor: 'kapasitas_maks', type: 'number', required: true },
    { header: 'Terpakai', accessor: 'jumlah_terpakai', type: 'number', required: true },
    { 
      header: 'Status', 
      accessor: 'status_kepenuhan', 
      editable: false,
      format: (val) => (
        <span className={val === 'Penuh' ? 'badge-kritis' : 'badge-normal'}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-primary-600 flex items-center justify-center">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Data Master</h2>
            <p className="text-slate-500 text-sm">Kelola kategori, lokasi rak, dan satuan spare part.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <Tabs 
          tabs={TABS} 
          defaultTab="kategori" 
          onChange={(id) => {
            setActiveTab(id);
            setIsAdding(false);
          }} 
        />
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">
              {activeTab === 'kategori' && 'Daftar Kategori'}
              {activeTab === 'lokasi' && 'Daftar Lokasi Rak'}
              {activeTab === 'satuan' && 'Daftar Satuan'}
            </h3>
            
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="btn-primary"
            >
              <Plus size={18} /> Tambah Data
            </button>
          </div>

          {/* Inline Add Form */}
          {isAdding && (
            <div className="mb-6 p-4 bg-slate-50 border border-primary-100 rounded-xl flex flex-wrap gap-4 items-end animate-slide-up">
              <div className="flex-1 min-w-[200px]">
                <label className="label">
                  Nama {activeTab === 'kategori' ? 'Kategori' : activeTab === 'lokasi' ? 'Lokasi' : 'Satuan'}
                </label>
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="input-field" 
                  placeholder={`Masukkan nama ${activeTab}...`}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && (activeTab !== 'lokasi' || newLokasiKapasitas) ? handleAddNew() : null}
                />
              </div>
              
              {activeTab === 'lokasi' && (
                <div className="w-40">
                  <label className="label">Kapasitas Maks</label>
                  <input 
                    type="number" 
                    value={newLokasiKapasitas}
                    onChange={(e) => setNewLokasiKapasitas(e.target.value)}
                    className="input-field" 
                    placeholder="Contoh: 50"
                    onKeyDown={(e) => e.key === 'Enter' && newItemName ? handleAddNew() : null}
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <button onClick={handleAddNew} className="btn-primary py-2.5">Simpan</button>
                <button onClick={() => setIsAdding(false)} className="btn-ghost py-2.5">Batal</button>
              </div>
            </div>
          )}

          {activeTab === 'kategori' && (
            <EditableDataGrid 
              data={kategori}
              columns={kategoriColumns}
              onUpdateRow={(row) => {
                updateKategori(row.id, row.nama);
                addToast('Kategori berhasil diupdate', 'success');
              }}
              onDeleteRow={(row) => handleDeleteClick('kategori', row)}
            />
          )}

          {activeTab === 'lokasi' && (
            <EditableDataGrid 
              data={lokasi}
              columns={lokasiColumns}
              onUpdateRow={(row) => {
                updateLokasi(row.id, { nama: row.nama, kapasitas_maks: row.kapasitas_maks, jumlah_terpakai: row.jumlah_terpakai });
                addToast('Lokasi berhasil diupdate', 'success');
              }}
              onDeleteRow={(row) => handleDeleteClick('lokasi', row)}
            />
          )}

          {activeTab === 'satuan' && (
            <EditableDataGrid 
              data={satuan}
              columns={satuanColumns}
              onUpdateRow={(row) => {
                updateSatuan(row.id, row.nama);
                addToast('Satuan berhasil diupdate', 'success');
              }}
              onDeleteRow={(row) => handleDeleteClick('satuan', row)}
            />
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title="Hapus Data Master"
        message={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.row?.nama}"? Data yang sudah dihapus tidak dapat dikembalikan.`}
        confirmText="Ya, Hapus"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
