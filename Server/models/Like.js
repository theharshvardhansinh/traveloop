// models/Like.js — re-exports the Drizzle `likes` table
const { likes, likesRelations } = require('../db/schema');
module.exports = { likes, likesRelations };
