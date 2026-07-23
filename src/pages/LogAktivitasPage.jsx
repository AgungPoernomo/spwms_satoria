import { useState } from 'react';
import { Activity, Search, Filter } from 'lucide-react';
import useLogStore from '../store/useLogStore';

export default function LogAktivitasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modulFilter, setModulFilter] = useState('');
  
  const getFilteredLogs = useLogStore(s => s.getFilteredLogs);
  const filteredLogs = getFilteredLogs(searchTerm, modulFilter);

  const MODUL_LIST = ['Data Master', 'Spare Part', 'Transaksi', 'Stock Opname'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Log Aktivitas</h2>
            <p className="text-slate-500 text-sm">Jejak audit dan riwayat aktivitas seluruh sistem.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={modulFilter}
              onChange={(e) => setModulFilter(e.target.value)}
              className="input-field py-2 h-10 w-44"
            >
              <option value="">Semua Modul</option>
              {MODUL_LIST.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari aktivitas, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 h-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Modul</th>
                <th className="px-6 py-4">Aksi</th>
                <th className="px-6 py-4">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <Activity size={32} className="mx-auto mb-3 text-slate-300" />
                    <p>Tidak ada log aktivitas yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(log.tanggal).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{log.pengguna}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                        {log.modul}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary-600">{log.aksi}</td>
                    <td className="px-6 py-4 whitespace-normal min-w-[300px] text-slate-600">
                      {log.deskripsi}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
