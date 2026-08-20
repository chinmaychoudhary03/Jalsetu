import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-leaflet';
import useMapStore from '../../store/mapStore';

const MapSearchBar = ({ assets }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const map = useMap();
  const { setSelectedAsset } = useMapStore();

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = assets.filter(f => 
      f.properties.name.toLowerCase().includes(val.toLowerCase()) || 
      f.properties.id.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5); // top 5
    
    setResults(filtered);
  };

  const handleSelect = (feature) => {
    const coords = feature.geometry.coordinates;
    let latlng;
    if (feature.geometry.type === 'Point') {
      latlng = [coords[1], coords[0]]; // geojson is [lng, lat]
    } else {
      latlng = [coords[0][1], coords[0][0]]; // use first point for lines
    }
    
    map.flyTo(latlng, 17);
    setSelectedAsset(feature.properties);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-[1000]">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3 bg-white rounded-2xl shadow-md text-base focus:outline-none"
          placeholder={t('map.search_placeholder', 'Search assets...')}
          value={query}
          onChange={handleSearch}
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        )}
      </div>
      
      {results.length > 0 && (
        <div className="mt-1 bg-white rounded-xl shadow-lg overflow-hidden">
          {results.map((f, i) => (
            <div 
              key={i} 
              onClick={() => handleSelect(f)}
              className="p-3 border-b border-slate-100 last:border-0 active:bg-slate-50 cursor-pointer hover:bg-slate-50"
            >
              <div className="font-semibold text-sm">{f.properties.name}</div>
              <div className="text-xs text-slate-500">{f.properties.id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapSearchBar;
