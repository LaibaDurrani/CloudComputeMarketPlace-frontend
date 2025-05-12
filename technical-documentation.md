# CloudComputeMarketPlace - Technical Documentation

## System Architecture

### Overview

CloudComputeMarketPlace is built using the MERN stack (MongoDB, Express.js, React, Node.js) with a clear separation between frontend and backend services. The system follows a RESTful API architecture with stateless communication between client and server.

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │<────>│  Express API    │<────>│  MongoDB        │
│  (Vite)         │      │  (Node.js)      │      │  Database       │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Frontend Architecture

The frontend is built with React.js and uses a component-based architecture with context-based state management:

```
┌─────────────────────────────────────────────────────┐
│                     App                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐    │
│  │           │  │           │  │               │    │
│  │  Auth     │  │  UI       │  │  API          │    │
│  │  Context  │  │  Context  │  │  Services     │    │
│  │           │  │           │  │               │    │
│  └───────────┘  └───────────┘  └───────────────┘    │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │                Components                     │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │  │
│  │  │         │ │         │ │                 │  │  │
│  │  │  Pages  │ │  UI     │ │  Feature        │  │  │
│  │  │         │ │  Shared │ │  Components     │  │  │
│  │  └─────────┘ └─────────┘ └─────────────────┘  │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Backend Architecture

The backend follows an MVC (Model-View-Controller) pattern:

```
┌─────────────────────────────────────────────────────┐
│                Express Application                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐    │
│  │           │  │           │  │               │    │
│  │  Routes   │  │Controllers│  │  Models       │    │
│  │           │  │           │  │               │    │
│  └───────────┘  └───────────┘  └───────────────┘    │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │                Middleware                     │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │  │
│  │  │         │ │         │ │                 │  │  │
│  │  │  Auth   │ │ Error   │ │  Validation     │  │  │
│  │  │         │ │ Handler │ │                 │  │  │
│  │  └─────────┘ └─────────┘ └─────────────────┘  │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Database Schema

### User Schema

```javascript
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  profileType: {
    type: String,
    enum: ['buyer', 'seller', 'both'],
    default: 'buyer'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Computer Schema

```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
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
      enum: ['available', 'rented', 'unavailable'],
      default: 'available'
    }
  },
  categories: [String],
  photos: [String],
  averageRating: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: String,
      rating: Number,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Rental Schema

```javascript
{
  computer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Computer',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
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
      enum: ['credit_card', 'paypal', 'crypto'],
      required: true
    },
    transactionId: {
      type: String
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    }
  },
  accessDetails: {
    ipAddress: {
      type: String
    },
    username: {
      type: String
    },
    password: {
      type: String
    },
    accessUrl: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Conversation Schema

```javascript
{
  computer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Computer',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  lastMessage: {
    type: String
  },
  lastMessageDate: {
    type: Date
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

### Message Schema

```javascript
{
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
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

## API Endpoints Documentation

### Authentication Endpoints

#### Register User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Description:** Create a new user account
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "profileType": "both"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60a1e2c9c7d1e123456789ab",
      "name": "John Doe",
      "email": "john@example.com",
      "profileType": "both"
    }
  }
  ```

#### Login User
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticate a user and get token
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60a1e2c9c7d1e123456789ab",
      "name": "John Doe",
      "email": "john@example.com",
      "profileType": "both"
    }
  }
  ```

#### Get Current User
- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Description:** Get current authenticated user's profile
- **Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "60a1e2c9c7d1e123456789ab",
      "name": "John Doe",
      "email": "john@example.com",
      "profileType": "both",
      "profilePicture": "https://example.com/profile.jpg",
      "createdAt": "2023-04-20T12:00:00.000Z"
    }
  }
  ```

### Computer Endpoints

#### Get All Computers
- **URL:** `/api/computers`
- **Method:** `GET`
- **Description:** Get a list of all available computers
- **Query Parameters:**
  - `search`: Search term for filtering
  - `category`: Filter by computer category
  - `limit`: Number of results per page (default: 10)
  - `page`: Page number (default: 1)
