const User = require('../models/User');
const Computer = require('../models/Computer');
const Rental = require('../models/Rental');

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, profileType } = req.body;

    const updateFields = {};
    if (name) {
      updateFields.name = name;
      // Update the avatar URL when name changes, using DiceBear
      updateFields.profilePicture = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`;
    }
    if (profileType) updateFields.profileType = profileType;
    
    // Ignore any profilePicture input from the request - always use DiceBear

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
exports.getUserComputers = async (req, res) => {  try {
    const computers = await Computer.find({ user: req.user.id }).lean();

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
exports.getUserRentals = async (req, res) => {  try {
    const rentals = await Rental.find({ renter: req.user.id })
      .populate('computer', 'title description specs price photos')
      .populate('owner', 'name email profilePicture')
      .lean();

    // Sort rentals by status and date - active first, then by start date
    const sortedRentals = rentals.sort((a, b) => {
      // First sort by status - active comes first
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      
      // Then sort by start date (most recent first)
      return new Date(b.startDate) - new Date(a.startDate);
    });

    res.status(200).json({
      success: true,
      count: sortedRentals.length,
      data: sortedRentals
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
exports.getRentedOutComputers = async (req, res) => {  try {
    // Find rentals where the user is the owner
    const rentals = await Rental.find({ owner: req.user.id })
      .populate('computer', 'title description specs price')
      .populate('renter', 'name email')
      .lean(); // Using lean() for better performance

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
    await user.save();    res.status(200).json({
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

// @desc    Delete user account
// @route   DELETE /api/profile
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    // Find user by ID and delete
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete all computers owned by the user
    await Computer.deleteMany({ user: req.user.id });

    // Delete the user
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
