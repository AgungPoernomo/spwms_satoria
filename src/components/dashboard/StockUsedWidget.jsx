import { ArrowUpRight } from 'lucide-react';
import useTransactionStore from '../../store/useTransactionStore';

export default function StockUsedWidget() {
  const transaksiKeluar = useTransactionStore(s => s.transaksiKeluar);
  
  // Aggregate data for top used parts
  const usedMap = transaksiKeluar.reduce((acc, t) => {
    if (!acc[t.kode_part]) {
      acc[t.kode_part] = { nama: t.nama_part, total: 0 };
    }
    acc[t.kode_part].total += t.jumlah;
    return acc;
  }, {});

  const topUsed = Object.entries(usedMap)
    .map(([kode, data]) => ({ kode, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  return (
    <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5 w-full h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-bold text-red-800 text-sm flex items-center gap-2">
          <ArrowUpRight size={16} className="text-red-600" />
          Stock Used (Top)
        </h3>
      </div>
      
      <div className="flex-1 space-y-3 relative z-10">
        {topUsed.length === 0 ? (
          <p className="text-xs text-red-400 italic">Belum ada pengeluaran.</p>
        ) : (
          topUsed.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white/60 p-2 rounded-lg border border-red-50">
              <div>
                <p className="text-xs font-bold text-red-900 truncate max-w-[120px]">{item.nama}</p>
                <p className="text-[9px] font-mono text-red-500">{item.kode}</p>
              </div>
              <span className="font-black text-red-700 text-sm">-{item.total}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
