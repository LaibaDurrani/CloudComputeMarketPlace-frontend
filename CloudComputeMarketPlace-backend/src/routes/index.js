const express = require('express');
const router = express.Router();

// API Routes
router.use('/api/auth', require('./api/auth'));
router.use('/api/profile', require('./api/profile'));
router.use('/api/computers', require('./api/computers'));
router.use('/api/rentals', require('./api/rentals'));

// Base route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cloud Compute MarketPlace API',
    version: '1.0.0'
  });
});

module.exports = router;
