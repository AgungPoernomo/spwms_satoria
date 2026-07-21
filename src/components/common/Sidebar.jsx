import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  PackageMinus,
  FileBarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  Boxes,
  ClipboardCheck,
  LogOut,
  Clock,
  Wrench,
  Activity,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import useSparePartStore from '../../store/useSparePartStore';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/data-master', icon: Database, label: 'Data Master' },
  { to: '/data-supplier', icon: Truck, label: 'Data Suplier' },
  { to: '/spare-parts', icon: Package, label: 'Data Spare Part' },
  { to: '/stock-gudang', icon: Boxes, label: 'Stock Gudang' },
  { to: '/barang-masuk', icon: PackagePlus, label: 'Barang Masuk' },
  { to: '/stock-used', icon: PackageMinus, label: 'Stock Used' },
  { to: '/stock-opname', icon: ClipboardCheck, label: 'Stock Opname' },
  { to: '/lifetime-part', icon: Clock, label: 'Lifetime Part' },
  { to: '/spare-parts-repair', icon: Wrench, label: 'Spare Parts Repair' },
  { to: '/log-aktivitas', icon: Activity, label: 'Log Aktivitas' },
  { to: '/laporan', icon: FileBarChart2, label: 'Laporan' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const criticalParts = useSparePartStore(s => s.getCriticalParts());
  const { logout } = useAuth();

  return (
    <aside
      className={`relative flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ease-in-out flex-shrink-0 ${collapsed ? 'w-16' : 'w-64'
        }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 bg-white border border-slate-200 rounded-full p-1 shadow-md text-slate-500 hover:text-primary-600 transition-colors"
        aria-label="Toggle sidebar"
        id="sidebar-toggle-btn"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div className={`flex items-center h-[72px] border-b border-white/[0.08] ${collapsed ? 'justify-center px-3' : 'px-4 gap-3'}`}>
        {/* Logo container */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/[0.07] border border-white/[0.1] flex items-center justify-center">
          <img
            src="/logo-perusahaan.png"
            alt="Company Logo"
            className="w-9 h-9 object-contain"
          />
        </div>

        {!collapsed && (
          <div className="animate-fade-in flex flex-col justify-center min-w-0 gap-[3px]">
            {/* Product name */}
            <span className="text-white text-[15px] font-bold tracking-widest leading-none">
              SPARE PARTS
            </span>
            {/* Subtitle accent */}
            <span className="text-blue-200 text-[9px] font-semibold tracking-widest leading-none uppercase">
              WAREHOUSE MANAGEMENT
            </span>
            {/* Thin divider */}
            <div className="mt-[4px] h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
            {/* Department label */}
            <span className="text-slate-500 text-[9px] font-medium tracking-wide leading-none mt-[3px]">
              Engineering Department
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
            Menu Utama
          </p>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
            id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="relative flex-shrink-0">
              <Icon size={18} />
              {label === 'Data Spare Part' && criticalParts.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {criticalParts.length}
                </span>
              )}
            </div>
            {!collapsed && <span className="animate-fade-in truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom settings */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <NavLink
          to="/pengaturan"
          className={({ isActive }) =>
            `sidebar-link w-full ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
          }
          title={collapsed ? 'Pengaturan' : undefined}
          id="nav-pengaturan"
        >
          <Settings size={18} />
          {!collapsed && <span>Pengaturan</span>}
        </NavLink>
        <button
          onClick={logout}
          className={`sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Keluar' : undefined}
          id="nav-logout"
        >
          <LogOut size={18} />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
