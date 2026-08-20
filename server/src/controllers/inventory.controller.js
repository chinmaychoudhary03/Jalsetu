const getInventory = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      return res.json(mock.inventory);
    }
    const db = require('../db/connection');
    const { rows } = await db.query('SELECT * FROM inventory ORDER BY name ASC');
    res.json(rows);
  } catch (error) { next(error); }
};

const getInventoryById = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const item = mock.inventory.find(i => i.id === req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.json({ ...item, recent_transactions: [] });
    }
    const db = require('../db/connection');
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM inventory WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Item not found' });
    const tx = await db.query('SELECT * FROM inventory_transactions WHERE inventory_id = $1 ORDER BY created_at DESC LIMIT 10', [id]);
    const item = rows[0];
    item.recent_transactions = tx.rows;
    res.json(item);
  } catch (error) { next(error); }
};

const addInventory = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const newItem = { ...req.body, status: 'healthy' };
      mock.inventory.push(newItem);
      return res.status(201).json(newItem);
    }
    const db = require('../db/connection');
    const { id, name, category, quantity, min_quantity, unit } = req.body;
    const { rows } = await db.query(
      'INSERT INTO inventory (id, name, category, quantity, min_quantity, unit) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, name, category, quantity, min_quantity, unit]
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

const updateInventory = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const idx = mock.inventory.findIndex(i => i.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Item not found' });
      mock.inventory[idx] = { ...mock.inventory[idx], ...req.body };
      return res.json(mock.inventory[idx]);
    }
    const db = require('../db/connection');
    const { id } = req.params;
    const { name, category, quantity, min_quantity, unit } = req.body;
    const { rows } = await db.query(
      'UPDATE inventory SET name = $1, category = $2, quantity = $3, min_quantity = $4, unit = $5 WHERE id = $6 RETURNING *',
      [name, category, quantity, min_quantity, unit, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Item not found' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

const recordTransaction = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const item = mock.inventory.find(i => i.id === req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      const { type, quantity } = req.body;
      const q = Number(quantity);
      item.quantity = type === 'in' ? Number(item.quantity) + q : Number(item.quantity) - q;
      if (item.quantity <= 0 || item.quantity <= item.min_quantity * 0.5) {
        item.status = 'replenishment_required';
      } else if (item.quantity < item.min_quantity) {
        item.status = 'low_stock';
      } else {
        item.status = 'healthy';
      }
      return res.status(201).json({ id: `tx-${Date.now()}`, type, quantity: q, remarks: req.body.remarks });
    }
    const db = require('../db/connection');
    const { id } = req.params;
    const { type, quantity, remarks } = req.body;
    await db.query('BEGIN');
    const tx = await db.query(
      'INSERT INTO inventory_transactions (inventory_id, type, quantity, remarks) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, type, quantity, remarks]
    );
    const updateQty = type === 'in' ? quantity : -quantity;
    await db.query('UPDATE inventory SET quantity = quantity + $1 WHERE id = $2', [updateQty, id]);
    await db.query('COMMIT');
    res.status(201).json(tx.rows[0]);
  } catch (error) {
    if (global.DB_AVAILABLE) {
      const db = require('../db/connection');
      await db.query('ROLLBACK');
    }
    next(error);
  }
};

const getLowStock = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      return res.json(mock.inventory.filter(i => i.status === 'low_stock' || i.status === 'replenishment_required'));
    }
    const db = require('../db/connection');
    const { rows } = await db.query('SELECT * FROM inventory WHERE quantity < min_quantity');
    res.json(rows);
  } catch (error) { next(error); }
};

const getReplenishment = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      return res.json(mock.inventory.filter(i => i.status === 'replenishment_required'));
    }
    const db = require('../db/connection');
    const { rows } = await db.query('SELECT *, (min_quantity * 2 - quantity) as recommended_order FROM inventory WHERE quantity <= min_quantity');
    res.json(rows);
  } catch (error) { next(error); }
};

module.exports = { getInventory, getInventoryById, addInventory, updateInventory, recordTransaction, getLowStock, getReplenishment };
