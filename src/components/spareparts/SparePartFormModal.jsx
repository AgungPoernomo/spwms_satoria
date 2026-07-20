import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { KATEGORI_LIST, SUPPLIERS } from '../../data/mockData';
import { generateKodePart } from '../../utils/formatDate';
import useSparePartStore from '../../store/useSparePartStore';

const INITIAL_FORM = {
  kode_part: '',
  nama_part: '',
  kategori: '',
  merk_type: '',
  stok_saat_ini: 0,
  stok_minimum: 0,
  stok_maksimum: 0,
  lokasi_rak: '',
  harga_satuan: 0,
  supplier: '',
};

export default function SparePartFormModal({ isOpen, onClose, partToEdit }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [autoKode, setAutoKode] = useState(true);
  const { spareParts, addPart, updatePart } = useSparePartStore();

  useEffect(() => {
    if (isOpen) {
      if (partToEdit) {
        setFormData({ ...partToEdit });
        setAutoKode(false);
      } else {
        setFormData({
          ...INITIAL_FORM,
          kode_part: generateKodePart(spareParts),
        });
        setAutoKode(true);
      }
    }
  }, [isOpen, partToEdit, spareParts]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleAutoKodeToggle = (e) => {
    const checked = e.target.checked;
    setAutoKode(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, kode_part: generateKodePart(spareParts) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (formData.stok_minimum >= formData.stok_maksimum) {
      alert('Stok Minimum harus lebih kecil dari Stok Maksimum.');
      return;
    }
    
    // Find supplier ID based on name
    const supplierId = SUPPLIERS.find(s => s.nama_supplier === formData.supplier)?.id || null;
    const finalData = { ...formData, supplier_id: supplierId };

    if (partToEdit) {
      updatePart(partToEdit.id, finalData);
    } else {
      // Validate unique code for new part
      if (spareParts.some(p => p.kode_part.toLowerCase() === formData.kode_part.toLowerCase())) {
        alert('Kode Part sudah digunakan.');
        return;
      }
      addPart(finalData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={partToEdit ? 'Edit Spare Part' : 'Tambah Spare Part Baru'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Kode Part <span className="text-red-500">*</span></label>
                {!partToEdit && (
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input type="checkbox" checked={autoKode} onChange={handleAutoKodeToggle} className="rounded text-primary-600 focus:ring-primary-600" />
                    Auto-generate
                  </label>
                )}
              </div>
              <input
                required
                name="kode_part"
                value={formData.kode_part}
                onChange={handleChange}
                disabled={autoKode || !!partToEdit}
                className="input-field disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Misal: SP-001"
              />
            </div>

            <div>
              <label className="label">Nama Part <span className="text-red-500">*</span></label>
              <input
                required
                name="nama_part"
                value={formData.nama_part}
                onChange={handleChange}
                className="input-field"
                placeholder="Misal: Filter Oli"
              />
            </div>

            <div>
              <label className="label">Kategori <span className="text-red-500">*</span></label>
              <select
                required
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Pilih Kategori</option>
                {KATEGORI_LIST.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Merk & Tipe</label>
              <input
                name="merk_type"
                value={formData.merk_type}
                onChange={handleChange}
                className="input-field"
                placeholder="Misal: Sakura / A200"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <label className="label">Stok Aktual (Saat Ini) <span className="text-red-500">*</span></label>
              <input
                required
                type="number"
                min="0"
                name="stok_saat_ini"
                value={formData.stok_saat_ini}
                onChange={handleChange}
                className="input-field bg-primary-50 border-primary-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Stok Min <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  name="stok_minimum"
                  value={formData.stok_minimum}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Stok Max <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="1"
                  name="stok_maksimum"
                  value={formData.stok_maksimum}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Lokasi Rak</label>
                <input
                  name="lokasi_rak"
                  value={formData.lokasi_rak}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Misal: A-01"
                />
              </div>
              <div>
                <label className="label">Harga Satuan <span className="text-red-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1000"
                  name="harga_satuan"
                  value={formData.harga_satuan}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label">Supplier Utama</label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Pilih Supplier</option>
                {SUPPLIERS.map(s => (
                  <option key={s.id} value={s.nama_supplier}>{s.nama_supplier}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-outline border-slate-300 text-slate-600 hover:bg-slate-50">
            Batal
          </button>
          <button type="submit" className="btn-primary">
            {partToEdit ? 'Simpan Perubahan' : 'Tambah Spare Part'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
