import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const SectionHeader = ({ title, linkTo }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center mb-3 px-1">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {linkTo && (
        <NavLink to={linkTo} className="text-primary font-medium text-sm flex items-center gap-1">
          {t('dashboard.view_all')} <ArrowRight className="w-4 h-4" />
        </NavLink>
      )}
    </div>
  );
};

export default SectionHeader;
