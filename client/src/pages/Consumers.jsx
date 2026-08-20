import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Search, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { useConsumers } from '../hooks/useConsumers';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';
import BottomSheet from '../components/ui/BottomSheet';

const Consumers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: 'Ward 1, Koregaon',
    phone: '',
    monthly_rate: '100'
  });

  const { consumers, isLoading, isError, refetch, createConsumer, isCreating } = useConsumers(searchTerm);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await createConsumer(formData);
      setToastMessage({ type: 'success', text: `Consumer registered successfully!` });
      setShowAddModal(false);
      setFormData({ name: '', address: 'Ward 1, Koregaon', phone: '', monthly_rate: '100' });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to register consumer' });
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'C';
  };

  return (
    <div className="pb-24 px-4 pt-4 bg-slate-50 min-h-screen">
      {toastMessage && (
        <Toast type={toastMessage.type} message={toastMessage.text} onClose={() => setToastMessage(null)} />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4 sticky top-0 z-10 glass border-b border-white/20 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Consumers</h1>
          <p className="text-sm text-slate-500 font-bold">{consumers.length} Active</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="p-2.5 bg-white rounded-full shadow-sm text-slate-600 active:scale-95 border border-slate-200">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button onClick={() => setShowAddModal(true)} className="p-2.5 bg-primary-500 text-white rounded-full shadow-sm active:scale-95">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search consumers..."
          className="w-full glass bg-white/80 text-slate-800 placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-2xl shadow-sm border border-slate-200 focus:ring-2 focus:ring-primary-500 font-bold"
        />
      </div>

      {/* Consumer Cards */}
      {isLoading ? (
        <LoadingSpinner message="Loading consumers..." />
      ) : isError ? (
        <div className="text-center p-4"><AlertTriangle className="mx-auto text-amber-500 mb-2"/><p>Error loading data</p></div>
      ) : consumers.length === 0 ? (
        <div className="text-center text-slate-500 mt-10">No consumers found.</div>
      ) : (
        <div className="space-y-3">
          {consumers.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/consumers/${c.id}`)}
              className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 tap-highlight card-press border border-slate-100/80"
            >
              <div className="text-primary-700 bg-primary-100 rounded-full w-12 h-12 font-bold text-lg flex items-center justify-center shrink-0">
                {getInitials(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate">{c.name}</h3>
                <div className="text-xs text-slate-500 truncate">{c.id} • {c.address}</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <StatusBadge status={c.status || 'active'} size="sm" />
                <div className="bg-warn-50 text-warn-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ₹{c.monthly_rate} Due
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <BottomSheet isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Consumer">
          <form onSubmit={handleAddSubmit} className="space-y-4 p-4">
            <input
              type="text" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold"
            />
            <input
              type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold"
            />
            <input
              type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold"
            />
            <input
              type="number" placeholder="Monthly Rate" value={formData.monthly_rate} onChange={e => setFormData({...formData, monthly_rate: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold"
            />
            <button type="submit" disabled={isCreating} className="w-full py-4 bg-primary-500 text-white rounded-full font-bold text-lg shadow-md">
              Save Consumer
            </button>
          </form>
        </BottomSheet>
      )}
    </div>
  );
};

export default Consumers;
