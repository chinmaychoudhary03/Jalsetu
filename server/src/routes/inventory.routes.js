const express = require('express');
const { getInventory, getInventoryById, addInventory, updateInventory, recordTransaction, getLowStock, getReplenishment } = require('../controllers/inventory.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/low-stock', getLowStock);
router.get('/replenishment', getReplenishment);
router.get('/', getInventory);
router.get('/:id', getInventoryById);
router.post('/', addInventory);
router.put('/:id', updateInventory);
router.post('/:id/transaction', recordTransaction);

module.exports = router;
