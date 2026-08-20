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
    assets: { total: 12, operational: 9, needs_attention: 2, under_maintenance: 1, non_operational: 0 },
    maintenance: { total: 11, reported: 2, assigned: 1, in_progress: 1, completed: 7, open: 3 },
    inventory: { total: 10, low_stock: 2, replenishment_required: 1 },
    finance: { total_receipts: 35000, total_expenditure: 8500, balance: 26500 },
    bills: { total: 20, paid: 14, pending: 5, overdue: 1, pending_amount: 900 },
  },

  assets: [
    { id: 'PMP-001', name: 'Pump Station 1',    type: 'pump',            status: 'operational',      location: { type: 'Point', coordinates: [74.0075, 17.6840] }, attributes: { capacity: '50 LPM', motor: '3HP', year: 2020 } },
    { id: 'PMP-002', name: 'Pump Station 2',    type: 'pump',            status: 'needs_attention',  location: { type: 'Point', coordinates: [74.0055, 17.6820] }, attributes: { capacity: '40 LPM', motor: '2HP', year: 2019 } },
    { id: 'PMP-003', name: 'Pump Station 3',    type: 'pump',            status: 'under_maintenance',location: { type: 'Point', coordinates: [74.0090, 17.6850] }, attributes: { capacity: '60 LPM', motor: '5HP', year: 2021 } },
    { id: 'WTP-001', name: 'Water Treatment Plant', type: 'treatment_plant', status: 'operational', location: { type: 'Point', coordinates: [74.0070, 17.6830] }, attributes: { capacity: '50 KLD', year: 2018 } },
    { id: 'STK-001', name: 'Overhead Tank',     type: 'storage_tank',   status: 'operational',      location: { type: 'Point', coordinates: [74.0065, 17.6835] }, attributes: { capacity: '1,00,000 L', year: 2018 } },
    { id: 'VLV-001', name: 'Valve - Main Gate', type: 'valve',          status: 'operational',      location: { type: 'Point', coordinates: [74.0060, 17.6840] }, attributes: { size: '4"', type: 'Gate Valve' } },
    { id: 'VLV-002', name: 'Valve - Sector A',  type: 'valve',          status: 'operational',      location: { type: 'Point', coordinates: [74.0050, 17.6830] }, attributes: { size: '3"', type: 'Gate Valve' } },
    { id: 'VLV-003', name: 'Valve - Sector B',  type: 'valve',          status: 'needs_attention',  location: { type: 'Point', coordinates: [74.0080, 17.6845] }, attributes: { size: '3"', type: 'Butterfly Valve' } },
    { id: 'VLV-004', name: 'Valve - Sector C',  type: 'valve',          status: 'operational',      location: { type: 'Point', coordinates: [74.0085, 17.6820] }, attributes: { size: '2"', type: 'Gate Valve' } },
    { id: 'VLV-005', name: 'Valve - Junction 1',type: 'valve',          status: 'operational',      location: { type: 'Point', coordinates: [74.0072, 17.6855] }, attributes: { size: '4"', type: 'Sluice Valve' } },
    { id: 'VLV-006', name: 'Valve - Junction 2',type: 'valve',          status: 'operational',      location: { type: 'Point', coordinates: [74.0045, 17.6818] }, attributes: { size: '3"', type: 'Gate Valve' } },
    { id: 'VLV-007', name: 'Valve - End Point', type: 'valve',          status: 'operational',      location: { type: 'Point', coordinates: [74.0092, 17.6810] }, attributes: { size: '2"', type: 'Stop Valve' } },
  ],

  pipelines: [
    { id: 'PL-001', name: 'Main Transmission Line', status: 'operational',      geometry: { type: 'LineString', coordinates: [[74.0070, 17.6830],[74.0075, 17.6840],[74.0065, 17.6835]] } },
    { id: 'PL-002', name: 'Distribution Line A',    status: 'operational',      geometry: { type: 'LineString', coordinates: [[74.0065, 17.6835],[74.0055, 17.6830],[74.0050, 17.6830]] } },
    { id: 'PL-003', name: 'Distribution Line B',    status: 'needs_attention',  geometry: { type: 'LineString', coordinates: [[74.0065, 17.6835],[74.0072, 17.6845],[74.0080, 17.6845]] } },
    { id: 'PL-004', name: 'Distribution Line C',    status: 'operational',      geometry: { type: 'LineString', coordinates: [[74.0070, 17.6830],[74.0080, 17.6820],[74.0085, 17.6820]] } },
    { id: 'PL-005', name: 'Sub-Distribution Line',  status: 'operational',      geometry: { type: 'LineString', coordinates: [[74.0055, 17.6820],[74.0055, 17.6810],[74.0092, 17.6810]] } },
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
