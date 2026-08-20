import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, PackagePlus, Receipt, FileText, UserCheck, PlusCircle } from 'lucide-react';

const QuickActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    { icon: AlertCircle, label: t('actions.report_issue'), route: '/maintenance/new' },
    { icon: PackagePlus, label: t('actions.add_stock'), route: '/inventory' },
    { icon: Receipt, label: t('actions.record_expense'), route: '/finance' },
    { icon: FileText, label: t('actions.record_receipt'), route: '/finance' },
    { icon: UserCheck, label: t('actions.generate_bill'), route: '/billing' },
    { icon: PlusCircle, label: t('actions.add_asset'), route: '/assets' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={() => navigate(action.route)}
            className="flex flex-col items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-2xl py-4 active:scale-95 transition-transform"
          >
            <Icon className="w-8 h-8" />
            <span className="font-medium text-base">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
