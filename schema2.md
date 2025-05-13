# Current MongoDB Schema for CloudComputeMarketPlace

This document outlines the current MongoDB schema implementation for the CloudComputeMarketPlace platform as of May 13, 2025.

## Core Collections

### 1. Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Not returned in queries by default
  },
  profileType: {
    type: String,
    enum: ['buyer', 'seller', 'both'],
    default: 'buyer'
  },
  profilePicture: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/pixel-art/svg?seed=anonymous-${this._id || Date.now()}`;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### 2. Computers (Listings)
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  specs: {
    cpu: {
      type: String,
      required: true
    },
    gpu: {
      type: String,
      required: true
    },
    ram: {
      type: String,
      required: true
    },
    storage: {
      type: String,
      required: true
    },
    operatingSystem: {
      type: String,
      required: true
    }
  },
  location: {
    type: String,
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  price: {
    hourly: {
      type: Number,
      required: true
    },
    daily: {
      type: Number,
      required: true
    },
    weekly: {
      type: Number,
      required: true
    },
    monthly: {
      type: Number,
      required: true
    }
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance', 'offline'],
      default: 'available'
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
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: ObjectId,
      ref: 'User'
    },
    text: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### 3. Rentals (Orders)
```javascript
{
  _id: ObjectId,
  computer: {
    type: ObjectId,
    ref: 'Computer',
    required: true
  },
  renter: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  rentalType: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['credit_card', 'paypal', 'crypto', 'automatic', 'other']
    },
    transactionId: String,
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date
  },
  accessDetails: {
    ipAddress: String,
    username: String,
    password: String,
    accessUrl: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### 4. Conversations
```javascript
{
  _id: ObjectId,
  computer: {
    type: ObjectId,
    ref: 'Computer',
    required: true
  },
  buyer: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: ObjectId,
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
}
```

### 5. Messages
```javascript
{
  _id: ObjectId,
  conversation: {
    type: ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

## Key Differences from Original Schema

### User Model
1. Simplified user model without wallet functionality
2. Added profileType field to distinguish between buyers and sellers
3. Using Dicebear API for default profile pictures


### Computer Model (vs. Listings in original schema)
1. More structured specifications for hardware components
2. Detailed availability management with status and scheduled maintenance
3. Direct embedding of reviews instead of separate collection
4. Categories implemented as an array of strings rather than references

### Rental Model (vs. Orders in original schema)
1. Direct references to both renter and owner
2. Simplified payment information
3. Added access details directly in rental document for remote access

### Messaging System
1. Implemented a two-level system with Conversations and Messages
2. Tracking of unread messages for both buyer and owner
3. Direct association with specific computer listings

## Schema Relationships
 multiple computers)
2. **User → Rentals (as renter)**: One-to-many (A user can rent multiple computers)
3. **User → Rentals (as owner)**: One-to-many (A user can have multiple rentals of their computers)
4. **Computer → Rentals**: One-to-many (A computer can be rented multiple times)
5. **Computer → Conversations**: One-to-many (A computer listing can have multiple conversation threads)
6. **Conversation → Messages**: One-to-many (A conversation contains multiple messages)

## Implementation Notes

1. **Authentication**: JWT-based authentication with bcrypt for password hashing
2. **Rental Process**: 
   - Rentals start as 'pending'
   - Owner provides access details
   - Rental becomes 'active' during the rental period
   - Automatically completed after end date
3. **Pagination**: Computer listings support pagination with customizable limits
4. **Search & Filtering**: Computers collection supports searching by text and category filtering
5. **User Roles**: Users can operate as buyers, sellers, or both
6. **Real-time Messaging**: Conversations and messages track read status for notifications

## Missing Features (Compared to Original Design)

1. No separate Categories collection - categories are strings within the Computer model
2. No dedicated TimeSlots collection - availability is managed through active periods
3. No dedicated Notifications collection - notifications would need to be implemented
4. No wallet/balance tracking for users

1. **User → Computers**: One-to-many (A user can list