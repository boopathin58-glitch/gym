const Progress = require('../models/Progress');

exports.getSummary = async (req, res) => {
  try {
    const records = await Progress.find({ user: req.user.id }).sort('-date').limit(30);
    const total = records.reduce((acc, r) => ({
      workouts: acc.workouts + (r.workoutsCompleted || 0),
      calories: acc.calories + (r.caloriesBurned || 0),
      minutes: acc.minutes + (r.totalMinutes || 0),
    }), { workouts: 0, calories: 0, minutes: 0 });
    res.json({ success: true, summary: total, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.logProgress = async (req, res) => {
  try {
    const entry = await Progress.create({ user: req.user.id, ...req.body });
    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { user: req.user.id };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const records = await Progress.find(filter).sort('-date');
    res.json({ success: true, count: records.length, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
