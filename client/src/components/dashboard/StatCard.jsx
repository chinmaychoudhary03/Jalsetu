import React from 'react';

const colorVariants = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600'
};

const textVariants = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  amber: 'text-amber-600',
  red: 'text-red-600'
};

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between min-h-[120px] ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-full ${colorVariants[color]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-3">
        <div className={`text-4xl font-bold ${textVariants[color]}`}>{value}</div>
        <div className="text-base font-semibold text-slate-800 mt-1">{title}</div>
        {subtitle && <div className="text-sm text-slate-500 mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
