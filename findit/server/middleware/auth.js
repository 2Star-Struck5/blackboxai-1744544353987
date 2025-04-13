const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Check session
    if (!req.session.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    // Verify user exists
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};
