import React from 'react';

// status → { bg, text, dot, icon }
const statusMap = {
  // Asset statuses
  operational:       { bg: 'bg-ok-50',       text: 'text-ok-700',    dot: 'bg-ok-500',   label: 'Operational' },
  needs_attention:   { bg: 'bg-warn-50',      text: 'text-warn-700',  dot: 'bg-warn-500', label: 'Needs Attention' },
  under_maintenance: { bg: 'bg-info-50',      text: 'text-info-600',  dot: 'bg-info-500', label: 'Under Maintenance' },
  non_operational:   { bg: 'bg-crit-50',      text: 'text-crit-700',  dot: 'bg-crit-500', label: 'Non-Operational' },
  // Maintenance statuses
  reported:          { bg: 'bg-warn-50',      text: 'text-warn-700',  dot: 'bg-warn-500', label: 'Reported' },
  assigned:          { bg: 'bg-info-50',      text: 'text-info-600',  dot: 'bg-info-500', label: 'Assigned' },
  in_progress:       { bg: 'bg-primary-50',   text: 'text-primary-700', dot: 'bg-primary-400', label: 'In Progress' },
  completed:         { bg: 'bg-ok-50',        text: 'text-ok-700',    dot: 'bg-ok-500',   label: 'Completed' },
  // Billing statuses
  paid:              { bg: 'bg-ok-50',        text: 'text-ok-700',    dot: 'bg-ok-500',   label: 'Paid' },
  pending:           { bg: 'bg-warn-50',      text: 'text-warn-700',  dot: 'bg-warn-500', label: 'Pending' },
  overdue:           { bg: 'bg-crit-50',      text: 'text-crit-700',  dot: 'bg-crit-500', label: 'Overdue' },
  // Inventory statuses
  healthy:           { bg: 'bg-ok-50',        text: 'text-ok-700',    dot: 'bg-ok-500',   label: 'Healthy' },
  low_stock:         { bg: 'bg-warn-50',      text: 'text-warn-700',  dot: 'bg-warn-500', label: 'Low Stock' },
  replenishment_required: { bg: 'bg-crit-50', text: 'text-crit-700',  dot: 'bg-crit-500', label: 'Replenish Soon' },
  // Generic
  active:            { bg: 'bg-ok-50',        text: 'text-ok-700',    dot: 'bg-ok-500',   label: 'Active' },
  inactive:          { bg: 'bg-slate-100',    text: 'text-slate-600', dot: 'bg-slate-400', label: 'Inactive' },
};

const sizes = {
  xs: 'text-[10px] font-bold px-2 py-0.5 gap-1',
  sm: 'text-xs font-bold px-2.5 py-1 gap-1.5',
  md: 'text-sm font-bold px-3 py-1.5 gap-2',
};

const dotSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
};

const Badge = ({ status, label: customLabel, size = 'sm', className = '' }) => {
  const key = (status || '').toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
  const style = statusMap[key] || { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', label: status || 'Unknown' };
  const label = customLabel || style.label;

  return (
    <span className={[
      'inline-flex items-center rounded-full uppercase tracking-wide whitespace-nowrap',
      sizes[size] || sizes.sm,
      style.bg,
      style.text,
      className,
    ].join(' ')}>
      <span className={`rounded-full shrink-0 ${dotSizes[size] || dotSizes.sm} ${style.dot}`} />
      {label}
    </span>
  );
};

export default Badge;
