const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create new item
router.post('/', [auth, upload.array('images', 5)], async (req, res) => {
  try {
    const { title, description, category, location, status } = req.body;
    
    const newItem = new Item({
      title,
      description,
      category,
      images: req.files.map(file => `/uploads/${file.filename}`),
      location,
      status,
      owner: req.user.id
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const { status, category, dateRange } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    
    if (dateRange) {
      const now = new Date();
      let startDate;
      
      switch(dateRange) {
        case '24h': startDate = new Date(now - 24 * 60 * 60 * 1000); break;
        case '7d': startDate = new Date(now - 7 * 24 * 60 * 60 * 1000); break;
        case '30d': startDate = new Date(now - 30 * 24 * 60 * 60 * 1000); break;
        default: startDate = new Date(0);
      }
      
      query.date = { $gte: startDate };
    }

    const items = await Item.find(query).populate('owner', 'username');
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'username')
      .populate('claims');
      
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    // Check ownership
    if (item.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { title, description, category, location, status } = req.body;
    
    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.location = location || item.location;
    item.status = status || item.status;
    
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    // Check ownership or admin
    if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await item.remove();
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Submit claim
router.post('/:id/claims', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    const newClaim = new Claim({
      description: req.body.description,
      item: item._id,
      claimer: req.user.id
    });
    
    const claim = await newClaim.save();
    
    // Add claim to item
    item.claims.push(claim._id);
    await item.save();
    
    res.json(claim);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
