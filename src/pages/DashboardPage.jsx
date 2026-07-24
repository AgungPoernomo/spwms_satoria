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

      <div className="grid grid-cols-12 gap-6 w-full items-stretch">

        {/* ROW 1: TOP SECTION */}
        {/* LEFT COLUMN (8 cols) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          <div className="flex-1">
            <IncomingCalendarWidget />
          </div>
          <div className="flex-1">
            <PartRepairWidget />
          </div>
          <div className="flex-1">
            <InventoryOverviewWidget />
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          <div>
            <LogActivityWidget />
          </div>
          <div className="flex-1">
            <InventoryPieChart />
          </div>
          <div className="flex-1">
            <StockUsedWidget />
          </div>
        </div>

        {/* ROW 2: BOTTOM SECTION */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div className="flex-1">
            <WarehouseStockWidget />
          </div>
          <div className="flex-1">
            <OpnameSummaryWidget />
          </div>
        </div>

      </div>
    </div>
  );
}
