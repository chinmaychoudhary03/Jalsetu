import React, { useState } from 'react';
import { Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MapLegend = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 left-4 z-[1000] bg-white p-3 rounded-full shadow-md text-primary"
      >
        <Map size={24} />
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 left-4 z-[1000] bg-white rounded-xl shadow-md p-3 w-48 text-sm" onClick={() => setIsOpen(false)}>
      <div className="font-bold mb-2">{t('map.legend', 'Legend')}</div>
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1E6DB7]"></div> {t('map.filter_pump', 'Pump')}</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#6B7280]"></div> {t('map.filter_valve', 'Valve')}</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#22C55E]"></div> {t('map.filter_treatment', 'Treatment Plant')}</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#06B6D4]"></div> {t('map.filter_tank', 'Storage Tank')}</div>
      </div>
      <div className="border-t border-slate-200 my-2"></div>
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-[#22C55E]"></div> {t('map.filter_operational', 'Operational')}</div>
        <div className="flex items-center gap-2"><div className="w-4 border-t border-dashed border-[#3B82F6]"></div> {t('map.filter_maintenance', 'Maintenance')}</div>
        <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-[#F59E0B]"></div> {t('map.filter_attention', 'Attention')}</div>
      </div>
    </div>
  );
};

export default MapLegend;
