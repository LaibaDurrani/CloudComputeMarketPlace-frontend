const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log(`MongoDB URI: ${process.env.MONGO_URI.substring(0, process.env.MONGO_URI.indexOf('@') + 1)}***********`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.error('Please check your MongoDB connection string and credentials');
    process.exit(1);
  }
};

module.exports = connectDB;
