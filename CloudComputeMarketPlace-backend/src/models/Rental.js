const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  computer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Computer',
    required: true,
  },
  renter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date'],
  },
  rentalType: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    required: [true, 'Please specify rental type'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add a total price'],
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },  paymentInfo: {
    method: {
      type: String,
      enum: ['credit_card', 'paypal', 'crypto', 'other'],
    },
    transactionId: String,
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  accessDetails: {
    ipAddress: String,
    username: String,
    password: String, // encrypted
    accessUrl: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Rental', RentalSchema);
