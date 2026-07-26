import { Check, CircleDot, Clock } from 'lucide-react';
import { LIFECYCLE_STAGES } from '../../data/mockData';

export default function LifecycleStepper({ events, currentStatus }) {
  // Map currentStatus to a stage index logic
  // 'masuk_gudang' -> passed 'po', 'pengiriman', 'masuk_gudang'.
  
  const getStageStatus = (stageId) => {
    // Check if event exists for this stage
    const event = events.find(e => e.event_type === stageId);
    if (event) return { status: 'completed', event };
    
    // Check if it's the current "in-progress" stage (rough heuristic based on previous completion)
    const stageIdx = LIFECYCLE_STAGES.findIndex(s => s.id === stageId);
    const lastCompletedIdx = LIFECYCLE_STAGES.map((s, idx) => events.some(e => e.event_type === s.id) ? idx : -1).reduce((a, b) => Math.max(a, b), -1);
    
    // Special handling for afkir/selesai_perbaikan branch (just simple linear mapping for now)
    if (stageIdx === lastCompletedIdx + 1) return { status: 'current', event: null };
    
    return { status: 'upcoming', event: null };
  };

  return (
    <div className="w-full overflow-x-auto pb-6 pt-2 hide-scrollbar">
      <div className="flex items-start min-w-[800px]">
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const { status, event } = getStageStatus(stage.id);
          const isLast = idx === LIFECYCLE_STAGES.length - 1;

          return (
            <div key={stage.id} className={`flex-1 relative ${isLast ? 'flex-none w-32' : ''}`}>
              {/* Connecting line */}
              {!isLast && (
                <div className={`absolute top-4 left-6 right-0 h-1 rounded-full -z-10 transition-colors duration-500
                  ${status === 'completed' ? 'bg-emerald-400' : 'bg-slate-100'}`} 
                  style={{ width: 'calc(100% - 24px)', left: '28px' }}
                />
              )}

              {/* Node */}
              <div className="flex flex-col items-start relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300
                  ${status === 'completed' ? 'bg-emerald-500 text-white ring-4 ring-emerald-50' : 
                    status === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-100 animate-pulse' : 
                    'bg-slate-200 text-slate-400 ring-4 ring-slate-50'}`}
                >
                  {status === 'completed' ? <Check size={14} strokeWidth={4} /> :
                   status === 'current' ? <CircleDot size={14} /> : 
                   <Clock size={12} />}
                </div>

                {/* Text */}
                <div className="mt-3 pr-2">
                  <p className={`text-xs font-bold ${status === 'completed' ? 'text-emerald-700' : status === 'current' ? 'text-blue-700' : 'text-slate-400'}`}>
                    {stage.label}
                  </p>
                  
                  {event ? (
                    <div className="mt-1">
                      <p className="text-[9px] font-bold text-slate-600">
                        {new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                        {event.deskripsi}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[9px] text-slate-400 mt-1">{status === 'current' ? 'Sedang berjalan' : 'Belum terjadi'}</p>
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
