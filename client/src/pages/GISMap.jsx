import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssetsGeoJSON } from '../hooks/useAssetsGeoJSON';
import useMapStore from '../store/mapStore';
import { createAssetMarker } from '../components/map/createAssetMarker';
import BottomSheet from '../components/ui/BottomSheet';
import ActionChip from '../components/ui/ActionChip';

// Fix Leaflet icon issue for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: '', shadowUrl: '' });

const GISMap = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useAssetsGeoJSON();
  const { activeTypeFilter, activeStatusFilter, setActiveTypeFilter, setSelectedAsset, selectedAsset } = useMapStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const center = [17.6834, 74.0069];

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-surf-1 text-slate-500">{t('map.loading', 'Loading map...')}</div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center h-screen bg-surf-1 text-crit-500">{t('map.error', 'Could not load map data')}</div>;
  }

  const features = data?.features || [];

  const filteredFeatures = features.filter(f => {
    const typeMatch = activeTypeFilter === 'all' || f.properties.type === activeTypeFilter;
    const statusMatch = activeStatusFilter === 'all' || f.properties.status === activeStatusFilter;
    const searchMatch = !searchTerm || f.properties.name?.toLowerCase().includes(searchTerm.toLowerCase()) || f.properties.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  const getPipelineStyle = (status) => {
    return {
      color: '#10B981', // Bold vibrant green (ok-500)
      weight: 7,        // Increased pipeline thickness
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  const types = [
    { id: 'all', label: 'All Assets' },
    { id: 'pump', label: 'Pumps' },
    { id: 'valve', label: 'Valves' },
    { id: 'pipeline', label: 'Pipelines' },
    { id: 'storage_tank', label: 'Tanks' },
    { id: 'treatment_plant', label: 'Treatment' }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-surf-1">
      {/* Floating search bar */}
      <div className="absolute top-4 left-4 right-4 z-[400]">
        <div className="glass rounded-2xl shadow-float flex items-center gap-3 px-4 py-3">
          {!isSearchActive && searchTerm === '' ? (
            <ArrowLeft className="w-5 h-5 text-slate-500 cursor-pointer" onClick={() => navigate(-1)} />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
          <input 
            placeholder="Search assets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-500 text-base"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-1 rounded-full bg-slate-200/50">
              <X className="w-4 h-4 text-slate-600" />
            </button>
          )}
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {filteredFeatures.map((feature, idx) => {
          if (feature.geometry.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            return (
              <Marker 
                key={feature.properties.id || idx}
                position={[lat, lng]}
                icon={createAssetMarker(feature.properties.type, feature.properties.status)}
                eventHandlers={{
                  click: () => setSelectedAsset(feature.properties)
                }}
              />
            );
          } else if (feature.geometry.type === 'LineString') {
            const positions = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            return (
              <Polyline
                key={feature.properties.id || idx}
                positions={positions}
                pathOptions={getPipelineStyle(feature.properties.status)}
                eventHandlers={{
                  click: () => setSelectedAsset(feature.properties)
                }}
              />
            );
          }
          return null;
        })}
      </MapContainer>
      
      {/* Filter chips - floating right above bottom nav */}
      <div className="absolute bottom-4 left-0 right-0 z-[400] px-4 pointer-events-none">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pointer-events-auto">
          {types.map((type) => (
            <ActionChip 
              key={type.id}
              label={type.label}
              active={activeTypeFilter === type.id}
              onClick={() => setActiveTypeFilter(type.id)}
              className="shadow-md"
            />
          ))}
        </div>
      </div>
      
      {/* Asset bottom sheet */}
      <BottomSheet isOpen={!!selectedAsset} onClose={() => setSelectedAsset(null)}>
        {selectedAsset && (
          <div className="p-4 pt-2 pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="text-xs font-black text-primary-500 tracking-wide uppercase bg-primary-50 px-2 py-0.5 rounded-md">
                {selectedAsset.id}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {selectedAsset.type?.replace('_', ' ')}
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedAsset.name}</h2>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-semibold text-slate-600 capitalize">Status:</span>
              <span className={`text-sm font-bold ${
                selectedAsset.status === 'operational' ? 'text-ok-500' :
                selectedAsset.status === 'needs_attention' ? 'text-warn-500' :
                selectedAsset.status === 'non_operational' ? 'text-crit-500' : 'text-primary-500'
              }`}>
                {selectedAsset.status?.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => navigate(`/assets/${selectedAsset.id}`)}
                className="flex-1 bg-slate-100 text-slate-800 py-3.5 rounded-2xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center"
              >
                View Details
              </button>
              <button 
                onClick={() => navigate(`/maintenance/new?asset=${selectedAsset.id}`)}
                className="flex-1 bg-primary-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex items-center justify-center"
              >
                Report Issue
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default GISMap;
