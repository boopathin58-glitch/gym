const Progress = require('../models/Progress');
const ClassSchedule = require('../models/ClassSchedule');

exports.getWorkoutAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const records = await Progress.find({
      user: req.user.id,
      date: { $gte: sixMonthsAgo }
    }).sort('date');

    // Group by month
    const monthly = {};
    records.forEach(r => {
      const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[key]) monthly[key] = { workouts: 0, calories: 0, minutes: 0 };
      monthly[key].workouts += r.workoutsCompleted || 0;
      monthly[key].calories += r.caloriesBurned || 0;
      monthly[key].minutes += r.totalMinutes || 0;
    });

    res.json({ success: true, analytics: monthly });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getClassAnalytics = async (req, res) => {
  try {
    const classes = await ClassSchedule.find({ trainer: req.user.id })
      .select('title startTime enrolled capacity status');
    const total = classes.length;
    const completed = classes.filter(c => c.status === 'completed').length;
    const totalAttendees = classes.reduce((s, c) => s + c.enrolled.length, 0);
    res.json({ success: true, analytics: { total, completed, totalAttendees, avgAttendance: total ? (totalAttendees / total).toFixed(1) : 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
