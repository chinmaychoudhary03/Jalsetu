import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useMaintenance } from '../hooks/useMaintenance';
import { useAssets } from '../hooks/useAssets';
import useAuthStore from '../store/authStore';
import Toast from '../components/shared/Toast';

const MaintenanceForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const preselectedAsset = searchParams.get('asset') || '';

  const { assets } = useAssets();
  const { reportIssue, isReporting } = useMaintenance();

  const [formData, setFormData] = useState({
    asset_id: preselectedAsset,
    issue_type: 'leakage',
    priority: 'high',
    description: '',
    spare_parts: '',
    assigned_to: user?.name || 'Suresh Jadhav (Operator)'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (preselectedAsset) {
      setFormData((prev) => ({ ...prev, asset_id: preselectedAsset }));
    } else if (assets && assets.length > 0 && !formData.asset_id) {
      setFormData((prev) => ({ ...prev, asset_id: assets[0].id }));
    }
  }, [preselectedAsset, assets]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePrioritySelect = (priority) => {
    setFormData({ ...formData, priority });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.asset_id) {
      setErrorMsg('Please select an infrastructure asset');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Please enter issue description');
      return;
    }

    setErrorMsg('');

    try {
      await reportIssue({
        asset_id: formData.asset_id,
        description: `[${formData.issue_type.toUpperCase()}] ${formData.description}`,
        priority: formData.priority,
        spare_parts: formData.spare_parts,
        assigned_to: formData.assigned_to,
        reported_by: user?.name || 'User'
      });

      setToastMessage({
        type: 'success',
        text: 'Maintenance issue reported successfully!'
      });

      setTimeout(() => {
        navigate('/maintenance');
      }, 1200);
    } catch (err) {
      setErrorMsg('Failed to report issue. Please try again.');
    }
  };

  const issueTypes = [
    { id: 'leakage', label: 'Leakage', icon: '💧' },
    { id: 'low_pressure', label: 'Low Pressure', icon: '⬇️' },
    { id: 'damage', label: 'Damage', icon: '🔧' },
    { id: 'blockage', label: 'Blockage', icon: '🚫' },
    { id: 'no_water', label: 'No Water', icon: '❌' },
    { id: 'other', label: 'Other', icon: '📋' }
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

      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-white/20 px-4 py-4 flex items-center gap-3 bg-white/80 backdrop-blur-md">
        <button
          onClick={() => navigate('/maintenance')}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900">Report Issue</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {errorMsg && (
          <div className="p-4 bg-crit-50 text-crit-700 rounded-2xl text-sm font-medium border border-crit-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Select Asset */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Select Asset
          </label>
          <div className="relative">
            <select
              name="asset_id"
              value={formData.asset_id}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-base font-bold text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm appearance-none"
            >
              <option value="" disabled>Select Asset</option>
              {assets?.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.type?.replace('_', ' ')})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* 2. Issue Type */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Issue Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {issueTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setFormData({ ...formData, issue_type: type.id })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 tap-highlight text-xs font-bold cursor-pointer transition-colors ${
                  formData.issue_type === type.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-center">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Priority */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Priority
          </label>
          <div className="flex gap-3">
            {[
              { id: 'low', label: 'Low', baseClass: 'bg-ok-50 text-ok-700 border-ok-200' },
              { id: 'medium', label: 'Medium', baseClass: 'bg-warn-50 text-warn-700 border-warn-200' },
              { id: 'high', label: 'High', baseClass: 'bg-crit-50 text-crit-700 border-crit-200' }
            ].map((p) => {
              const isSelected = formData.priority === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handlePrioritySelect(p.id)}
                  className={`flex-1 py-3 px-2 rounded-full text-sm transition-all border ${p.baseClass} ${
                    isSelected ? 'font-black shadow-sm border-2' : 'font-semibold border-transparent'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Description */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            className="w-full bg-white rounded-2xl border-2 border-slate-200 focus:border-primary-400 p-4 resize-none text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm"
          />
        </div>

        {/* 5. Spare Parts */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Spare Parts (Optional)
          </label>
          <input
            type="text"
            name="spare_parts"
            value={formData.spare_parts}
            onChange={handleChange}
            placeholder="e.g. Pump Seal Kit"
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Submit */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-20">
          <button
            type="submit"
            disabled={isReporting}
            className="w-full bg-primary-500 text-white rounded-2xl py-4 font-bold shadow-float active:scale-[0.98] transition-transform disabled:opacity-70 flex justify-center items-center"
          >
            {isReporting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;
