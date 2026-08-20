import React from 'react';

const variants = {
  primary:   'bg-primary-500 text-white shadow-glow-jal hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-surf-2 text-primary-700 border border-primary-200 hover:bg-surf-3 active:bg-surf-3',
  ghost:     'text-primary-600 hover:bg-surf-2 active:bg-surf-3',
  danger:    'bg-crit-500 text-white hover:bg-crit-600 active:bg-crit-700',
  success:   'bg-ok-500 text-white hover:bg-ok-600 active:bg-ok-700',
  white:     'bg-white text-primary-700 shadow-card hover:shadow-card-md',
};

const sizes = {
  sm:   'px-3 py-2 text-xs font-semibold gap-1.5',
  md:   'px-4 py-3 text-sm font-semibold gap-2',
  lg:   'px-5 py-3.5 text-base font-bold gap-2',
  xl:   'px-6 py-4 text-lg font-bold gap-2.5',
  icon: 'p-2.5',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  loading = false,
  rounded = 'xl',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center select-none transition-all duration-150',
        `rounded-${rounded}`,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? 'w-full' : '',
        disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer tap-highlight',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : (
        <>
          {Icon && !iconRight && <Icon className="w-4 h-4 shrink-0" />}
          {children && <span>{children}</span>}
          {Icon && iconRight && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
