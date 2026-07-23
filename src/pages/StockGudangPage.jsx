import { useState, useEffect } from 'react';
import { Boxes, Search, MapPin } from 'lucide-react';
import useMasterDataStore from '../store/useMasterDataStore';
import CapacityProgressBar from '../components/common/CapacityProgressBar';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function StockGudangPage() {
  const { lokasi } = useMasterDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredLokasi = lokasi.filter(l => 
    l.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Boxes size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Stock Gudang</h2>
            <p className="text-slate-500 text-sm">Pantau utilitas dan kapasitas setiap lokasi rak.</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Cari lokasi rak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonLoader key={i} type="card" lines={2} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLokasi.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <MapPin className="mx-auto text-slate-300 mb-3" size={48} />
              <h3 className="text-lg font-bold text-slate-700">Tidak ada rak ditemukan</h3>
              <p className="text-slate-500 text-sm mt-1">Coba gunakan kata kunci pencarian yang berbeda.</p>
            </div>
          ) : (
            filteredLokasi.map((rak) => (
              <div key={rak.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500 group-hover:text-primary-600 group-hover:bg-primary-50 transition-colors">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{rak.nama}</h3>
                      <p className="text-xs text-slate-500">ID: {rak.id}</p>
                    </div>
                  </div>
                  <span className={rak.status_kepenuhan === 'Penuh' ? 'badge-kritis' : 'badge-normal'}>
                    {rak.status_kepenuhan}
                  </span>
                </div>
                
                <CapacityProgressBar 
                  terpakai={rak.jumlah_terpakai} 
                  kapasitas={rak.kapasitas_maks} 
                />
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span>Tersedia: {Math.max(0, rak.kapasitas_maks - rak.jumlah_terpakai)} slot</span>
                  <button className="text-primary-600 font-semibold hover:text-primary-700">Lihat Detail</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
