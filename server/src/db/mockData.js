/**
 * Mock Data Module — used when PostgreSQL is unavailable (no Docker)
 * Provides realistic Koregaon GP data for all API endpoints.
 * Switch to real DB by starting Docker: docker-compose up -d postgres
 */

const mockData = {
  users: [
    { id: 'user-001', username: 'user',     name: 'Ramesh Patil (Citizen)', role: 'user',  village: 'Koregaon Gram Panchayat', password_hash: '$2a$10$YAEFKj1GjL8qNnevyk2r9uRbKZWWM6IHwnkBHkORoeCDTcOSp8mtC' },
    { id: 'user-002', username: 'phed',     name: 'Er. S. K. Deshmukh',     role: 'phed',  village: 'Koregaon Gram Panchayat', password_hash: '$2a$10$YAEFKj1GjL8qNnevyk2r9uRbKZWWM6IHwnkBHkORoeCDTcOSp8mtC' },
    { id: 'user-003', username: 'admin',    name: 'GP Administrator',        role: 'admin', village: 'Koregaon Gram Panchayat', password_hash: '$2a$10$YAEFKj1GjL8qNnevyk2r9uRbKZWWM6IHwnkBHkORoeCDTcOSp8mtC' },
    { id: 'user-004', username: 'gp_admin', name: 'GP Administrator',        role: 'admin', village: 'Koregaon Gram Panchayat', password_hash: '$2a$10$YAEFKj1GjL8qNnevyk2r9uRbKZWWM6IHwnkBHkORoeCDTcOSp8mtC' },
    { id: 'user-005', username: 'phed1',    name: 'Er. S. K. Deshmukh',     role: 'phed',  village: 'Koregaon Gram Panchayat', password_hash: '$2a$10$YAEFKj1GjL8qNnevyk2r9uRbKZWWM6IHwnkBHkORoeCDTcOSp8mtC' },
  ],

  dashboardStats: {
    assets: { total: 28, operational: 22, needs_attention: 4, under_maintenance: 2, non_operational: 0 },
    maintenance: { total: 11, reported: 2, assigned: 1, in_progress: 1, completed: 7, open: 3 },
    inventory: { total: 10, low_stock: 2, replenishment_required: 1 },
    finance: { total_receipts: 35000, total_expenditure: 8500, balance: 26500 },
    bills: { total: 20, paid: 14, pending: 5, overdue: 1, pending_amount: 900 },
  },

  assets: [
    { id: 'PMP-001', name: 'Pump Station 1 (Main Intake)', type: 'pump', status: 'operational', location: { type: 'Point', coordinates: [74.0075, 17.6840] }, attributes: { capacity: '50 LPM', motor: '3HP', year: 2020 } },
    { id: 'PMP-002', name: 'Pump Station 2 (Booster)', type: 'pump', status: 'needs_attention', location: { type: 'Point', coordinates: [74.0055, 17.6820] }, attributes: { capacity: '40 LPM', motor: '2HP', year: 2019 } },
    { id: 'PMP-003', name: 'Pump Station 3 (East)', type: 'pump', status: 'under_maintenance', location: { type: 'Point', coordinates: [74.0090, 17.6850] }, attributes: { capacity: '60 LPM', motor: '5HP', year: 2021 } },
    { id: 'PMP-004', name: 'Solar Borewell Pump 1', type: 'pump', status: 'operational', location: { type: 'Point', coordinates: [74.0035, 17.6845] }, attributes: { capacity: '30 LPM', motor: '3HP Solar', year: 2022 } },
    { id: 'PMP-005', name: 'Submersible Pump (South)', type: 'pump', status: 'operational', location: { type: 'Point', coordinates: [74.0060, 17.6805] }, attributes: { capacity: '45 LPM', motor: '4HP', year: 2021 } },
    { id: 'WTP-001', name: 'Central Water Treatment Plant', type: 'treatment_plant', status: 'operational', location: { type: 'Point', coordinates: [74.0070, 17.6830] }, attributes: { capacity: '50 KLD', year: 2018 } },
    { id: 'WTP-002', name: 'Rapid Sand Filter Unit', type: 'treatment_plant', status: 'operational', location: { type: 'Point', coordinates: [74.0073, 17.6828] }, attributes: { capacity: '30 KLD', year: 2020 } },
    { id: 'STK-001', name: 'Main Overhead Tank (1L L)', type: 'storage_tank', status: 'operational', location: { type: 'Point', coordinates: [74.0065, 17.6835] }, attributes: { capacity: '1,00,000 L', year: 2018 } },
    { id: 'STK-002', name: 'North Elevated Reservoir', type: 'storage_tank', status: 'operational', location: { type: 'Point', coordinates: [74.0080, 17.6865] }, attributes: { capacity: '50,000 L', year: 2021 } },
    { id: 'STK-003', name: 'South Ward Tank', type: 'storage_tank', status: 'needs_attention', location: { type: 'Point', coordinates: [74.0050, 17.6812] }, attributes: { capacity: '40,000 L', year: 2019 } },
    { id: 'STK-004', name: 'Ground Storage Tank (West)', type: 'storage_tank', status: 'operational', location: { type: 'Point', coordinates: [74.0038, 17.6838] }, attributes: { capacity: '75,000 L', year: 2020 } },
    { id: 'VLV-001', name: 'Valve - Main Gate', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0060, 17.6840] }, attributes: { size: '4"', type: 'Gate Valve' } },
    { id: 'VLV-002', name: 'Valve - Sector A Dist', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0050, 17.6830] }, attributes: { size: '3"', type: 'Gate Valve' } },
    { id: 'VLV-003', name: 'Valve - Sector B Control', type: 'valve', status: 'needs_attention', location: { type: 'Point', coordinates: [74.0080, 17.6845] }, attributes: { size: '3"', type: 'Butterfly Valve' } },
    { id: 'VLV-004', name: 'Valve - Sector C Gate', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0085, 17.6820] }, attributes: { size: '2"', type: 'Gate Valve' } },
    { id: 'VLV-005', name: 'Valve - Junction 1 Main', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0072, 17.6855] }, attributes: { size: '4"', type: 'Sluice Valve' } },
    { id: 'VLV-006', name: 'Valve - Junction 2 Feed', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0045, 17.6818] }, attributes: { size: '3"', type: 'Gate Valve' } },
    { id: 'VLV-007', name: 'Valve - End Point Scour', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0092, 17.6810] }, attributes: { size: '2"', type: 'Stop Valve' } },
    { id: 'VLV-008', name: 'Valve - North Branch Sluice', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0078, 17.6870] }, attributes: { size: '3"', type: 'Sluice Valve' } },
    { id: 'VLV-009', name: 'Valve - School Line Bypass', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0100, 17.6840] }, attributes: { size: '2"', type: 'Gate Valve' } },
    { id: 'VLV-010', name: 'Valve - West Reservoir Gate', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0040, 17.6835] }, attributes: { size: '3"', type: 'Gate Valve' } },
    { id: 'VLV-011', name: 'Valve - South Air Release', type: 'valve', status: 'needs_attention', location: { type: 'Point', coordinates: [74.0055, 17.6808] }, attributes: { size: '2"', type: 'Air Release Valve' } },
    { id: 'VLV-012', name: 'Valve - Emergency Supply', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0088, 17.6832] }, attributes: { size: '3"', type: 'Globe Valve' } },
    { id: 'TAP-001', name: 'Public Standpost (Ward 1)', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0042, 17.6850] }, attributes: { type: 'Public Tap', taps: 4 } },
    { id: 'TAP-002', name: 'Public Standpost (Ward 2)', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0095, 17.6842] }, attributes: { type: 'Public Tap', taps: 4 } },
    { id: 'TAP-003', name: 'Public Tap (Market Chowk)', type: 'valve', status: 'operational', location: { type: 'Point', coordinates: [74.0068, 17.6815] }, attributes: { type: 'Public Tap', taps: 6 } },
    { id: 'FLM-001', name: 'Ultrasonic Flow Meter (Main)', type: 'pump', status: 'operational', location: { type: 'Point', coordinates: [74.0068, 17.6832] }, attributes: { brand: 'Siemens', accuracy: '99.5%' } },
    { id: 'FLM-002', name: 'Digital Flow Meter (East)', type: 'pump', status: 'operational', location: { type: 'Point', coordinates: [74.0082, 17.6848] }, attributes: { brand: 'Krohne', accuracy: '99.2%' } }
  ],

  pipelines: [
    { id: 'PL-001', name: 'Main Intake Raw Water Line', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0075, 17.6840],[74.0073, 17.6828],[74.0070, 17.6830]] } },
    { id: 'PL-002', name: 'Main Transmission Line (100mm HDPE)', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0070, 17.6830],[74.0068, 17.6832],[74.0065, 17.6835]] } },
    { id: 'PL-003', name: 'Distribution Line A (West Ward)', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0065, 17.6835],[74.0060, 17.6840],[74.0050, 17.6830],[74.0040, 17.6835]] } },
    { id: 'PL-004', name: 'Distribution Line B (North East)', status: 'needs_attention', geometry: { type: 'LineString', coordinates: [[74.0065, 17.6835],[74.0072, 17.6855],[74.0080, 17.6845],[74.0090, 17.6850]] } },
    { id: 'PL-005', name: 'Distribution Line C (Market Sector)', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0070, 17.6830],[74.0068, 17.6815],[74.0080, 17.6820],[74.0085, 17.6820]] } },
    { id: 'PL-006', name: 'Sub-Distribution Line (South Reservoir)', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0055, 17.6820],[74.0060, 17.6805],[74.0055, 17.6808],[74.0050, 17.6812]] } },
    { id: 'PL-007', name: 'North Tank Trunk Line', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0072, 17.6855],[74.0080, 17.6865],[74.0078, 17.6870]] } },
    { id: 'PL-008', name: 'West Solar Borewell Feeder', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0035, 17.6845],[74.0038, 17.6838],[74.0042, 17.6850]] } },
    { id: 'PL-009', name: 'East School & Hospital Extension', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0080, 17.6845],[74.0088, 17.6832],[74.0095, 17.6842],[74.0100, 17.6840]] } },
    { id: 'PL-010', name: 'Scour & Flush Connection Line', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0085, 17.6820],[74.0092, 17.6810]] } },
    { id: 'PL-011', name: 'Sector B Secondary Ring Loop', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0050, 17.6830],[74.0045, 17.6818],[74.0055, 17.6820]] } },
    { id: 'PL-012', name: 'Market Chowk Main Supply Ring', status: 'operational', geometry: { type: 'LineString', coordinates: [[74.0065, 17.6835],[74.0068, 17.6815],[74.0050, 17.6812]] } },
  ],

  maintenance: [
    { id: 'mnt-001', asset_id: 'PMP-002', description: 'Motor overheating issue', status: 'reported',     priority: 'high',   created_at: '2026-08-18T09:00:00Z' },
    { id: 'mnt-002', asset_id: 'VLV-003', description: 'Valve not closing fully',  status: 'assigned',    priority: 'medium', created_at: '2026-08-17T10:00:00Z' },
    { id: 'mnt-003', asset_id: 'PMP-003', description: 'Pump seal replacement',    status: 'in_progress', priority: 'high',   created_at: '2026-08-16T08:00:00Z' },
    { id: 'mnt-004', asset_id: 'PL-003',  description: 'Pipeline joint leakage',   status: 'reported',    priority: 'medium', created_at: '2026-08-15T11:00:00Z' },
    { id: 'mnt-005', asset_id: 'PMP-001', description: 'Routine maintenance done', status: 'completed',   priority: 'low',    created_at: '2026-08-10T09:00:00Z' },
  ],

  inventory: [
    { id: 'INV-001', name: 'Chlorine',              category: 'chemical',    quantity: 18,  min_quantity: 10, unit: 'kg',    status: 'healthy' },
    { id: 'INV-002', name: 'Alum',                  category: 'chemical',    quantity: 45,  min_quantity: 20, unit: 'kg',    status: 'healthy' },
    { id: 'INV-003', name: 'Filter Media (Sand)',    category: 'filter',      quantity: 120, min_quantity: 50, unit: 'kg',    status: 'healthy' },
    { id: 'INV-004', name: 'Filter Media (Gravel)',  category: 'filter',      quantity: 80,  min_quantity: 30, unit: 'kg',    status: 'healthy' },
    { id: 'INV-005', name: 'Pump Seal Kit',          category: 'spare_part',  quantity: 3,   min_quantity: 2,  unit: 'units', status: 'healthy' },
    { id: 'INV-006', name: 'PVC Pipe 4"',            category: 'spare_part',  quantity: 12,  min_quantity: 6,  unit: 'm',     status: 'healthy' },
    { id: 'INV-007', name: 'Gate Valve 4"',          category: 'spare_part',  quantity: 1,   min_quantity: 2,  unit: 'units', status: 'low_stock' },
    { id: 'INV-008', name: 'Pressure Gauge',         category: 'spare_part',  quantity: 1,   min_quantity: 2,  unit: 'units', status: 'low_stock' },
    { id: 'INV-009', name: 'Bleaching Powder',       category: 'chemical',    quantity: 4,   min_quantity: 10, unit: 'kg',    status: 'replenishment_required' },
    { id: 'INV-010', name: 'Fuel (Diesel)',           category: 'supply',      quantity: 45,  min_quantity: 20, unit: 'L',     status: 'healthy' },
  ],

  finance: [
    { id: 'fin-001', type: 'receipt',      category: 'GP Grant',         amount: 20000, description: 'State govt grant Q2', date: '2026-08-01', payment_mode: 'neft' },
    { id: 'fin-002', type: 'receipt',      category: 'Water Bill Collection', amount: 15000, description: 'July bill collection', date: '2026-08-05', payment_mode: 'cash' },
    { id: 'fin-003', type: 'expenditure',  category: 'Maintenance',      amount: 3000,  description: 'Pump repair cost',    date: '2026-08-10', payment_mode: 'cash' },
    { id: 'fin-004', type: 'expenditure',  category: 'Consumables',      amount: 2500,  description: 'Chlorine purchase',   date: '2026-08-12', payment_mode: 'cash' },
    { id: 'fin-005', type: 'expenditure',  category: 'Electricity',      amount: 3000,  description: 'Electric bill Aug',   date: '2026-08-15', payment_mode: 'cheque' },
  ],

  consumers: Array.from({ length: 20 }, (_, i) => {
    const names = ['Ramesh Patil','Sunita Jadhav','Balaji Shinde','Rekha More','Ganesh Kadam',
      'Lakshmi Pawar','Vijay Deshmukh','Meena Kulkarni','Suresh Bhosale','Priya Salunkhe',
      'Arun Kale','Savita Mane','Rohit Gaikwad','Pooja Nair','Dilip Thorat',
      'Kavita Waghmare','Santosh Pande','Varsha Chitnis','Mahesh Deshpande','Uma Bapat'];
    return {
      id: `CON-${String(i+1).padStart(4,'0')}`,
      name: names[i],
      address: `Ward ${Math.ceil((i+1)/4)}, Koregaon`,
      phone: `98${String(70000000 + i*111).padStart(8,'0')}`,
      status: 'active',
      monthly_rate: 100,
    };
  }),

  bills: Array.from({ length: 20 }, (_, i) => ({
    id: `BILL-AUG26-${String(i+1).padStart(3,'0')}`,
    consumer_id: `CON-${String(i+1).padStart(4,'0')}`,
    amount: 100,
    billing_period: 'August 2026',
    due_date: '2026-08-31',
    status: i < 14 ? 'paid' : i < 19 ? 'pending' : 'overdue',
    created_at: '2026-08-01T00:00:00Z',
  })),
};

module.exports = mockData;
