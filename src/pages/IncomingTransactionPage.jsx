import { useState, useEffect, useMemo } from 'react';
import { Plus, Filter, RotateCcw, PackagePlus, CalendarDays, Truck, TrendingUp } from 'lucide-react';
import useTransactionStore from '../store/useTransactionStore';
import { SUPPLIERS } from '../data/mockData';
import IncomingTransactionTable from '../components/transactions/IncomingTransactionTable';
import IncomingTransactionFormModal from '../components/transactions/IncomingTransactionFormModal';
import SearchInput from '../components/common/SearchInput';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function IncomingTransactionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { filterMasuk, setFilterMasuk, transaksiMasuk } = useTransactionStore();
  const filteredData = useTransactionStore(s => s.getFilteredMasuk());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const resetFilters = () => {
    setFilterMasuk('search', '');
    setFilterMasuk('supplier', '');
    setFilterMasuk('dateStart', '');
    setFilterMasuk('dateEnd', '');
  };

  const hasActiveFilters = filterMasuk.search || filterMasuk.supplier || filterMasuk.dateStart || filterMasuk.dateEnd;

  // Derived stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const totalQtyToday = transaksiMasuk
      .filter(t => t.tanggal_masuk === today)
      .reduce((sum, t) => sum + t.jumlah, 0);

    const thisMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
    const totalQtyMonth = transaksiMasuk
      .filter(t => t.tanggal_masuk?.startsWith(thisMonth))
      .reduce((sum, t) => sum + t.jumlah, 0);

    const uniqueSuppliers = new Set(transaksiMasuk.map(t => t.supplier).filter(Boolean)).size;

    return {
      total: transaksiMasuk.length,
      todayQty: totalQtyToday,
      monthQty: totalQtyMonth,
      suppliers: uniqueSuppliers,
    };
  }, [transaksiMasuk]);

  const STAT_CARDS = [
    {
      label: 'Total Transaksi',
      value: stats.total,
      sub: 'semua penerimaan',
      icon: PackagePlus,
      gradient: 'from-primary-600 to-blue-500',
      bg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      textColor: 'text-primary-700',
    },
    {
      label: 'Diterima Hari Ini',
      value: stats.todayQty,
      sub: 'unit masuk hari ini',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Diterima Bulan Ini',
      value: stats.monthQty,
      sub: 'unit bulan ini',
      icon: CalendarDays,
      gradient: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      textColor: 'text-violet-700',
    },
    {
      label: 'Supplier Aktif',
      value: stats.suppliers,
      sub: 'supplier terdaftar',
      icon: Truck,
      gradient: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-6 shadow-lg border border-slate-700">
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-primary-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
              <PackagePlus size={26} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold tracking-tight">Barang Masuk</h2>
              <p className="text-slate-400 text-sm mt-0.5">Manajemen penerimaan spare part dari supplier</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            id="btn-penerimaan-baru"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-500/30 text-sm whitespace-nowrap self-start sm:self-auto"
          >
            <Plus size={18} />
            Penerimaan Baru
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow duration-200 animate-slide-up">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
                  <p className={`text-3xl font-black ${card.textColor}`}>{card.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={card.iconColor} />
                </div>
              </div>
              <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${card.gradient} opacity-60`} />
            </div>
          );
        })}
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* Filter section */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                <Filter size={13} className="text-slate-500" />
              </div>
              <span className="text-sm font-semibold hidden sm:inline text-slate-600">Filter:</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filterMasuk.dateStart}
                onChange={(e) => setFilterMasuk('dateStart', e.target.value)}
                className="input-field py-1.5 h-9 w-36 text-xs"
                title="Tanggal Awal"
              />
              <span className="text-slate-300 font-bold">—</span>
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
              className="input-field py-1.5 h-9 w-44 text-sm"
            >
              <option value="">Semua Supplier</option>
              {SUPPLIERS.map(s => (
                <option key={s.id} value={s.nama_supplier}>{s.nama_supplier}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 transition-all duration-200"
                title="Reset Filter"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <SearchInput
              value={filterMasuk.search}
              onChange={(val) => setFilterMasuk('search', val)}
              placeholder="Cari kode, nama part..."
              id="search-barang-masuk"
            />
            {/* Result count badge */}
            {hasActiveFilters && (
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                {filteredData.length} hasil
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Table Section ── */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <SkeletonLoader type="table" lines={10} />
        </div>
      ) : (
        <IncomingTransactionTable data={filteredData} />
      )}

      {isModalOpen && (
        <IncomingTransactionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
