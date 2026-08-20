const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jalsathi_super_secret_jwt_key';

const login = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // ── Mock mode (no DB) ──────────────────────────────────────────────────
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      let user = mock.users.find(u => u.username === username || u.role === role);

      if (!user) {
        user = {
          id: `usr-${Date.now()}`,
          username: username || 'demo',
          name: role === 'user' 
            ? 'Ramesh Patil (Citizen)' 
            : role === 'phed' 
              ? 'Er. S. K. Deshmukh (PHED)' 
              : 'GP Administrator',
          role: role || 'admin',
          village: 'Koregaon Gram Panchayat'
        };
      } else {
        // Ensure requested role is respected
        user = { ...user, role: role || user.role };
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, village: user.village },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      const { password_hash, ...safeUser } = user;
      return res.json({ token, user: safeUser });
    }

    // ── Real DB mode ───────────────────────────────────────────────────────
    const db = require('../db/connection');
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const payload = { id: user.id, name: user.name, username: user.username, role: user.role, village: user.village };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: payload });

  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

const getMe = async (req, res, next) => {
  try {
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const user = mock.users.find(u => u.id === req.user?.id) || {
        id: req.user?.id || 'usr-1',
        username: req.user?.username || 'user',
        role: req.user?.role || 'admin',
        village: 'Koregaon'
      };
      const { password_hash, ...safeUser } = user;
      return res.json(safeUser);
    }
    const db = require('../db/connection');
    const { rows } = await db.query('SELECT id, username, role, created_at FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, getMe };
