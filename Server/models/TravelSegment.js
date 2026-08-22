const mongoose = require('mongoose');

const travelSegmentSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Trip is required'],
  },
  fromStop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop',
    required: [true, 'From stop is required'],
  },
  toStop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop',
    required: [true, 'To stop is required'],
  },
  travelMode: {
    type: String,
    enum: ['driving', 'transit', 'walking', 'flight'],
    default: 'driving',
  },
  distanceKm: {
    type: Number,
  },
  durationMinutes: {
    type: Number,
  },
  polyline: {
    type: String,
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
travelSegmentSchema.index({ trip: 1 });

module.exports = mongoose.model('TravelSegment', travelSegmentSchema);
