# MongoDB Schema Design for CloudComputeMarketPlace

This document outlines the MongoDB schema design for the CloudComputeMarketPlace platform, aligned with the current frontend structure.

## Core Collections

### 1. Users
```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // hashed
  name: String,
  role: String, // "user", "admin", "provider"
  profilePicture: String, // URL
  wallet: {
    balance: Number,
    transactions: [
      {
        amount: Number,
        type: String, // "deposit", "withdrawal", "purchase", "sale"
        description: String,
        date: Date
      }
    ]
  },
  settings: {
    notifications: Boolean,
    theme: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Listings
```javascript
{
  _id: ObjectId,
  providerId: ObjectId, // reference to User
  title: String,
  description: String,
  category: String, // "compute", "storage", "gpu", etc.
  specs: {
    cpu: {
      cores: Number,
      model: String,
      speed: String
    },
    ram: {
      capacity: Number,
      type: String
    },
    storage: {
      capacity: Number,
      type: String // "SSD", "HDD", etc.
    },
    gpu: {
      model: String,
      memory: Number,
      quantity: Number // Number of GPUs (e.g., 2x NVIDIA A100)
    },
    os: {
      name: String,
      version: String
    }
  },
  pricing: {
    hourlyRate: Number,
    currency: String
  },
  availability: {
    availableFrom: Date,
    availableTo: Date // The period during which this machine is listed
  },
  location: {
    country: String,
    region: String
  },
  imageUrls: [String],
  accessInstructions: String, // Instructions on how to access once booked
  avgRating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. TimeSlots
```javascript
{
  _id: ObjectId,
  listingId: ObjectId,
  date: Date, // Date for this slot
  slots: [
    {
      hour: Number, // 0-23 representing the hour of the day
      status: String, // "available", "booked"
      bookedById: ObjectId, // User ID if booked
      orderId: ObjectId // Order ID if booked
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Orders
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  providerId: ObjectId,
  listingId: ObjectId,
  timeSlots: [
    {
      date: Date,
      hour: Number // 0-23 representing the hour
    }
  ],
  status: String, // "pending", "confirmed", "active", "completed", "cancelled"
  totalHours: Number,
  hourlyRate: Number,
  totalPrice: Number,
  paymentInfo: {
    method: String,
    transactionId: String,
    status: String
  },
  accessDetails: {
    ipAddress: String,
    username: String,
    password: String, // encrypted
    accessUrl: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Reviews
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  providerId: ObjectId,
  listingId: ObjectId,
  orderId: ObjectId,
  rating: Number,
  comment: String,
  createdAt: Date
}
```

### 6. Categories
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  icon: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Messages
```javascript
{
  _id: ObjectId,
  senderId: ObjectId,
  recipientId: ObjectId,
  content: String,
  read: Boolean,
  createdAt: Date
}
```

### 8. Notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // "order", "message", "system", "payment"
  message: String,
  read: Boolean,
  linkUrl: String, // URL to navigate to when clicked
  createdAt: Date
}
```

## Indexes

To optimize query performance, these indexes should be implemented:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Listings collection
db.listings.createIndex({ providerId: 1 })
db.listings.createIndex({ category: 1 })
db.listings.createIndex({ "pricing.hourlyRate": 1 })
db.listings.createIndex({ avgRating: -1 })

// TimeSlots collection
db.timeSlots.createIndex({ listingId: 1 })
db.timeSlots.createIndex({ date: 1 })
db.timeSlots.createIndex({ "slots.status": 1 })

// Orders collection
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ providerId: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ listingId: 1 })

// Reviews collection
db.reviews.createIndex({ listingId: 1 })
db.reviews.createIndex({ userId: 1 })

// Notifications collection
db.notifications.createIndex({ userId: 1, read: 1 })
```

## Schema Relationships

1. **User → Listings**: One-to-many (Provider users can have multiple listings)
2. **User → Orders**: One-to-many (Users can place multiple orders)
3. **Listing → TimeSlots**: One-to-many (A listing has multiple time slots)
4. **Listing → Orders**: One-to-many (A listing can have multiple orders)
5. **User → Reviews**: One-to-many (Users can write multiple reviews)

## Implementation Considerations

1. **Security**: Ensure passwords are hashed and sensitive data is encrypted
2. **Time Slots**: Generate hourly slots when a provider creates a listing
3. **Booking Logic**: Prevent double-booking of the same time slots
4. **Frontend Integration**: Schema aligns with the pages in your frontend structure:
   - `pages/addComputer`: Create new listings
   - `pages/computerDetails`: View listing details
   - `pages/checkout`: Process booking orders
   - `pages/myListings`: View provider's listings
   - `pages/rentalHistory`: View past orders
   - `pages/rentals`: Browse available listings
   - `pages/sellerDashboard`: Manage provider listings and earnings