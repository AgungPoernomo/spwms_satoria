import { Wrench } from 'lucide-react';
import { SPARE_PARTS_REPAIR } from '../../data/mockData';

export default function PartRepairWidget() {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Dalam Pengerjaan': return 'bg-orange-100 text-orange-700';
      case 'Menunggu Sparepart': return 'bg-red-100 text-red-700';
      case 'Selesai': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col w-full">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <Wrench size={16} className="text-slate-600" />
        <h3 className="font-bold text-slate-800 text-sm">Part Repair</h3>
      </div>
      
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Part</th>
              <th className="px-4 py-3">Tgl Masuk</th>
              <th className="px-4 py-3">Masalah</th>
              <th className="px-4 py-3">Teknisi</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {SPARE_PARTS_REPAIR.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-700">{item.nama_part}</p>
                  <p className="font-mono text-[9px] text-slate-400">{item.kode_part}</p>
                </td>
                <td className="px-4 py-3 text-slate-500 font-medium">{item.tanggal_masuk}</td>
                <td className="px-4 py-3 text-red-600 font-medium">{item.masalah}</td>
                <td className="px-4 py-3 text-slate-600">{item.teknisi}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
