const getBills = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      let list = mock.bills;
      if (req.query.status && req.query.status !== 'all') {
        list = list.filter(b => b.status === req.query.status);
      }
      if (req.query.consumer_id) {
        list = list.filter(b => b.consumer_id === req.query.consumer_id);
      }
      return res.json(list.map(b => {
        const consumer = mock.consumers.find(c => c.id === b.consumer_id);
        return { ...b, consumer };
      }));
    }
    const db = require('../db/connection');
    const { status, consumer_id } = req.query;
    let query = 'SELECT b.*, c.name as consumer_name FROM bills b JOIN consumers c ON b.consumer_id = c.id WHERE 1=1';
    const params = [];
    if (status && status !== 'all') { params.push(status); query += ` AND b.status = $${params.length}`; }
    if (consumer_id) { params.push(consumer_id); query += ` AND b.consumer_id = $${params.length}`; }
    query += ' ORDER BY b.due_date DESC';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) { next(error); }
};

const getBillById = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const bill = mock.bills.find(b => b.id === req.params.id);
      if (!bill) return res.status(404).json({ message: 'Bill not found' });
      const consumer = mock.consumers.find(c => c.id === bill.consumer_id);
      return res.json({ ...bill, consumer });
    }
    const db = require('../db/connection');
    const { id } = req.params;
    const { rows } = await db.query('SELECT b.*, c.name as consumer_name FROM bills b JOIN consumers c ON b.consumer_id = c.id WHERE b.id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Bill not found' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

const generateBill = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const newBill = {
        id: `BILL-${Date.now().toString().slice(-6)}`,
        consumer_id: req.body.consumer_id,
        amount: Number(req.body.amount || 100),
        billing_period: req.body.billing_month || 'August 2026',
        due_date: req.body.due_date || '2026-08-31',
        status: 'pending',
        created_at: new Date().toISOString()
      };
      mock.bills.unshift(newBill);
      mock.dashboardStats.bills.pending += 1;
      mock.dashboardStats.bills.total += 1;
      mock.dashboardStats.bills.pending_amount += newBill.amount;
      return res.status(201).json(newBill);
    }
    const db = require('../db/connection');
    const { consumer_id, amount, billing_month, due_date } = req.body;
    const { rows } = await db.query(
      'INSERT INTO bills (consumer_id, amount, billing_month, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [consumer_id, amount, billing_month, due_date]
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

const generateBulkBills = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const month = req.body.month || 'August 2026';
      const activeConsumers = mock.consumers.filter(c => c.status === 'active');
      const newBills = activeConsumers.map((c, idx) => ({
        id: `BILL-AUG26-BULK-${idx + 1}`,
        consumer_id: c.id,
        amount: c.monthly_rate || 100,
        billing_period: month,
        due_date: '2026-08-31',
        status: 'pending',
        created_at: new Date().toISOString()
      }));
      mock.bills.unshift(...newBills);
      mock.dashboardStats.bills.pending += newBills.length;
      mock.dashboardStats.bills.total += newBills.length;
      mock.dashboardStats.bills.pending_amount += newBills.length * 100;
      return res.status(201).json({ count: newBills.length, bills: newBills });
    }
    const db = require('../db/connection');
    const { amount, billing_month, due_date } = req.body;
    const consumers = await db.query('SELECT id FROM consumers WHERE status = $1', ['active']);
    await db.query('BEGIN');
    const generated = [];
    for (const c of consumers.rows) {
      const { rows } = await db.query(
        'INSERT INTO bills (consumer_id, amount, billing_month, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [c.id, amount, billing_month, due_date]
      );
      generated.push(rows[0]);
    }
    await db.query('COMMIT');
    res.status(201).json({ count: generated.length, bills: generated });
  } catch (error) {
    if (global.DB_AVAILABLE) {
      const db = require('../db/connection');
      await db.query('ROLLBACK');
    }
    next(error);
  }
};

module.exports = { getBills, getBillById, generateBill, generateBulkBills };
