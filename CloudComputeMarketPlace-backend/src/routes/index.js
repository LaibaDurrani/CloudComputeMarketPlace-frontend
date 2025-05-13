const express = require('express');
const router = express.Router();
const performanceMonitor = require('../middleware/performanceMonitor');

// Apply performance monitoring to all API routes
// This middleware tracks execution time and logs slow requests
// For requests over 500ms: Warns with basic info
// For requests over 1000ms: Provides detailed diagnostics
// In development mode, adds timing info to all responses
router.use('/api', performanceMonitor);

// API Routes
router.use('/api/auth', require('./api/auth'));
router.use('/api/profile', require('./api/profile'));
router.use('/api/computers', require('./api/computers'));
router.use('/api/rentals', require('./api/rentals'));
router.use('/api/conversations', require('./api/conversations'));

// Base route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cloud Compute MarketPlace API',
    version: '1.0.0'
  });
});

module.exports = router;
