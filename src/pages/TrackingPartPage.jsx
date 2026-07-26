import { useState, useMemo } from 'react';
import { ScanLine, Box, ArrowRight, Activity, Printer, FileText, Wrench } from 'lucide-react';
import { TRACKING_UNITS, TRACKING_EVENTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import ScanInput from '../components/tracking/ScanInput';
import PartStatusCard from '../components/tracking/PartStatusCard';
import LifecycleStepper from '../components/tracking/LifecycleStepper';
import EventTimeline from '../components/tracking/EventTimeline';

export default function TrackingPartPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // If there's a search query, try to find matches
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return TRACKING_UNITS.filter(u => 
      u.kode_part.toLowerCase().includes(q) || 
      u.serial_number.toLowerCase().includes(q) ||
      u.nama_part.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // The currently viewed unit
  const activeUnit = useMemo(() => {
    if (!selectedUnitId) return null;
    return TRACKING_UNITS.find(u => u.id === selectedUnitId);
  }, [selectedUnitId]);

  // The events for the currently viewed unit
  const activeEvents = useMemo(() => {
    if (!selectedUnitId) return [];
    return TRACKING_EVENTS.filter(e => e.unit_id === selectedUnitId);
  }, [selectedUnitId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // If only one exact match (like scanning a serial number), select it immediately
    const q = query.toLowerCase();
    const exactMatch = TRACKING_UNITS.find(u => u.serial_number.toLowerCase() === q);
    if (exactMatch) {
      setSelectedUnitId(exactMatch.id);
    } else {
      setSelectedUnitId(null);
    }
  };

  const handlePrintLabel = () => {
    if (activeUnit) {
      navigate(`/generator-code?part=${activeUnit.kode_part}`);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ScanLine className="text-blue-600" size={32} />
            Tracking Part Lifecycle
          </h1>
          <p className="text-slate-500 font-medium mt-1">Lacak riwayat lengkap dan posisi fisik spare part berdasarkan Serial Number atau Kode Batch.</p>
        </div>

        <div className="max-w-2xl">
          <ScanInput onScan={handleSearch} onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content Area */}
      {!searchQuery && !selectedUnitId && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <ScanLine size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Mulai Pelacakan Part</h3>
          <p className="text-slate-500 max-w-md mb-8">Ketik kode part, serial number, atau gunakan tombol scan untuk memindai barcode pada fisik barang.</p>
          
          {/* Quick Trial / Demo section */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 w-full max-w-2xl text-left">
            <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
              <Activity size={16} /> Mode Trial (Demo Data)
            </h4>
            <p className="text-xs text-blue-600 mb-4">Klik salah satu contoh data di bawah ini untuk melihat simulasi tampilan detail halaman:</p>
            
            <div className="flex flex-wrap gap-3">
              <button onClick={() => handleSearch('AK-2026-001')} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-700 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
                <span className="block text-blue-600 text-[10px] uppercase mb-0.5">Part di Rak</span>
                AK-2026-001
              </button>
              <button onClick={() => handleSearch('AK-2026-002')} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-700 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
                <span className="block text-amber-600 text-[10px] uppercase mb-0.5">Sedang Digunakan</span>
                AK-2026-002
              </button>
              <button onClick={() => handleSearch('AK-2026-003')} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-700 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
                <span className="block text-red-600 text-[10px] uppercase mb-0.5">Dalam Perbaikan</span>
                AK-2026-003
              </button>
              <button onClick={() => handleSearch('SP-001')} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-700 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
                <span className="block text-emerald-600 text-[10px] uppercase mb-0.5">Search by Batch</span>
                SP-001
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multiple Results View (if search doesn't perfectly match a single SN) */}
      {searchQuery && !selectedUnitId && searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700">Ditemukan {searchResults.length} unit:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map(unit => (
              <div 
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-800">{unit.serial_number}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{unit.status}</span>
                </div>
                <div className="text-sm font-semibold text-slate-600">{unit.nama_part}</div>
                <div className="text-xs text-slate-400 mt-1">Kode: {unit.kode_part}</div>
                
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Lihat Detail Lifecycle</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && !selectedUnitId && searchResults.length === 0 && (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="font-semibold text-slate-600">Tidak ada part yang cocok dengan "{searchQuery}"</p>
        </div>
      )}

      {/* Detail View for Selected Unit */}
      {activeUnit && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Top Status Card */}
          <PartStatusCard unit={activeUnit} />

          {/* Lifecycle Lintasan */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="text-blue-500" size={20} />
              Lintasan Lifecycle
            </h3>
            <LifecycleStepper events={activeEvents} currentStatus={activeUnit.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: History Log */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FileText className="text-slate-400" size={20} />
                  Riwayat & Log Event
                </h3>
                <EventTimeline events={activeEvents} />
              </div>
            </div>

            {/* Right: Quick Actions & Details */}
            <div className="space-y-6">
              {/* Quick Actions Panel */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Tindakan Cepat</h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                  >
                    <Wrench size={18} />
                    Update Status Part
                  </button>
                  
                  <button 
                    onClick={handlePrintLabel}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <Printer size={18} />
                    Cetak Ulang Label
                  </button>
                </div>

                {!isAdmin && (
                  <p className="text-[10px] text-slate-400 text-center mt-4">
                    Beberapa perubahan status (misal: Afkir) memerlukan approval Admin.
                  </p>
                )}
              </div>

              {/* Data Detail Panel */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Informasi Teknis</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Supplier</span>
                    <span className="font-semibold text-slate-800 text-right">{activeUnit.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. Referensi / PO</span>
                    <span className="font-semibold text-slate-800 text-right">{activeUnit.batch_ref}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200">
                    <span className="text-slate-500">Kondisi Fisik</span>
                    <span className={`font-semibold ${activeUnit.kondisi === 'Baik' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {activeUnit.kondisi}
                    </span>
                  </div>
                  {activeUnit.pengguna && (
                    <div className="flex justify-between pt-3 border-t border-slate-200">
                      <span className="text-slate-500">Pengguna Terakhir</span>
                      <span className="font-semibold text-slate-800">{activeUnit.pengguna}</span>
                    </div>
                  )}
                  {activeUnit.mesin && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dipasang pada Mesin</span>
                      <span className="font-semibold text-slate-800">{activeUnit.mesin}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
