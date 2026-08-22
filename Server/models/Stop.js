const mongoose = require('mongoose');

const stopActivitySchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
    },
    scheduledDate: {
      type: Date,
    },
    scheduledTime: {
      type: String,
    },
    actualCost: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  { _id: false }
);

const stopSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Trip is required'],
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, 'City is required'],
  },
  sequenceOrder: {
    type: Number,
    required: [true, 'Sequence order is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  notes: {
    type: String,
  },
  activities: [stopActivitySchema],
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
stopSchema.index({ trip: 1, sequenceOrder: 1 });

module.exports = mongoose.model('Stop', stopSchema);
