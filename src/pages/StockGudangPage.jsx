import { useState, useEffect } from 'react';
import {
  Search, MapPin, AlertCircle, CheckCircle2,
  LayoutGrid, List, Warehouse, TrendingUp
} from 'lucide-react';
import useMasterDataStore from '../store/useMasterDataStore';
import SkeletonLoader from '../components/common/SkeletonLoader';

// ── Helpers ───────────────────────────────────────────────────────────────────
const resolveStatus = (pct) => {
  if (pct >= 90) return 'penuh';
  if (pct >= 50) return 'sebagian';
  return 'normal';
};

const STATUS_META = {
  penuh:    { label: 'Penuh',    color: '#ef4444', bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5' }, // red-500
  sebagian: { label: 'Sebagian', color: '#f59e0b', bg: '#fffbeb', text: '#92400e', border: '#fde68a' }, // amber-500
  normal:   { label: 'Normal',   color: '#2563eb', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' }, // blue-600
};

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, statusKey }) {
  const { color } = STATUS_META[statusKey];
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Rack Card ─────────────────────────────────────────────────────────────────
function RackCard({ rak }) {
  const pct   = Math.min(100, Math.round((rak.jumlah_terpakai / (rak.kapasitas_maks || 1)) * 100));
  const sk    = resolveStatus(pct);
  const meta  = STATUS_META[sk];
  const avail = Math.max(0, rak.kapasitas_maks - rak.jumlah_terpakai);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <MapPin size={15} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{rak.nama}</p>
            <p className="text-[10px] text-slate-400 font-mono">ID #{rak.id}</p>
          </div>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-lg border"
          style={{ background: meta.bg, color: meta.text, borderColor: meta.border }}
        >
          {meta.label}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="text-slate-500 font-medium">{rak.jumlah_terpakai} dari {rak.kapasitas_maks} slot</span>
          <span className="font-bold" style={{ color: meta.color }}>{pct}%</span>
        </div>
        <ProgressBar pct={pct} statusKey={sk} />
      </div>

      {/* Footer stat */}
      <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span>Terpakai: <strong className="text-slate-700">{rak.jumlah_terpakai}</strong></span>
        <span>Tersedia: <strong style={{ color: avail === 0 ? '#ef4444' : '#2563eb' }}>{avail} slot</strong></span>
      </div>
    </div>
  );
}

// ── Rack Row (List view) ──────────────────────────────────────────────────────
function RackRow({ rak }) {
  const pct   = Math.min(100, Math.round((rak.jumlah_terpakai / (rak.kapasitas_maks || 1)) * 100));
  const sk    = resolveStatus(pct);
  const meta  = STATUS_META[sk];
  const avail = Math.max(0, rak.kapasitas_maks - rak.jumlah_terpakai);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 px-4 py-3 flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
        <MapPin size={14} className="text-blue-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-bold text-slate-800 text-sm truncate">{rak.nama}</span>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0"
            style={{ background: meta.bg, color: meta.text, borderColor: meta.border }}
          >
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <ProgressBar pct={pct} statusKey={sk} />
          </div>
          <span className="text-[11px] font-bold shrink-0" style={{ color: meta.color }}>{pct}%</span>
        </div>
      </div>

      <div className="flex items-center gap-5 shrink-0 text-center">
        <div>
          <p className="text-sm font-bold text-slate-800">{rak.jumlah_terpakai}<span className="text-slate-400 text-xs font-normal">/{rak.kapasitas_maks}</span></p>
          <p className="text-[10px] text-slate-400">terpakai</p>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: avail === 0 ? '#ef4444' : '#2563eb' }}>{avail}</p>
          <p className="text-[10px] text-slate-400">tersedia</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StockGudangPage() {
  const { lokasi } = useMasterDataStore();
  const [searchTerm,   setSearchTerm]   = useState('');
  const [isLoading,    setIsLoading]    = useState(true);
  const [viewMode,     setViewMode]     = useState('grid');
  const [filterStatus, setFilterStatus] = useState('Semua');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const STATUS_FILTERS = ['Semua', 'Normal', 'Sebagian', 'Penuh'];

  const filteredLokasi = lokasi.filter(l => {
    const pct = (l.jumlah_terpakai / (l.kapasitas_maks || 1)) * 100;
    const sk  = resolveStatus(pct);
    const matchStatus = filterStatus === 'Semua' || STATUS_META[sk].label === filterStatus;
    const matchSearch = !searchTerm || l.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Summary counts
  const totalSlot  = lokasi.reduce((a, l) => a + l.kapasitas_maks, 0);
  const usedSlot   = lokasi.reduce((a, l) => a + l.jumlah_terpakai, 0);
  const penuhCount = lokasi.filter(l => resolveStatus((l.jumlah_terpakai / l.kapasitas_maks) * 100) === 'penuh').length;
  const normalCount = lokasi.length - penuhCount;

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <Warehouse size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Stock Gudang</h2>
              <p className="text-blue-100 text-sm">Kapasitas & utilisasi lokasi rak</p>
            </div>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 border-t border-slate-100">
          {[
            { label: 'Total Rak',  value: lokasi.length,       icon: <MapPin size={14} />,       color: 'text-slate-700' },
            { label: 'Total Slot', value: `${usedSlot}/${totalSlot}`, icon: <TrendingUp size={14} />,  color: 'text-blue-700' },
            { label: 'Aman',       value: normalCount,          icon: <CheckCircle2 size={14} />,  color: 'text-emerald-600' },
            { label: 'Penuh',      value: penuhCount,           icon: <AlertCircle size={14} />,   color: 'text-rose-600' },
          ].map(s => (
            <div key={s.label} className="px-5 py-3 flex items-center gap-2.5">
              <span className={`${s.color} opacity-70`}>{s.icon}</span>
              <div>
                <p className={`text-lg font-black leading-none ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-2.5 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari lokasi rak..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-52 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                filterStatus === f ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            title="Grid"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            title="List"
          >
            <List size={14} />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 font-medium">{filteredLokasi.length} dari {lokasi.length} rak</p>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonLoader key={i} type="card" lines={2} />)}
        </div>
      ) : filteredLokasi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 flex flex-col items-center gap-3 text-slate-400">
          <MapPin size={36} className="opacity-20" />
          <p className="font-semibold text-slate-500 text-sm">Tidak ada rak ditemukan</p>
          <p className="text-xs">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLokasi.map(rak => <RackCard key={rak.id} rak={rak} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredLokasi.map(rak => <RackRow key={rak.id} rak={rak} />)}
        </div>
      )}
    </div>
  );
}
