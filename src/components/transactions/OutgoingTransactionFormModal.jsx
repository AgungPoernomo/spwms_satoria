import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import useTransactionStore from '../../store/useTransactionStore';
import useSparePartStore from '../../store/useSparePartStore';
import { todayString } from '../../utils/formatDate';

const INITIAL_FORM = {
  tanggal_keluar: '',
  kode_part: '',
  jumlah: 1,
  tujuan_departemen: '',
  no_permintaan: '',
  keterangan: '',
};

const DEPARTEMEN_LIST = [
  'Workshop Maintenance',
  'Departemen Logistik',
  'Fleet Management',
  'Produksi',
  'General Affair',
];

export default function OutgoingTransactionFormModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const addKeluar = useTransactionStore(s => s.addKeluar);
  const spareParts = useSparePartStore(s => s.spareParts);
  const [selectedPartInfo, setSelectedPartInfo] = useState(null);

  useEffect(() => {
    if (isOpen) setFormData({ ...INITIAL_FORM, tanggal_keluar: todayString() });
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    if (name === 'kode_part') {
      const part = spareParts.find(p => p.kode_part === value);
      setSelectedPartInfo(part || null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPartInfo) {
      alert('Spare part tidak ditemukan!');
      return;
    }

    if (formData.jumlah > selectedPartInfo.stok_saat_ini) {
      alert(`Gagal! Jumlah pengeluaran (${formData.jumlah}) melebihi stok saat ini (${selectedPartInfo.stok_saat_ini}).`);
      return;
    }
    
    addKeluar({
      ...formData,
      nama_part: selectedPartInfo.nama_part,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pengeluaran Barang" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="label">Tanggal Keluar <span className="text-red-500">*</span></label>
          <input
            required
            type="date"
            name="tanggal_keluar"
            value={formData.tanggal_keluar}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Kode Spare Part <span className="text-red-500">*</span></label>
          <select
            required
            name="kode_part"
            value={formData.kode_part}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">-- Pilih Spare Part --</option>
            {spareParts.map(p => (
              <option key={p.id} value={p.kode_part}>{p.kode_part} - {p.nama_part}</option>
            ))}
          </select>
          {selectedPartInfo && (
            <div className={`mt-2 p-3 border rounded-lg text-sm ${
              selectedPartInfo.stok_saat_ini === 0 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-slate-50 border-slate-100 text-slate-700'
            }`}>
              <p className="font-semibold">{selectedPartInfo.nama_part}</p>
              <p className="text-xs mt-0.5">Stok saat ini: <strong className="text-base">{selectedPartInfo.stok_saat_ini}</strong> di {selectedPartInfo.lokasi_rak}</p>
            </div>
          )}
        </div>

        <div>
          <label className="label">Jumlah Dikeluarkan <span className="text-red-500">*</span></label>
          <input
            required
            type="number"
            min="1"
            max={selectedPartInfo?.stok_saat_ini || 1}
            name="jumlah"
            value={formData.jumlah}
            onChange={handleChange}
            disabled={!selectedPartInfo || selectedPartInfo.stok_saat_ini === 0}
            className="input-field bg-orange-50 border-orange-200"
          />
          {selectedPartInfo && formData.jumlah > selectedPartInfo.stok_saat_ini && (
             <p className="text-xs text-red-500 mt-1">Melebihi stok yang tersedia!</p>
          )}
        </div>

        <div>
          <label className="label">Tujuan Departemen <span className="text-red-500">*</span></label>
          <select
            required
            name="tujuan_departemen"
            value={formData.tujuan_departemen}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">-- Pilih Departemen --</option>
            {DEPARTEMEN_LIST.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">No. Permintaan / Work Order</label>
          <input
            name="no_permintaan"
            value={formData.no_permintaan}
            onChange={handleChange}
            className="input-field"
            placeholder="Misal: REQ-2026-..."
          />
        </div>

        <div>
          <label className="label">Keterangan / Keperluan</label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            className="input-field min-h-[80px]"
            placeholder="Catatan penggunaan..."
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-outline border-slate-300 text-slate-600 hover:bg-slate-50">
            Batal
          </button>
          <button 
            type="submit" 
            disabled={!selectedPartInfo || selectedPartInfo.stok_saat_ini === 0 || formData.jumlah > selectedPartInfo.stok_saat_ini}
            className="btn-primary bg-orange-500 hover:bg-orange-600 border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan Pengeluaran
          </button>
        </div>
      </form>
    </Modal>
  );
}
