const getMaintenance = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      let list = mock.maintenance;
      if (req.query.status && req.query.status !== 'all') {
        list = list.filter(m => m.status === req.query.status);
      }
      if (req.query.asset_id) {
        list = list.filter(m => m.asset_id === req.query.asset_id);
      }
      return res.json(list);
    }
    const db = require('../db/connection');
    const { status, asset_id } = req.query;
    let query = 'SELECT m.*, a.name as asset_name FROM maintenance m JOIN assets a ON m.asset_id = a.id WHERE 1=1';
    const params = [];
    if (status && status !== 'all') { params.push(status); query += ` AND m.status = $${params.length}`; }
    if (asset_id) { params.push(asset_id); query += ` AND m.asset_id = $${params.length}`; }
    query += ' ORDER BY m.created_at DESC';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) { next(error); }
};

const getMaintenanceById = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const item = mock.maintenance.find(m => m.id === req.params.id);
      if (!item) return res.status(404).json({ message: 'Record not found' });
      return res.json(item);
    }
    const db = require('../db/connection');
    const { id } = req.params;
    const { rows } = await db.query('SELECT m.*, a.name as asset_name FROM maintenance m JOIN assets a ON m.asset_id = a.id WHERE m.id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Record not found' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

const reportIssue = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const newItem = {
        id: `mnt-${Date.now()}`,
        asset_id: req.body.asset_id,
        description: req.body.description,
        priority: req.body.priority || 'high',
        status: 'reported',
        assigned_to: req.body.assigned_to || 'Suresh Jadhav',
        created_at: new Date().toISOString()
      };
      mock.maintenance.unshift(newItem);
      mock.dashboardStats.maintenance.reported += 1;
      mock.dashboardStats.maintenance.open += 1;
      mock.dashboardStats.maintenance.total += 1;

      // Update asset status to needs_attention or under_maintenance
      const asset = mock.assets.find(a => a.id === req.body.asset_id);
      if (asset) asset.status = 'needs_attention';

      return res.status(201).json(newItem);
    }
    const db = require('../db/connection');
    const { asset_id, description } = req.body;
    const reported_by = req.user.id;
    const { rows } = await db.query(
      'INSERT INTO maintenance (asset_id, description, reported_by) VALUES ($1, $2, $3) RETURNING *',
      [asset_id, description, reported_by]
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

const updateMaintenanceStatus = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const item = mock.maintenance.find(m => m.id === req.params.id);
      if (!item) return res.status(404).json({ message: 'Record not found' });
      item.status = req.body.status;
      return res.json(item);
    }
    const db = require('../db/connection');
    const { id } = req.params;
    const { status } = req.body;
    const { rows } = await db.query(
      'UPDATE maintenance SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Record not found' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

module.exports = { getMaintenance, getMaintenanceById, reportIssue, updateMaintenanceStatus };
