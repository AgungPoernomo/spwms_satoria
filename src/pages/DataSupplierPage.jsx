import { useState } from 'react';
import { SUPPLIERS as INITIAL_SUPPLIERS } from '../data/mockData';
import { Truck, Plus, X } from 'lucide-react';

export default function DataSupplierPage() {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama_supplier: '',
    kontak: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSupplier = {
      id: suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1,
      ...formData
    };
    setSuppliers([...suppliers, newSupplier]);
    setIsModalOpen(false);
    setFormData({ nama_supplier: '', kontak: '', email: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Truck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Data Suplier</h2>
            <p className="text-slate-500 text-sm">Kelola daftar suplier spare part Anda.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
        >
          <Plus size={18} /> Tambah Suplier
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nama Suplier</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">#{supplier.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{supplier.nama_supplier}</td>
                  <td className="px-6 py-4">{supplier.kontak}</td>
                  <td className="px-6 py-4 text-blue-600">{supplier.email}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">Tambah Data Suplier</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Suplier</label>
                <input 
                  type="text" 
                  required
                  value={formData.nama_supplier}
                  onChange={(e) => setFormData({...formData, nama_supplier: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all focus:bg-white" 
                  placeholder="Masukkan nama suplier..." 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kontak / Telepon</label>
                <input 
                  type="text" 
                  required
                  value={formData.kontak}
                  onChange={(e) => setFormData({...formData, kontak: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all focus:bg-white" 
                  placeholder="0812-3456-7890" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all focus:bg-white" 
                  placeholder="email@perusahaan.com" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
