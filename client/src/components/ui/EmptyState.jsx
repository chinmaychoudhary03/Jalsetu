import React from 'react';
import { Droplets, Package, Wrench, IndianRupee, FileText, WifiOff } from 'lucide-react';

const iconMap = {
  water:       Droplets,
  maintenance: Wrench,
  inventory:   Package,
  finance:     IndianRupee,
  billing:     FileText,
  offline:     WifiOff,
  default:     Droplets,
};

const EmptyState = ({
  type = 'default',
  title,
  description,
  icon: CustomIcon,
  action,
  actionLabel,
  className = '',
}) => {
  const Icon = CustomIcon || iconMap[type] || iconMap.default;

  return (
    <div className={`flex flex-col items-center justify-center text-center py-14 px-6 animate-fade-in ${className}`}>
      {/* Icon ring */}
      <div className="w-20 h-20 rounded-full bg-surf-2 flex items-center justify-center mb-5 shadow-inner">
        <Icon className="w-10 h-10 text-primary-300" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold text-slate-700 mb-2">{title || 'Nothing here yet'}</h3>
      {description && (
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{description}</p>
      )}

      {/* Action */}
      {action && actionLabel && (
        <button
          onClick={action}
          className="mt-6 px-6 py-3 rounded-2xl bg-primary-500 text-white text-sm font-bold shadow-card-md hover:bg-primary-600 transition-colors tap-highlight"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
