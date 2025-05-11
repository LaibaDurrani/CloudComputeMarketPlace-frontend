const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Computer = require('../models/Computer');

// @desc    Get all conversations for a user
// @route   GET /api/conversations
// @access  Private
exports.getUserConversations = async (req, res) => {
  try {
    // Find conversations where the user is either buyer or owner
    const conversations = await Conversation.find({
      $or: [
        { buyer: req.user.id },
        { owner: req.user.id }
      ]
    })
      .populate('computer', 'title photos')
      .populate('buyer', 'name profilePicture')
      .populate('owner', 'name profilePicture')
      .sort({ lastMessageDate: -1 }); // Sort by the most recent message
    
    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get conversation by ID with messages
// @route   GET /api/conversations/:id
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('computer', 'title photos specs price')
      .populate('buyer', 'name profilePicture')
      .populate('owner', 'name profilePicture');
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
      // Check if user is part of this conversation
    const buyerId = conversation.buyer._id ? conversation.buyer._id.toString() : conversation.buyer.toString();
    const ownerId = conversation.owner._id ? conversation.owner._id.toString() : conversation.owner.toString();
    
    if (buyerId !== req.user.id && ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this conversation'
      });
    }
    
    // Get messages for this conversation
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });
    
    // Mark messages as read if the current user is the recipient
    if (conversation.buyer.toString() === req.user.id && conversation.unreadBuyer > 0) {
      await Conversation.findByIdAndUpdate(req.params.id, { unreadBuyer: 0 });
      await Message.updateMany(
        { conversation: req.params.id, sender: { $ne: req.user.id }, isRead: false },
        { isRead: true }
      );
    } else if (conversation.owner.toString() === req.user.id && conversation.unreadOwner > 0) {
      await Conversation.findByIdAndUpdate(req.params.id, { unreadOwner: 0 });
      await Message.updateMany(
        { conversation: req.params.id, sender: { $ne: req.user.id }, isRead: false },
        { isRead: true }
      );
    }
    
    res.status(200).json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create or get a conversation between buyer and owner for a specific computer
// @route   POST /api/conversations
// @access  Private
exports.createConversation = async (req, res) => {
  try {
    const { computerId } = req.body;
    
    if (!computerId) {
      return res.status(400).json({
        success: false,
        error: 'Computer ID is required'
      });
    }
    
    // Get the computer and check if it exists
    const computer = await Computer.findById(computerId);
    if (!computer) {
      return res.status(404).json({
        success: false,
        error: 'Computer not found'
      });
    }
    
    const buyerId = req.user.id;
    const ownerId = computer.user.toString();
    
    // Check if the user is trying to message themselves
    if (buyerId === ownerId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create a conversation with yourself'
      });
    }
    
    // Check if a conversation already exists between these users for this computer
    let conversation = await Conversation.findOne({
      computer: computerId,
      buyer: buyerId,
      owner: ownerId
    });
    
    if (conversation) {
      // Return the existing conversation
      return res.status(200).json({
        success: true,
        data: conversation
      });
    }
    
    // Create a new conversation
    conversation = await Conversation.create({
      computer: computerId,
      buyer: buyerId,
      owner: ownerId
    });
    
    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (err) {
    console.error('Error creating conversation:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/conversations/:id/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }
    
    // Find the conversation
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
      // Check if user is part of this conversation
    const buyerId = conversation.buyer._id ? conversation.buyer._id.toString() : conversation.buyer.toString();
    const ownerId = conversation.owner._id ? conversation.owner._id.toString() : conversation.owner.toString();
    
    if (buyerId !== req.user.id && ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to send message in this conversation'
      });
    }
    
    // Create the message
    const message = await Message.create({
      conversation: req.params.id,
      sender: req.user.id,
      content
    });
    
    // Update conversation with last message info
    const isBuyer = req.user.id === buyerId;
    await Conversation.findByIdAndUpdate(req.params.id, {
      lastMessage: content,
      lastMessageDate: Date.now(),
      // Increment unread counter for the recipient
      ...(isBuyer ? { unreadOwner: conversation.unreadOwner + 1 } : { unreadBuyer: conversation.unreadBuyer + 1 })
    });
    
    // Populate the sender info for response
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name profilePicture');
    
    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Mark all messages in a conversation as read
// @route   PUT /api/conversations/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
      // Check if user is part of this conversation
    const buyerId = conversation.buyer._id ? conversation.buyer._id.toString() : conversation.buyer.toString();
    const ownerId = conversation.owner._id ? conversation.owner._id.toString() : conversation.owner.toString();
    
    if (buyerId !== req.user.id && ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this conversation'
      });
    }
    
    // Update based on whether the current user is buyer or owner
    if (buyerId === req.user.id) {
      conversation.unreadBuyer = 0;
      await Conversation.findByIdAndUpdate(req.params.id, { unreadBuyer: 0 });
    } else if (ownerId === req.user.id) {
      conversation.unreadOwner = 0;
      await Conversation.findByIdAndUpdate(req.params.id, { unreadOwner: 0 });
    }
    
    // Mark all messages sent by the other user as read
    await Message.updateMany(
      { conversation: req.params.id, sender: { $ne: req.user.id }, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get unread message count for current user
// @route   GET /api/conversations/unread
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    // Find all conversations for this user
    const conversations = await Conversation.find({
      $or: [
        { buyer: req.user.id },
        { owner: req.user.id }
      ]
    });
      // Calculate total unread messages
    let totalUnread = 0;
    for (const conv of conversations) {
      const buyerId = conv.buyer._id ? conv.buyer._id.toString() : conv.buyer.toString();
      
      if (buyerId === req.user.id) {
        totalUnread += conv.unreadBuyer || 0;
      } else {
        totalUnread += conv.unreadOwner || 0;
      }
    }
    
    res.status(200).json({
      success: true,
      data: { unreadCount: totalUnread }
    });
  } catch (err) {
    console.error('Error getting unread count:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
