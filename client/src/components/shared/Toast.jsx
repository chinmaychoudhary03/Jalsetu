import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const iconMap = {
  success: { Icon: CheckCircle2, bg: 'bg-ok-500',   text: 'text-white' },
  error:   { Icon: XCircle,      bg: 'bg-crit-500', text: 'text-white' },
  warning: { Icon: AlertTriangle,bg: 'bg-warn-500', text: 'text-white' },
  info:    { Icon: Info,         bg: 'bg-primary-500', text: 'text-white' },
};

const Toast = ({ type = 'info', message, onClose, duration = 3500 }) => {
  const [visible, setVisible] = useState(true);
  const { Icon, bg, text } = iconMap[type] || iconMap.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={[
        'fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm',
        'flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-float',
        bg, text,
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
        'animate-slide-down',
      ].join(' ')}
      style={{ animation: visible ? 'slideDown 0.25s ease-out both' : undefined }}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="flex-1 text-sm font-semibold">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300); }} className="shrink-0 opacity-80 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
