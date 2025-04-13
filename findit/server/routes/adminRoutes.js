const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const auth = require('../middleware/auth');

// Get all users (admin only)
router.get('/users', [auth, auth.admin], async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all items (admin only)
router.get('/items', [auth, auth.admin], async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'username');
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all claims (admin only)
router.get('/claims', [auth, auth.admin], async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('item', 'title status')
      .populate('claimer', 'username email');
    res.json(claims);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update claim status (admin only)
router.put('/claims/:id', [auth, auth.admin], async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({ msg: 'Claim not found' });
    }
    
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    claim.status = status;
    await claim.save();
    
    res.json(claim);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete user (admin only)
router.delete('/users/:id', [auth, auth.admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete yourself' });
    }
    
    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
