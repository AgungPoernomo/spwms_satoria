import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import useTransactionStore from '../../store/useTransactionStore';

export default function IncomingCalendarWidget() {
  const transaksiMasuk = useTransactionStore(s => s.transaksiMasuk);
  const [currentDate, setCurrentDate] = useState(new Date('2026-07-01')); // Default ke bulan mock data (Juli 2026)

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Memetakan transaksi ke tanggal
  const eventsByDate = useMemo(() => {
    const map = {};
    transaksiMasuk.forEach(t => {
      const d = new Date(t.tanggal_masuk);
      if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
        const date = d.getDate();
        if (!map[date]) map[date] = [];
        map[date].push(t);
      }
    });
    return map;
  }, [transaksiMasuk, currentDate]);

  const renderCalendarDays = () => {
    const days = [];
    // Kosong di awal bulan
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 bg-slate-50/50 rounded-lg border border-slate-100"></div>);
    }
    
    // Hari-hari dalam bulan
    for (let d = 1; d <= daysInMonth; d++) {
      const hasEvents = eventsByDate[d] && eventsByDate[d].length > 0;
      days.push(
        <div key={d} className={`h-14 rounded-lg border p-1 relative flex flex-col items-center justify-start ${hasEvents ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white'}`}>
          <span className={`text-xs font-semibold ${hasEvents ? 'text-blue-700' : 'text-slate-600'}`}>{d}</span>
          {hasEvents && (
            <div className="mt-1 flex gap-1 flex-wrap justify-center">
              {eventsByDate[d].slice(0, 3).map((e, idx) => (
                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-blue-500" title={e.nama_part}></div>
              ))}
              {eventsByDate[d].length > 3 && <span className="text-[8px] text-blue-600 font-bold">+{eventsByDate[d].length - 3}</span>}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <CalendarIcon size={16} className="text-blue-600" />
          Kalender Kedatangan Part
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"><ChevronLeft size={16}/></button>
          <span className="text-xs font-bold text-slate-700">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"><ChevronRight size={16}/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 mb-2">
        <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
      </div>
      <div className="grid grid-cols-7 gap-2 flex-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
