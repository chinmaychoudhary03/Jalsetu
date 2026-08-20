import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-surf-1 flex flex-col">
      <main className="flex-1 overflow-y-auto pb-24">
        <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-pulse bg-slate-200 w-12 h-12 rounded-full"></div></div>}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
