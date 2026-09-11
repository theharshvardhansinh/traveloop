// models/Follow.js — re-exports the Drizzle `follows` table
const { follows, followsRelations } = require('../db/schema');
module.exports = { follows, followsRelations };
