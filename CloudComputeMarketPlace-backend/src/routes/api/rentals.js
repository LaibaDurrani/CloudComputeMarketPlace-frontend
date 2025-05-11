const express = require('express');
const { check } = require('express-validator');
const {
  getRentals,
  getRental,
  createRental,
  updateRentalStatus
} = require('../../controllers/rentalController');
const validate = require('../../middleware/validator');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all rentals
router.get('/', getRentals);

// Get single rental
router.get('/:id', getRental);

// Create new rental
router.post(
  '/',
  [
    check('computerId', 'Computer ID is required').not().isEmpty(),
    check('startDate', 'Start date is required').isDate(),
    check('endDate', 'End date is required').isDate(),
    check('rentalType', 'Rental type must be hourly, daily, weekly, or monthly')
      .isIn(['hourly', 'daily', 'weekly', 'monthly']),
  ],
  validate,
  createRental
);

// Update rental status
router.put(
  '/:id',
  [
    check('status', 'Status must be pending, active, completed, or cancelled')
      .isIn(['pending', 'active', 'completed', 'cancelled']),
  ],
  validate,
  updateRentalStatus
);

module.exports = router;
