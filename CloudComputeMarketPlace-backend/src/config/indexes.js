/**
 * MongoDB Index Configuration
 * 
 * This file contains database index creation for improved query performance
 * Indexes are essential for optimizing query execution time and reducing database load
 */

const User = require('../models/User');
const Computer = require('../models/Computer');
const Rental = require('../models/Rental');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const createIndexes = async () => {
  console.log('Setting up MongoDB indexes for optimized queries...');
  
  try {
    // User Collection Indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ profileType: 1 });
    console.log('✓ User indexes created');
    
    // Computer Collection Indexes
    await Computer.collection.createIndex({ user: 1 });
    await Computer.collection.createIndex({ categories: 1 });
    await Computer.collection.createIndex({ "availability.status": 1 });
    await Computer.collection.createIndex({ "price.hourly": 1 });
    await Computer.collection.createIndex({ location: "text", title: "text", description: "text" });
    console.log('✓ Computer indexes created');
    
    // Rental Collection Indexes
    await Rental.collection.createIndex({ renter: 1 });
    await Rental.collection.createIndex({ owner: 1 });
    await Rental.collection.createIndex({ computer: 1 });
    await Rental.collection.createIndex({ status: 1 });
    await Rental.collection.createIndex({ startDate: 1, endDate: 1 });
    console.log('✓ Rental indexes created');
    
    // Conversation Collection Indexes
    await Conversation.collection.createIndex({ buyer: 1 });
    await Conversation.collection.createIndex({ owner: 1 });
    await Conversation.collection.createIndex({ computer: 1 });
    await Conversation.collection.createIndex({ lastMessageDate: -1 });
    console.log('✓ Conversation indexes created');
    
    // Message Collection Indexes
    await Message.collection.createIndex({ conversation: 1 });
    await Message.collection.createIndex({ sender: 1 });
    await Message.collection.createIndex({ createdAt: 1 });
    console.log('✓ Message indexes created');
    
    console.log('All database indexes have been successfully created!');
  } catch (err) {
    console.error('Error creating indexes:', err);
  }
};

module.exports = { createIndexes };
