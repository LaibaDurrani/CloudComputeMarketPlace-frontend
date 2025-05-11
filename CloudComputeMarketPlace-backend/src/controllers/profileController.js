const User = require('../models/User');
const Computer = require('../models/Computer');
const Rental = require('../models/Rental');

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, profilePicture, profileType } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (profilePicture) updateFields.profilePicture = profilePicture;
    if (profileType) updateFields.profileType = profileType;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get user's computers
// @route   GET /api/profile/computers
// @access  Private
exports.getUserComputers = async (req, res) => {
  try {
    const computers = await Computer.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: computers.length,
      data: computers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get user's rentals
// @route   GET /api/profile/rentals
// @access  Private
exports.getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user.id })
      .populate('computer', 'title description specs price')
      .populate('owner', 'name email');

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get user's computers that are rented out
// @route   GET /api/profile/rentedout
// @access  Private
exports.getRentedOutComputers = async (req, res) => {
  try {
    // Find rentals where the user is the owner
    const rentals = await Rental.find({ owner: req.user.id })
      .populate('computer', 'title description specs price')
      .populate('renter', 'name email');

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/profile/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
