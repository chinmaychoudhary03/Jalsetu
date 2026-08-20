import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Wrench, Plus, AlertCircle, Clock, CheckCircle2, 
  ArrowRight, UserCheck, Play, RefreshCw, AlertTriangle, ArrowLeft 
} from 'lucide-react';
import { useMaintenance } from '../hooks/useMaintenance';
import StatusBadge from '../components/shared/StatusBadge';
import Toast from '../components/shared/Toast';
import EmptyState from '../components/ui/EmptyState';
import SkeletonPage, { SkeletonCard } from '../components/ui/SkeletonCard';
import ActionChip from '../components/ui/ActionChip';

const Maintenance = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); 
  const [toastMessage, setToastMessage] = useState(null);

  const { tickets, isLoading, isError, refetch, updateStatus, isUpdating } = useMaintenance(activeTab);

  const tabs = [
    { id: 'all', label: t('maintenance.tab_all', 'All') },
    { id: 'reported', label: t('maintenance.tab_reported', 'Reported') },
    { id: 'assigned', label: t('maintenance.tab_assigned', 'Assigned') },
    { id: 'in_progress', label: t('maintenance.tab_in_progress', 'In Progress') },
    { id: 'completed', label: t('maintenance.tab_completed', 'Completed') }
  ];

  const handleAdvanceStatus = async (ticket) => {
    let nextStatus = 'assigned';
    if (ticket.status === 'reported') nextStatus = 'assigned';
    else if (ticket.status === 'assigned') nextStatus = 'in_progress';
    else if (ticket.status === 'in_progress') nextStatus = 'completed';
    else return;

    try {
      await updateStatus({ id: ticket.id, status: nextStatus });
      setToastMessage({
        type: 'success',
        text: `Ticket status updated to ${nextStatus.replace('_', ' ')}`
      });
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: 'Failed to update ticket status'
      });
    }
  };

  const getNextActionLabel = (status) => {
    switch (status) {
      case 'reported':
        return { label: t('maintenance.action_assign', 'Assign Technician') };
      case 'assigned':
        return { label: t('maintenance.action_start', 'Start Repair Work') };
      case 'in_progress':
        return { label: t('maintenance.action_complete', 'Mark as Completed') };
      default:
        return null;
    }
  };

  const workflowSteps = [
    { id: 'reported', label: 'Reported' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header (sticky glass) */}
      <div className="sticky top-0 z-10 glass border-b border-white/20 px-4 py-3 flex justify-between items-center bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('nav.maintenance', 'Maintenance')}</h1>
            <div className="text-xs font-bold text-slate-500">{tickets.length} tickets</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/maintenance/new')}
          className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Report Issue</span>
        </button>
      </div>

      {/* Workflow visual bar */}
      <div className="flex items-center px-4 py-3 bg-white border-b border-slate-100 justify-between">
        {workflowSteps.map((step, idx) => {
          const isActive = activeTab === step.id;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'bg-primary-500 border-primary-500' : 'bg-white border-slate-300'}`}></div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-primary-700' : 'text-slate-500'}`}>{step.label}</span>
              </div>
              {idx < workflowSteps.length - 1 && (
                <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-4"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Tab filter row */}
      <div className="px-4 py-3 bg-slate-50">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => (
            <ActionChip
              key={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="px-4">
        {isLoading ? (
          <SkeletonPage cards={4} />
        ) : isError ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
            <AlertTriangle className="w-10 h-10 text-warn-500 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-800">{t('common.error', 'An error occurred')}</p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold"
            >
              {t('dashboard.retry', 'Tap to retry')}
            </button>
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState 
            type="maintenance" 
            title="No maintenance tickets" 
            description={activeTab === 'all' ? "No active tickets found." : `No tickets in ${activeTab.replace('_', ' ')} status.`} 
          />
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => {
              const nextAction = getNextActionLabel(ticket.status);
              const ticketDate = new Date(ticket.created_at || Date.now());
              const formattedDate = !isNaN(ticketDate) 
                ? ticketDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                : ticket.created_at;

              let priorityColor = 'border-slate-200';
              let priorityText = 'text-slate-500';
              if (ticket.priority === 'high') { priorityColor = 'border-crit-500'; priorityText = 'text-crit-700'; }
              else if (ticket.priority === 'medium') { priorityColor = 'border-warn-500'; priorityText = 'text-warn-700'; }
              else if (ticket.priority === 'low') { priorityColor = 'border-ok-500'; priorityText = 'text-ok-700'; }

              return (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-2xl shadow-card border border-slate-100/80 p-4 border-l-4 ${priorityColor}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-900">{ticket.asset_id || 'ASSET'}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase ${priorityText}`}>{ticket.priority || 'medium'}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">
                      {ticket.issue_type?.replace('_', ' ') || 'Issue'}
                    </span>
                    <p className="text-sm text-slate-800 font-medium line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="text-xs font-medium text-slate-500">
                      <div>{formattedDate}</div>
                      {ticket.assigned_to && <div className="text-slate-700">{ticket.assigned_to}</div>}
                    </div>
                    {nextAction && ticket.status !== 'completed' && (
                      <button
                        onClick={() => handleAdvanceStatus(ticket)}
                        disabled={isUpdating}
                        className="bg-primary-50 text-primary-700 rounded-xl px-3 py-1.5 text-xs font-bold active:scale-95 transition-transform disabled:opacity-50"
                      >
                        {nextAction.label}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
