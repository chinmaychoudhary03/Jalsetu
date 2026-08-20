const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/payments.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
