import { SPARE_PARTS_REPAIR } from '../data/mockData';
import { Wrench } from 'lucide-react';

export default function SparePartsRepairPage() {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Dalam Pengerjaan': return 'text-blue-600 bg-blue-50';
      case 'Menunggu Sparepart': return 'text-orange-600 bg-orange-50';
      case 'Selesai': return 'text-emerald-600 bg-emerald-50';
      case 'Baru Masuk': return 'text-purple-600 bg-purple-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Spare Parts Repair</h2>
            <p className="text-slate-500 text-sm">Pantau status perbaikan komponen spare part.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Kode Part</th>
                <th className="px-6 py-4">Nama Part</th>
                <th className="px-6 py-4">Tgl Masuk</th>
                <th className="px-6 py-4">Masalah</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Teknisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {SPARE_PARTS_REPAIR.map((repair) => (
                <tr key={repair.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">{repair.kode_part}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{repair.nama_part}</td>
                  <td className="px-6 py-4">{repair.tanggal_masuk}</td>
                  <td className="px-6 py-4 text-red-500">{repair.masalah}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(repair.status)}`}>
                      {repair.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{repair.teknisi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
