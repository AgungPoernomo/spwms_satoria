import { PackageCheck, AlertCircle } from 'lucide-react';
import useSparePartStore from '../../store/useSparePartStore';

export default function InventoryOverviewWidget() {
  const spareParts = useSparePartStore(s => s.spareParts);
  const criticalParts = useSparePartStore(s => s.getCriticalParts());

  // Aggregate overview
  const totalValue = spareParts.reduce((sum, p) => sum + (p.stok_saat_ini * p.harga_satuan), 0);
  const excessParts = spareParts.filter(p => p.status === 'Berlebih').length;
  const normalParts = spareParts.filter(p => p.status === 'Normal').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full h-full flex flex-col">
      <h3 className="font-bold text-slate-800 text-sm mb-4">Inventory Overview</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <PackageCheck size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold text-slate-600">Total Item (SKU)</span>
          </div>
          <span className="font-black text-slate-800">{spareParts.length}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 border border-red-100">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-xs font-semibold text-red-700">Stok Kritis</span>
          </div>
          <span className="font-black text-red-700">{criticalParts.length}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Normal</p>
            <p className="font-black text-blue-700 text-lg">{normalParts}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-center">
            <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">Berlebih</p>
            <p className="font-black text-orange-700 text-lg">{excessParts}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimasi Nilai Aset</span>
          <span className="font-black text-emerald-600 text-sm">
            Rp {totalValue.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}
