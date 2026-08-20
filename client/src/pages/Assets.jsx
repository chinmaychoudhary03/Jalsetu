import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, Plus, Database, AlertTriangle, ChevronRight, X 
} from 'lucide-react';
import { useAssets } from '../hooks/useAssets';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';
import ActionChip from '../components/ui/ActionChip';
import BottomSheet from '../components/ui/BottomSheet';
import useAuthStore from '../store/authStore';

const getAssetIcon = (type) => {
  switch (type) {
    case 'pump': return '💧';
    case 'valve': return '🚰';
    case 'treatment_plant': return '🏭';
    case 'storage_tank': return '🏢';
    case 'pipeline': return '📏';
    default: return '⚙️';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'operational':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Operational
        </span>
      );
    case 'needs_attention':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Needs Attention
        </span>
      );
    case 'under_maintenance':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Under Maint
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          Non Operational
        </span>
      );
  }
};

const Assets = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newAssetForm, setNewAssetForm] = useState({
    name: '',
    type: 'pump',
    status: 'operational',
    capacity: '10 HP',
    lat: 17.6834,
    lng: 74.0069
  });

  const { assets, isLoading, isError, refetch, createAsset, isCreating } = useAssets({
    type: selectedType,
    status: selectedStatus
  });

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    if (searchParams.get('action') === 'add') {
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newAssetForm.name.trim()) return;

    try {
      await createAsset(newAssetForm);
      setToastMessage({ type: 'success', text: 'Asset registered successfully!' });
      handleCloseAddModal();
      setNewAssetForm({
        name: '',
        type: 'pump',
        status: 'operational',
        capacity: '10 HP',
        lat: 17.6834,
        lng: 74.0069
      });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Failed to register asset.' });
    }
  };

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'pump', label: 'Pumps' },
    { id: 'valve', label: 'Valves' },
    { id: 'treatment_plant', label: 'Treatment Plants' },
    { id: 'storage_tank', label: 'Storage Tanks' },
    { id: 'pipeline', label: 'Pipelines' }
  ];

  const statuses = [
    { id: 'all', label: 'All Status' },
    { id: 'operational', label: 'Operational' },
    { id: 'needs_attention', label: 'Needs Attention' },
    { id: 'under_maintenance', label: 'Under Maintenance' },
    { id: 'non_operational', label: 'Non Operational' }
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="page-enter pb-24 min-h-screen bg-surf-1">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-white/20 px-4 pt-4 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Assets</h1>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            {assets.length || 12} registered assets in village
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Asset</span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Full-width Search Bar */}
        <div className="flex items-center gap-3 bg-white rounded-2xl shadow-card px-4 py-3 border border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by ID or Name..."
            className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-base font-medium"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="shrink-0 p-1 bg-slate-100 rounded-full cursor-pointer">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>

        {/* Filters Row 1: Type */}
        <div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Filter by Type</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {types.map((type) => (
              <ActionChip
                key={type.id}
                label={type.label}
                active={selectedType === type.id}
                onClick={() => setSelectedType(type.id)}
              />
            ))}
          </div>
        </div>

        {/* Filters Row 2: Status */}
        <div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Filter by Status</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {statuses.map((status) => (
              <ActionChip
                key={status.id}
                label={status.label}
                active={selectedStatus === status.id}
                onClick={() => setSelectedStatus(status.id)}
              />
            ))}
          </div>
        </div>

        {/* Asset Cards List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-shimmer shadow-sm"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-card border border-slate-100">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-800">Error loading asset list</p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-5 py-2 bg-primary-500 text-white rounded-full text-sm font-bold shadow-md cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-card border border-slate-100 mt-6">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Assets Found</h3>
            <p className="text-sm text-slate-500 font-medium">
              Try clearing your search or category filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => navigate(`/assets/${asset.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-4 tap-highlight card-press cursor-pointer hover:shadow-card transition-all"
              >
                {/* Icon square badge */}
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-2xl flex items-center justify-center shrink-0 shadow-xs border border-primary-100">
                  {getAssetIcon(asset.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-primary-700 tracking-wider uppercase bg-primary-50 px-2 py-0.5 rounded-md truncate max-w-[80px]">
                      {asset.id}
                    </span>
                    <span className="text-xs font-bold text-slate-400 capitalize truncate">
                      {asset.type?.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight truncate mb-1">
                    {asset.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium truncate">
                    📍 {asset.location?.coordinates ? `${asset.location.coordinates[1].toFixed(4)}° N, ${asset.location.coordinates[0].toFixed(4)}° E` : '17.6840° N, 74.0075° E'}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {getStatusBadge(asset.status)}
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Asset Registration Modal */}
      {isAddModalOpen && (
        <BottomSheet
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          title="Register Infrastructure Asset"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 p-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Asset Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Solar Pump #3, Koregaon OHT Tank"
                value={newAssetForm.name}
                onChange={(e) => setNewAssetForm({ ...newAssetForm, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Asset Type</label>
                <select
                  value={newAssetForm.type}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="pump">Pumps (💧)</option>
                  <option value="valve">Valves (🚰)</option>
                  <option value="treatment_plant">Treatment Plant (🏭)</option>
                  <option value="storage_tank">Storage Tank (🏢)</option>
                  <option value="pipeline">Pipeline (📏)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={newAssetForm.status}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="operational">Operational</option>
                  <option value="needs_attention">Needs Attention</option>
                  <option value="under_maintenance">Under Maintenance</option>
                  <option value="non_operational">Non Operational</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Capacity / Specifications</label>
              <input
                type="text"
                placeholder="e.g. 15 HP Submersible, 50,000 Liters"
                value={newAssetForm.capacity}
                onChange={(e) => setNewAssetForm({ ...newAssetForm, capacity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-base shadow-md active:scale-[0.98] transition-transform disabled:opacity-70 mt-2 cursor-pointer"
            >
              {isCreating ? 'Registering Asset...' : 'Register Asset'}
            </button>
          </form>
        </BottomSheet>
      )}
    </div>
  );
};

export default Assets;
