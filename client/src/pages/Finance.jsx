import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  IndianRupee, Plus, Minus, ArrowUpRight, ArrowDownRight, 
  RefreshCw, AlertTriangle, TrendingUp, TrendingDown 
} from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';
import BottomSheet from '../components/ui/BottomSheet';

const Finance = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All'); 
  const [modalMode, setModalMode] = useState(null); // 'receipt' | 'expenditure'
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'GP Grant',
    description: '',
    date: new Date().toISOString().split('T')[0],
    payment_mode: 'cash',
    reference_no: '',
    asset_id: ''
  });

  const { 
    balanceSummary, cashbook, isLoading, isError, refetch, 
    recordReceipt, isRecordingReceipt, 
    recordExpenditure, isRecordingExpenditure 
  } = useFinance();

  const formatCurrency = (amt) => {
    return Number(amt || 0).toLocaleString('en-IN');
  };

  const formatShortCurrency = (amt) => {
    if (amt >= 1000) return (amt / 1000).toFixed(1) + 'K';
    return amt;
  };

  const handleOpenModal = (mode) => {
    setModalMode(mode);
    setFormData({
      amount: '',
      category: mode === 'receipt' ? 'GP Grant' : 'Maintenance',
      description: '',
      date: new Date().toISOString().split('T')[0],
      payment_mode: 'cash',
      reference_no: '',
      asset_id: ''
    });
  };

  const handleModeToggle = (newMode) => {
    setModalMode(newMode);
    setFormData(prev => ({
      ...prev,
      category: newMode === 'receipt' ? 'GP Grant' : 'Maintenance'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;
    if (!formData.description.trim()) return;

    try {
      if (modalMode === 'receipt') {
        await recordReceipt(formData);
        setToastMessage({ type: 'success', text: 'Collection receipt recorded successfully!' });
      } else {
        await recordExpenditure(formData);
        setToastMessage({ type: 'success', text: 'Deduction / expense recorded successfully!' });
      }
      setModalMode(null);
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to record transaction' });
    }
  };

  const filteredCashbook = activeTab === 'All' 
    ? cashbook 
    : activeTab === 'Receipts' 
      ? cashbook.filter(t => t.type === 'receipt')
      : cashbook.filter(t => t.type === 'expenditure');

  // Group by date
  const groupedTransactions = filteredCashbook.reduce((acc, tr) => {
    if (!acc[tr.date]) acc[tr.date] = [];
    acc[tr.date].push(tr);
    return acc;
  }, {});

  return (
    <div className="pb-28 px-4 pt-4 bg-slate-50 min-h-screen relative">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4 sticky top-0 z-10 glass pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('nav.finance', 'Finance')}</h1>
        </div>
        <button 
          onClick={() => refetch()} 
          className="p-2 bg-white rounded-full shadow-sm text-slate-600 active:scale-95 transition-transform cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Blue Hero Balance Card */}
      <div className="bg-hero-gradient text-white rounded-3xl shadow-float p-6 mb-5 space-y-4">
        <div>
          <span className="text-jal-100 text-xs font-black uppercase tracking-widest block mb-1">
            AVAILABLE BALANCE
          </span>
          <div className="text-5xl font-black text-white flex items-center">
            <span>₹{formatCurrency(balanceSummary?.balance || 26500)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold pt-2 border-t border-white/20">
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            +₹{formatShortCurrency(balanceSummary?.total_receipts || 35000)} Receipts
          </span>
          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30">
            <TrendingDown className="w-3.5 h-3.5" />
            -₹{formatShortCurrency(balanceSummary?.total_expenditure || 8500)} Expenses
          </span>
        </div>
      </div>

      {/* Horizontal Pill-shaped Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
        {['All', 'Receipts', 'Expenses'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List Grouped by Date */}
      {isLoading ? (
        <LoadingSpinner message="Loading financial records..." />
      ) : isError ? (
        <div className="text-center p-4">
          <AlertTriangle className="mx-auto w-8 h-8 text-amber-500 mb-2" />
          <p className="text-slate-600 font-bold">Error loading financial records</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date}>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest py-2 px-1">
                {date}
              </div>
              <div className="space-y-3">
                {transactions.map((tr, idx) => (
                  <div key={tr.id || idx} className="bg-white rounded-2xl shadow-card border border-slate-100/80 p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${tr.type === 'receipt' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {tr.type === 'receipt' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{tr.description}</div>
                      <div className="text-xs text-slate-500 font-medium truncate">{tr.category}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-black ${tr.type === 'receipt' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tr.type === 'receipt' ? '+' : '-'}₹{formatCurrency(tr.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                        BAL: ₹{formatCurrency(tr.running_balance || tr.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Buttons (Sticky above nav bottom-right) */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2.5 items-end z-20">
        <button
          onClick={() => handleOpenModal('expenditure')}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-full shadow-float font-bold text-xs active:scale-95 transition-transform cursor-pointer"
        >
          <Minus className="w-4 h-4" />
          <span>Expense (Deduction)</span>
        </button>
        <button
          onClick={() => handleOpenModal('receipt')}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-float font-bold text-xs active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Receipt (Collection)</span>
        </button>
      </div>

      {/* Record Modal as BottomSheet */}
      {modalMode && (
        <BottomSheet 
          isOpen={!!modalMode} 
          onClose={() => setModalMode(null)} 
          title={modalMode === 'receipt' ? 'Record Collection (Receipt)' : 'Record Deduction (Expense)'}
        >
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Segmented Type Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => handleModeToggle('receipt')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalMode === 'receipt' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Receipt (Collection)</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeToggle('expenditure')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalMode === 'expenditure' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Expense (Deduction)</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="e.g. 1500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                {modalMode === 'receipt' ? (
                  <>
                    <option value="GP Grant">GP Grant</option>
                    <option value="Water Bill Collection">Water Bill Collection</option>
                    <option value="Community Contribution">Community Contribution</option>
                    <option value="Other">Other Receipt</option>
                  </>
                ) : (
                  <>
                    <option value="Maintenance">Maintenance & Repair</option>
                    <option value="Electricity">Electricity Bill</option>
                    <option value="Chemical Purchase">Bleaching / Chemical Purchase</option>
                    <option value="Operator Salary">Operator Honorarium</option>
                    <option value="Other">Other Expenditure</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                required
                placeholder={modalMode === 'receipt' ? "e.g. August tap connection fee collection" : "e.g. Pump repair parts & labor charges"}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isRecordingReceipt || isRecordingExpenditure}
              className={`w-full py-4 text-white rounded-2xl font-bold text-base shadow-md active:scale-[0.98] transition-transform cursor-pointer ${
                modalMode === 'receipt' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {modalMode === 'receipt' ? 'Save Receipt (Collection)' : 'Save Expense (Deduction)'}
            </button>
          </form>
        </BottomSheet>
      )}
    </div>
  );
};

export default Finance;
