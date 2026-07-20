import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useSparePartStore from '../../store/useSparePartStore';
import StatusBadge from '../common/StatusBadge';

export default function CriticalAlertList() {
  const criticalParts = useSparePartStore(s => s.getCriticalParts());
  // Show max 5 items
  const displayParts = criticalParts.slice(0, 5);

  return (
    <div className="card animate-slide-up flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            Alert Stok Kritis
            {criticalParts.length > 0 && (
              <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {criticalParts.length} Item
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Item yang butuh restock segera</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[160px]">
        {criticalParts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🎉</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Gudang Aman</p>
            <p className="text-xs">Tidak ada stok kritis saat ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayParts.map(part => (
              <div key={part.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{part.kode_part}</p>
                    <StatusBadge status="Kritis" />
                  </div>
                  <p className="text-xs text-slate-500 truncate" title={part.nama_part}>{part.nama_part}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-bold text-red-600">{part.stok_saat_ini}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Min: {part.stok_minimum}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {criticalParts.length > 5 && (
        <Link 
          to="/spare-parts?status=Kritis" 
          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
        >
          Lihat {criticalParts.length - 5} lainnya <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
