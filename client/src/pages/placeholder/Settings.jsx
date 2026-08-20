import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import LanguageSelector from '../../components/shared/LanguageSelector';

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surf-1 pb-24">
      <div className="sticky top-0 z-10 glass border-b border-white/20 px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">{t('nav.settings', 'Settings')}</h1>
        <LanguageSelector variant="header" />
      </div>

      <div className="p-4 space-y-6">
        {/* User Profile Card */}
        <div className="bg-white p-4 rounded-2xl shadow-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-jal-gradient flex items-center justify-center text-white font-bold text-xl shadow-md">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{user?.name || 'Guest User'}</h2>
            <div className="inline-block mt-1 px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-bold rounded-full capitalize">
              {user?.role || 'operator'}
            </div>
          </div>
        </div>

        {/* App Info Section */}
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">App Info</h3>
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
            <span className="text-slate-700 font-bold">Version</span>
            <span className="text-slate-500 font-medium text-sm">Gram Jal v1.0 · JJM O&M</span>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full mt-4 bg-crit-50 text-crit-600 border border-crit-200 rounded-2xl py-4 font-bold text-center active:scale-[0.98] transition-transform tap-highlight"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
