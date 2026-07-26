import { CalendarDays, User, MapPin } from 'lucide-react';

export default function EventTimeline({ events }) {
  // Sort descending by date
  const sortedEvents = [...events].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  return (
    <div className="relative pl-3 md:pl-4 mt-2">
      {/* Vertical line */}
      <div className="absolute top-4 bottom-4 left-[23px] md:left-[27px] w-0.5 bg-slate-100 z-0"></div>

      <div className="flex flex-col gap-6">
        {sortedEvents.map((event, idx) => {
          const isLatest = idx === 0;
          const date = new Date(event.tanggal);

          return (
            <div key={event.id} className="relative z-10 flex items-start gap-4 md:gap-6">
              
              {/* Timeline dot */}
              <div className={`mt-1.5 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 flex items-center justify-center shrink-0
                ${isLatest 
                  ? 'bg-blue-500 border-white ring-4 ring-blue-50 shadow-sm' 
                  : 'bg-white border-slate-200 shadow-sm'}`}
              >
                {!isLatest && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-300" />}
                {isLatest && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />}
              </div>

              {/* Event card */}
              <div className={`flex-1 rounded-2xl border p-4 ${isLatest ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'bg-white border-slate-100'}`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 className={`text-sm font-bold ${isLatest ? 'text-blue-800' : 'text-slate-800'}`}>
                    {event.deskripsi}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm shrink-0">
                    <CalendarDays size={12} className="text-slate-400" />
                    {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} 
                    <span className="text-slate-300 mx-0.5">•</span>
                    {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {event.catatan && (
                  <p className="text-xs text-slate-600 mb-3 bg-white/50 p-2 rounded-lg border border-slate-100">
                    {event.catatan}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                    <User size={12} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">{event.petugas}</span>
                  </div>
                  
                  {event.departemen && (
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                      <MapPin size={12} className="text-slate-400" />
                      <span className="font-semibold text-slate-700">{event.departemen}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
