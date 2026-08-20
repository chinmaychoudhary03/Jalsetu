import React from 'react';

const elevations = {
  flat:  '',
  sm:    'shadow-card',
  md:    'shadow-card-md',
  lg:    'shadow-card-lg',
  float: 'shadow-float',
};

const Card = ({
  children,
  elevation = 'sm',
  rounded = '2xl',
  padding = 'p-4',
  className = '',
  onClick,
  animate = false,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white border border-slate-100/80',
        `rounded-${rounded}`,
        elevations[elevation] || elevations.sm,
        padding,
        onClick ? 'cursor-pointer card-press' : '',
        animate ? 'animate-fade-in' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
};

// Gradient hero card variant
Card.Hero = ({ children, className = '', ...props }) => (
  <div
    className={[
      'bg-hero-gradient rounded-3xl text-white overflow-hidden relative',
      className,
    ].join(' ')}
    {...props}
  >
    {/* Subtle water texture overlay */}
    <div className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
      }}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

// Stat card variant
Card.Stat = ({ icon: Icon, iconColor = 'text-primary-400 bg-primary-50', value, label, trend, onClick, className = '' }) => (
  <div
    onClick={onClick}
    className={[
      'bg-white rounded-2xl shadow-card border border-slate-100/80 p-4 min-w-[130px] flex-shrink-0 card-press cursor-pointer',
      className,
    ].join(' ')}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconColor}`}>
      {Icon && <Icon className="w-5 h-5" />}
    </div>
    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
    <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
    {trend && <div className="text-xs font-semibold mt-1.5">{trend}</div>}
  </div>
);

export default Card;
