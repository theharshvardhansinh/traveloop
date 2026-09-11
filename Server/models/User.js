// models/User.js — re-exports the Drizzle `users` table from db/schema.js
// Kept for backward-compatible import paths in controllers/routes.
const { users, usersRelations } = require('../db/schema');
module.exports = { users, usersRelations };
