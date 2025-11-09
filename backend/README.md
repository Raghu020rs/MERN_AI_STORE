# AI Tools Marketplace - Backend API

Complete backend API for the AI Tools Marketplace with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the backend folder:

```env
# Copy from .env.example and fill in your values
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CLIENT_URL=http://localhost:3000
```

### 3. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Paste in `.env` file as `MONGODB_URI`

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server will start at: **http://localhost:5000**

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "...",
      "role": "user",
      "stats": {...}
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <accessToken>
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

#### Update Profile
```http
PUT /api/auth/updateprofile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "New bio...",
  "avatar": "https://..."
}
```

#### Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## 🏗️ Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── errorHandler.js      # Error handling
│   └── validate.js          # Request validation
├── models/
│   └── User.js              # User model
├── routes/
│   └── authRoutes.js        # Auth routes
├── utils/                   # Utility functions
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Express app entry point
└── README.md               # This file
```

## 🔐 Features Implemented

### ✅ User Authentication System

- **Register**: Create new user with email/password
- **Login**: JWT-based authentication (15min access + 7day refresh tokens)
- **Logout**: Clear tokens and sessions
- **Get Profile**: Fetch current user data
- **Update Profile**: Update name, bio, avatar
- **Update Password**: Change password securely
- **Refresh Token**: Get new access token without re-login

### ✅ Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens (access + refresh)
- HTTP-only cookies for refresh tokens
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- Input validation with express-validator
- CORS protection
- Error handling middleware

### ✅ Database Features

- MongoDB with Mongoose ODM
- User model with validations
- Indexes for performance
- Virtual fields
- Pre-save hooks for password hashing
- Public profile method

## 🧪 Testing with Postman

### 1. Register a New User

```
POST http://localhost:5000/api/auth/register

Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login

```
POST http://localhost:5000/api/auth/login

Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the `accessToken` from response.

### 3. Get Current User

```
GET http://localhost:5000/api/auth/me

Headers:
Authorization: Bearer <paste_your_access_token_here>
```

### 4. Update Profile

```
PUT http://localhost:5000/api/auth/updateprofile

Headers:
Authorization: Bearer <your_access_token>

Body (JSON):
{
  "name": "Updated Name",
  "bio": "This is my new bio"
}
```

## 📊 Database Schema

### User Model

```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  avatar: String (auto-generated from DiceBear),
  bio: String (max 500 chars),
  role: String (user/admin/moderator),
  isVerified: Boolean (default: false),
  bookmarks: [ObjectId] (ref: Tool),
  collections: [ObjectId] (ref: Collection),
  stats: {
    totalReviews: Number,
    totalBookmarks: Number,
    totalCollections: Number,
    totalInstallations: Number
  },
  isActive: Boolean (default: true),
  lastLogin: Date,
  refreshToken: String,
  timestamps: true (createdAt, updatedAt)
}
```

## 🛠️ Next Steps

Now that User Authentication is complete, you can:

1. ✅ Test all authentication endpoints with Postman
2. 📦 Build Tool model and CRUD operations
3. ⭐ Build Bookmarks system
4. 📝 Build Reviews system
5. 📁 Build Collections system
6. 👨‍💼 Build Admin panel
7. 🔗 Connect frontend to backend

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check your `MONGODB_URI` in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user credentials

### JWT Token Invalid
- Make sure `JWT_SECRET` is set in `.env`
- Check if token is being sent in Authorization header
- Token might be expired (15min default)

### Port Already in Use
- Change `PORT` in `.env` to different number (e.g., 5001)
- Or kill the process using port 5000

## 📝 Environment Variables

Required variables in `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## 🎯 Success Checklist

- [x] Backend folder structure created
- [x] Dependencies installed
- [x] MongoDB connection working
- [x] User model created
- [x] Authentication middleware
- [x] Auth controller with all endpoints
- [x] Auth routes configured
- [x] Server running successfully
- [x] Error handling implemented
- [x] Input validation working
- [ ] Tested with Postman
- [ ] Frontend integration pending

---

**Backend is ready! 🎉 Now test the API endpoints and proceed to build more features.**
