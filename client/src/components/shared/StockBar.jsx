import React from 'react';

const StockBar = ({ current, max, min, className = '' }) => {
  const percent  = Math.min(100, Math.max(0, (current / (max || current || 1)) * 100));
  const minPct   = Math.min(100, ((min || 0) / (max || 1)) * 100);

  const color =
    current <= (min || 0)          ? 'from-crit-400 to-crit-500'  :
    current <= (min || 0) * 1.5    ? 'from-warn-400 to-warn-500'  :
    'from-ok-400 to-ok-500';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Track */}
      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
        {/* Fill */}
        <div
          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
        {/* Minimum threshold marker */}
        {min > 0 && (
          <div
            className="absolute top-0 h-full w-0.5 bg-slate-400/60"
            style={{ left: `${minPct}%` }}
            title={`Min: ${min}`}
          />
        )}
      </div>
      {/* Labels */}
      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
        <span>0</span>
        {min > 0 && <span className="text-slate-400">Min {min}</span>}
        <span>{max}</span>
      </div>
    </div>
  );
};

export default StockBar;
