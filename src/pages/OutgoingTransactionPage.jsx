import { useState, useEffect } from 'react';
import { Minus, Filter, RotateCcw } from 'lucide-react';
import useTransactionStore from '../store/useTransactionStore';
import OutgoingTransactionTable from '../components/transactions/OutgoingTransactionTable';
import OutgoingTransactionFormModal from '../components/transactions/OutgoingTransactionFormModal';
import SearchInput from '../components/common/SearchInput';
import SkeletonLoader from '../components/common/SkeletonLoader';

const DEPARTEMEN_LIST = [
  'Workshop Maintenance',
  'Departemen Logistik',
  'Fleet Management',
  'Produksi',
  'General Affair',
];

export default function OutgoingTransactionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { filterKeluar, setFilterKeluar } = useTransactionStore();
  const filteredData = useTransactionStore(s => s.getFilteredKeluar());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const resetFilters = () => {
    setFilterKeluar('search', '');
    setFilterKeluar('departemen', '');
    setFilterKeluar('dateStart', '');
    setFilterKeluar('dateEnd', '');
  };

  const hasActiveFilters = filterKeluar.search || filterKeluar.departemen || filterKeluar.dateStart || filterKeluar.dateEnd;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-500 mr-2">
            <Filter size={16} />
            <span className="text-sm font-semibold hidden sm:inline">Filter:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterKeluar.dateStart}
              onChange={(e) => setFilterKeluar('dateStart', e.target.value)}
              className="input-field py-1.5 h-9 w-36 text-xs"
              title="Tanggal Awal"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={filterKeluar.dateEnd}
              onChange={(e) => setFilterKeluar('dateEnd', e.target.value)}
              className="input-field py-1.5 h-9 w-36 text-xs"
              title="Tanggal Akhir"
            />
          </div>

          <select
            value={filterKeluar.departemen}
            onChange={(e) => setFilterKeluar('departemen', e.target.value)}
            className="input-field py-1.5 h-9 w-44"
          >
            <option value="">Semua Departemen</option>
            {DEPARTEMEN_LIST.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="btn-ghost text-slate-500 hover:text-red-600 px-2">
              <RotateCcw size={14} />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <SearchInput
            value={filterKeluar.search}
            onChange={(val) => setFilterKeluar('search', val)}
            placeholder="Cari kode, departemen..."
          />
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary bg-orange-500 hover:bg-orange-600 border-none whitespace-nowrap"
          >
            <Minus size={18} />
            Pengeluaran Baru
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <SkeletonLoader type="table" lines={10} />
        </div>
      ) : (
        <OutgoingTransactionTable data={filteredData} />
      )}

      {isModalOpen && (
        <OutgoingTransactionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