- **Response:**
  ```json
  {
    "success": true,
    "count": 2,
    "pagination": {
      "current": 1,
      "total": 1
    },
    "data": [
      {
        "id": "60a1e2c9c7d1e123456789ac",
        "title": "High-Performance GPU Server",
        "specs": {
          "cpu": "AMD Ryzen 9 7950X",
          "gpu": "NVIDIA RTX 4090",
          "ram": "128GB DDR5-6000",
          "storage": "4TB NVMe SSD",
          "operatingSystem": "Ubuntu 22.04 LTS"
        },
        "price": {
          "hourly": 5.99,
          "daily": 99.99,
          "weekly": 599.99,
          "monthly": 1999.99
        },
        "categories": ["AI & Machine Learning", "3D Rendering"]
      },
      {
        "id": "60a1e2c9c7d1e123456789ad",
        "title": "Web Development Workstation",
        "specs": {
          "cpu": "Intel Core i7-13700K",
          "gpu": "NVIDIA RTX 4070",
          "ram": "64GB DDR5-5600",
          "storage": "2TB NVMe SSD",
          "operatingSystem": "Windows 11 Pro"
        },
        "price": {
          "hourly": 3.99,
          "daily": 59.99,
          "weekly": 349.99,
          "monthly": 1199.99
        },
        "categories": ["Software Development", "Web Development"]
      }
    ]
  }
  ```

#### Get Single Computer
- **URL:** `/api/computers/:id`
- **Method:** `GET`
- **Description:** Get detailed information about a specific computer
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "60a1e2c9c7d1e123456789ac",
      "user": {
        "id": "60a1e2c9c7d1e123456789ab",
        "name": "John Doe",
        "profilePicture": "https://example.com/profile.jpg"
      },
      "title": "High-Performance GPU Server",
      "description": "A powerful GPU server with NVIDIA RTX 4090 for machine learning, rendering, and other GPU-intensive tasks.",
      "specs": {
        "cpu": "AMD Ryzen 9 7950X",
        "gpu": "NVIDIA RTX 4090",
        "ram": "128GB DDR5-6000",
        "storage": "4TB NVMe SSD",
        "operatingSystem": "Ubuntu 22.04 LTS"
      },
      "location": "New York, USA",
      "price": {
        "hourly": 5.99,
        "daily": 99.99,
        "weekly": 599.99,
        "monthly": 1999.99
      },
      "availability": {
        "status": "available"
      },
      "categories": ["AI & Machine Learning", "3D Rendering"],
      "photos": [
        "https://example.com/computer1.jpg",
        "https://example.com/computer2.jpg"
      ],
      "averageRating": 4.9,
      "reviews": [
        {
          "user": {
            "id": "60a1e2c9c7d1e123456789ae",
            "name": "Alice Buyer"
          },
          "text": "Excellent machine for my AI training needs!",
          "rating": 5,
          "createdAt": "2023-05-15T10:30:00.000Z"
        }
      ],
      "createdAt": "2023-04-20T12:00:00.000Z"
    }
  }
  ```

### Rental Endpoints

#### Create Rental
- **URL:** `/api/rentals`
- **Method:** `POST`
- **Description:** Create a new rental for a computer
- **Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Request Body:**
  ```json
  {
    "computer": "60a1e2c9c7d1e123456789ac",
    "startDate": "2023-06-01T00:00:00.000Z",
    "endDate": "2023-06-08T00:00:00.000Z",
    "rentalType": "weekly",
    "paymentInfo": {
      "method": "credit_card",
      "transactionId": "txn_123456789"
    }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "60a1e2c9c7d1e123456789af",
      "computer": "60a1e2c9c7d1e123456789ac",
      "renter": "60a1e2c9c7d1e123456789ae",
      "owner": "60a1e2c9c7d1e123456789ab",
      "startDate": "2023-06-01T00:00:00.000Z",
      "endDate": "2023-06-08T00:00:00.000Z",
      "rentalType": "weekly",
      "totalPrice": 599.99,
      "status": "pending",
      "paymentInfo": {
        "method": "credit_card",
        "transactionId": "txn_123456789",
        "isPaid": true,
        "paidAt": "2023-05-20T15:45:00.000Z"
      },
      "createdAt": "2023-05-20T15:45:00.000Z"
    }
  }
  ```

### Conversation Endpoints

#### Get User Conversations
- **URL:** `/api/conversations`
- **Method:** `GET`
- **Description:** Get all conversations for current user
- **Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "60a1e2c9c7d1e123456789b0",
        "computer": {
          "id": "60a1e2c9c7d1e123456789ac",
          "title": "High-Performance GPU Server"
        },
        "buyer": {
          "id": "60a1e2c9c7d1e123456789ae",
          "name": "Alice Buyer",
          "profilePicture": "https://example.com/alice.jpg"
        },
        "owner": {
          "id": "60a1e2c9c7d1e123456789ab",
          "name": "John Doe",
          "profilePicture": "https://example.com/john.jpg"
        },
        "lastMessage": "Is this computer still available?",
        "lastMessageDate": "2023-05-19T09:23:00.000Z",
        "unreadBuyer": 0,
        "unreadOwner": 1
      }
    ]
  }
  ```

