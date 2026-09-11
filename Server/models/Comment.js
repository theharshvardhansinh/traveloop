// models/Comment.js — re-exports the Drizzle `comments` table
const { comments, commentsRelations } = require('../db/schema');
module.exports = { comments, commentsRelations };
