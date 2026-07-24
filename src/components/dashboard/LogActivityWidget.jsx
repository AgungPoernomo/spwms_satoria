import { Activity } from 'lucide-react';
import useLogStore from '../../store/useLogStore';

export default function LogActivityWidget() {
  const recentLogs = useLogStore(s => s.getRecentLogs(3));

  return (
    <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 p-5 w-full h-full flex flex-col text-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-blue-400" />
        <h3 className="font-bold text-sm">Log Aktivitas Terbaru</h3>
      </div>
      
      <div className="space-y-3">
        {recentLogs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada aktivitas.</p>
        ) : (
          recentLogs.map(log => (
            <div key={log.id} className="bg-slate-700/50 p-3 rounded-xl border border-slate-600">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-blue-300">{log.aksi}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(log.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{log.deskripsi}</p>
              <div className="mt-2 text-[9px] font-semibold text-slate-400">Oleh: {log.pengguna}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
