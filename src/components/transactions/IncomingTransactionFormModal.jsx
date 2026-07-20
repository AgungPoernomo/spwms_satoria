import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import useTransactionStore from '../../store/useTransactionStore';
import useSparePartStore from '../../store/useSparePartStore';
import { SUPPLIERS } from '../../data/mockData';
import { todayString } from '../../utils/formatDate';

const INITIAL_FORM = {
  tanggal_masuk: '',
  kode_part: '',
  jumlah: 1,
  supplier: '',
  no_po_invoice: '',
  keterangan: '',
};

export default function IncomingTransactionFormModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const addMasuk = useTransactionStore(s => s.addMasuk);
  const spareParts = useSparePartStore(s => s.spareParts);
  const [selectedPartInfo, setSelectedPartInfo] = useState(null);

  useEffect(() => {
    if (isOpen) setFormData({ ...INITIAL_FORM, tanggal_masuk: todayString() });
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
    
    addMasuk({
      ...formData,
      nama_part: selectedPartInfo.nama_part,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Penerimaan Barang Masuk" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="label">Tanggal Masuk <span className="text-red-500">*</span></label>
          <input
            required
            type="date"
            name="tanggal_masuk"
            value={formData.tanggal_masuk}
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
            <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm">
              <p className="font-semibold text-slate-700">{selectedPartInfo.nama_part}</p>
              <p className="text-slate-500 text-xs mt-0.5">Stok saat ini: <strong className="text-slate-800">{selectedPartInfo.stok_saat_ini}</strong> di {selectedPartInfo.lokasi_rak}</p>
            </div>
          )}
        </div>

        <div>
          <label className="label">Jumlah Diterima <span className="text-red-500">*</span></label>
          <input
            required
            type="number"
            min="1"
            name="jumlah"
            value={formData.jumlah}
            onChange={handleChange}
            className="input-field bg-emerald-50 border-emerald-200"
          />
        </div>

        <div>
          <label className="label">Supplier Pengirim</label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">-- Pilih Supplier --</option>
            {SUPPLIERS.map(s => (
              <option key={s.id} value={s.nama_supplier}>{s.nama_supplier}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">No. PO / Invoice</label>
          <input
            name="no_po_invoice"
            value={formData.no_po_invoice}
            onChange={handleChange}
            className="input-field"
            placeholder="Misal: PO-2026-..."
          />
        </div>

        <div>
          <label className="label">Keterangan Tambahan</label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            className="input-field min-h-[80px]"
            placeholder="Catatan..."
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-outline border-slate-300 text-slate-600 hover:bg-slate-50">
            Batal
          </button>
          <button type="submit" className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-none">
            Simpan Penerimaan
          </button>
        </div>
      </form>
    </Modal>
  );
}
