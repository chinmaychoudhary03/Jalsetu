import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, AlertTriangle } from 'lucide-react';
import { useConsumers } from '../hooks/useConsumers';
import { useBilling } from '../hooks/useBilling';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';

const ConsumerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [toastMessage, setToastMessage] = useState(null);

  const { consumerDetail, isLoading, isError, refetch } = useConsumers('', id);
  const { generateBill, isGenerating } = useBilling();

  if (isLoading) return <div className="min-h-screen bg-slate-50 p-4"><LoadingSpinner message="Loading..." /></div>;
  if (isError || !consumerDetail) return <div className="min-h-screen flex items-center justify-center p-4">Error loading consumer</div>;

  const handleGenerateBill = async () => {
    try {
      await generateBill({
        consumer_id: consumerDetail.id,
        amount: consumerDetail.monthly_rate || 100,
        billing_month: 'August 2026',
        due_date: '2026-08-31'
      });
      setToastMessage({ type: 'success', text: `Bill generated for ${consumerDetail.name}` });
      refetch();
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to generate bill' });
    }
  };

  const bills = consumerDetail.bills || [];
  const initials = consumerDetail.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'C';

  return (
    <div className="pb-28 bg-slate-50 min-h-screen">
      {toastMessage && <Toast type={toastMessage.type} message={toastMessage.text} onClose={() => setToastMessage(null)} />}

      {/* Hero Header */}
      <div className="bg-hero-gradient text-white rounded-b-3xl p-5 pt-8 relative shadow-md">
        <button onClick={() => navigate('/consumers')} className="absolute top-4 left-4 p-2 bg-white/20 rounded-full text-white backdrop-blur-sm active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center mt-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full text-primary-700 flex items-center justify-center text-3xl font-black mb-3 shadow-sm">
            {initials}
          </div>
          <h1 className="text-2xl font-black mb-1">{consumerDetail.name}</h1>
          <div className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            {consumerDetail.id}
          </div>
          <div className="bg-white/10 p-1 rounded-full backdrop-blur-sm">
            <StatusBadge status={consumerDetail.status || 'active'} />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Current Bill Card */}
        <div className="bg-white rounded-2xl shadow-card-md border border-primary-100 p-5 relative z-10">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Current Bill</div>
          <div className="text-4xl font-black text-primary-700 mb-1">₹{consumerDetail.monthly_rate || 100}</div>
          <div className="text-sm font-bold text-slate-500 mb-4">Due: 31 Aug 2026</div>
          <button 
            onClick={() => navigate(`/payments?bill=${consumerDetail.id}`)}
            className="w-full bg-primary-500 text-white py-4 rounded-full font-black shadow-md active:scale-95 transition-transform"
          >
            PAY NOW
          </button>
        </div>

        {/* Billing History */}
        <div className="mt-6">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Billing History</div>
          <div className="space-y-3">
            {bills.length === 0 ? (
              <div className="text-center text-slate-500 text-sm">No bills yet.</div>
            ) : (
              bills.map(b => (
                <div key={b.id} className="bg-white rounded-2xl p-4 shadow-card flex justify-between items-center border border-slate-100/80">
                  <div>
                    <div className="font-bold text-slate-900">{b.billing_month || 'August 2026'}</div>
                    <div className="text-xs text-slate-500">{b.id}</div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="font-black text-lg text-slate-900">₹{b.amount}</div>
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/20">
        <button
          onClick={handleGenerateBill}
          disabled={isGenerating}
          className="w-full bg-slate-900 text-white py-4 rounded-full font-bold shadow-float flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>{isGenerating ? 'Generating...' : 'Generate New Bill'}</span>
        </button>
      </div>
    </div>
  );
};

export default ConsumerDetail;
