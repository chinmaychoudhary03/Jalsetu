import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिन्दी', short: 'हिं' },
  { code: 'mr', label: 'मराठी', short: 'मरा' }
];

const LanguageSelector = ({ variant = 'pill', className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || localStorage.getItem('jalsathi_lang') || 'en';

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('jalsathi_lang', code);
    localStorage.setItem('app_lang', code);
  };

  if (variant === 'header') {
    return (
      <div className={`flex items-center bg-slate-100/90 p-0.5 rounded-full border border-slate-200/80 ${className}`}>
        {languages.map((l) => {
          const isActive = currentLang.startsWith(l.code);
          return (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-primary-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {l.short}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'pill' row
  return (
    <div className={`flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      {languages.map((l) => {
        const isActive = currentLang.startsWith(l.code);
        return (
          <button
            key={l.code}
            onClick={() => handleLanguageChange(l.code)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              isActive
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-transparent text-slate-700 hover:bg-slate-50'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSelector;
