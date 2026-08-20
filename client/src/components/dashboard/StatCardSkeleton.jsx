import React from 'react';

const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between min-h-[120px] animate-pulse">
      <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
      <div className="mt-3">
        <div className="w-16 h-10 bg-slate-200 rounded-md"></div>
        <div className="w-24 h-5 bg-slate-200 rounded-md mt-2"></div>
        <div className="w-16 h-4 bg-slate-200 rounded-md mt-1"></div>
      </div>
    </div>
  );
};

export default StatCardSkeleton;
