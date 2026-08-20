const getAssetsGeoJSON = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const features = [
        ...mock.assets.map(a => ({ type: 'Feature', geometry: a.location, properties: { id: a.id, name: a.name, type: a.type, status: a.status } })),
        ...mock.pipelines.map(p => ({ type: 'Feature', geometry: p.geometry, properties: { id: p.id, name: p.name, type: 'pipeline', status: p.status } })),
      ];
      return res.json({ type: 'FeatureCollection', features });
    }
    const db = require('../db/connection');
    const [assets, pipelines] = await Promise.all([
      db.query('SELECT id, name, type, status, ST_AsGeoJSON(location) as geometry FROM assets'),
      db.query('SELECT id, name, status, ST_AsGeoJSON(path) as geometry FROM pipelines'),
    ]);
    const features = [];
    assets.rows.forEach(r => { if (r.geometry) features.push({ type: 'Feature', geometry: JSON.parse(r.geometry), properties: { id: r.id, name: r.name, type: r.type, status: r.status } }); });
    pipelines.rows.forEach(r => { if (r.geometry) features.push({ type: 'Feature', geometry: JSON.parse(r.geometry), properties: { id: r.id, name: r.name, type: 'pipeline', status: r.status } }); });
    res.json({ type: 'FeatureCollection', features });
  } catch (error) { next(error); }
};

const getAssets = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      let assets = mock.assets;
      if (req.query.type) assets = assets.filter(a => a.type === req.query.type);
      if (req.query.status) assets = assets.filter(a => a.status === req.query.status);
      return res.json(assets);
    }
    const db = require('../db/connection');
    const { type, status } = req.query;
    let query = 'SELECT id, name, type, status, ST_AsGeoJSON(location) as location, attributes, created_at FROM assets WHERE 1=1';
    const params = [];
    if (type)   { params.push(type);   query += ` AND type = $${params.length}`; }
    if (status) { params.push(status); query += ` AND status = $${params.length}`; }
    const { rows } = await db.query(query, params);
    res.json(rows.map(r => ({ ...r, location: JSON.parse(r.location) })));
  } catch (error) { next(error); }
};

const getAssetById = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const asset = mock.assets.find(a => a.id === req.params.id);
      if (!asset) return res.status(404).json({ message: 'Asset not found' });
      const history = mock.maintenance.filter(m => m.asset_id === req.params.id);
      return res.json({ ...asset, maintenance_history: history });
    }
    const db = require('../db/connection');
    const { rows } = await db.query('SELECT id, name, type, status, ST_AsGeoJSON(location) as location, attributes, created_at FROM assets WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Asset not found' });
    const asset = { ...rows[0], location: JSON.parse(rows[0].location) };
    const mRows = await db.query('SELECT * FROM maintenance WHERE asset_id = $1 ORDER BY created_at DESC', [req.params.id]);
    asset.maintenance_history = mRows.rows;
    res.json(asset);
  } catch (error) { next(error); }
};

const createAsset = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const newAsset = { ...req.body, location: { type: 'Point', coordinates: [req.body.lng, req.body.lat] } };
      mock.assets.push(newAsset);
      return res.status(201).json(newAsset);
    }
    const db = require('../db/connection');
    const { id, name, type, status, lat, lng, attributes } = req.body;
    const { rows } = await db.query(
      `INSERT INTO assets (id, name, type, status, location, attributes) VALUES ($1,$2,$3,$4,ST_SetSRID(ST_MakePoint($5,$6),4326),$7) RETURNING *`,
      [id, name, type, status, lng, lat, attributes || {}]
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

const updateAsset = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const idx = mock.assets.findIndex(a => a.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Asset not found' });
      mock.assets[idx] = { ...mock.assets[idx], ...req.body };
      return res.json(mock.assets[idx]);
    }
    const db = require('../db/connection');
    const { name, type, status, lat, lng, attributes } = req.body;
    const { rows } = await db.query(
      `UPDATE assets SET name=$1,type=$2,status=$3,location=ST_SetSRID(ST_MakePoint($4,$5),4326),attributes=$6 WHERE id=$7 RETURNING *`,
      [name, type, status, lng, lat, attributes || {}, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Asset not found' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

const updateAssetStatus = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const asset = mock.assets.find(a => a.id === req.params.id);
      if (!asset) return res.status(404).json({ message: 'Asset not found' });
      asset.status = req.body.status;
      return res.json(asset);
    }
    const db = require('../db/connection');
    const { rows } = await db.query('UPDATE assets SET status=$1 WHERE id=$2 RETURNING *', [req.body.status, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Asset not found' });
    res.json(rows[0]);
  } catch (error) { next(error); }
};

module.exports = { getAssets, getAssetsGeoJSON, getAssetById, createAsset, updateAsset, updateAssetStatus };
