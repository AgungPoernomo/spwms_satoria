import { Package, MapPin, Tag, Wrench, CheckCircle2, AlertTriangle, XCircle, Box, Activity } from 'lucide-react';
import { LIFECYCLE_STAGES } from '../../data/mockData';

export default function PartStatusCard({ unit }) {
  if (!unit) return null;

  const statusConfig = {
    di_rak:            { label: 'Tersedia di Gudang', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
    keluar:            { label: 'Sedang Digunakan',   color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    icon: Activity },
    perbaikan:         { label: 'Dalam Perbaikan',    color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: Wrench },
    masuk_gudang:      { label: 'Proses Penerimaan',  color: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200',  icon: Box },
    afkir:             { label: 'Afkir (Dibuang)',    color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     icon: XCircle },
  };

  const config = statusConfig[unit.status] || { label: 'Unknown', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: AlertTriangle };
  const StatusIcon = config.icon;

  return (
    <div className={`rounded-2xl border-2 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${config.bg} ${config.border}`}>
      
      {/* Left info */}
      <div className="flex gap-4 items-center">
        <div className={`p-4 rounded-2xl bg-white shadow-sm border ${config.border}`}>
          <Package size={32} className={config.color} />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black text-slate-800">{unit.nama_part}</h2>
            <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500">
              {unit.kategori}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
              <Tag size={12} className="text-slate-400" />
              Serial: <span className="text-slate-800">{unit.serial_number}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
              <Package size={12} className="text-slate-400" />
              Kode: <span className="text-slate-800">{unit.kode_part}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right info */}
      <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm ${config.border}`}>
          <StatusIcon size={16} className={config.color} />
          <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/50 px-3 py-1.5 rounded-lg">
          <MapPin size={12} className="text-slate-400" />
          Lokasi: <span className="text-slate-800">{unit.lokasi_saat_ini}</span>
        </div>
      </div>

    </div>
  );
}
