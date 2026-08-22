const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, 'City is required'],
  },
  name: {
    type: String,
    required: [true, 'Activity name is required'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  avgCost: {
    type: Number,
  },
  durationMinutes: {
    type: Number,
  },
  suitedFor: {
    solo: { type: Boolean, default: true },
    couple: { type: Boolean, default: true },
    friends: { type: Boolean, default: true },
    family: { type: Boolean, default: true },
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
activitySchema.index({ city: 1, category: 1 });

module.exports = mongoose.model('Activity', activitySchema);
