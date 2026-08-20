const getConsumers = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      let list = mock.consumers;
      if (req.query.search) {
        const s = req.query.search.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(s) || c.id.toLowerCase().includes(s) || (c.address && c.address.toLowerCase().includes(s)));
      }
      return res.json(list);
    }
    const db = require('../db/connection');
    const { search, status } = req.query;
    let query = 'SELECT * FROM consumers WHERE 1=1';
    const params = [];
    if (search) { params.push(`%${search}%`); query += ` AND name ILIKE $${params.length}`; }
    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    query += ' ORDER BY name ASC';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) { next(error); }
};

const getConsumerById = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const c = mock.consumers.find(c => c.id === req.params.id);
      if (!c) return res.status(404).json({ message: 'Consumer not found' });
      const bills = mock.bills.filter(b => b.consumer_id === req.params.id);
      return res.json({ ...c, bills });
    }
    const db = require('../db/connection');
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM consumers WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Consumer not found' });
    const bills = await db.query('SELECT * FROM bills WHERE consumer_id = $1 ORDER BY billing_month DESC', [id]);
    const consumer = rows[0];
    consumer.bills = bills.rows;
    res.json(consumer);
  } catch (error) { next(error); }
};

const createConsumer = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const newConsumer = {
        id: `CON-${String(mock.consumers.length + 1).padStart(4, '0')}`,
        name: req.body.name,
        address: req.body.address || 'Ward 1, Koregaon',
        phone: req.body.phone || '9870000000',
        status: 'active',
        monthly_rate: req.body.monthly_rate || 100
      };
      mock.consumers.push(newConsumer);
      return res.status(201).json(newConsumer);
    }
    const db = require('../db/connection');
    const { id, name, address, phone } = req.body;
    const { rows } = await db.query(
      'INSERT INTO consumers (id, name, address, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, address, phone]
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

const updateConsumer = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const c = mock.consumers.find(c => c.id === req.params.id);
      if (!c) return res.status(404).json({ message: 'Consumer not found' });
      Object.assign(c, req.body);
      return res.json(c);
    }
    const db = require('../db/connection');
    const { id } = req.params;
    const { name, address, phone, status } = req.body;
    const { rows } = await db.query(
      'UPDATE consumers SET name = $1, address = $2, phone = $3, status = $4 WHERE id = $5 RETURNING *',
      [name, address, phone, status, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Consumer not found' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

module.exports = { getConsumers, getConsumerById, createConsumer, updateConsumer };