#### Send Message
- **URL:** `/api/conversations/:id/messages`
- **Method:** `POST`
- **Description:** Send a new message in a conversation
- **Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Request Body:**
  ```json
  {
    "content": "Yes, it's available. When would you like to rent it?"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "60a1e2c9c7d1e123456789b1",
      "conversation": "60a1e2c9c7d1e123456789b0",
      "sender": {
        "id": "60a1e2c9c7d1e123456789ab",
        "name": "John Doe",
        "profilePicture": "https://example.com/john.jpg"
      },
      "content": "Yes, it's available. When would you like to rent it?",
      "isRead": false,
      "createdAt": "2023-05-19T10:15:00.000Z"
    }
  }
  ```

## Frontend Component Structure

### Key Components

#### Authentication Components
- `LoginPopup`: Modal for user login
- `SignupPopup`: Modal for user registration
- `PrivateRoute`: Route wrapper for authenticated pages

#### Layout Components
- `Header`: Main navigation header
- `Sidebar`: Context-specific navigation sidebar
- `Footer`: Site footer with links and information

#### Page Components
- `LandingPage`: Homepage with feature showcase
- `Dashboard`: User's main dashboard
- `ComputerDetails`: Computer listing details
- `AddComputer`: Form for adding new computer
- `ConversationsManagement`: Message center
- `Profile`: User profile management
- `RentalHistory`: List of past and current rentals
- `Checkout`: Rental booking process

#### Feature Components
- `ChatBox`: Messaging interface for computer listings
- `ComputerCard`: Card display for computer listings
- `SearchFilters`: Search and filtering interface
- `RatingStars`: Star rating display and input

### Context Providers

```javascript
// AuthContext.jsx
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/me');
        setCurrentUser(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error checking authentication:', err);
        setCurrentUser(null);
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setError(null);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', userData);
      
      localStorage.setItem('token', res.data.token);
      setCurrentUser(res.data.user);
      setError(null);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const authContextValue = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Key Technical Challenges and Solutions

### Challenge 1: User Authentication

**Challenge:** Implementing secure authentication with role-based access control.

**Solution:** Used JWT tokens with expiration and role encoding. The authentication middleware verifies tokens on protected routes and checks user roles for appropriate authorization.

```javascript
// auth.js middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.profileType)) {
      return res.status(403).json({
        success: false,
        error: `User with profile type ${req.user.profileType} is not authorized to access this route`
      });
    }
    next();
  };
};
```

### Challenge 2: Real-time Messaging

**Challenge:** Implementing an efficient messaging system with unread message tracking.

**Solution:** Created a conversation model that tracks messages and unread counts for each participant. When a user sends a message, the system increments the unread counter for the recipient.

```javascript
// conversationController.js
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }
    
    // Find the conversation
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }
    
    // Check if user is part of this conversation
    const buyerId = conversation.buyer._id ? conversation.buyer._id.toString() : conversation.buyer.toString();
    const ownerId = conversation.owner._id ? conversation.owner._id.toString() : conversation.owner.toString();
    
    if (buyerId !== req.user.id && ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to send message in this conversation'
      });
    }
    
    // Create the message
    const message = await Message.create({
      conversation: req.params.id,
      sender: req.user.id,
      content
    });
    
    // Update conversation with last message info
    const isBuyer = req.user.id === buyerId;
    await Conversation.findByIdAndUpdate(req.params.id, {
      lastMessage: content,
      lastMessageDate: Date.now(),
      // Increment unread counter for the recipient
      ...(isBuyer ? { unreadOwner: conversation.unreadOwner + 1 } : { unreadBuyer: conversation.unreadBuyer + 1 })
    });
    
    // Populate the sender info for response
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name profilePicture');
    
    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
