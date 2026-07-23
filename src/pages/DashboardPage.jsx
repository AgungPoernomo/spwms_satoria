import { useAuth } from '../context/AuthContext';
import IncomingCalendarWidget from '../components/dashboard/IncomingCalendarWidget';
import PartRepairWidget from '../components/dashboard/PartRepairWidget';
import LogActivityWidget from '../components/dashboard/LogActivityWidget';
import InventoryPieChart from '../components/dashboard/InventoryPieChart';
import InventoryOverviewWidget from '../components/dashboard/InventoryOverviewWidget';
import WarehouseStockWidget from '../components/dashboard/WarehouseStockWidget';
import OpnameSummaryWidget from '../components/dashboard/OpnameSummaryWidget';
import StockUsedWidget from '../components/dashboard/StockUsedWidget';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="w-full pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Selamat Datang, {user?.nama?.split(' ')[0] || 'User'}!</h1>
        <p className="text-slate-500 text-sm font-medium">Metrik Real-time performa Gudang Master.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 w-full items-start">
        
        {/* ROW 1: TOP SECTION */}
        {/* LEFT COLUMN (8 cols) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          <div className="h-[360px]">
             <IncomingCalendarWidget />
          </div>
          <div>
             <PartRepairWidget />
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          <div>
             <LogActivityWidget />
          </div>
          <div>
             <InventoryPieChart />
          </div>
          <div>
             <InventoryOverviewWidget />
          </div>
        </div>

        {/* ROW 2: BOTTOM SECTION */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <div className="h-[250px]">
            <WarehouseStockWidget />
          </div>
          <div className="h-[250px]">
            <OpnameSummaryWidget />
          </div>
          <div className="h-[250px]">
            <StockUsedWidget />
          </div>
        </div>

      </div>
    </div>
  );
}
