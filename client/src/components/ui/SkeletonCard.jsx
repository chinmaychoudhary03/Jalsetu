import React from 'react';

// Generic skeleton block
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

// Card skeleton
export const SkeletonCard = ({ lines = 3, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-card border border-slate-100/80 p-4 space-y-3 ${className}`}>
    <div className="flex items-center gap-3">
      <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 rounded-lg w-3/4" />
        <div className="skeleton h-3 rounded-lg w-1/2" />
      </div>
    </div>
    {Array.from({ length: Math.max(0, lines - 2) }).map((_, i) => (
      <div key={i} className="skeleton h-3 rounded-lg" style={{ width: `${75 - i * 15}%` }} />
    ))}
  </div>
);

// Dashboard hero skeleton
export const SkeletonHero = () => (
  <div className="skeleton rounded-3xl h-44 w-full" />
);

// Stat card skeleton
export const SkeletonStat = () => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-100/80 p-4 min-w-[130px] flex-shrink-0">
    <div className="skeleton w-9 h-9 rounded-xl mb-3" />
    <div className="skeleton h-7 rounded-lg w-14 mb-1.5" />
    <div className="skeleton h-3 rounded-lg w-20" />
  </div>
);

// List row skeleton
export const SkeletonRow = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-card border border-slate-100/80 p-4 flex items-center gap-3 ${className}`}>
    <div className="skeleton w-12 h-12 rounded-2xl shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-4 rounded-lg w-2/3" />
      <div className="skeleton h-3 rounded-lg w-1/2" />
    </div>
    <div className="skeleton w-14 h-7 rounded-full shrink-0" />
  </div>
);

// Page skeleton (list of cards)
const SkeletonPage = ({ cards = 4, type = 'card' }) => {
  const Component = type === 'row' ? SkeletonRow : SkeletonCard;
  return (
    <div className="space-y-3 animate-fade-in">
      {Array.from({ length: cards }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
};

export default SkeletonPage;
