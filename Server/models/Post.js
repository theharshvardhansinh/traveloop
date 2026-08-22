const mongoose = require('mongoose');

const postImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  caption: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  images: [postImageSchema],
  // Denormalized counters — keep in sync via app logic when Like/Comment created/deleted
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
postSchema.index({ user: 1 });
postSchema.index({ city: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
