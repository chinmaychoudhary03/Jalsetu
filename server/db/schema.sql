CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('gp_admin', 'gp_user', 'phed', 'operator')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    location GEOMETRY(Point, 4326),
    attributes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pipelines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    path GEOMETRY(LineString, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id VARCHAR(50) REFERENCES assets(id),
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'reported',
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity NUMERIC NOT NULL,
    min_quantity NUMERIC NOT NULL,
    unit VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id VARCHAR(50) REFERENCES inventory(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out')),
    quantity NUMERIC NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consumers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consumer_id VARCHAR(50) REFERENCES consumers(id),
    amount NUMERIC NOT NULL,
    billing_month DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE finance_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('receipt', 'expenditure')),
    amount NUMERIC NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
