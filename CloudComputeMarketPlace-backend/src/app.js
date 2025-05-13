const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Import index creation utility
const { createIndexes } = require('./config/indexes');

// Route files
const routes = require('./routes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/', routes);

// Error handler middleware
app.use(errorHandler);

// Create database indexes when app starts (non-blocking)
createIndexes().catch(err => console.error('Error creating indexes:', err));

module.exports = app;
