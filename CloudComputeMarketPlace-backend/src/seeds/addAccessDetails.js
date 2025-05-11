// This script adds test access details to existing rentals for development purposes
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Load models
const Rental = require('../models/Rental');

// Connect to DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hammadarif564:hammad1234@cluster0.t3ayndk.mongodb.net/cloudcomputemarketplace?retryWrites=true&w=majority';
console.log('Connecting to MongoDB...');
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB Connected');

  try {
    // Find all active rentals without access details
    const rentals = await Rental.find({ 
      status: 'active',
      accessDetails: { $exists: false } 
    });

    console.log(`Found ${rentals.length} active rentals without access details`);

    // List of demo remote access URLs to use for testing
    const demoUrls = [
      'https://codepen.io/pen/',
      'https://codesandbox.io/s/new',
      'https://jsfiddle.net/',
      'https://replit.com/languages/nodejs'
    ];

    // Add access details to each rental
    for (let i = 0; i < rentals.length; i++) {
      const rental = rentals[i];
      
      // Generate random access details
      const accessDetails = {
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        username: `user${Math.floor(Math.random() * 1000)}`,
        password: `pass${Math.floor(Math.random() * 10000)}`, // In production, use proper encryption
        accessUrl: demoUrls[Math.floor(Math.random() * demoUrls.length)]
      };

      // Update the rental
      rental.accessDetails = accessDetails;
      await rental.save();
      console.log(`Added access details to rental ID: ${rental._id}`);
    }

    console.log('Access details added successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
