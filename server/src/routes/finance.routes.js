const express = require('express');
const { getTransactions, recordReceipt, recordExpenditure, getCashbook, getBalance } = require('../controllers/finance.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/transactions', getTransactions);
router.post('/receipt', recordReceipt);
router.post('/expenditure', recordExpenditure);
router.get('/cashbook', getCashbook);
router.get('/balance', getBalance);

module.exports = router;
