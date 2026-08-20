import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Wrench, Plus } from 'lucide-react';

const typeMap = {
  inspection:  { Icon: CheckCircle2, color: 'text-ok-600',      bg: 'bg-ok-100',    line: 'bg-ok-200' },
  maintenance: { Icon: Wrench,       color: 'text-primary-600', bg: 'bg-primary-100', line: 'bg-primary-200' },
  issue:       { Icon: AlertCircle,  color: 'text-crit-600',    bg: 'bg-crit-100',  line: 'bg-crit-200' },
  repair:      { Icon: Wrench,       color: 'text-warn-600',    bg: 'bg-warn-100',  line: 'bg-warn-200' },
  installation:{ Icon: Plus,         color: 'text-primary-600', bg: 'bg-primary-100', line: 'bg-primary-200' },
  default:     { Icon: Clock,        color: 'text-slate-500',   bg: 'bg-slate-100', line: 'bg-slate-200' },
};

const Timeline = ({ events = [] }) => {
  if (!events.length) return (
    <div className="text-center py-8 text-sm text-slate-400">No history records found</div>
  );

  return (
    <div className="space-y-0 animate-fade-in">
      {events.map((event, i) => {
        const { Icon, color, bg, line } = typeMap[event.type?.toLowerCase()] || typeMap.default;
        const isLast = i === events.length - 1;

        return (
          <div key={event.id || i} className="flex gap-4">
            {/* Left: icon + connector line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 z-10`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 mt-1 ${line} min-h-[1.5rem]`} />
              )}
            </div>

            {/* Right: content */}
            <div className={`flex-1 ${isLast ? 'pb-2' : 'pb-6'}`}>
              <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 leading-snug">
                      {event.title || event.description || 'Event'}
                    </p>
                    {event.description && event.title && (
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    {event.technician && (
                      <p className="text-xs text-slate-400 mt-1">
                        👷 {event.technician}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                    {event.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
