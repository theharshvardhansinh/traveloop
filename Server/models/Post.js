// models/Post.js — re-exports the Drizzle `posts` and `postImages` tables
const { posts, postImages, postsRelations, postImagesRelations } = require('../db/schema');
module.exports = { posts, postImages, postsRelations, postImagesRelations };
