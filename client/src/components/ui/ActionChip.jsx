import React from 'react';

const ActionChip = ({
  children,
  label,
  icon: Icon,
  active = false,
  onClick,
  className = '',
  size = 'md',
}) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={[
        'inline-flex items-center rounded-full font-semibold whitespace-nowrap transition-all duration-150 select-none shrink-0 cursor-pointer',
        sizes[size] || sizes.md,
        active
          ? 'bg-primary-500 text-white shadow-card-md'
          : 'bg-white text-slate-600 border border-slate-200 shadow-card hover:border-primary-200 hover:text-primary-600',
        'tap-highlight',
        className,
      ].join(' ')}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children || label}
    </button>
  );
};

export default ActionChip;
