import { useState } from 'react';
import { LIFETIME_PARTS, SPARE_PARTS } from '../data/mockData';
import {
  Clock, Plus, ArrowLeft, CheckCircle2, AlertTriangle,
  AlertOctagon, Search, Cpu, Calendar, Activity, Wrench,
  ChevronRight, Timer, Gauge
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────
const getStatusConfig = (status, percentage) => {
  if (status === 'Kritis' || percentage >= 100) return {
    label: 'Kritis',
    gradient: 'from-red-500 to-rose-600',
    trackColor: '#fca5a5',
    fillColor: '#ef4444',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    cardBorder: 'border-red-200',
    cardGlow: 'shadow-red-100',
    ringBg: 'bg-red-50',
    icon: <AlertOctagon size={14} className="text-red-600" />,
    dot: 'bg-red-500',
  };
  if (status === 'Peringatan' || percentage >= 80) return {
    label: 'Peringatan',
    gradient: 'from-amber-400 to-orange-500',
    trackColor: '#fed7aa',
    fillColor: '#f97316',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    cardBorder: 'border-orange-200',
    cardGlow: 'shadow-orange-100',
    ringBg: 'bg-orange-50',
    icon: <AlertTriangle size={14} className="text-orange-600" />,
    dot: 'bg-orange-500',
  };
  return {
    label: 'Aman',
    gradient: 'from-emerald-400 to-teal-500',
    trackColor: '#a7f3d0',
    fillColor: '#10b981',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    cardBorder: 'border-emerald-200',
    cardGlow: 'shadow-emerald-100',
    ringBg: 'bg-emerald-50',
    icon: <CheckCircle2 size={14} className="text-emerald-600" />,
    dot: 'bg-emerald-500',
  };
};

// SVG Radial Progress Ring
function RadialProgress({ percentage, config, size = 80 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(percentage, 100);
  const dashOffset = circumference - (clampedPct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={config.trackColor} strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={config.fillColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-black text-slate-800 leading-none">{clampedPct}%</span>
      </div>
    </div>
  );
}

// ── Summary Stats ─────────────────────────────────────────────────────────────
function SummaryBar({ parts }) {
  const kritis = parts.filter(p => p.status === 'Kritis' || (p.umur_hari / p.estimasi_maksimal) >= 1).length;
  const peringatan = parts.filter(p => {
    const pct = p.umur_hari / p.estimasi_maksimal;
    return (p.status === 'Peringatan' || (pct >= 0.8 && pct < 1)) && p.status !== 'Kritis';
  }).length;
  const aman = parts.length - kritis - peringatan;

  const stats = [
    { label: 'Total Part', value: parts.length, icon: <Cpu size={18} />, gradient: 'from-indigo-500 to-violet-600', light: 'bg-indigo-50 text-indigo-600' },
    { label: 'Aman', value: aman, icon: <CheckCircle2 size={18} />, gradient: 'from-emerald-400 to-teal-500', light: 'bg-emerald-50 text-emerald-600' },
    { label: 'Peringatan', value: peringatan, icon: <AlertTriangle size={18} />, gradient: 'from-amber-400 to-orange-500', light: 'bg-orange-50 text-orange-600' },
    { label: 'Kritis', value: kritis, icon: <AlertOctagon size={18} />, gradient: 'from-red-500 to-rose-600', light: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.light}`}>
            {s.icon}
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Part Card ─────────────────────────────────────────────────────────────────
function PartCard({ part }) {
  const pct = Math.min(100, Math.round((part.umur_hari / part.estimasi_maksimal) * 100));
  const cfg = getStatusConfig(part.status, pct);
  const remaining = Math.max(0, part.estimasi_maksimal - part.umur_hari);

  return (
    <div className={`bg-white rounded-2xl border ${cfg.cardBorder} shadow-sm ${cfg.cardGlow} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col`}>
      {/* Top accent gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${cfg.gradient}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-sm leading-snug truncate">{part.nama_part}</h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{part.kode_part}</p>
          </div>
          <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${cfg.badgeBg} ${cfg.badgeText}`}>
            {cfg.icon}
            {cfg.label}
          </span>
        </div>

        {/* Radial + Info */}
        <div className="flex items-center gap-4 mb-4">
          <RadialProgress percentage={pct} config={cfg} size={80} />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Wrench size={12} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Mesin</p>
                <p className="text-[11px] font-bold text-slate-700 leading-tight">{part.mesin}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer size={12} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Umur</p>
                <p className="text-[11px] font-bold text-slate-700"><span className="text-base font-black">{part.umur_hari}</span> / {part.estimasi_maksimal} hari</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress linear */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-semibold text-slate-400">Progress Lifetime</span>
            <span className={`text-[10px] font-bold ${cfg.badgeText}`}>
              {remaining > 0 ? `Sisa ${remaining} hari` : 'Melebihi batas!'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${cfg.gradient} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Input Form ────────────────────────────────────────────────────────────────
function InputForm({ onBack }) {
  const [form, setForm] = useState({
    kode_part: '',
    nama_part: '',
    mesin: '',
    umur_hari: '',
    estimasi_maksimal: '',
    tanggal_pasang: '',
    teknisi: '',
    keterangan: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePartSelect = (e) => {
    const sp = SPARE_PARTS.find(s => s.kode_part === e.target.value);
    if (sp) setForm(f => ({ ...f, kode_part: sp.kode_part, nama_part: sp.nama_part }));
    else setForm(f => ({ ...f, kode_part: e.target.value, nama_part: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black text-slate-800">Data Berhasil Disimpan!</h3>
          <p className="text-slate-500 text-sm mt-1">Lifetime part <span className="font-bold text-slate-700">{form.nama_part}</span> telah ditambahkan.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSubmitted(false)}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Tambah Lagi
          </button>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
          <h3 className="text-white font-bold text-base">Form Input Lifetime Part</h3>
          <p className="text-indigo-200 text-xs mt-0.5">Isi data komponen yang akan dipantau masa pakainya</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Part Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Kode Part *</label>
              <select
                name="kode_part"
                value={form.kode_part}
                onChange={handlePartSelect}
                required
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              >
                <option value="">-- Pilih Part --</option>
                {SPARE_PARTS.map(sp => (
                  <option key={sp.kode_part} value={sp.kode_part}>{sp.kode_part}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Nama Part *</label>
              <input
                type="text"
                name="nama_part"
                value={form.nama_part}
                onChange={handleChange}
                required
                placeholder="Nama komponen"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          {/* Mesin */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Nama Mesin / Unit *</label>
            <input
              type="text"
              name="mesin"
              value={form.mesin}
              onChange={handleChange}
              required
              placeholder="Contoh: Mesin Produksi A, Forklift 01"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Umur & Estimasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Umur Saat Ini (hari) *</label>
              <input
                type="number"
                name="umur_hari"
                value={form.umur_hari}
                onChange={handleChange}
                required
                min={0}
                placeholder="0"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Estimasi Maks (hari) *</label>
              <input
                type="number"
                name="estimasi_maksimal"
                value={form.estimasi_maksimal}
                onChange={handleChange}
                required
                min={1}
                placeholder="365"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          {/* Tanggal & Teknisi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Tanggal Pemasangan *</label>
              <input
                type="date"
                name="tanggal_pasang"
                value={form.tanggal_pasang}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Teknisi</label>
              <input
                type="text"
                name="teknisi"
                value={form.teknisi}
                onChange={handleChange}
                placeholder="Nama teknisi"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Keterangan</label>
            <textarea
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              rows={3}
              placeholder="Catatan tambahan (opsional)..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all resize-none"
            />
          </div>

          {/* Live Preview */}
          {form.kode_part && form.umur_hari && form.estimasi_maksimal && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity size={11} /> Preview Status
              </p>
              {(() => {
                const pct = Math.min(100, Math.round((Number(form.umur_hari) / Number(form.estimasi_maksimal)) * 100));
                const cfg = getStatusConfig(pct >= 100 ? 'Kritis' : pct >= 80 ? 'Peringatan' : 'Aman', pct);
                return (
                  <div className="flex items-center gap-3">
                    <RadialProgress percentage={pct} config={cfg} size={56} />
                    <div>
                      <p className="text-sm font-bold text-slate-700">{form.nama_part || form.kode_part}</p>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider w-fit ${cfg.badgeBg} ${cfg.badgeText}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all active:scale-95"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LifetimePartPage() {
  const [view, setView] = useState('list'); // 'list' | 'input'
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const STATUS_FILTERS = ['Semua', 'Aman', 'Peringatan', 'Kritis'];

  const filteredParts = LIFETIME_PARTS.filter(p => {
    const pct = (p.umur_hari / p.estimasi_maksimal) * 100;
    const resolvedStatus = p.status === 'Kritis' || pct >= 100
      ? 'Kritis' : p.status === 'Peringatan' || pct >= 80
      ? 'Peringatan' : 'Aman';

    const matchStatus = filter === 'Semua' || resolvedStatus === filter;
    const matchSearch = !search || p.nama_part.toLowerCase().includes(search.toLowerCase()) || p.kode_part.toLowerCase().includes(search.toLowerCase()) || p.mesin.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {view === 'input' && (
                <button
                  onClick={() => setView('list')}
                  className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                {view === 'input' ? <Plus size={24} className="text-white" /> : <Gauge size={24} className="text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  {view === 'input' ? 'Tambah Lifetime Part' : 'Lifetime Part Monitor'}
                </h2>
                <p className="text-indigo-200 text-sm mt-0.5">
                  {view === 'input' ? 'Daftarkan komponen baru untuk dipantau' : 'Pantau umur pemakaian komponen secara real-time'}
                </p>
              </div>
            </div>

            {view === 'list' && (
              <button
                onClick={() => setView('input')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Plus size={16} />
                Tambah Data
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className={view === 'list' ? 'text-indigo-600 font-bold' : ''}>Lifetime Part</span>
          {view === 'input' && (
            <>
              <ChevronRight size={12} />
              <span className="text-indigo-600 font-bold">Input Data</span>
            </>
          )}
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Summary Stats */}
          <SummaryBar parts={LIFETIME_PARTS} />

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari part, kode, mesin..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === f
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 font-medium sm:ml-auto">
              {filteredParts.length} dari {LIFETIME_PARTS.length} part
            </p>
          </div>

          {/* Grid Cards */}
          {filteredParts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredParts.map(part => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 flex flex-col items-center gap-3 text-slate-400">
              <Clock size={40} className="opacity-30" />
              <p className="font-semibold">Tidak ada data yang cocok</p>
              <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}
        </>
      ) : (
        <InputForm onBack={() => setView('list')} />
      )}
    </div>
  );
}
