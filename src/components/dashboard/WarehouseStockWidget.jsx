import { Layers } from 'lucide-react';
import useMasterDataStore from '../../store/useMasterDataStore';
import CapacityProgressBar from '../common/CapacityProgressBar';

export default function WarehouseStockWidget() {
  const lokasi = useMasterDataStore(s => s.lokasi);
  
  const penuhCount = lokasi.filter(l => l.status_kepenuhan === 'Penuh').length;
  const normalCount = lokasi.filter(l => l.status_kepenuhan === 'Normal').length;
  
  // Ambil 3 rak dengan persentase tertinggi
  const topRacks = [...lokasi].sort((a, b) => {
    const pA = a.jumlah_terpakai / a.kapasitas_maks;
    const pB = b.jumlah_terpakai / b.kapasitas_maks;
    return pB - pA;
  }).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Layers size={16} className="text-blue-600" />
          Kapasitas Gudang
        </h3>
        <span className="text-[10px] font-bold text-slate-400">{lokasi.length} Rak Aktif</span>
      </div>
      
      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-red-50 p-2 rounded-lg text-center border border-red-100">
          <p className="text-[10px] font-bold text-red-600 uppercase mb-0.5">Penuh</p>
          <p className="text-lg font-black text-red-700">{penuhCount}</p>
        </div>
        <div className="flex-1 bg-emerald-50 p-2 rounded-lg text-center border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-600 uppercase mb-0.5">Normal</p>
          <p className="text-lg font-black text-emerald-700">{normalCount}</p>
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Rak Terpadat</p>
        <div className="space-y-3">
          {topRacks.map(rak => (
            <div key={rak.id}>
              <div className="flex justify-between text-[10px] font-semibold mb-1">
                <span className="text-slate-700">{rak.nama}</span>
                <span className="text-slate-500">{rak.jumlah_terpakai}/{rak.kapasitas_maks}</span>
              </div>
              <CapacityProgressBar terpakai={rak.jumlah_terpakai} kapasitas={rak.kapasitas_maks} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
