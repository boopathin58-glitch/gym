const ClassSchedule = require('../models/ClassSchedule');
const User = require('../models/User');

exports.getAllClasses = async (req, res) => {
  try {
    const { category, from, to } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (from || to) {
      filter.startTime = {};
      if (from) filter.startTime.$gte = new Date(from);
      if (to) filter.startTime.$lte = new Date(to);
    }
    const classes = await ClassSchedule.find(filter)
      .populate('trainer', 'name avatar specialty')
      .sort('startTime');
    res.json({ success: true, count: classes.length, classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only trainers can create classes.' });
    }
    const cls = await ClassSchedule.create({ ...req.body, trainer: req.user.id });
    res.status(201).json({ success: true, class: cls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.bookClass = async (req, res) => {
  try {
    const cls = await ClassSchedule.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
    if (cls.enrolled.includes(req.user.id)) return res.status(400).json({ success: false, message: 'Already enrolled.' });

    if (cls.enrolled.length >= cls.capacity) {
      if (!cls.waitlist.includes(req.user.id)) cls.waitlist.push(req.user.id);
      await cls.save();
      return res.json({ success: true, message: 'Added to waitlist.', status: 'waitlist' });
    }

    cls.enrolled.push(req.user.id);
    await cls.save();
    res.json({ success: true, message: 'Successfully booked!', status: 'enrolled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const cls = await ClassSchedule.findById(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
    cls.enrolled = cls.enrolled.filter(id => id.toString() !== req.user.id.toString());
    cls.waitlist = cls.waitlist.filter(id => id.toString() !== req.user.id.toString());
    // Promote from waitlist
    if (cls.waitlist.length > 0 && cls.enrolled.length < cls.capacity) {
      const next = cls.waitlist.shift();
      cls.enrolled.push(next);
    }
    await cls.save();
    res.json({ success: true, message: 'Booking cancelled.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyClasses = async (req, res) => {
  try {
    const filter = req.user.role === 'trainer'
      ? { trainer: req.user.id }
      : { enrolled: req.user.id };
    const classes = await ClassSchedule.find(filter)
      .populate('trainer', 'name avatar specialty')
      .sort('startTime');
    res.json({ success: true, count: classes.length, classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
