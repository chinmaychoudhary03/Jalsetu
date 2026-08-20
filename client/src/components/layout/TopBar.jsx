import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import OfflineIndicator from '../shared/OfflineIndicator';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/dashboard';

  return (
    <header className="bg-primary text-white sticky top-0 z-10 shadow-sm safe-area-pt">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={() => navigate(-1)}
              className="p-1 -ml-1 rounded-full hover:bg-white/20 active:bg-white/30"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-lg font-semibold truncate">JJM Gram Jal</h1>
        </div>
        <OfflineIndicator />
      </div>
    </header>
  );
};

export default TopBar;
