-- Seed script
INSERT INTO users (id, username, password_hash, role) VALUES
('a1b2c3d4-0001-0001-0001-000000000001', 'admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImJcSR0K', 'gp_admin'),
('a1b2c3d4-0001-0001-0001-000000000002', 'operator1', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImJcSR0K', 'operator'),
('a1b2c3d4-0001-0001-0001-000000000003', 'phed1', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImJcSR0K', 'phed');

INSERT INTO assets (id, name, type, status, location) VALUES
('PMP-001', 'Main Pump 1', 'pump', 'operational', ST_SetSRID(ST_MakePoint(74.0075, 17.6840), 4326)),
('PMP-002', 'Backup Pump', 'pump', 'needs_attention', ST_SetSRID(ST_MakePoint(74.0055, 17.6820), 4326)),
('PMP-003', 'North Pump', 'pump', 'under_maintenance', ST_SetSRID(ST_MakePoint(74.0090, 17.6850), 4326)),
('WTP-001', 'Water Treatment Plant', 'treatment_plant', 'operational', ST_SetSRID(ST_MakePoint(74.0070, 17.6830), 4326)),
('STK-001', 'Overhead Tank', 'storage_tank', 'operational', ST_SetSRID(ST_MakePoint(74.0065, 17.6835), 4326)),
('VLV-001', 'Valve 1', 'valve', 'operational', ST_SetSRID(ST_MakePoint(74.0060, 17.6830), 4326)),
('VLV-002', 'Valve 2', 'valve', 'operational', ST_SetSRID(ST_MakePoint(74.0080, 17.6840), 4326)),
('VLV-003', 'Valve 3', 'valve', 'needs_attention', ST_SetSRID(ST_MakePoint(74.0050, 17.6810), 4326));

INSERT INTO inventory (id, name, category, quantity, min_quantity, unit) VALUES
('INV-001', 'Chlorine', 'chemical', 18, 10, 'kg'),
('INV-002', 'Alum', 'chemical', 45, 20, 'kg'),
('INV-003', 'Filter Media (Sand)', 'filter', 120, 50, 'kg'),
('INV-004', 'Filter Media (Gravel)', 'filter', 80, 30, 'kg'),
('INV-005', 'Pump Seal Kit', 'spare_part', 3, 2, 'units'),
('INV-006', 'PVC Pipe 4"', 'spare_part', 12, 6, 'm'),
('INV-007', 'Gate Valve 4"', 'spare_part', 2, 1, 'units'),
('INV-008', 'Pressure Gauge', 'spare_part', 1, 2, 'units'),
('INV-009', 'Bleaching Powder', 'chemical', 8, 10, 'kg'),
('INV-010', 'Fuel (Diesel)', 'supply', 45, 20, 'L');

INSERT INTO consumers (id, name, address, phone) VALUES
('CON-0001', 'Ramesh Patil', 'Main Road, Koregaon', '9876543210'),
('CON-0002', 'Suresh Kadam', 'Shivaji Nagar, Koregaon', '9876543211'),
('CON-0003', 'Anil Desai', 'Shaniwar Peth, Koregaon', '9876543212'),
('CON-0004', 'Sunil Jadhav', 'Raviwar Peth, Koregaon', '9876543213');

INSERT INTO bills (consumer_id, amount, billing_month, due_date, status) VALUES
('CON-0001', 150, '2026-08-01', '2026-08-15', 'paid'),
('CON-0002', 150, '2026-08-01', '2026-08-15', 'pending'),
('CON-0003', 150, '2026-08-01', '2026-08-15', 'overdue');