```

### Challenge 3: Search and Filtering

**Challenge:** Creating an efficient search and filtering system for computer listings.

**Solution:** Implemented advanced filtering in the frontend with multiple criteria including hardware specifications, categories, and text search.

```jsx
// Dashboard.jsx
const filteredComputers = computers
  .filter(computer => {
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      return (
        (computer.title && computer.title.toLowerCase().includes(searchLower)) ||
        (computer.description && computer.description.toLowerCase().includes(searchLower)) ||
        (computer.specs && computer.specs.cpu && computer.specs.cpu.toLowerCase().includes(searchLower)) ||
        (computer.specs && computer.specs.gpu && computer.specs.gpu.toLowerCase().includes(searchLower)) ||
        (computer.specs && computer.specs.ram && computer.specs.ram.toLowerCase().includes(searchLower)) ||
        (computer.specs && computer.specs.storage && computer.specs.storage.toLowerCase().includes(searchLower)) ||
        (computer.specs && computer.specs.operatingSystem && computer.specs.operatingSystem.toLowerCase().includes(searchLower)) ||
        (computer.location && computer.location.toLowerCase().includes(searchLower)) ||
        (computer.categories && computer.categories.some(category => category.toLowerCase().includes(searchLower)))
      );
    }
    return true;
  })
  .filter(computer => {
    // Filter by category
    if (selectedCategory && computer.categories) {
      return computer.categories.includes(selectedCategory);
    }
    return true;
  });
```

## Testing

### Unit Tests

Sample Jest test for the Authentication controller:

```javascript
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          profileType: 'buyer'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'Test User');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).toHaveProperty('profileType', 'buyer');
    });

    it('should not register user with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another Test',
          email: 'test@example.com',
          password: 'anotherpassword',
          profileType: 'seller'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'Test User');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
```

## Deployment

### Production Deployment Checklist

1. **Environment Configuration**
   - Set up production environment variables
   - Configure database connection strings
   - Set appropriate security settings

2. **Build Process**
   - Frontend: Build optimized React bundle
   - Backend: Prepare Node.js application for production

3. **Database Configuration**
   - Set up MongoDB Atlas cluster
   - Configure database indexes
   - Set up database backup strategy

4. **Hosting Setup**
   - Backend: Deploy to Node.js hosting (Heroku, AWS, etc.)
   - Frontend: Deploy to static hosting (Netlify, Vercel, etc.)
   - Configure domains and DNS

5. **Security Measures**
   - Enable HTTPS
   - Configure CORS settings
   - Set up rate limiting
   - Implement server-side validation

6. **Monitoring and Logging**
   - Set up error tracking (Sentry, LogRocket)
   - Implement server monitoring
   - Configure log aggregation

## Performance Optimizations

1. **Database Indexing**
   ```javascript
   // Create indexes for frequently queried fields
   computerSchema.index({ title: 'text', description: 'text' });
   computerSchema.index({ categories: 1 });
   rentalSchema.index({ renter: 1, status: 1 });
   rentalSchema.index({ owner: 1, status: 1 });
   conversationSchema.index({ buyer: 1, owner: 1 });
   ```

2. **API Response Optimization**
   ```javascript
   // Limit fields returned by the API
   exports.getAllComputers = async (req, res) => {
     const select = 'title specs price categories photos averageRating';
     const computers = await Computer.find({ 'availability.status': 'available' })
       .select(select)
       .populate('user', 'name profilePicture');
     
     res.status(200).json({
       success: true,
       count: computers.length,
       data: computers
     });
   };
   ```

3. **Frontend Performance**
   ```javascript
   // Lazy loading components
   const ComputerDetails = React.lazy(() => import('./pages/computerDetails'));
   const ConversationsManagement = React.lazy(() => import('./components/ConversationsManagement'));
   
   // In the router
   <Route 
     path="/computer/:id" 
     element={
       <React.Suspense fallback={<LoadingSpinner />}>
         <ComputerDetails />
       </React.Suspense>
     } 
   />
   ```

---

This technical documentation provides an in-depth look at the implementation details of the CloudComputeMarketPlace platform. The documentation is intended for developers who need to understand the system architecture, API endpoints, database schema, and key technical challenges and solutions.

For more information, refer to the project codebase and inline documentation.
