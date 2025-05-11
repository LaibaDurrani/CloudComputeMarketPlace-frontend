const express = require('express');
const { check } = require('express-validator');
const {
  getComputers,
  getComputer,
  createComputer,
  updateComputer,
  deleteComputer
} = require('../../controllers/computerController');
const validate = require('../../middleware/validator');
const { protect, authorize } = require('../../middleware/auth');

const router = express.Router();

// Get all computers
router.get('/', getComputers);

// Get single computer
router.get('/:id', getComputer);

// Create new computer - private - seller/both only
router.post(
  '/',
  protect,
  authorize('seller', 'both'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('specs.cpu', 'CPU specification is required').not().isEmpty(),
    check('specs.gpu', 'GPU specification is required').not().isEmpty(),
    check('specs.ram', 'RAM specification is required').not().isEmpty(),
    check('specs.storage', 'Storage specification is required').not().isEmpty(),
    check('specs.operatingSystem', 'Operating system is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('price.hourly', 'Hourly price is required').isNumeric(),
    check('price.daily', 'Daily price is required').isNumeric(),
    check('price.weekly', 'Weekly price is required').isNumeric(),
    check('price.monthly', 'Monthly price is required').isNumeric(),
  ],
  validate,
  createComputer
);

// Update computer - private - owner only
router.put('/:id', protect, updateComputer);

// Delete computer - private - owner only
router.delete('/:id', protect, deleteComputer);

module.exports = router;
