const Computer = require('../models/Computer');

// @desc    Get all computers
// @route   GET /api/computers
// @access  Public
exports.getComputers = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30; // Default to 30 listings per page
    const startIndex = (page - 1) * limit;
    
    // Search and filter parameters
    const searchQuery = {};
    
    // Apply category filter if provided
    if (req.query.category) {
      searchQuery.categories = req.query.category;
    }
    
    // Apply text search if provided
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      searchQuery.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'specs.cpu': searchRegex },
        { 'specs.gpu': searchRegex },
        { 'specs.ram': searchRegex },
        { 'specs.storage': searchRegex },
        { 'specs.operatingSystem': searchRegex },
        { location: searchRegex }
      ];
    }
    
    // Count total computers matching the query
    const total = await Computer.countDocuments(searchQuery);
      // Get paginated computers using lean() for performance
    const computers = await Computer.find(searchQuery)
      .populate('user', 'name profilePicture')
      .skip(startIndex)
      .limit(limit)
      .lean(); // Convert to plain JS objects for better performance
    
    // Calculate pagination info
    const pagination = {
      current: page,
      limit: limit,
      total: Math.ceil(total / limit),
      totalItems: total
    };
    
    res.status(200).json({
      success: true,
      count: computers.length,
      pagination,
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

// @desc    Get single computer
// @route   GET /api/computers/:id
// @access  Public
exports.getComputer = async (req, res) => {  try {
    const computer = await Computer.findById(req.params.id)
      .populate('user', 'name profilePicture')
      .populate('reviews.user', 'name profilePicture')
      .lean(); // Using lean() for better performance
    
    if (!computer) {
      return res.status(404).json({
        success: false,
        error: 'Computer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: computer
    });
  } catch (err) {
    console.error(err);
    
    // Check if error is due to invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Computer not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new computer
// @route   POST /api/computers
// @access  Private (Seller/Both)
exports.createComputer = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Check if user is allowed to create computer listing
    if (req.user.profileType !== 'seller' && req.user.profileType !== 'both') {
      return res.status(403).json({
        success: false,
        error: 'Only sellers can create computer listings'
      });
    }
    
    console.log('Creating computer with data:', JSON.stringify(req.body));
    
    const computer = await Computer.create(req.body);
    
    res.status(201).json({
      success: true,
      data: computer
    });
  } catch (err) {
    console.error('Error creating computer:', err);
    
    if (err.name === 'ValidationError') {
      // Get the first validation error message
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages[0]
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error: ' + err.message
    });
  }
};

// @desc    Update computer
// @route   PUT /api/computers/:id
// @access  Private (Owner only)
exports.updateComputer = async (req, res) => {
  try {
    let computer = await Computer.findById(req.params.id);
    
    if (!computer) {
      return res.status(404).json({
        success: false,
        error: 'Computer not found'
      });
    }
    
    // Make sure user is computer owner
    if (computer.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this computer'
      });
    }
    
    computer = await Computer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: computer
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete computer
// @route   DELETE /api/computers/:id
// @access  Private (Owner only)
exports.deleteComputer = async (req, res) => {
  try {
    const computer = await Computer.findById(req.params.id);
    
    if (!computer) {
      return res.status(404).json({
        success: false,
        error: 'Computer not found'
      });
    }
      // Make sure user is computer owner
    if (computer.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this computer'
      });
    }
    
    // Use deleteOne() instead of deprecated remove()
    await Computer.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
