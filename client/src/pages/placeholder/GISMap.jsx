import React from 'react';
import { useTranslation } from 'react-i18next';

export default function GISMap() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <h2 className="text-3xl font-bold text-slate-800 mb-4">GIS Map</h2>
      <p className="text-xl text-slate-500 bg-slate-100 px-6 py-3 rounded-2xl">{t('common.coming_soon')}</p>
    </div>
  );
}
