const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Get MongoDB URI from environment variable
    let mongoURI = process.env.MONGO_URI;
    
    // Log masked URI for security
    if (mongoURI && mongoURI.includes('@')) {
      console.log(`MongoDB URI: ${mongoURI.substring(0, mongoURI.indexOf('@') + 1)}***********`);
    }
    
    // Try to connect with specified URI
    try {
      const conn = await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Reduce timeout for faster fallback
      });
      
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log(`Database Name: ${conn.connection.name}`);
      return;
    } catch (remoteErr) {
      // If remote connection fails, try connecting to local MongoDB
      console.warn(`Remote MongoDB connection failed: ${remoteErr.message}`);
      console.warn('Attempting to connect to local MongoDB instance...');
      
      try {
        const localConn = await mongoose.connect('mongodb://localhost:27017/cloudcompute', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
        });
        
        console.log(`Connected to local MongoDB: ${localConn.connection.host}`);
        console.log(`Database Name: ${localConn.connection.name}`);
        return;
      } catch (localErr) {
        // If local connection also fails, throw error
        console.error('Local MongoDB connection also failed');
        throw localErr;
      }
    }
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.error('Please check your MongoDB connection string and credentials');
    console.error('Make sure you have MongoDB running locally or provide a valid remote MongoDB URI');
    process.exit(1);
  }
};

module.exports = connectDB;
