const mongoose = require('mongoose');

const trainBookingSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Trip is required'],
  },
  stop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop',
  },
  fromStation: {
    type: String,
    required: [true, 'From station is required'],
    trim: true,
  },
  toStation: {
    type: String,
    required: [true, 'To station is required'],
    trim: true,
  },
  trainNumber: {
    type: String,
    trim: true,
  },
  trainName: {
    type: String,
    trim: true,
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required'],
  },
  class: {
    type: String,
    trim: true,
  },
  pnr: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  fare: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['confirmed', 'waitlisted', 'cancelled'],
    default: 'confirmed',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
trainBookingSchema.index({ trip: 1 });

module.exports = mongoose.model('TrainBooking', trainBookingSchema);
