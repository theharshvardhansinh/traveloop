// drizzle.config.js — Drizzle Kit configuration
// NOTE: Drizzle Kit requires ESM config OR a .ts file when using defineConfig.
// We use a plain object export (CJS compatible with drizzle-kit).

require('dotenv').config();

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema:    './db/schema.js',
  out:       './drizzle',
  dialect:   'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict:  true,
};
