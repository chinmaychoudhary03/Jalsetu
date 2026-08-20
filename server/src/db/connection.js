const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

/**
 * Lazily creates pool. Returns null if env vars not set.
 * Actual connection failures are caught at query time.
 */
function getPool() {
  if (!pool) {
    pool = new Pool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT) || 5432,
      user:     process.env.DB_USER     || 'jalsathi_user',
      password: process.env.DB_PASSWORD || 'jalsathi_pass',
      database: process.env.DB_NAME     || 'jalsathi',
      connectionTimeoutMillis: 3000,  // fail fast if DB not available
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

module.exports = {
  query: (text, params) => getPool().query(text, params),
  pool: { get: getPool },
};
