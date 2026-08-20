import L from 'leaflet';

export const createAssetMarker = (type, status) => {
  let bgColor = '#8B5CF6'; // Purple for other
  let letter = 'O';

  if (type === 'pump') {
    bgColor = '#1E6DB7'; // Blue
    letter = 'P';
  } else if (type === 'valve') {
    bgColor = '#6B7280'; // Gray
    letter = 'V';
  } else if (type === 'treatment_plant') {
    bgColor = '#22C55E'; // Green
    letter = 'T';
  } else if (type === 'storage_tank') {
    bgColor = '#06B6D4'; // Cyan
    letter = 'S';
  }

  let borderStyle = 'border: 2px solid white;';
  let animationClass = '';

  if (status === 'needs_attention') {
    borderStyle = 'border: 2px solid #F59E0B;'; // Amber
    animationClass = 'animate-pulse';
  } else if (status === 'under_maintenance') {
    borderStyle = 'border: 2px dashed #3B82F6;'; // Blue dashed
  } else if (status === 'non_operational') {
    borderStyle = 'border: 2px solid #EF4444;'; // Red
  }

  const html = `
    <div class="flex items-center justify-center rounded-full text-white font-bold text-xs shadow-md ${animationClass}" 
         style="width: 36px; height: 36px; background-color: ${bgColor}; ${borderStyle} cursor: pointer; pointer-events: auto; touch-action: manipulation;">
      ${letter}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};
