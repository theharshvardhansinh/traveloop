const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    shareAmount: {
      type: Number,
    },
    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'Trip is required'],
  },
  stop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop',
  },
  category: {
    type: String,
    enum: ['transport', 'stay', 'activities', 'meals', 'other'],
    required: [true, 'Category is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  description: {
    type: String,
  },
  expenseDate: {
    type: Date,
  },
  sourceType: {
    type: String,
    enum: ['manual', 'activity', 'train_booking', 'hotel_booking'],
    default: 'manual',
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  splits: [splitSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
expenseSchema.index({ trip: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
