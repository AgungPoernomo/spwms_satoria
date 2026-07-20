import { Filter, RotateCcw, Download } from 'lucide-react';
import { KATEGORI_LIST } from '../../data/mockData';

export default function ReportFilterBar({ filters, setFilters, onExport }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ dateStart: '', dateEnd: '', kategori: '', jenis: '' });
  };

  const hasActiveFilters = filters.dateStart || filters.dateEnd || filters.kategori || filters.jenis;

  const setPreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setFilters({
      ...filters,
      dateStart: start.toISOString().split('T')[0],
      dateEnd: end.toISOString().split('T')[0],
    });
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
          <Filter size={16} />
          <span className="text-sm font-semibold hidden sm:inline">Filter Laporan:</span>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateStart}
            onChange={(e) => handleChange('dateStart', e.target.value)}
            className="input-field py-1.5 h-9 w-36 text-xs"
          />
          <span className="text-slate-400">-</span>
          <input
            type="date"
            value={filters.dateEnd}
            onChange={(e) => handleChange('dateEnd', e.target.value)}
            className="input-field py-1.5 h-9 w-36 text-xs"
          />
        </div>

        {/* Category */}
        <select
          value={filters.kategori}
          onChange={(e) => handleChange('kategori', e.target.value)}
          className="input-field py-1.5 h-9 w-40"
        >
          <option value="">Semua Kategori</option>
          {KATEGORI_LIST.map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>

        {/* Transaction Type */}
        <select
          value={filters.jenis}
          onChange={(e) => handleChange('jenis', e.target.value)}
          className="input-field py-1.5 h-9 w-40"
        >
          <option value="">Semua Transaksi</option>
          <option value="Masuk">Masuk Saja</option>
          <option value="Keluar">Keluar Saja</option>
        </select>

        {hasActiveFilters && (
          <button onClick={resetFilters} className="btn-ghost text-slate-500 hover:text-red-600 px-2">
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden xl:flex bg-slate-100 p-1 rounded-lg mr-2">
          <button onClick={() => setPreset(0)} className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-white rounded-md transition-colors">Hari Ini</button>
          <button onClick={() => setPreset(7)} className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-white rounded-md transition-colors">7 Hari</button>
          <button onClick={() => setPreset(30)} className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-white rounded-md transition-colors">30 Hari</button>
        </div>
        <button onClick={onExport} className="btn-outline">
          <Download size={16} />
          Export CSV
        </button>
      </div>
    </div>
  );
}
