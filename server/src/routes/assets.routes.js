const express = require('express');
const { getAssets, getAssetsGeoJSON, getAssetById, createAsset, updateAsset, updateAssetStatus } = require('../controllers/assets.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getAssets);
router.get('/geojson', getAssetsGeoJSON);
router.get('/:id', getAssetById);
router.post('/', authorize(['phed', 'gp_admin']), createAsset);
router.put('/:id', authorize(['phed', 'gp_admin']), updateAsset);
router.put('/:id/status', updateAssetStatus);

module.exports = router;
