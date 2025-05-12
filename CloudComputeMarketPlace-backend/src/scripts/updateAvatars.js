// This script updates all users' profile pictures to use DiceBear avatar URLs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Load models
const User = require('../models/User');

// Helper function to generate DiceBear avatar URL (same as frontend utility)
const generateAvatarUrl = (username) => {
  // Use a default seed if username is undefined/null
  const seed = username || 'anonymous';
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
};

// Connect to DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hammadarif564:hammad1234@cluster0.t3ayndk.mongodb.net/cloudcomputemarketplace?retryWrites=true&w=majority';
console.log('Connecting to MongoDB...');

// Main function to update avatars
const updateAvatars = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected');

    // Find all users
    const users = await User.find();
    console.log(`Found ${users.length} users to update`);

    // Counter for tracking progress
    let updatedCount = 0;
    let skippedCount = 0;

    // Loop through each user and update their profile picture
    for (const user of users) {
      // Generate DiceBear avatar URL using the user's name as seed
      const avatarUrl = generateAvatarUrl(user.name);
      
      // Skip update if user already has a DiceBear avatar
      if (user.profilePicture && user.profilePicture.includes('dicebear.com')) {
        console.log(`User ${user.name} already has DiceBear avatar. Skipping.`);
        skippedCount++;
        continue;
      }

      // Update user profile picture
      await User.findByIdAndUpdate(user._id, { profilePicture: avatarUrl });
      updatedCount++;
      console.log(`Updated avatar for user: ${user.name}`);
    }

    // Summary
    console.log('Avatar update complete!');
    console.log(`Total users: ${users.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

// Run the update function
updateAvatars();
