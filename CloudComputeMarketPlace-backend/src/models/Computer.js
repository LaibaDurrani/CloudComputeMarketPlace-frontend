const mongoose = require('mongoose');

const ComputerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  specs: {
    cpu: {
      type: String,
      required: [true, 'Please add a CPU specification'],
    },
    gpu: {
      type: String,
      required: [true, 'Please add a GPU specification'],
    },
    ram: {
      type: String,
      required: [true, 'Please add RAM specification'],
    },
    storage: {
      type: String,
      required: [true, 'Please add storage specification'],
    },
    operatingSystem: {
      type: String,
      required: [true, 'Please add operating system'],
    },
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  price: {
    hourly: {
      type: Number,
      required: [true, 'Please add hourly price'],
    },
    daily: {
      type: Number,
      required: [true, 'Please add daily price'],
    },
    weekly: {
      type: Number,
      required: [true, 'Please add weekly price'],
    },
    monthly: {
      type: Number,
      required: [true, 'Please add monthly price'],
    },
  },  availability: {
    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance', 'offline'],
      default: 'available',
    },
    scheduledMaintenanceDates: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }],
    activePeriods: [{
      startDate: Date,
      endDate: Date
    }]
  },
  photos: [String],
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    text: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Computer', ComputerSchema);
