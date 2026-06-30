const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['starter', 'pro', 'elite'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'cancelled', 'expired'], default: 'active' },
  price: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  autoRenew: { type: Boolean, default: true },
  paymentMethod: { type: String, enum: ['stripe', 'razorpay', 'cash'], default: 'razorpay' },
  transactionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema);
