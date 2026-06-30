const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['hiit','yoga','strength','cardio','pilates','boxing','dance','other'], default: 'other' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  capacity: { type: Number, default: 20 },
  enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: { type: String, default: 'Main Studio' },
  isOnline: { type: Boolean, default: false },
  meetLink: String,
  status: { type: String, enum: ['scheduled','ongoing','completed','cancelled'], default: 'scheduled' },
  color: { type: String, default: '#4f8ef7' },
}, { timestamps: true });

module.exports = mongoose.model('ClassSchedule', classSchema);
