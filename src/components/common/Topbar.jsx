import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useSparePartStore from '../../store/useSparePartStore';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/data-master': 'Data Master',
  '/data-supplier': 'Data Suplier',
  '/spare-parts': 'Data Spare Part',
  '/stock-gudang': 'Stock Gudang',
  '/barang-masuk': 'Barang Masuk',
  '/stock-used': 'Stock Used',
  '/stock-opname': 'Stock Opname',
  '/lifetime-part': 'Lifetime Part',
  '/spare-parts-repair': 'Spare Parts Repair',
  '/log-aktivitas': 'Log Aktivitas',
  '/laporan': 'Laporan & Histori',
  '/pengaturan': 'Pengaturan',
};

export default function Topbar() {
  const location = useLocation();
  const { user } = useAuth();
  const criticalParts = useSparePartStore(s => s.getCriticalParts());
  const title = PAGE_TITLES[location.pathname] || 'SPWMS';

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          id="topbar-notification-btn"
          className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          title={`${criticalParts.length} item kritis`}
        >
          <Bell size={16} />
          {criticalParts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 w-5 h-5 flex items-center justify-center leading-none">
              {criticalParts.length}
            </span>
          )}
        </button>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.avatar || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.nama}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
