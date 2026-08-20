const express = require('express');
const { getBills, getBillById, generateBill, generateBulkBills } = require('../controllers/billing.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getBills);
router.get('/:id', getBillById);
router.post('/', generateBill);
router.post('/bulk', generateBulkBills);

module.exports = router;
