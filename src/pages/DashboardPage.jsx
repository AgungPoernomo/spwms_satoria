import { useAuth } from '../context/AuthContext';
import LineCard from '../components/dashboard/LineCard';
import useSparePartStore from '../store/useSparePartStore';
import useTransactionStore from '../store/useTransactionStore';

export default function DashboardPage() {
  const { user } = useAuth();
  const spareParts = useSparePartStore(s => s.spareParts);
  const { masukHariIni, keluarHariIni } = useTransactionStore(s => s.getTodayTotals());
  const criticalParts = useSparePartStore(s => s.getCriticalParts());

  const totalMaster = spareParts.length;

  const commonMetrics = {
    master: totalMaster,
    inbound: masukHariIni,
    outbound: keluarHariIni,
    critical: criticalParts.length
  };

  const lines = [
    { id: 1, title: 'Stock Sparepart Line 1', theme: 'blue', metrics: commonMetrics, data: spareParts },
    { id: 2, title: 'Stock Sparepart Line 2', theme: 'emerald', metrics: commonMetrics, data: spareParts },
    { id: 3, title: 'Stock Sparepart Line 3', theme: 'purple', metrics: commonMetrics, data: spareParts },
    { id: 4, title: 'Stock Sparepart Line 4', theme: 'orange', metrics: commonMetrics, data: spareParts },
  ];

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Selamat Datang, {user?.nama?.split(' ')[0] || 'User'}!</h1>
        <p className="text-slate-500 text-sm font-medium">Metrik Real-time performa Gudang Master (Terpisah Per Line).</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-16 w-full">
        {lines.map((line) => (
          <LineCard
            key={line.id}
            title={line.title}
            theme={line.theme}
            metrics={line.metrics}
            data={line.data}
          />
        ))}
      </div>
    </div>
  );
}
