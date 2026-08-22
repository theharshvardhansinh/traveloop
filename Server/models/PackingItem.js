const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Trip is required'],
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['clothing', 'documents', 'electronics', 'toiletries', 'other'],
    default: 'other',
  },
  isPacked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
packingItemSchema.index({ trip: 1 });

module.exports = mongoose.model('PackingItem', packingItemSchema);
