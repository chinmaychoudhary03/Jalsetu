require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const assetsRoutes = require('./routes/assets.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const financeRoutes = require('./routes/finance.routes');
const consumersRoutes = require('./routes/consumers.routes');
const billingRoutes = require('./routes/billing.routes');
const paymentsRoutes = require('./routes/payments.routes');

const { errorHandler } = require('./middleware/error.middleware');
const mockData = require('./db/mockData');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ─── Health ping (used by offline detection Layer 3) ────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), mode: global.DB_AVAILABLE ? 'database' : 'mock' });
});

// ─── Mount real API routes ───────────────────────────────────────────────────
app.use('/api/v1/auth',       authRoutes);
app.use('/api/v1/dashboard',  dashboardRoutes);
app.use('/api/v1/assets',     assetsRoutes);
app.use('/api/v1/maintenance',maintenanceRoutes);
app.use('/api/v1/inventory',  inventoryRoutes);
app.use('/api/v1/finance',    financeRoutes);
app.use('/api/v1/consumers',  consumersRoutes);
app.use('/api/v1/bills',      billingRoutes);
app.use('/api/v1/payments',   paymentsRoutes);

app.use(errorHandler);

// ─── Start server + test DB connection ──────────────────────────────────────
const PORT = process.env.PORT || 3001;

