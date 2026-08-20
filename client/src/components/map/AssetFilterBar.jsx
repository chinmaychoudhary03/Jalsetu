import React from 'react';
import useMapStore from '../../store/mapStore';
import { useTranslation } from 'react-i18next';

const AssetFilterBar = () => {
  const { t } = useTranslation();
  const { activeTypeFilter, activeStatusFilter, setTypeFilter, setStatusFilter } = useMapStore();

  const types = [
    { id: 'all', label: t('map.filter_all', 'All') },
    { id: 'pump', label: t('map.filter_pump', 'Pump') },
    { id: 'valve', label: t('map.filter_valve', 'Valve') },
    { id: 'treatment_plant', label: t('map.filter_treatment', 'Treatment Plant') },
    { id: 'storage_tank', label: t('map.filter_tank', 'Storage Tank') },
  ];

  const statuses = [
    { id: 'all', label: t('map.filter_all', 'All') },
    { id: 'operational', label: t('map.filter_operational', 'Operational') },
    { id: 'needs_attention', label: t('map.filter_attention', 'Attention') },
    { id: 'under_maintenance', label: t('map.filter_maintenance', 'Maintenance') },
    { id: 'non_operational', label: t('map.filter_non_operational', 'Non-Operational') },
  ];

  const Chip = ({ active, label, onClick }) => (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium shadow-sm border ${
        active 
          ? 'bg-primary text-white border-primary' 
          : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="absolute top-16 left-0 right-0 z-[1000] flex flex-col gap-2 px-2">
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        {types.map((type) => (
          <Chip 
            key={`type-${type.id}`} 
            active={activeTypeFilter === type.id} 
            label={type.label} 
            onClick={() => setTypeFilter(type.id)} 
          />
        ))}
      </div>
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        {statuses.map((status) => (
          <Chip 
            key={`status-${status.id}`} 
            active={activeStatusFilter === status.id} 
            label={status.label} 
            onClick={() => setStatusFilter(status.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default AssetFilterBar;
