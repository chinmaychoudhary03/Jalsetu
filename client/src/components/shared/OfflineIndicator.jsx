import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import useUiStore from '../../store/uiStore';

const OfflineIndicator = () => {
  const { isOnline, pendingCount } = useUiStore();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={[
      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300',
      isOnline
        ? 'bg-warn-50 text-warn-700 border border-warn-200'
        : 'bg-crit-50 text-crit-700 border border-crit-200',
    ].join(' ')}>
      {isOnline
        ? <RefreshCw className="w-3 h-3 animate-spin" />
        : <WifiOff className="w-3 h-3" />
      }
      <span>
        {!isOnline
          ? 'Offline'
          : pendingCount > 0
            ? `${pendingCount} syncing`
            : ''}
      </span>
    </div>
  );
};

export default OfflineIndicator;
