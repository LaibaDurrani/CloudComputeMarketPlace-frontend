# Cloud Compute Marketplace

A platform where users can rent out their computers when they are not in use, and others can rent these computers for various computational tasks.

## Project Structure

- **CloudComputeMarketPlace-frontend** - React frontend built with Vite
- **CloudComputeMarketPlace-backend** - Node.js/Express/MongoDB backend

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas connection)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd CloudComputeMarketPlace-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content (adjust as needed):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cloudcomputemarketplace
JWT_SECRET=cloudcomputesecret
JWT_EXPIRE=30d
```

4. Start the backend server:

```bash
npm run dev
```

The backend server will start on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd CloudComputeMarketPlace-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend development server will start on http://localhost:5173

## Features Implemented

- User Authentication (Login/Register)
- User Profiles
- Computer Listing Management

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/logout` - Logout a user

### Profile

- `PUT /api/profile` - Update user profile
- `PUT /api/profile/password` - Change password
- `GET /api/profile/computers` - Get user's computers
- `GET /api/profile/rentals` - Get user's rentals
- `GET /api/profile/rentedout` - Get user's rented out computers

### Computers

- `GET /api/computers` - Get all computers
- `GET /api/computers/:id` - Get single computer
- `POST /api/computers` - Create new computer listing
- `PUT /api/computers/:id` - Update computer listing
- `DELETE /api/computers/:id` - Delete computer listing

### Rentals

- `GET /api/rentals` - Get all rentals (admin only)
- `GET /api/rentals/:id` - Get single rental (owner or renter only)
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/:id` - Update rental status

## Next Steps

- Implement computer search functionality
- Add payment processing
- Develop scheduling system
- Create admin dashboard
- Add notifications
- Implement real-time messaging between renters and owners
