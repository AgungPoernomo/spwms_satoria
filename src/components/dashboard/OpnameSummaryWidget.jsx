import { ClipboardCheck } from 'lucide-react';
import useOpnameStore from '../../store/useOpnameStore';

export default function OpnameSummaryWidget() {
  const sessions = useOpnameStore(s => s.sessions);
  const recentSessions = sessions.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <ClipboardCheck size={16} className="text-blue-600" />
          Ringkasan Stock Opname
        </h3>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="text-slate-400 font-bold uppercase text-[9px] tracking-widest border-b border-slate-100">
            <tr>
              <th className="pb-2">ID Sesi</th>
              <th className="pb-2">Tanggal</th>
              <th className="pb-2 text-right">PIC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {recentSessions.length === 0 ? (
              <tr>
                <td colSpan="3" className="pt-4 text-center text-slate-400 text-xs italic">Belum ada riwayat opname</td>
              </tr>
            ) : (
              recentSessions.map(session => (
                <tr key={session.id} className="hover:bg-slate-50/50">
                  <td className="py-2 font-bold text-blue-600 text-[10px]">{session.id}</td>
                  <td className="py-2 text-slate-500 font-medium">
                    {new Date(session.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-2 text-right text-slate-600 font-semibold">{session.pic}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
