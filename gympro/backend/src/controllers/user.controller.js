const User = require('../models/User');
const Progress = require('../models/Progress');
const WorkoutPlan = require('../models/WorkoutPlan');
const Membership = require('../models/Membership');

// @GET /api/users/notifications
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    res.json({ success: true, notifications: user.notifications || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/users/notifications/:id/read
exports.markNotificationRead = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user.id, 'notifications._id': req.params.id },
      { $set: { 'notifications.$.read': true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'avatar', 'bio', 'specialty', 'experience', 'certifications', 'fitnessGoal', 'height', 'weight', 'dateOfBirth'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/users/trainers  (list all trainers)
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer', isActive: true })
      .select('name email avatar specialty experience rating reviewCount bio certifications');
    res.json({ success: true, count: trainers.length, trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/users/trainer/:id/clients  (trainer sees own clients)
exports.getTrainerClients = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ trainer: req.user.id }).distinct('member');
    const clients = await User.find({ _id: { $in: plans }, role: 'member' })
      .select('name email avatar membershipStatus fitnessGoal lastLogin');
    res.json({ success: true, count: clients.length, clients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/users/dashboard  (member dashboard summary)
exports.getMemberDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const progress = await Progress.find({ user: userId, date: { $gte: startOfMonth } });
    const totalWorkouts = progress.reduce((s, p) => s + (p.workoutsCompleted || 0), 0);
    const totalCalories = progress.reduce((s, p) => s + (p.caloriesBurned || 0), 0);
    const membership = await Membership.findOne({ user: userId, status: 'active' });
    const workoutPlan = await WorkoutPlan.findOne({ member: userId, isActive: true }).populate('trainer', 'name avatar');

    res.json({
      success: true,
      dashboard: {
        workoutsThisMonth: totalWorkouts,
        caloriesThisMonth: totalCalories,
        activeMembership: membership || null,
        workoutPlan: workoutPlan || null,
        loginStreak: req.user.loginStreak || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/users/trainer-dashboard
exports.getTrainerDashboard = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const plans = await WorkoutPlan.find({ trainer: trainerId }).distinct('member');
    const clientCount = plans.length;
    const trainer = await User.findById(trainerId).select('rating reviewCount');
    res.json({
      success: true,
      dashboard: {
        activeClients: clientCount,
        rating: trainer.rating || 0,
        reviewCount: trainer.reviewCount || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
