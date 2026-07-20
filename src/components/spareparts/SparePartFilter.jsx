import { Filter, RotateCcw } from 'lucide-react';
import useSparePartStore from '../../store/useSparePartStore';
import { KATEGORI_LIST, SUPPLIERS } from '../../data/mockData';

export default function SparePartFilter() {
  const { filters, setFilter, resetFilters } = useSparePartStore();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-slate-500 mr-2">
        <Filter size={16} />
        <span className="text-sm font-semibold">Filter:</span>
      </div>

      <select
        value={filters.kategori}
        onChange={(e) => setFilter('kategori', e.target.value)}
        className="input-field py-1.5 h-9 w-40"
      >
        <option value="">Semua Kategori</option>
        {KATEGORI_LIST.map(k => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => setFilter('status', e.target.value)}
        className="input-field py-1.5 h-9 w-40"
      >
        <option value="">Semua Status</option>
        <option value="Kritis">Kritis</option>
        <option value="Normal">Normal</option>
        <option value="Berlebih">Berlebih</option>
      </select>

      <select
        value={filters.supplier}
        onChange={(e) => setFilter('supplier', e.target.value)}
        className="input-field py-1.5 h-9 w-48"
      >
        <option value="">Semua Supplier</option>
        {SUPPLIERS.map(s => (
          <option key={s.id} value={s.nama_supplier}>{s.nama_supplier}</option>
        ))}
      </select>

      {(filters.kategori || filters.status || filters.supplier || filters.search) && (
        <button
          onClick={resetFilters}
          className="btn-ghost text-slate-500 hover:text-red-600"
          title="Reset semua filter"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}
    </div>
  );
}
