// ─── config/db.js ─────────────────────────────────────────────────────────────
// Neon + Drizzle ORM client (replaces Mongoose connectDB)
// Neon is serverless/HTTP — no persistent connection needed.
// Just import { db } from './config/db' and use it directly.
// ─────────────────────────────────────────────────────────────────────────────

const { neon }   = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const schema = require('../db/schema');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db  = drizzle(sql, { schema });

console.log('✅ Neon PostgreSQL client ready (Drizzle ORM)');

module.exports = { db };
