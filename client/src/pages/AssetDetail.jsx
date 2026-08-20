import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, MapPin, Wrench, AlertTriangle, 
  CheckCircle, Layers, Cpu, Clock
} from 'lucide-react';
import { useAssetDetail } from '../hooks/useAssetDetail';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Timeline from '../components/shared/Timeline';

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

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const { asset, isLoading, isError } = useAssetDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surf-1 p-4 flex items-center justify-center">
        <LoadingSpinner message={t('common.loading', 'Loading asset details...')} />
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="min-h-screen bg-surf-1 p-4 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-warn-500 mb-3" />
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">{t('assets.asset_not_found', 'Asset Not Found')}</h2>
        <p className="text-sm font-medium text-slate-500 mb-6">{t('assets.asset_not_found_desc', 'The requested asset ID does not exist.')}</p>
        <button
          onClick={() => navigate('/assets')}
          className="px-6 py-3 bg-primary-500 text-white rounded-full text-sm font-bold shadow-md card-press"
        >
          {t('common.back_to_list', 'Back to Assets List')}
        </button>
      </div>
    );
  }

  const coords = asset.location?.coordinates 
    ? `${asset.location.coordinates[1].toFixed(4)}°N, ${asset.location.coordinates[0].toFixed(4)}°E`
    : 'Koregaon GP';

  const historyEvents = asset.maintenance_history || [
    {
      id: 'm-1',
      date: '2026-08-18',
      title: 'Inspection Completed',
      status: 'completed',
      type: 'inspection',
      details: 'Routine monthly check performed by Field Inspector.'
    },
    {
      id: 'm-2',
      date: '2026-08-10',
      title: 'Seal Replacement & Repair',
      status: 'completed',
      type: 'repair',
      details: 'Replaced worn rubber gasket and tightened motor assembly.'
    },
    {
      id: 'm-3',
      date: '2026-06-15',
      title: 'Maintenance Performed',
      status: 'completed',
      type: 'maintenance',
      details: 'Filter cleaned and lubrication re-applied.'
    }
  ];

  const tabs = [
    { id: 'overview', label: t('assets.tab_overview', 'Overview') },
    { id: 'technical', label: t('assets.tab_technical', 'Technical') },
    { id: 'maintenance', label: t('assets.tab_maintenance', 'Maintenance') },
    { id: 'history', label: t('assets.tab_history', 'History') }
  ];

  return (
    <div className="page-enter pb-28 bg-surf-1 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 glass px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/assets')}
          className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-full shadow-sm text-slate-700 card-press"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 truncate flex-1">Asset Details</h1>
      </header>

      {/* Hero card (bg-hero-gradient) */}
      <div className="px-4 pt-2 mb-5">
        <div className="bg-hero-gradient rounded-3xl p-5 text-white shadow-float relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">
            {getAssetIcon(asset.type)}
          </div>
          
          <div className="relative z-10">
            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm mb-3">
              {asset.type?.replace('_', ' ')}
            </div>
            
            <h2 className="text-2xl font-black mb-1">{asset.name}</h2>
            <div className="text-jal-100 text-sm font-bold tracking-wide uppercase mb-4">
              ID: {asset.id}
            </div>
            
            <div className="flex justify-between items-end">
              <StatusBadge status={asset.status} size="md" />
              <div className="flex flex-wrap gap-1.5 justify-end max-w-[50%]">
                <span className="bg-black/20 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-sm">GP Owned</span>
                {asset.attributes?.year && (
                  <span className="bg-black/20 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-sm">Est. {asset.attributes.year}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 bg-surf-2 rounded-2xl p-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] py-2 px-3 text-sm font-bold whitespace-nowrap transition-all rounded-xl ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-card'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="px-4 space-y-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100/80">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">{t('assets.location', 'Location GPS')}</span>
                <p className="text-sm font-bold text-slate-800 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{coords}</span>
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100/80">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">{t('assets.authority', 'Authority')}</span>
                <p className="text-sm font-bold text-slate-800 leading-tight">Gram Panchayat</p>
              </div>
            </div>

            {asset.attributes && Object.keys(asset.attributes).length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary-500" />
                  {t('assets.specifications', 'Key Specifications')}
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(asset.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-slate-500 font-semibold capitalize">{key.replace('_', ' ')}</span>
                      <span className="font-bold text-slate-800 text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TECHNICAL */}
        {activeTab === 'technical' && (
          <div className="animate-fade-in bg-white rounded-2xl p-5 shadow-card border border-slate-100/80">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-primary-500" />
              {t('assets.technical_details', 'Technical Details')}
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-surf-2 rounded-xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{t('assets.asset_id', 'Asset ID')}</span>
                <span className="text-sm font-bold text-slate-800">{asset.id}</span>
              </div>

              {asset.attributes && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(asset.attributes).map(([k, v]) => (
                    <div key={k} className="p-3.5 bg-surf-2 rounded-xl">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 capitalize">{k.replace('_', ' ')}</span>
                      <span className="text-sm font-bold text-slate-800">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3.5 bg-surf-2 rounded-xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{t('assets.manufacturer', 'Manufacturer / Make')}</span>
                <span className="text-sm font-bold text-slate-800">Kirloskar Brothers Ltd / Standard</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-primary-500" />
                {t('assets.maintenance_summary', 'Maintenance Summary')}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-surf-2 rounded-xl">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{t('assets.last_maintenance', 'Last Maint')}</span>
                  <span className="text-sm font-bold text-slate-800">10 Aug 2026</span>
                </div>
                <div className="p-3.5 bg-surf-2 rounded-xl">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{t('assets.next_maintenance', 'Next Due')}</span>
                  <span className="text-sm font-bold text-primary-600">10 Nov 2026</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100/80">
              <h4 className="text-sm font-bold text-slate-800 mb-3">{t('assets.active_issues', 'Active Tickets')}</h4>
              {asset.status === 'operational' ? (
                <div className="p-4 bg-ok-50 border border-ok-100 rounded-xl text-ok-700 text-sm font-bold flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="leading-tight">No active issues reported for this asset.</span>
                </div>
              ) : (
                <div className="p-4 bg-warn-50 border border-warn-100 rounded-xl text-warn-800 text-sm font-bold flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-warn-500" />
                  <span className="leading-tight">This asset requires attention or repair. See reported issue.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="animate-fade-in bg-white rounded-2xl p-5 shadow-card border border-slate-100/80">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary-500" />
              {t('assets.maintenance_history', 'Event History')}
            </h3>
            <Timeline events={historyEvents} />
          </div>
        )}
      </div>

      {/* Fixed bottom action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 backdrop-blur-md border-t border-slate-100 z-20">
        <button
          onClick={() => navigate(`/maintenance/new?asset=${asset.id}`)}
          className="w-full bg-primary-500 text-white py-4 rounded-full font-bold text-base shadow-lg shadow-primary-500/30 card-press flex items-center justify-center gap-2"
        >
          <Wrench className="w-5 h-5" />
          <span>{t('actions.report_issue', 'Report Issue')}</span>
        </button>
      </div>
    </div>
  );
};

export default AssetDetail;
