const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: Number,
  bodyFatPercentage: Number,
  muscleMass: Number,
  chest: Number, waist: Number, hips: Number, arms: Number, legs: Number,
  workoutsCompleted: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  totalMinutes: { type: Number, default: 0 },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
