// ─── db/index.js ──────────────────────────────────────────────────────────────
// Re-exports db client and all schema symbols for convenience.
// Usage:
//   const { db }   = require('../db');
//   const { users } = require('../db');
// ─────────────────────────────────────────────────────────────────────────────

const { db } = require('../config/db');
const schema  = require('./schema');

module.exports = { db, ...schema };
