const Membership = require('../models/Membership');
const User = require('../models/User');

const PLAN_PRICES = { starter: 999, pro: 2499, elite: 3999 };

exports.getMyMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ user: req.user.id, status: 'active' });
    res.json({ success: true, membership });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { plan, paymentMethod = 'razorpay', transactionId } = req.body;
    if (!PLAN_PRICES[plan]) return res.status(400).json({ success: false, message: 'Invalid plan.' });

    // Cancel existing
    await Membership.updateMany({ user: req.user.id, status: 'active' }, { status: 'cancelled' });

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const membership = await Membership.create({
      user: req.user.id, plan,
      price: PLAN_PRICES[plan],
      endDate, paymentMethod,
      transactionId: transactionId || `TXN_${Date.now()}`,
    });

    await User.findByIdAndUpdate(req.user.id, {
      membershipPlan: plan,
      membershipStatus: 'active',
      membershipExpiry: endDate,
    });

    res.status(201).json({ success: true, membership });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelMembership = async (req, res) => {
  try {
    await Membership.findOneAndUpdate({ user: req.user.id, status: 'active' }, { status: 'cancelled', autoRenew: false });
    await User.findByIdAndUpdate(req.user.id, { membershipStatus: 'inactive' });
    res.json({ success: true, message: 'Membership cancelled.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
