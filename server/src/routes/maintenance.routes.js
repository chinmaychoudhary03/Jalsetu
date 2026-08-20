const express = require('express');
const { getMaintenance, getMaintenanceById, reportIssue, updateMaintenanceStatus } = require('../controllers/maintenance.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getMaintenance);
router.get('/:id', getMaintenanceById);
router.post('/', reportIssue);
router.put('/:id/status', updateMaintenanceStatus);

module.exports = router;
