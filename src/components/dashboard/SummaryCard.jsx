import { TrendingUp, TrendingDown, Package, PackagePlus, PackageMinus, AlertTriangle } from 'lucide-react';

const CARD_CONFIGS = {
  totalParts: {
    label: 'Total Spare Part',
    icon: Package,
    gradient: 'from-primary-600 to-blue-500',
    bg: 'bg-primary-50',
    iconColor: 'text-primary-600',
  },
  masukHariIni: {
    label: 'Barang Masuk Hari Ini',
    icon: PackagePlus,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  keluarHariIni: {
    label: 'Barang Keluar Hari Ini',
    icon: PackageMinus,
    gradient: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  itemKritis: {
    label: 'Item Kritis',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-rose-500',
    bg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
};

export default function SummaryCard({ type, value, subtitle }) {
  const config = CARD_CONFIGS[type];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{config.label}</p>
          <p className="text-3xl font-bold text-slate-800">{value ?? 0}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} className={config.iconColor} />
        </div>
      </div>
      {/* Accent bar */}
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${config.gradient} opacity-60`} />
    </div>
  );
}
