import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, RefreshCw, AlertTriangle, FileText, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react';
import { useBilling } from '../hooks/useBilling';
import useAuthStore from '../store/authStore';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';

const Billing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all'); 
  const [toastMessage, setToastMessage] = useState(null);

  const isCitizen = user?.role === 'user';
  const { bills, isLoading, isError, refetch, bulkGenerateBills, isBulkGenerating } = useBilling(activeTab === 'all' ? '' : activeTab);

  const pendingBills = bills.filter(b => b.status === 'pending' || b.status === 'overdue');
  const paidBills = bills.filter(b => b.status === 'paid');
  const totalPendingAmount = pendingBills.reduce((acc, b) => acc + Number(b.amount || 0), 0);
  const totalPaidAmount = paidBills.reduce((acc, b) => acc + Number(b.amount || 0), 0);

  const handleBulkGenerate = async () => {
    try {
      await bulkGenerateBills('August 2026');
      setToastMessage({ type: 'success', text: 'Bills generated successfully!' });
      refetch();
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to generate bills' });
    }
  };

  const tabs = ['All', 'Paid', 'Pending', 'Overdue'];

  // ─────────────────────────────────────────────────────────────
  // CITIZEN / USER VIEW (My Household Water Bills & History)
  // ─────────────────────────────────────────────────────────────
  if (isCitizen) {
    const displayedBills = activeTab === 'all' 
      ? bills 
      : bills.filter(b => b.status === activeTab);

    return (
      <div className="pb-24 px-4 pt-4 bg-slate-50 min-h-screen">
        {toastMessage && <Toast type={toastMessage.type} message={toastMessage.text} onClose={() => setToastMessage(null)} />}

        {/* Header */}
        <div className="flex justify-between items-center mb-4 sticky top-0 z-10 glass pb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">My Water Bills</h1>
            <p className="text-xs text-slate-500 font-semibold">{user?.name || 'Ramesh Patil'} • CON-0001</p>
          </div>
          <button onClick={() => refetch()} className="p-2 bg-white rounded-full shadow-sm">
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Hero Summary Card */}
        <div className="bg-hero-gradient text-white rounded-3xl p-6 mb-5 shadow-float space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-jal-100 text-xs font-black uppercase tracking-widest">
              My Household Water Tariff
            </span>
            <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-md">
              Koregaon GP
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-jal-100 font-bold block">Total Paid Till Now</span>
              <div className="text-3xl font-black text-white">₹{totalPaidAmount.toLocaleString('en-IN')}</div>
              <span className="text-[11px] text-jal-100 font-medium">{paidBills.length} Monthly Cycles Paid</span>
            </div>

            {totalPendingAmount > 0 && (
              <div className="text-right">
                <span className="text-xs text-warn-200 font-bold block">Current Due</span>
                <div className="text-2xl font-black text-warn-300">₹{totalPendingAmount}</div>
                <button
                  onClick={() => navigate(`/payments?bill=${pendingBills[0]?.id || 'BILL-AUG26-001'}`)}
                  className="mt-1 px-3 py-1 bg-white text-primary-700 rounded-lg text-xs font-extrabold shadow-sm active:scale-95 transition-transform"
                >
                  Pay Now 💳
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                activeTab === tab.toLowerCase() ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bills List */}
        {isLoading ? <LoadingSpinner /> : isError ? <AlertTriangle className="mx-auto mt-10 text-amber-500" /> : (
          <div className="space-y-3">
            {displayedBills.map(b => (
              <div 
                key={b.id} 
                onClick={() => navigate(`/billing/${b.id}`)}
                className="bg-white rounded-2xl shadow-card border border-slate-100/80 p-4 relative overflow-hidden tap-highlight card-press"
              >
                {/* Receipt dash cutout */}
                <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-50 rounded-full border-r border-slate-100"></div>
                <div className="absolute top-1/2 -right-2 w-4 h-4 bg-slate-50 rounded-full border-l border-slate-100"></div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-500" />
                    <span className="font-extrabold text-slate-900 text-sm">{b.billing_period || 'August 2026'} Water Bill</span>
                  </div>
                  <StatusBadge status={b.status} size="sm" />
                </div>
                
                <div className="flex justify-between items-end border-y border-dashed border-slate-200 py-3 my-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Bill Number</span>
                    <span className="font-mono text-xs text-slate-600 font-bold">#{b.id}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Due: <strong>{b.due_date}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount</span>
                    <div className="text-2xl font-black text-primary-600">₹{b.amount}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {b.status === 'paid' ? 'Paid via Online UPI/Receipt' : 'Payment Due'}
                  </span>

                  {b.status === 'paid' ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/billing/${b.id}`); }} 
                      className="text-xs font-extrabold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-primary-100"
                    >
                      <span>View Receipt 🧾</span>
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/payments?bill=${b.id}`); }} 
                      className="bg-primary-500 text-white px-4 py-1.5 rounded-xl text-xs font-extrabold shadow-sm active:scale-95 flex items-center gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Now ₹{b.amount}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ADMIN VIEW (Full GP Billing & Collection Metrics)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="pb-24 px-4 pt-4 bg-slate-50 min-h-screen">
      {toastMessage && <Toast type={toastMessage.type} message={toastMessage.text} onClose={() => setToastMessage(null)} />}

      <div className="flex justify-between items-center mb-4 sticky top-0 z-10 glass pb-2">
        <h1 className="text-2xl font-extrabold text-slate-800">Billing & Collections</h1>
        <button onClick={() => refetch()} className="p-2 bg-white rounded-full shadow-sm">
          <RefreshCw className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Hero pending card */}
      <div className="bg-hero-gradient text-white rounded-3xl p-6 mb-5 shadow-float">
        <div className="text-jal-100 text-xs font-black uppercase tracking-widest mb-1">
          PENDING COLLECTION
        </div>
        <div className="text-4xl font-black mb-3">₹{totalPendingAmount.toLocaleString('en-IN')}</div>
        <div className="text-sm font-bold flex gap-4 text-jal-50">
          <span>{pendingBills.length} Pending</span>
          <span className="text-warn-200">{bills.filter(b => b.status === 'overdue').length} Overdue</span>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === tab.toLowerCase() ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bill Cards */}
      {isLoading ? <LoadingSpinner /> : isError ? <AlertTriangle className="mx-auto mt-10 text-amber-500" /> : (
        <div className="space-y-3">
          {bills.map(b => (
            <div key={b.id} onClick={() => navigate(`/billing/${b.id}`)} className="bg-white rounded-2xl shadow-card border border-slate-100/80 p-4 relative overflow-hidden tap-highlight card-press">
              <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-50 rounded-full border-r border-slate-100"></div>
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-slate-50 rounded-full border-l border-slate-100"></div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-slate-900">{b.consumer?.name || b.consumer_id}</span>
                <span className="text-xs text-slate-400 font-mono">#{b.id}</span>
              </div>
              
              <div className="flex justify-between items-end border-y border-dashed border-slate-200 py-3 mb-3">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Period</div>
                  <div className="font-bold text-slate-700">{b.billing_period || 'Aug 2026'}</div>
                </div>
                <div className="text-2xl font-black text-primary-600">
                  ₹{b.amount}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-500">Due: <strong className="text-slate-700">{b.due_date}</strong></div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} size="sm" />
                  {b.status !== 'paid' && (
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/payments?bill=${b.id}`); }} className="bg-primary-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      Pay
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Generate FAB */}
      <button
        onClick={handleBulkGenerate}
        disabled={isBulkGenerating}
        className="fixed bottom-20 right-4 p-4 bg-jal-900 text-white rounded-full shadow-float flex items-center justify-center z-20 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Billing;
