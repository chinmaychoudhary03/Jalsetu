import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
    <div className="relative w-14 h-14 mb-5">
      <div className="absolute inset-0 rounded-full border-4 border-surf-2" />
      <div className="absolute inset-0 rounded-full border-4 border-primary-400 border-t-transparent animate-spin" />
    </div>
    <p className="text-sm font-medium text-slate-500">{message}</p>
  </div>
);

export default LoadingSpinner;