async function startServer() {
  // Test DB connection
  try {
    const db = require('./db/connection');
    await db.query('SELECT 1');
    global.DB_AVAILABLE = true;
    console.log('✅ Database connected (PostgreSQL)');
  } catch (err) {
    global.DB_AVAILABLE = false;
    console.warn('⚠️  Database not available — running in MOCK DATA mode');
    console.warn('   To use real DB: start Docker Desktop, then run: docker-compose up -d postgres');
    console.warn('   Then restart the server.');

    // Override controllers with mock implementations
    setupMockRoutes(app, mockData);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 JJM Jalsetu server running on http://localhost:${PORT}`);
    console.log(`   Mode: ${global.DB_AVAILABLE ? '🗄️  PostgreSQL Database' : '📦 Mock Data (no DB needed)'}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  });
}

/**
 * Mount mock route handlers that bypass the DB entirely.
 * These override the real routes only when DB is unavailable.
 */
function setupMockRoutes(app, mock) {
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'jalsathi_super_secret_jwt_key';

  // AUTH — mock login
  app.post('/api/v1/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = mock.users.find(u => u.username === username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  });

  app.get('/api/v1/auth/me', (req, res) => {
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(401).json({ message: 'No token' });
    try {
      const payload = jwt.verify(auth, JWT_SECRET);
      const user = mock.users.find(u => u.id === payload.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password_hash, ...safeUser } = user;
      res.json(safeUser);
    } catch { res.status(401).json({ message: 'Invalid token' }); }
  });

  // DASHBOARD
  app.get('/api/v1/dashboard/stats', (req, res) => res.json(mock.dashboardStats));

  // ASSETS
  app.get('/api/v1/assets/geojson', (req, res) => {
    const features = [
      ...mock.assets.map(a => ({
        type: 'Feature',
        geometry: a.location,
        properties: { id: a.id, name: a.name, type: a.type, status: a.status }
      })),
      ...mock.pipelines.map(p => ({
        type: 'Feature',
        geometry: p.geometry,
        properties: { id: p.id, name: p.name, type: 'pipeline', status: p.status }
      })),
    ];
    res.json({ type: 'FeatureCollection', features });
  });

  app.get('/api/v1/assets', (req, res) => {
    let assets = mock.assets;
    if (req.query.type)   assets = assets.filter(a => a.type === req.query.type);
    if (req.query.status) assets = assets.filter(a => a.status === req.query.status);
    res.json(assets);
  });

  app.get('/api/v1/assets/:id', (req, res) => {
    const asset = mock.assets.find(a => a.id === req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    const history = mock.maintenance.filter(m => m.asset_id === req.params.id);
    res.json({ ...asset, maintenance_history: history });
  });

  // MAINTENANCE
  app.get('/api/v1/maintenance', (req, res) => res.json(mock.maintenance));
  app.get('/api/v1/maintenance/:id', (req, res) => {
    const item = mock.maintenance.find(m => m.id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  });
  app.post('/api/v1/maintenance', (req, res) => {
    const newItem = { id: `mnt-${Date.now()}`, ...req.body, status: 'reported', created_at: new Date().toISOString() };
    mock.maintenance.push(newItem);
    res.status(201).json(newItem);
  });
  app.put('/api/v1/maintenance/:id/status', (req, res) => {
    const item = mock.maintenance.find(m => m.id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    item.status = req.body.status;
    res.json(item);
  });

  // INVENTORY
  app.get('/api/v1/inventory', (req, res) => res.json(mock.inventory));
  app.get('/api/v1/inventory/low-stock', (req, res) =>
    res.json(mock.inventory.filter(i => i.status === 'low_stock' || i.status === 'replenishment_required'))
  );
  app.get('/api/v1/inventory/:id', (req, res) => {
    const item = mock.inventory.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ ...item, transactions: [] });
  });
  app.post('/api/v1/inventory/:id/transaction', (req, res) => {
    const item = mock.inventory.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const { type, quantity } = req.body;
    item.quantity = type === 'in' ? item.quantity + Number(quantity) : item.quantity - Number(quantity);
    res.json(item);
  });

  // FINANCE
  app.get('/api/v1/finance/transactions', (req, res) => res.json(mock.finance));
  app.get('/api/v1/finance/balance', (req, res) => res.json(mock.dashboardStats.finance));
  app.get('/api/v1/finance/cashbook', (req, res) => {
    let balance = 0;
    const cashbook = mock.finance.map(t => {
      balance += t.type === 'receipt' ? t.amount : -t.amount;
      return { ...t, running_balance: balance };
    });
    res.json(cashbook);
  });
  app.post('/api/v1/finance/receipt', (req, res) => {
    const t = { id: `fin-${Date.now()}`, type: 'receipt', ...req.body, created_at: new Date().toISOString() };
    mock.finance.push(t);
    mock.dashboardStats.finance.total_receipts += Number(req.body.amount);
    mock.dashboardStats.finance.balance += Number(req.body.amount);
    res.status(201).json(t);
  });
  app.post('/api/v1/finance/expenditure', (req, res) => {
    const t = { id: `fin-${Date.now()}`, type: 'expenditure', ...req.body, created_at: new Date().toISOString() };
    mock.finance.push(t);
    mock.dashboardStats.finance.total_expenditure += Number(req.body.amount);
    mock.dashboardStats.finance.balance -= Number(req.body.amount);
    res.status(201).json(t);
  });

  // CONSUMERS
  app.get('/api/v1/consumers', (req, res) => {
    let list = mock.consumers;
    if (req.query.search) {
      const s = req.query.search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(s) || c.id.toLowerCase().includes(s));
    }
    res.json(list);
  });
  app.get('/api/v1/consumers/:id', (req, res) => {
    const c = mock.consumers.find(c => c.id === req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    const bills = mock.bills.filter(b => b.consumer_id === req.params.id);
    res.json({ ...c, bills });
  });

  // BILLING
  app.get('/api/v1/bills', (req, res) => {
    let list = mock.bills;
    if (req.query.status) list = list.filter(b => b.status === req.query.status);
    if (req.query.consumer_id) list = list.filter(b => b.consumer_id === req.query.consumer_id);
    res.json(list);
  });
  app.get('/api/v1/bills/:id', (req, res) => {
    const bill = mock.bills.find(b => b.id === req.params.id);
    if (!bill) return res.status(404).json({ message: 'Not found' });
    const consumer = mock.consumers.find(c => c.id === bill.consumer_id);
    res.json({ ...bill, consumer });
  });
  app.post('/api/v1/bills', (req, res) => {
    const bill = { id: `BILL-${Date.now()}`, status: 'pending', ...req.body, created_at: new Date().toISOString() };
    mock.bills.push(bill);
    res.status(201).json(bill);
  });

  // PAYMENTS — mock order creation
  app.post('/api/v1/payments/create-order', (req, res) => {
    res.json({ order_id: `order_mock_${Date.now()}`, amount: req.body.amount, currency: 'INR', key: process.env.RAZORPAY_KEY_ID });
  });
  app.post('/api/v1/payments/verify', (req, res) => {
    const { bill_id } = req.body;
    const bill = mock.bills.find(b => b.id === bill_id);
    if (bill) bill.status = 'paid';
    res.json({ success: true, transaction_id: `TXNMOCK${Date.now()}` });
  });

  console.log('📦 Mock routes registered — all endpoints active without database');
}

startServer();
