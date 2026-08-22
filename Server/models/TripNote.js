const mongoose = require('mongoose');

const tripNoteSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip is required'],
    },
    stop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
tripNoteSchema.index({ trip: 1 });

module.exports = mongoose.model('TripNote', tripNoteSchema);
