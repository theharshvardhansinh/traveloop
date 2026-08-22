const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  region: {
    type: String,
    trim: true,
  },
  costIndex: {
    type: Number,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  googlePlaceId: {
    type: String,
    unique: true,
    sparse: true,
  },
  imageUrl: {
    type: String,
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
citySchema.index({ location: '2dsphere' });
citySchema.index({ name: 'text', country: 'text' });

module.exports = mongoose.model('City', citySchema);
