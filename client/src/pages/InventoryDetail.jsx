import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Plus, Minus, TrendingUp, AlertTriangle, 
  History, ShoppingBag 
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import StockBar from '../components/shared/StockBar';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';

const InventoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [modalType, setModalType] = useState(null); 
  const [transQty, setTransQty] = useState('');
  const [transRemarks, setTransRemarks] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const { itemDetail, isLoading, isError, refetch, recordTransaction, isRecording } = useInventory(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <LoadingSpinner message={t('common.loading', 'Loading inventory forecasting...')} />
      </div>
    );
  }

  if (isError || !itemDetail) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-warn-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-1">{t('inventory.item_not_found', 'Item Not Found')}</h2>
        <button
          onClick={() => navigate('/inventory')}
          className="mt-4 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold"
        >
          {t('common.back', 'Back to Inventory')}
        </button>
      </div>
    );
  }

  const q = Number(itemDetail.quantity || 0);
  const min = Number(itemDetail.min_quantity || 0);
  const unit = itemDetail.unit || 'units';

  const avgMonthlyUsage = itemDetail.category === 'chemical' ? Math.round(min * 1.2) : Math.round(min * 0.8) || 5;
  const daysRemaining = avgMonthlyUsage > 0 ? Math.max(0, Math.round((q / avgMonthlyUsage) * 30)) : 30;
  const recommendedReplenishment = q < min ? Math.max(0, (min * 2) - q) : 0;

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!transQty || Number(transQty) <= 0) return;

    try {
      await recordTransaction({
        itemId: itemDetail.id,
        type: modalType,
        quantity: transQty,
        remarks: transRemarks || (modalType === 'in' ? 'Stock Added' : 'Recorded Consumption')
      });

      setToastMessage({
        type: 'success',
        text: `Stock ${modalType === 'in' ? 'added' : 'deducted'} successfully!`
      });

      setModalType(null);
      refetch();
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: 'Failed to record transaction'
      });
    }
  };

  const transactions = itemDetail.transactions || [
    { id: 't-1', date: '2026-08-18', type: 'out', quantity: 2, remarks: 'Daily water purification' },
    { id: 't-2', date: '2026-08-10', type: 'in',  quantity: 10, remarks: 'Purchased from GP O&M fund' },
    { id: 't-3', date: '2026-08-01', type: 'out', quantity: 3, remarks: 'Regular O&M usage' }
  ];

  return (
    <div className="pb-28 bg-slate-50 min-h-screen">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Hero header card */}
      <div className="p-4 sticky top-0 z-10 glass border-b border-white/20">
         <button
            onClick={() => navigate('/inventory')}
            className="p-2 rounded-full bg-white/50 backdrop-blur-md text-slate-800 active:scale-95 transition-transform mb-3 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
         </button>

         <div className="bg-hero-gradient text-white rounded-3xl p-5 shadow-card-md">
           <div className="flex justify-between items-start mb-2">
             <h1 className="text-2xl font-extrabold line-clamp-2">{itemDetail.name}</h1>
             <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{itemDetail.category?.replace('_', ' ')}</span>
           </div>
           
           <div className="mt-4">
             <div className="text-xs font-black uppercase tracking-widest text-white/70">Current Stock</div>
             <div className="flex items-baseline gap-1 mt-1">
               <span className="text-5xl font-black">{q}</span>
               <span className="text-lg font-bold opacity-80">{unit}</span>
             </div>
           </div>

           <div className="mt-4">
             <StockBar quantity={q} minQuantity={min} unit={unit} variant="light" />
           </div>
         </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Forecasting Card */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-bold text-slate-900">Demand Forecast</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Avg Usage</span>
              <span className="text-sm font-bold text-slate-800">{avgMonthlyUsage} {unit}/mo</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Coverage Days</span>
              <span className="text-sm font-bold text-primary-600">~{daysRemaining} Days</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Min Level</span>
              <span className="text-sm font-bold text-slate-800">{min} {unit}</span>
            </div>
          </div>

          <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className={`w-5 h-5 ${recommendedReplenishment > 0 ? 'text-warn-600' : 'text-primary-600'}`} />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest block text-slate-500">Recommended Order</span>
                <span className="text-base font-bold text-slate-900">
                  {recommendedReplenishment > 0 ? `${recommendedReplenishment} ${unit}` : 'None needed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <History className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map((tr, idx) => (
              <div key={tr.id || idx} className="py-3 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      tr.type === 'in' ? 'bg-ok-100 text-ok-700' : 'bg-crit-100 text-crit-700'
                    }`}>
                      {tr.type === 'in' ? 'Stock In' : 'Usage'}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{tr.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{tr.remarks || 'Stock transaction'}</p>
                </div>
                <span className={`text-base font-black ${tr.type === 'in' ? 'text-ok-600' : 'text-crit-600'}`}>
                  {tr.type === 'in' ? '+' : '-'}{tr.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons side by side */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-20 flex gap-3">
        <button
          onClick={() => setModalType('in')}
          className="flex-1 bg-primary-500 text-white py-3.5 rounded-full font-bold shadow-float active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Stock</span>
        </button>
        <button
          onClick={() => setModalType('out')}
          className="flex-1 bg-white text-slate-800 border-2 border-slate-200 py-3.5 rounded-full font-bold shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Minus className="w-5 h-5" />
          <span>Record Usage</span>
        </button>
      </div>

      {/* Transaction Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-slide-up">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {modalType === 'in' ? 'Add Stock' : 'Record Usage'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Quantity ({unit})</label>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  required
                  value={transQty}
                  onChange={(e) => setTransQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Remarks</label>
                <input
                  type="text"
                  value={transRemarks}
                  onChange={(e) => setTransRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold">Cancel</button>
                <button type="submit" disabled={isRecording} className={`flex-1 py-3 text-white rounded-xl text-sm font-bold shadow-md ${modalType === 'in' ? 'bg-ok-500' : 'bg-primary-500'}`}>
                  {isRecording ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDetail;
