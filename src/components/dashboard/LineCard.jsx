import { useState } from 'react';
import { Package } from 'lucide-react';

const COLOR_MAP = {
  blue: {
    bar: 'bg-blue-500',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    subtitle: 'text-blue-600',
    tableHeaderBg: 'bg-blue-50/50',
    tableHeaderText: 'text-blue-600',
  },
  emerald: {
    bar: 'bg-emerald-500',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    subtitle: 'text-emerald-600',
    tableHeaderBg: 'bg-emerald-50/50',
    tableHeaderText: 'text-emerald-600',
  },
  purple: {
    bar: 'bg-purple-500',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    subtitle: 'text-purple-600',
    tableHeaderBg: 'bg-purple-50/50',
    tableHeaderText: 'text-purple-600',
  },
  orange: {
    bar: 'bg-orange-500',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
    subtitle: 'text-orange-600',
    tableHeaderBg: 'bg-orange-50/50',
    tableHeaderText: 'text-orange-600',
  },
};

export default function LineCard({ title, theme = 'blue', metrics, data }) {
  const [searchKategori, setSearchKategori] = useState('');
  const [searchSpek, setSearchSpek] = useState('');

  const colors = COLOR_MAP[theme];

  const filteredData = data.filter(row => {
    const matchKat = searchKategori === '' || row.kategori.toLowerCase().includes(searchKategori.toLowerCase());
    const matchSpek = searchSpek === '' || row.nama_part.toLowerCase().includes(searchSpek.toLowerCase());
    return matchKat && matchSpek;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[650px] relative">
      <div className={`absolute top-0 left-0 w-full h-1.5 ${colors.bar}`}></div>
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center`}>
             <Package size={20} />
          </div>
          <div>
             <h3 className="font-black text-slate-800 text-lg tracking-tight">{title}</h3>
             <p className={`text-[10px] font-bold ${colors.subtitle} tracking-widest uppercase`}>Plant Warehouse</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-5 border-b border-slate-100 shrink-0 bg-white">
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cari Kategori/Jenis</label>
                <input 
                  type="text" 
                  value={searchKategori}
                  onChange={(e) => setSearchKategori(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all focus:bg-white" 
                  placeholder="Pilih / Ketik Jenis Part..." 
                />
            </div>
            <div className="relative flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cari Spesifikasi Detail</label>
                <input 
                  type="text" 
                  value={searchSpek}
                  onChange={(e) => setSearchSpek(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all focus:bg-white" 
                  placeholder="Ketik Spesifikasi Part..." 
                />
            </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 p-5 shrink-0 bg-slate-50/30">
          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex flex-col justify-center items-center cursor-default">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Part</p>
              <h4 className="text-2xl font-black text-slate-800">{metrics.master}</h4>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl shadow-sm flex flex-col justify-center items-center cursor-default">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Barang Masuk</p>
              <h4 className="text-2xl font-black text-emerald-700">{metrics.inbound}</h4>
          </div>
          <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl shadow-sm flex flex-col justify-center items-center cursor-default">
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Barang Keluar</p>
              <h4 className="text-2xl font-black text-purple-700">{metrics.outbound}</h4>
          </div>
          <div className="bg-red-50 border border-red-100 p-3 rounded-xl shadow-sm flex flex-col justify-center items-center cursor-default">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Stok Kritis</p>
              <h4 className="text-2xl font-black text-red-700">{metrics.critical}</h4>
          </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar border-t border-slate-100 relative bg-white">
          <table className="w-full text-left whitespace-nowrap">
              <thead className="sticky top-0 bg-white text-slate-400 font-bold uppercase text-[10px] tracking-widest shadow-sm z-10">
                  <tr>
                      <th className="px-4 py-3 border-b border-slate-200">Kategori Part</th>
                      <th className="px-4 py-3 border-b border-slate-200">Kode Material</th>
                      <th className="px-4 py-3 border-b border-slate-200">Spesifikasi Detail</th>
                      <th className="px-4 py-3 border-b border-slate-200 text-center">Min. Stock</th>
                      <th className={`px-4 py-3 border-b border-slate-200 text-center ${colors.tableHeaderText} ${colors.tableHeaderBg}`}>Aktual</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredData.length === 0 ? (
                      <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400 text-xs">Tidak ada data.</td></tr>
                  ) : (
                      filteredData.map((row, i) => {
                          const isCritical = row.stok_saat_ini <= row.stok_minimum;
                          const actColor = isCritical ? "text-red-600 bg-red-50 px-2 py-0.5 rounded inline-block" : "text-slate-800";
                          return (
                              <tr key={i} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                  <td className="px-4 py-3 font-semibold text-slate-700 text-xs">{row.kategori}</td>
                                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{row.kode_part || "-"}</td>
                                  <td className="px-4 py-3 text-blue-600 font-bold text-xs truncate max-w-[150px]" title={row.nama_part}>{row.nama_part}</td>
                                  <td className="px-4 py-3 text-center text-slate-500 text-xs font-semibold">{row.stok_minimum}</td>
                                  <td className="px-4 py-3 text-center"><span className={`text-xs font-black ${actColor}`}>{row.stok_saat_ini}</span></td>
                              </tr>
                          );
                      })
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
}
