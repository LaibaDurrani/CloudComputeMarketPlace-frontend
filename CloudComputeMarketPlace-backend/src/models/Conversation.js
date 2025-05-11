const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  computer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Computer',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageDate: {
    type: Date,
    default: Date.now
  },
  unreadBuyer: {
    type: Number,
    default: 0
  },
  unreadOwner: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
