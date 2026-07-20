import { useState } from 'react';
import { Plus, Filter, RotateCcw } from 'lucide-react';
import useTransactionStore from '../store/useTransactionStore';
import { SUPPLIERS } from '../data/mockData';
import IncomingTransactionTable from '../components/transactions/IncomingTransactionTable';
import IncomingTransactionFormModal from '../components/transactions/IncomingTransactionFormModal';
import SearchInput from '../components/common/SearchInput';

export default function IncomingTransactionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filterMasuk, setFilterMasuk } = useTransactionStore();
  const filteredData = useTransactionStore(s => s.getFilteredMasuk());

  const resetFilters = () => {
    setFilterMasuk('search', '');
    setFilterMasuk('supplier', '');
    setFilterMasuk('dateStart', '');
    setFilterMasuk('dateEnd', '');
  };

  const hasActiveFilters = filterMasuk.search || filterMasuk.supplier || filterMasuk.dateStart || filterMasuk.dateEnd;

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
              value={filterMasuk.dateStart}
              onChange={(e) => setFilterMasuk('dateStart', e.target.value)}
              className="input-field py-1.5 h-9 w-36 text-xs"
              title="Tanggal Awal"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={filterMasuk.dateEnd}
              onChange={(e) => setFilterMasuk('dateEnd', e.target.value)}
              className="input-field py-1.5 h-9 w-36 text-xs"
              title="Tanggal Akhir"
            />
          </div>

          <select
            value={filterMasuk.supplier}
            onChange={(e) => setFilterMasuk('supplier', e.target.value)}
            className="input-field py-1.5 h-9 w-40"
          >
            <option value="">Semua Supplier</option>
            {SUPPLIERS.map(s => (
              <option key={s.id} value={s.nama_supplier}>{s.nama_supplier}</option>
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
            value={filterMasuk.search}
            onChange={(val) => setFilterMasuk('search', val)}
            placeholder="Cari kode, nama part..."
          />
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-none whitespace-nowrap"
          >
            <Plus size={18} />
            Penerimaan Baru
          </button>
        </div>
      </div>

      <IncomingTransactionTable data={filteredData} />

      {isModalOpen && (
        <IncomingTransactionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
