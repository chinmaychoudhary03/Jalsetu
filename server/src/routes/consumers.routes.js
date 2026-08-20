const express = require('express');
const { getConsumers, getConsumerById, createConsumer, updateConsumer } = require('../controllers/consumers.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getConsumers);
router.get('/:id', getConsumerById);
router.post('/', createConsumer);
router.put('/:id', updateConsumer);

module.exports = router;
