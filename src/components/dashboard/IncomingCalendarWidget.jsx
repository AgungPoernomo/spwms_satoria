import { useState, useMemo, useCallback } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const DUMMY_ACTIVITIES = [
  { id: 1, date: '2026-07-02', type: 'Kedatangan', title: 'Baffle Plate Masuk', color: 'bg-blue-500' },
  { id: 2, date: '2026-07-05', type: 'Perbaikan', title: 'Perbaikan Mesin CNC', color: 'bg-red-500' },
  { id: 3, date: '2026-07-08', type: 'Stock Opname', title: 'Opname Gudang A', color: 'bg-emerald-500' },
  { id: 4, date: '2026-07-12', type: 'Kedatangan', title: 'O-Ring Masuk', color: 'bg-blue-500' },
  { id: 5, date: '2026-07-15', type: 'Perbaikan', title: 'Pergantian Bearing', color: 'bg-red-500' },
  { id: 6, date: '2026-07-15', type: 'Stock Opname', title: 'Opname Rak B', color: 'bg-emerald-500' },
  { id: 7, date: '2026-07-20', type: 'Kedatangan', title: 'Sensor Suhu Masuk', color: 'bg-blue-500' },
  { id: 8, date: '2026-07-25', type: 'Perbaikan', title: 'Maintenance Conveyor', color: 'bg-red-500' },
  { id: 9, date: '2026-07-28', type: 'Stock Opname', title: 'Opname Akhir Bulan', color: 'bg-emerald-500' },
];

const LEGEND = [
  { label: 'Kedatangan', color: 'bg-blue-500' },
  { label: 'Perbaikan', color: 'bg-red-500' },
  { label: 'Opname', color: 'bg-emerald-500' },
];

const TYPE_COLORS = {
  'Kedatangan': { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-600' },
  'Perbaikan':  { bg: 'bg-red-50',  border: 'border-red-200',  dot: 'bg-red-500',  text: 'text-red-700',  badge: 'bg-red-100 text-red-600' },
  'Stock Opname': { bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-600' },
};

export default function IncomingCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-07-01'));
  const [selectedDayInfo, setSelectedDayInfo] = useState(null); // { day, date, events }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => { setSelectedDayInfo(null); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); };
  const nextMonth = () => { setSelectedDayInfo(null); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); };

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const eventsByDate = useMemo(() => {
    const map = {};
    DUMMY_ACTIVITIES.forEach(t => {
      const d = new Date(t.date);
      if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
        const date = d.getDate();
        if (!map[date]) map[date] = [];
        map[date].push(t);
      }
    });
    return map;
  }, [currentDate]);

  const handleDateClick = useCallback((day, events) => {
    if (!events || events.length === 0) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDayInfo({ day, events: [], date: dateObj });
      return;
    }

    if (selectedDayInfo && selectedDayInfo.day === day) {
      setSelectedDayInfo(null);
      return;
    }

    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDayInfo({ day, events, date: dateObj });
  }, [selectedDayInfo, currentDate]);

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 bg-slate-50/50 rounded-lg border border-slate-100"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const hasEvents = eventsByDate[d] && eventsByDate[d].length > 0;
      const isSelected = selectedDayInfo && selectedDayInfo.day === d;
      days.push(
        <div
          key={d}
          data-day-cell="true"
          onClick={() => handleDateClick(d, eventsByDate[d])}
          className={`h-14 rounded-lg border p-1 relative flex flex-col items-center justify-start transition-all duration-150 cursor-pointer
            ${isSelected
              ? 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200'
              : hasEvents
                ? 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 hover:shadow-sm'
                : 'border-slate-100 bg-white hover:bg-slate-50'
            }`}
        >
          <span className={`text-xs font-semibold ${isSelected ? 'text-blue-700' : hasEvents ? 'text-slate-800' : 'text-slate-500'}`}>{d}</span>
          {hasEvents && (
            <div className="mt-1 flex gap-1 flex-wrap justify-center">
              {eventsByDate[d].slice(0, 3).map((e, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full ${e.color}`} title={e.title}></div>
              ))}
              {eventsByDate[d].length > 3 && <span className="text-[8px] text-slate-600 font-bold">+{eventsByDate[d].length - 3}</span>}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full h-full flex flex-col md:flex-row gap-6 relative">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <CalendarIcon size={16} className="text-blue-600" />
            Kalender Aktivitas
          </h3>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-600">
            {LEGEND.map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${l.color}`}></div>
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all"><ChevronLeft size={16}/></button>
          <span className="text-xs font-bold text-slate-700">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all"><ChevronRight size={16}/></button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 mb-2">
          <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
        </div>
        <div className="grid grid-cols-7 gap-2 flex-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Right Side Card: Activities List */}
      <div className="w-full md:w-72 flex flex-col border-t md:border-t-0 md:border-l border-slate-200 pt-5 md:pt-0 md:pl-6 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            Aktivitas
          </h3>
          {selectedDayInfo && (
             <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
               {selectedDayInfo.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
             </span>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          {!selectedDayInfo ? (
            <div className="flex flex-col items-center justify-center h-32 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
              <CalendarIcon size={24} className="text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-500">Pilih tanggal untuk melihat detail aktivitas.</p>
            </div>
          ) : selectedDayInfo.events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500">Tidak ada aktivitas pada tanggal ini.</p>
            </div>
          ) : (
            selectedDayInfo.events.map(ev => {
              const c = TYPE_COLORS[ev.type] || TYPE_COLORS['Kedatangan'];
              return (
                <div key={ev.id} className={`flex items-start gap-3 p-3 rounded-xl border ${c.border} ${c.bg}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${c.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-[13px] ${c.text}`}>{ev.title}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block ${c.badge}`}>
                      {ev.type}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
