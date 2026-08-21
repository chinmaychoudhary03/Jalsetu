/**
 * Client-side Mock Data Fallback
 * Used when backend API is unreachable (e.g., deployed frontend on Vercel/Netlify without live backend).
 */

export const mockClientData = {
  users: [
    { id: 'user-001', username: 'user', name: 'Ramesh Patil (Citizen)', role: 'user', village: 'Koregaon Gram Panchayat' },
    { id: 'user-002', username: 'phed', name: 'Er. S. K. Deshmukh', role: 'phed', village: 'Koregaon Gram Panchayat' },
    { id: 'user-003', username: 'admin', name: 'GP Administrator', role: 'admin', village: 'Koregaon Gram Panchayat' },
  ],

  dashboardStats: {
    assets: { total: 28, operational: 22, needs_attention: 4, under_maintenance: 2, non_operational: 0 },
    maintenance: { total: 11, reported: 2, assigned: 1, in_progress: 1, completed: 7, open: 3 },
    inventory: { total: 10, low_stock: 2, replenishment_required: 1 },
    finance: { total_receipts: 35000, total_expenditure: 8500, balance: 26500 },
    bills: { total: 20, paid: 14, pending: 5, overdue: 1, pending_amount: 900 },
  },

  assetsGeoJSON: {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0075, 17.6840] }, properties: { id: 'PMP-001', name: 'Pump Station 1 (Main Intake)', type: 'pump', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0055, 17.6820] }, properties: { id: 'PMP-002', name: 'Pump Station 2 (Booster)', type: 'pump', status: 'needs_attention' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0090, 17.6850] }, properties: { id: 'PMP-003', name: 'Pump Station 3 (East)', type: 'pump', status: 'under_maintenance' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0035, 17.6845] }, properties: { id: 'PMP-004', name: 'Solar Borewell Pump 1', type: 'pump', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0060, 17.6805] }, properties: { id: 'PMP-005', name: 'Submersible Pump (South)', type: 'pump', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0070, 17.6830] }, properties: { id: 'WTP-001', name: 'Central Water Treatment Plant', type: 'treatment_plant', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0073, 17.6828] }, properties: { id: 'WTP-002', name: 'Rapid Sand Filter Unit', type: 'treatment_plant', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0065, 17.6835] }, properties: { id: 'STK-001', name: 'Main Overhead Tank (1L L)', type: 'storage_tank', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0080, 17.6865] }, properties: { id: 'STK-002', name: 'North Elevated Reservoir', type: 'storage_tank', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0050, 17.6812] }, properties: { id: 'STK-003', name: 'South Ward Tank', type: 'storage_tank', status: 'needs_attention' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0038, 17.6838] }, properties: { id: 'STK-004', name: 'Ground Storage Tank (West)', type: 'storage_tank', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0060, 17.6840] }, properties: { id: 'VLV-001', name: 'Valve - Main Gate', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0050, 17.6830] }, properties: { id: 'VLV-002', name: 'Valve - Sector A Dist', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0080, 17.6845] }, properties: { id: 'VLV-003', name: 'Valve - Sector B Control', type: 'valve', status: 'needs_attention' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0085, 17.6820] }, properties: { id: 'VLV-004', name: 'Valve - Sector C Gate', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0072, 17.6855] }, properties: { id: 'VLV-005', name: 'Valve - Junction 1 Main', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0045, 17.6818] }, properties: { id: 'VLV-006', name: 'Valve - Junction 2 Feed', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0092, 17.6810] }, properties: { id: 'VLV-007', name: 'Valve - End Point Scour', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0078, 17.6870] }, properties: { id: 'VLV-008', name: 'Valve - North Branch Sluice', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0100, 17.6840] }, properties: { id: 'VLV-009', name: 'Valve - School Line Bypass', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0040, 17.6835] }, properties: { id: 'VLV-010', name: 'Valve - West Reservoir Gate', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0055, 17.6808] }, properties: { id: 'VLV-011', name: 'Valve - South Air Release', type: 'valve', status: 'needs_attention' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0088, 17.6832] }, properties: { id: 'VLV-012', name: 'Valve - Emergency Supply', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0042, 17.6850] }, properties: { id: 'TAP-001', name: 'Public Standpost (Ward 1)', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0095, 17.6842] }, properties: { id: 'TAP-002', name: 'Public Standpost (Ward 2)', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0068, 17.6815] }, properties: { id: 'TAP-003', name: 'Public Tap (Market Chowk)', type: 'valve', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0068, 17.6832] }, properties: { id: 'FLM-001', name: 'Ultrasonic Flow Meter (Main)', type: 'pump', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [74.0082, 17.6848] }, properties: { id: 'FLM-002', name: 'Digital Flow Meter (East)', type: 'pump', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0075, 17.6840],[74.0073, 17.6828],[74.0070, 17.6830]] }, properties: { id: 'PL-001', name: 'Main Intake Raw Water Line', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0070, 17.6830],[74.0068, 17.6832],[74.0065, 17.6835]] }, properties: { id: 'PL-002', name: 'Main Transmission Line (100mm HDPE)', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0065, 17.6835],[74.0060, 17.6840],[74.0050, 17.6830],[74.0040, 17.6835]] }, properties: { id: 'PL-003', name: 'Distribution Line A (West Ward)', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0065, 17.6835],[74.0072, 17.6855],[74.0080, 17.6845],[74.0090, 17.6850]] }, properties: { id: 'PL-004', name: 'Distribution Line B (North East)', type: 'pipeline', status: 'needs_attention' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0070, 17.6830],[74.0068, 17.6815],[74.0080, 17.6820],[74.0085, 17.6820]] }, properties: { id: 'PL-005', name: 'Distribution Line C (Market Sector)', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0055, 17.6820],[74.0060, 17.6805],[74.0055, 17.6808],[74.0050, 17.6812]] }, properties: { id: 'PL-006', name: 'Sub-Distribution Line (South Reservoir)', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0072, 17.6855],[74.0080, 17.6865],[74.0078, 17.6870]] }, properties: { id: 'PL-007', name: 'North Tank Trunk Line', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0035, 17.6845],[74.0038, 17.6838],[74.0042, 17.6850]] }, properties: { id: 'PL-008', name: 'West Solar Borewell Feeder', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0080, 17.6845],[74.0088, 17.6832],[74.0095, 17.6842],[74.0100, 17.6840]] }, properties: { id: 'PL-009', name: 'East School & Hospital Extension', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0085, 17.6820],[74.0092, 17.6810]] }, properties: { id: 'PL-010', name: 'Scour & Flush Connection Line', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0050, 17.6830],[74.0045, 17.6818],[74.0055, 17.6820]] }, properties: { id: 'PL-011', name: 'Sector B Secondary Ring Loop', type: 'pipeline', status: 'operational' } },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[74.0065, 17.6835],[74.0068, 17.6815],[74.0050, 17.6812]] }, properties: { id: 'PL-012', name: 'Market Chowk Main Supply Ring', type: 'pipeline', status: 'operational' } },
    ]
  },

  assetsList: [
    { id: 'PMP-001', name: 'Pump Station 1 (Main Intake)', type: 'pump', status: 'operational', location: { type: 'Point', coordinates: [74.0075, 17.6840] }, attributes: { capacity: '50 LPM', motor: '3HP', year: 2020 } },
    { id: 'PMP-002', name: 'Pump Station 2 (Booster)', type: 'pump', status: 'needs_attention', location: { type: 'Point', coordinates: [74.0055, 17.6820] }, attributes: { capacity: '40 LPM', motor: '2HP', year: 2019 } },
    { id: 'PMP-003', name: 'Pump Station 3 (East)', type: 'pump', status: 'under_maintenance', location: { type: 'Point', coordinates: [74.0090, 17.6850] }, attributes: { capacity: '60 LPM', motor: '5HP', year: 2021 } },
    { id: 'WTP-001', name: 'Central Water Treatment Plant', type: 'treatment_plant', status: 'operational', location: { type: 'Point', coordinates: [74.0070, 17.6830] }, attributes: { capacity: '50 KLD', year: 2018 } },
    { id: 'STK-001', name: 'Main Overhead Tank (1L L)', type: 'storage_tank', status: 'operational', location: { type: 'Point', coordinates: [74.0065, 17.6835] }, attributes: { capacity: '1,00,000 L', year: 2018 } },
  ],

  maintenanceList: [
    { id: 'mnt-001', asset_id: 'PMP-002', description: 'Motor overheating issue', status: 'reported', priority: 'high', created_at: '2026-08-18T09:00:00Z' },
    { id: 'mnt-002', asset_id: 'VLV-003', description: 'Valve not closing fully', status: 'assigned', priority: 'medium', created_at: '2026-08-17T10:00:00Z' },
    { id: 'mnt-003', asset_id: 'PMP-003', description: 'Pump seal replacement', status: 'in_progress', priority: 'high', created_at: '2026-08-16T08:00:00Z' },
  ],

  inventoryList: [
    { id: 'INV-001', name: 'Chlorine', category: 'chemical', quantity: 18, min_quantity: 10, unit: 'kg', status: 'healthy' },
    { id: 'INV-002', name: 'Alum', category: 'chemical', quantity: 45, min_quantity: 20, unit: 'kg', status: 'healthy' },
    { id: 'INV-005', name: 'Pump Seal Kit', category: 'spare_part', quantity: 3, min_quantity: 2, unit: 'units', status: 'healthy' },
  ]
};
