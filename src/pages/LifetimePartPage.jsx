import { LIFETIME_PARTS } from '../data/mockData';
import { Clock } from 'lucide-react';

export default function LifetimePartPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Lifetime Part</h2>
            <p className="text-slate-500 text-sm">Pantau umur pemakaian komponen pada mesin.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LIFETIME_PARTS.map((part) => {
          const percentage = Math.min(100, Math.round((part.umur_hari / part.estimasi_maksimal) * 100));
          let statusColor = 'bg-emerald-500';
          let bgColor = 'bg-emerald-50';
          let textColor = 'text-emerald-700';
          
          if (part.status === 'Kritis' || percentage >= 100) {
            statusColor = 'bg-red-500';
            bgColor = 'bg-red-50';
            textColor = 'text-red-700';
          } else if (part.status === 'Peringatan' || percentage >= 80) {
            statusColor = 'bg-orange-500';
            bgColor = 'bg-orange-50';
            textColor = 'text-orange-700';
          }

          return (
            <div key={part.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800">{part.nama_part}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{part.kode_part}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${bgColor} ${textColor}`}>
                  {part.status}
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Terpasang Pada</p>
                <p className="text-sm font-medium text-slate-700 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100 inline-block">{part.mesin}</p>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-2xl font-black text-slate-800">{part.umur_hari}</span>
                    <span className="text-xs text-slate-500 font-medium ml-1">hari</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium">Batas: {part.estimasi_maksimal} hari</span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full ${statusColor}`} style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
