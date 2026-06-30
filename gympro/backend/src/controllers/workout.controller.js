const WorkoutPlan = require('../models/WorkoutPlan');

exports.getWeeklyPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ member: req.user.id, isActive: true })
      .populate('trainer', 'name avatar specialty');
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { memberId, ...rest } = req.body;
    const planData = {
      ...rest,
      member: req.user.role === 'trainer' ? memberId : req.user.id,
      trainer: req.user.role === 'trainer' ? req.user.id : undefined,
    };
    // Deactivate old plan
    await WorkoutPlan.updateMany({ member: planData.member, isActive: true }, { isActive: false });
    const plan = await WorkoutPlan.create(planData);
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyPlans = async (req, res) => {
  try {
    const filter = req.user.role === 'trainer'
      ? { trainer: req.user.id }
      : { member: req.user.id };
    const plans = await WorkoutPlan.find(filter)
      .populate('trainer', 'name avatar')
      .populate('member', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, count: plans.length, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
