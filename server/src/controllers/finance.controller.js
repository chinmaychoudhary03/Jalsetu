const getTransactions = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      let list = mock.finance;
      if (req.query.type) list = list.filter(t => t.type === req.query.type);
      return res.json(list);
    }
    const db = require('../db/connection');
    const { type, from } = req.query;
    let query = 'SELECT * FROM finance_transactions WHERE 1=1';
    const params = [];
    if (type) { params.push(type); query += ` AND type = $${params.length}`; }
    if (from) { params.push(from); query += ` AND date >= $${params.length}`; }
    query += ' ORDER BY date DESC, created_at DESC';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) { next(error); }
};

const recordReceipt = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const amt = Number(req.body.amount);
      const newTx = {
        id: `fin-${Date.now()}`,
        type: 'receipt',
        category: req.body.category || 'GP Grant',
        amount: amt,
        description: req.body.description,
        date: req.body.date || new Date().toISOString().split('T')[0],
        payment_mode: req.body.payment_mode || 'neft'
      };
      mock.finance.push(newTx);
      mock.dashboardStats.finance.total_receipts += amt;
      mock.dashboardStats.finance.balance += amt;
      return res.status(201).json(newTx);
    }
    const db = require('../db/connection');
    const { amount, description, date } = req.body;
    const { rows } = await db.query(
      'INSERT INTO finance_transactions (type, amount, description, date) VALUES ($1, $2, $3, $4) RETURNING *',
      ['receipt', amount, description, date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

const recordExpenditure = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const amt = Number(req.body.amount);
      const newTx = {
        id: `fin-${Date.now()}`,
        type: 'expenditure',
        category: req.body.category || 'Maintenance',
        amount: amt,
        description: req.body.description,
        date: req.body.date || new Date().toISOString().split('T')[0],
        payment_mode: req.body.payment_mode || 'cash'
      };
      mock.finance.push(newTx);
      mock.dashboardStats.finance.total_expenditure += amt;
      mock.dashboardStats.finance.balance -= amt;
      return res.status(201).json(newTx);
    }
    const db = require('../db/connection');
    const { amount, description, date } = req.body;
    const { rows } = await db.query(
      'INSERT INTO finance_transactions (type, amount, description, date) VALUES ($1, $2, $3, $4) RETURNING *',
      ['expenditure', amount, description, date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

const getCashbook = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      let balance = 0;
      const cashbook = mock.finance.map(t => {
        balance += t.type === 'receipt' ? Number(t.amount) : -Number(t.amount);
        return { ...t, running_balance: balance };
      });
      return res.json(cashbook);
    }
    const db = require('../db/connection');
    const { rows } = await db.query(`
      SELECT date, 
             SUM(CASE WHEN type = 'receipt' THEN amount ELSE 0 END) as receipts,
             SUM(CASE WHEN type = 'expenditure' THEN amount ELSE 0 END) as expenditures
      FROM finance_transactions 
      GROUP BY date 
      ORDER BY date ASC
    `);
    let runningBalance = 0;
    const cashbook = rows.map(r => {
      runningBalance += (parseFloat(r.receipts) - parseFloat(r.expenditures));
      return { ...r, balance: runningBalance };
    });
    res.json(cashbook);
  } catch (error) { next(error); }
};

const getBalance = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      return res.json(mock.dashboardStats.finance);
    }
    const db = require('../db/connection');
    const { rows } = await db.query(`
      SELECT 
        SUM(CASE WHEN type = 'receipt' THEN amount ELSE 0 END) as total_receipts,
        SUM(CASE WHEN type = 'expenditure' THEN amount ELSE 0 END) as total_expenditures
      FROM finance_transactions
    `);
    const receipts = parseFloat(rows[0].total_receipts || 0);
    const expenditures = parseFloat(rows[0].total_expenditures || 0);
    res.json({ balance: receipts - expenditures, total_receipts: receipts, total_expenditure: expenditures });
  } catch (error) { next(error); }
};

module.exports = { getTransactions, recordReceipt, recordExpenditure, getCashbook, getBalance };
