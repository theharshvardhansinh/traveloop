const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Trip is required'],
  },
  stop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop',
  },
  hotelName: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required'],
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required'],
  },
  roomType: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
  },
  totalCost: {
    type: Number,
  },
  confirmationCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
hotelBookingSchema.index({ trip: 1 });

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);
