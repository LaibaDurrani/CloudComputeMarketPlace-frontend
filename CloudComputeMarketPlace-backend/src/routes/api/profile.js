const express = require('express');
const { check } = require('express-validator');
const {
  updateProfile,
  getUserComputers,
  getUserRentals,
  getRentedOutComputers,
  updatePassword,
  deleteAccount
} = require('../../controllers/profileController');
const validate = require('../../middleware/validator');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Update user profile
router.put(
  '/',
  [
    check('name', 'Name cannot be empty if provided').optional().not().isEmpty(),
    check('profileType', 'Profile type must be buyer, seller, or both').optional().isIn(['buyer', 'seller', 'both']),
  ],
  validate,
  updateProfile
);

// Get user computers
router.get('/computers', getUserComputers);

// Get user rentals
router.get('/rentals', getUserRentals);

// Get user's computers that are rented out
router.get('/rentedout', getRentedOutComputers);

// Update password
router.put(
  '/password',
  [
    check('currentPassword', 'Current password is required').not().isEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
  ],
  validate,
  updatePassword
);

// Delete account
router.delete('/', deleteAccount);

module.exports = router;
