const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
      default: 'editor',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    tripType: {
      type: String,
      enum: ['solo', 'couple', 'friends', 'family'],
      default: 'solo',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    coverPhotoUrl: {
      type: String,
    },
    totalBudget: {
      type: Number,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    publicSlug: {
      type: String,
      unique: true,
      sparse: true,
    },
    members: [memberSchema],
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
tripSchema.index({ owner: 1 });
tripSchema.index({ 'members.user': 1 });
tripSchema.index({ publicSlug: 1 });

module.exports = mongoose.model('Trip', tripSchema);
