const express = require('express');
const { login, logout, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

module.exports = router;
