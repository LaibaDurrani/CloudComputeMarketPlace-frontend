const express = require('express');
const { check } = require('express-validator');
const {
  getUserConversations,
  getConversation,
  createConversation,
  sendMessage,
  markAsRead,
  getUnreadCount
} = require('../../controllers/conversationController');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validator');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all conversations for a user
router.get('/', getUserConversations);

// Get unread message count
router.get('/unread', getUnreadCount);

// Get a specific conversation with messages
router.get('/:id', getConversation);

// Create a new conversation
router.post('/', [
  check('computerId', 'Computer ID is required').notEmpty()
], validate, createConversation);

// Send a message in a conversation
router.post('/:id/messages', [
  check('content', 'Message content is required').notEmpty()
], validate, sendMessage);

// Mark messages as read
router.put('/:id/read', markAsRead);

module.exports = router;
