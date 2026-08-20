import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Database, IndianRupee, Wrench, FileText, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import clsx from 'clsx';

const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Hide BottomNav on dedicated flow/checkout routes that have their own fixed bottom CTA buttons
  const hideNavRoutes = ['/maintenance/new', '/login'];
  const shouldHideNav = hideNavRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHideNav) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isCitizen = user?.role === 'user';

  // Role-differentiated bottom navigation items
  const navItems = isCitizen
    ? [
        { to: '/dashboard', icon: Home, label: t('nav.home', 'Home') },
        { to: '/maintenance', icon: Wrench, label: t('nav.complaints', 'Complaints') },
        { to: '/billing', icon: FileText, label: t('nav.my_bills', 'My Bills') },
      ]
    : [
        { to: '/dashboard', icon: Home, label: t('nav.home', 'Home') },
        { to: '/map', icon: Map, label: t('nav.map', 'Map') },
        { to: '/assets', icon: Database, label: t('nav.assets', 'Assets') },
        { to: '/finance', icon: IndianRupee, label: t('nav.finance', 'Finance') },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[500] glass border-t border-white/30 shadow-nav h-16 safe-area-pb">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(
              'flex flex-col items-center justify-center gap-0.5 flex-1 h-full tap-highlight transition-colors',
              isActive ? 'text-primary-500 font-bold' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} />
                <span className="text-[10px] font-extrabold">{item.label}</span>
                {isActive ? (
                  <div className="w-1 h-1 rounded-full bg-primary-500 mt-0.5" />
                ) : (
                  <div className="w-1 h-1 rounded-full mt-0.5 opacity-0" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Direct Logout Button on Bottom Navbar */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full tap-highlight text-red-500 hover:text-red-600 cursor-pointer active:scale-95 transition-transform"
        >
          <LogOut size={22} />
          <span className="text-[10px] font-extrabold">{t('common.logout', 'Logout')}</span>
          <div className="w-1 h-1 rounded-full mt-0.5 opacity-0" />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
