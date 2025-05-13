const Rental = require('../models/Rental');
const Computer = require('../models/Computer');

// @desc    Get all rentals
// @route   GET /api/rentals
// @access  Private (Admin only - future implementation)
exports.getRentals = async (req, res) => {  try {
    const rentals = await Rental.find()
      .populate('computer', 'title description specs price')
      .populate('renter', 'name email')
      .populate('owner', 'name email')
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

// @desc    Get single rental
// @route   GET /api/rentals/:id
// @access  Private (Only renter or owner)
exports.getRental = async (req, res) => {  try {
    const rental = await Rental.findById(req.params.id)
      .populate('computer', 'title description specs price photos')
      .populate('renter', 'name email profilePicture')
      .populate('owner', 'name email profilePicture')
      .lean(); // Using lean() for better performance

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
exports.createRental = async (req, res) => {  try {
    const { computerId, startDate: startDateString, endDate: endDateString, rentalType } = req.body;
    
    // Convert date strings to Date objects to ensure they're valid
    let startDate, endDate;
    try {
      startDate = new Date(startDateString);
      endDate = new Date(endDateString);
      
      // Verify dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format provided'
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Error parsing dates: ' + error.message
      });
    }
      // Enhanced debug logs
    console.log('Creating rental with data:', { 
      computerId, 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString(), 
      rentalType 
    });
    console.log('User in request:', req.user?.id);
    
    // Validate user authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'User authentication failed. Please log in again.'
      });
    }    // Find the computer
    const computer = await Computer.findById(computerId);

    if (!computer) {
      return res.status(404).json({
        success: false,
        error: 'Computer not found'
      });
    }
    
    // Validate computer data
    if (!computer.availability) {
      return res.status(400).json({
        success: false,
        error: 'Computer availability data is missing'
      });
    }

    // Check if computer is available
    if (computer.availability.status !== 'available') {
      return res.status(400).json({
        success: false,
        error: `Computer is currently ${computer.availability.status}`
      });
    }    // Check if user is not renting their own computer
    if (!computer.user) {
      return res.status(400).json({
        success: false,
        error: 'Computer ownership data is missing'
      });
    }
    
    if (computer.user.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot rent your own computer'
      });
    }    // Verify computer has price information
    if (!computer.price) {
      return res.status(400).json({
        success: false,
        error: 'Computer pricing information is missing'
      });
    }
    
    // Calculate total price based on rental type and computer pricing
    let totalPrice;
    try {
      switch (rentalType) {
        case 'hourly':
          if (computer.price.hourly === undefined || computer.price.hourly === null) {
            return res.status(400).json({
              success: false,
              error: 'Hourly price not set for this computer'
            });
          }
          // Calculate hours between startDate and endDate
          const hours = Math.ceil((endDate - startDate) / (1000 * 60 * 60));
          totalPrice = computer.price.hourly * hours;
          break;
        case 'daily':
          if (computer.price.daily === undefined || computer.price.daily === null) {
            return res.status(400).json({
              success: false,
              error: 'Daily price not set for this computer'
            });
          }
          // Calculate days between startDate and endDate
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          totalPrice = computer.price.daily * days;
          break;
        case 'weekly':
          if (computer.price.weekly === undefined || computer.price.weekly === null) {
            return res.status(400).json({
              success: false,
              error: 'Weekly price not set for this computer'
            });
          }
          // Calculate weeks between startDate and endDate
          const weeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
          totalPrice = computer.price.weekly * weeks;
          break;
        case 'monthly':
          if (computer.price.monthly === undefined || computer.price.monthly === null) {
            return res.status(400).json({
              success: false,
              error: 'Monthly price not set for this computer'
            });
          }
          // Calculate months between startDate and endDate (approximate)
          const months = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
          totalPrice = computer.price.monthly * months;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid rental type'
          });
      }
      
      // Validate calculated price
      if (isNaN(totalPrice) || totalPrice <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Error calculating price. Please check dates and try again.'
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Error calculating price: ' + error.message
      });
    }// Create rental with auto-approved payment
    const rental = await Rental.create({
      computer: computerId,
      renter: req.user.id,
      owner: computer.user,
      startDate,
      endDate,
      rentalType,
      totalPrice,
      status: 'active', // Set to active instead of pending to bypass payment check
      paymentInfo: {
        method: 'automatic', // This now matches our updated enum in the Rental model
        transactionId: `auto_${Date.now()}`,
        isPaid: true,
        paidAt: new Date()
      }
    });

    // Update computer availability status
    computer.availability.status = 'rented';
    await computer.save();    res.status(201).json({
      success: true,
      data: rental
    });
  } catch (err) {
    console.error('Error creating rental:', err);
    
    // Check for validation errors (Mongoose validation)
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors.join(', ')
      });
    }
    
    // Check for cast errors (e.g., invalid MongoDB ID)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: `Invalid ${err.path}: ${err.value}`
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
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
    }    // Update rental status
    rental.status = status;
      // Automatically set payment as completed when activating a rental
    if (status === 'active' && (!rental.paymentInfo || !rental.paymentInfo.isPaid)) {
      rental.paymentInfo = {
        method: 'automatic', // Matches our updated enum in the Rental model
        transactionId: `auto_${Date.now()}`,
        isPaid: true,
        paidAt: new Date()
      };
    }
    
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
