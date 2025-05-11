const Rental = require('../models/Rental');
const Computer = require('../models/Computer');

// @desc    Get all rentals
// @route   GET /api/rentals
// @access  Private (Admin only - future implementation)
exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('computer', 'title description specs price')
      .populate('renter', 'name email')
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

// @desc    Get single rental
// @route   GET /api/rentals/:id
// @access  Private (Only renter or owner)
exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('computer', 'title description specs price photos')
      .populate('renter', 'name email profilePicture')
      .populate('owner', 'name email profilePicture');

    if (!rental) {
      return res.status(404).json({
        success: false,
        error: 'Rental not found'
      });
    }

    // Make sure user is rental owner or renter
    if (
      rental.renter._id.toString() !== req.user.id &&
      rental.owner._id.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this rental'
      });
    }

    res.status(200).json({
      success: true,
      data: rental
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new rental
// @route   POST /api/rentals
// @access  Private
exports.createRental = async (req, res) => {
  try {
    const { computerId, startDate, endDate, rentalType } = req.body;

    // Find the computer
    const computer = await Computer.findById(computerId);

    if (!computer) {
      return res.status(404).json({
        success: false,
        error: 'Computer not found'
      });
    }

    // Check if computer is available
    if (computer.availability.status !== 'available') {
      return res.status(400).json({
        success: false,
        error: `Computer is currently ${computer.availability.status}`
      });
    }

    // Check if user is not renting their own computer
    if (computer.user.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot rent your own computer'
      });
    }

    // Calculate total price based on rental type and computer pricing
    let totalPrice;
    switch (rentalType) {
      case 'hourly':
        // Calculate hours between startDate and endDate
        const hours = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60));
        totalPrice = computer.price.hourly * hours;
        break;
      case 'daily':
        // Calculate days between startDate and endDate
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        totalPrice = computer.price.daily * days;
        break;
      case 'weekly':
        // Calculate weeks between startDate and endDate
        const weeks = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 7));
        totalPrice = computer.price.weekly * weeks;
        break;
      case 'monthly':
        // Calculate months between startDate and endDate (approximate)
        const months = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 30));
        totalPrice = computer.price.monthly * months;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid rental type'
        });
    }

    // Create rental
    const rental = await Rental.create({
      computer: computerId,
      renter: req.user.id,
      owner: computer.user,
      startDate,
      endDate,
      rentalType,
      totalPrice,
      status: 'pending'
    });

    // Update computer availability status
    computer.availability.status = 'rented';
    await computer.save();

    res.status(201).json({
      success: true,
      data: rental
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update rental status
// @route   PUT /api/rentals/:id
// @access  Private (Only owner or renter depending on the update)
exports.updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        error: 'Rental not found'
      });
    }

    // Check permissions based on the status change
    if (status === 'cancelled') {
      // Only the renter can cancel a rental
      if (rental.renter.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to cancel this rental'
        });
      }
    } else if (status === 'completed' || status === 'active') {
      // Only the owner can mark a rental as completed or active
      if (rental.owner.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to update this rental'
        });
      }
    }

    // Update rental status
    rental.status = status;
    await rental.save();

    // If rental is cancelled or completed, update computer availability
    if (status === 'cancelled' || status === 'completed') {
      const computer = await Computer.findById(rental.computer);
      computer.availability.status = 'available';
      await computer.save();
    }

    res.status(200).json({
      success: true,
      data: rental
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Add access details to a rental
// @route   PUT /api/rentals/:id/access
// @access  Private (Only owner)
exports.addAccessDetails = async (req, res) => {
  try {
    const { ipAddress, username, password, accessUrl } = req.body;

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        error: 'Rental not found'
      });
    }

    // Only the owner can add access details
    if (rental.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to add access details to this rental'
      });
    }

    // Add access details
    rental.accessDetails = {
      ipAddress,
      username,
      password, // Note: In a production app, you should encrypt this password
      accessUrl
    };

    await rental.save();

    // Don't return the password in the response
    const rentalResponse = rental.toObject();
    if (rentalResponse.accessDetails) {
      rentalResponse.accessDetails.password = undefined;
    }

    res.status(200).json({
      success: true,
      data: rentalResponse
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
