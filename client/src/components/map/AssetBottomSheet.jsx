import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMapStore from '../../store/mapStore';
import { useTranslation } from 'react-i18next';

const AssetBottomSheet = () => {
  const { selectedAsset, clearSelectedAsset } = useMapStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div 
      className={`fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[1001] transition-transform duration-300 ease-in-out ${
        selectedAsset ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ height: '260px' }}
    >
      {selectedAsset && (
        <div className="p-4 flex flex-col h-full relative">
          <button 
            onClick={clearSelectedAsset}
            className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
          
          <div className="mb-1 text-sm text-slate-500">{selectedAsset.id}</div>
          <div className="text-xl font-bold mb-3">{selectedAsset.name}</div>
          
          <div className="mb-4">
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 mr-2">
              {t(`status.${selectedAsset.status}`, selectedAsset.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-auto text-sm text-slate-600">
            <div>
              <span className="font-semibold block">Type</span>
              {t(`map.filter_${selectedAsset.type}`, selectedAsset.type)}
            </div>
            <div>
              <span className="font-semibold block">Status</span>
              {t(`status.${selectedAsset.status}`, selectedAsset.status)}
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => navigate(`/assets/${selectedAsset.id}`)}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold"
            >
              {t('map.view_details', 'View Details')}
            </button>
            <button 
              onClick={() => navigate(`/maintenance/new?asset=${selectedAsset.id}`)}
              className="flex-1 bg-white text-primary border border-primary py-3 rounded-xl font-semibold"
            >
              {t('map.report_issue', 'Report Issue')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetBottomSheet;
