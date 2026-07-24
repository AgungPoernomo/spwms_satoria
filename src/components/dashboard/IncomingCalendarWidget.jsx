import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
  const [popover, setPopover] = useState(null); // { events, style }
  const popoverRef = useRef(null);
  const containerRef = useRef(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => { setPopover(null); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); };
  const nextMonth = () => { setPopover(null); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); };

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

  // Close popover when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        // check if click is on a calendar day cell (to allow toggle)
        if (!e.target.closest('[data-day-cell]')) {
          setPopover(null);
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDateClick = useCallback((day, events, cellEl) => {
    if (!events || events.length === 0) return;

    // If same popover is open, toggle it closed
    if (popover && popover.day === day) {
      setPopover(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const cellRect = cellEl.getBoundingClientRect();

    const POPOVER_WIDTH = 220;
    const POPOVER_ESTIMATED_HEIGHT = 180;
    const GAP = 8;

    // Relative position inside container
    const cellTop = cellRect.top - containerRect.top;
    const cellBottom = cellRect.bottom - containerRect.top;
    const cellLeft = cellRect.left - containerRect.left;
    const cellCenterX = cellLeft + cellRect.width / 2;

    // Determine vertical direction: prefer below, fallback above
    const spaceBelow = containerRect.height - cellBottom;
    const openAbove = spaceBelow < POPOVER_ESTIMATED_HEIGHT && cellTop > POPOVER_ESTIMATED_HEIGHT;

    let top, bottom;
    if (openAbove) {
      bottom = containerRect.height - cellTop + GAP;
    } else {
      top = cellBottom + GAP;
    }

    // Horizontal: center on cell, clamp to container edges
    let left = cellCenterX - POPOVER_WIDTH / 2;
    left = Math.max(4, Math.min(left, containerRect.width - POPOVER_WIDTH - 4));

    const style = {
      position: 'absolute',
      width: POPOVER_WIDTH,
      left,
      ...(openAbove ? { bottom } : { top }),
      zIndex: 60,
    };

    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setPopover({ day, events, style, date: dateObj, openAbove });
  }, [popover, currentDate]);

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 bg-slate-50/50 rounded-lg border border-slate-100"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const hasEvents = eventsByDate[d] && eventsByDate[d].length > 0;
      const isSelected = popover && popover.day === d;
      days.push(
        <div
          key={d}
          data-day-cell="true"
          onClick={(e) => handleDateClick(d, eventsByDate[d], e.currentTarget)}
          className={`h-14 rounded-lg border p-1 relative flex flex-col items-center justify-start transition-all duration-150
            ${hasEvents ? 'cursor-pointer' : 'border-slate-100 bg-white'}
            ${isSelected
              ? 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200'
              : hasEvents
                ? 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 hover:shadow-sm'
                : ''
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
    <div
      ref={containerRef}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full h-full flex flex-col relative"
    >
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

      {/* ── Hanging Popover ── */}
      {popover && (
        <div
          ref={popoverRef}
          style={popover.style}
          className="pointer-events-auto"
        >
          {/* Arrow indicator */}
          {!popover.openAbove && (
            <div className="flex justify-center mb-0 -mt-0">
              <div
                style={{ left: Math.min(Math.max((popover.style.width / 2) - 8, 8), popover.style.width - 24) }}
                className="relative w-0 h-0"
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45 shadow-sm z-10" />
              </div>
            </div>
          )}
          {popover.openAbove && (
            <div className="flex justify-center mt-0">
              <div className="relative w-0 h-0">
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 shadow-sm z-10" />
              </div>
            </div>
          )}

          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
            style={{
              animation: 'popoverIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both',
              transformOrigin: popover.openAbove ? 'bottom center' : 'top center',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon size={12} className="text-blue-500" />
                <span className="text-[11px] font-bold text-slate-700">
                  {popover.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <button
                onClick={() => setPopover(null)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {/* Event list */}
            <div className="p-2 flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
              {popover.events.map(ev => {
                const c = TYPE_COLORS[ev.type] || TYPE_COLORS['Kedatangan'];
                return (
                  <div key={ev.id} className={`flex items-center gap-2.5 p-2 rounded-xl border ${c.border} ${c.bg}`}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`font-bold text-[11px] truncate ${c.text}`}>{ev.title}</p>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${c.badge}`}>
                        {ev.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Popover entrance animation */}
      <style>{`
        @keyframes popoverIn {
          from { opacity: 0; transform: scale(0.88) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
