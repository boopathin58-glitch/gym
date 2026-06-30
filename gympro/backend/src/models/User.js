const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, minlength: 6, select: false },
  role: { type: String, enum: ['member', 'trainer', 'admin'], default: 'member' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  googleId: { type: String },
  provider: { type: String, default: 'email' },

  // Trainer-specific
  specialty: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  certifications: [{ type: String }],
  bio: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  // Member-specific
  fitnessGoal: { type: String, enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'], default: 'general_fitness' },
  height: { type: Number },
  weight: { type: Number },
  dateOfBirth: { type: Date },
  membershipStatus: { type: String, enum: ['active', 'inactive', 'suspended', 'trial'], default: 'trial' },
  membershipPlan: { type: String, enum: ['starter', 'pro', 'elite', 'none'], default: 'none' },
  membershipExpiry: { type: Date },

  // Auth
  isVerified: { type: Boolean, default: false },
  verificationOTP: { type: String, select: false },
  verificationOTPExpiry: { type: Date, select: false },
  resetPasswordOTP: { type: String, select: false },
  resetPasswordOTPExpiry: { type: Date, select: false },
  refreshToken: { type: String, select: false },

  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginStreak: { type: Number, default: 0 },
  notifications: [{ message: String, read: Boolean, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
