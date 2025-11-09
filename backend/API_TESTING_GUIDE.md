# 🧪 API Testing Guide with Postman

Complete guide to test all authentication endpoints of your AI Tools Marketplace backend.

---

## 📋 Prerequisites

1. ✅ Backend server running: `cd backend && npm run dev`
2. ✅ MongoDB Atlas connected (green success message)
3. 📦 Postman installed: [Download Postman](https://www.postman.com/downloads/)

---

## 🚀 Quick Start

### Base URL
All API endpoints start with:
```
http://localhost:5000/api
```

### Test Server Health

**Endpoint**: `GET http://localhost:5000/health`

**Expected Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-18T10:30:00.000Z"
}
```

✅ If this works, your server is running correctly!

---

## 🔐 Authentication Endpoints Testing

### 1. Register New User

**Endpoint**: `POST http://localhost:5000/api/auth/register`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "name": "Raghu Kumar",
  "email": "raghu@example.com",
  "password": "password123"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "67129abc123def456789",
      "name": "Raghu Kumar",
      "email": "raghu@example.com",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=raghu@example.com",
      "bio": "",
      "role": "user",
      "isVerified": false,
      "stats": {
        "totalReviews": 0,
        "totalBookmarks": 0,
        "totalCollections": 0,
        "totalInstallations": 0
      },
      "createdAt": "2025-10-18T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

📝 **Action**: Copy the `accessToken` for next requests!

---

### 2. Login User

**Endpoint**: `POST http://localhost:5000/api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "email": "raghu@example.com",
  "password": "password123"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "67129abc123def456789",
      "name": "Raghu Kumar",
      "email": "raghu@example.com",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get Current User Profile

**Endpoint**: `GET http://localhost:5000/api/auth/me`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important**: Replace with your actual `accessToken` from login/register!

**Expected Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "67129abc123def456789",
    "name": "Raghu Kumar",
    "email": "raghu@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=raghu@example.com",
    "bio": "",
    "role": "user",
    "isVerified": false,
    "stats": {
      "totalReviews": 0,
      "totalBookmarks": 0,
      "totalCollections": 0,
      "totalInstallations": 0
    },
    "createdAt": "2025-10-18T10:30:00.000Z"
  }
}
```

---

### 4. Update User Profile

**Endpoint**: `PUT http://localhost:5000/api/auth/updateprofile`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <your_access_token>
```

**Body** (raw JSON):
```json
{
  "name": "Raghu Kumar Updated",
  "bio": "Full Stack Developer | AI Enthusiast | Building amazing projects",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=raghu"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "67129abc123def456789",
    "name": "Raghu Kumar Updated",
    "bio": "Full Stack Developer | AI Enthusiast | Building amazing projects",
    ...
  }
}
```

---

### 5. Update Password

**Endpoint**: `PUT http://localhost:5000/api/auth/updatepassword`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <your_access_token>
```

**Body** (raw JSON):
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": { ... },
    "accessToken": "new_token...",
    "refreshToken": "new_refresh_token..."
  }
}
```

---

### 6. Refresh Access Token

**Endpoint**: `POST http://localhost:5000/api/auth/refresh`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token..."
  }
}
```

---

### 7. Logout User

**Endpoint**: `POST http://localhost:5000/api/auth/logout`

**Headers**:
```
Authorization: Bearer <your_access_token>
```

**No Body Required**

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "User logged out successfully",
  "data": {}
}
```

---

## 📂 Postman Collection

### Create Collection in Postman

1. Open Postman
2. Click **"Collections"** → **"+"** (New Collection)
3. Name it: `AI Tools Marketplace API`
4. Create folders:
   - **Authentication**
   - **Tools** (future)
   - **Bookmarks** (future)
   - **Reviews** (future)
   - **Collections** (future)
   - **Admin** (future)

### Add Requests

For each endpoint above:
1. Click **"Add Request"** in Authentication folder
2. Set method (GET/POST/PUT)
3. Enter URL
4. Add headers
5. Add body (if required)
6. Click **"Send"**

---

## 🔧 Testing Scenarios

### Scenario 1: Complete User Flow

```
1. Register new user ✅
2. Copy accessToken ✅
3. Get user profile (with token) ✅
4. Update profile (name, bio) ✅
5. Update password ✅
6. Logout ✅
7. Login again with new password ✅
```

### Scenario 2: Error Testing

**Test Invalid Login**:
```json
{
  "email": "wrong@example.com",
  "password": "wrongpass"
}
```

**Expected**: 401 Unauthorized

**Test Duplicate Registration**:
```json
{
  "name": "Test",
  "email": "raghu@example.com",  // Already exists
  "password": "password123"
}
```

**Expected**: 400 Bad Request - "User with this email already exists"

**Test Weak Password**:
```json
{
  "name": "Test",
  "email": "test@example.com",
  "password": "123"  // Too short
}
```

**Expected**: 400 Bad Request - Validation error

**Test Without Token**:
- Try accessing `/api/auth/me` without Authorization header

**Expected**: 401 Unauthorized - "Not authorized to access this route"

---

## 🎯 Validation Testing

### Register Validation

**Missing Name**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
**Expected**: 400 - "Name is required"

**Invalid Email**:
```json
{
  "name": "Test",
  "email": "invalid-email",
  "password": "password123"
}
```
**Expected**: 400 - "Please provide a valid email"

**Short Password**:
```json
{
  "name": "Test",
  "email": "test@example.com",
  "password": "123"
}
```
**Expected**: 400 - "Password must be at least 6 characters"

**Password Without Number**:
```json
{
  "name": "Test",
  "email": "test@example.com",
  "password": "password"
}
```
**Expected**: 400 - "Password must contain at least one number"

---

## 📊 Check MongoDB Atlas

After testing, verify data in MongoDB:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Browse Collections"**
3. Select database: `ai-marketplace`
4. Select collection: `users`
5. You should see your registered user(s)!

**Example Document**:
```json
{
  "_id": "67129abc123def456789",
  "name": "Raghu Kumar",
  "email": "raghu@example.com",
  "password": "$2a$10$...",  // Hashed
  "avatar": "https://...",
  "role": "user",
  "bookmarks": [],
  "stats": {
    "totalReviews": 0,
    "totalBookmarks": 0,
    ...
  },
  "createdAt": "2025-10-18T10:30:00.000Z",
  "updatedAt": "2025-10-18T10:30:00.000Z"
}
```

---

## 🐛 Common Errors & Solutions

### Error: "Cannot POST /api/auth/register"

**Solution**:
- Check server is running
- Verify URL is correct
- Ensure method is POST, not GET

### Error: "Token is invalid or has expired"

**Solution**:
- Token expired (15 minutes)
- Login again to get new token
- Or use refresh token endpoint

### Error: "MongooseServerSelectionError"

**Solution**:
- Check MongoDB connection
- Verify MONGODB_URI in .env
- Ensure internet connection

### Error: "Validation failed"

**Solution**:
- Check request body format
- Ensure all required fields present
- Verify data types match schema

---

## 🎓 Next Steps

After successful testing:

1. ✅ All authentication endpoints working
2. 📦 **Build Tool Model** - Add 128 AI tools to database
3. ⭐ **Build Bookmarks API** - Save/remove bookmarks
4. 📝 **Build Reviews API** - Create/read reviews
5. 📁 **Build Collections API** - Manage collections
6. 🔗 **Frontend Integration** - Connect React to backend

---

## 💡 Pro Tips

### Save Environment in Postman

1. Click **"Environments"** → **"+"**
2. Name: `Local Development`
3. Add variables:
   - `baseUrl` = `http://localhost:5000/api`
   - `accessToken` = `<paste your token>`
4. Use in requests: `{{baseUrl}}/auth/register`

### Auto-Update Token

1. Go to Collection Settings
2. Add Pre-request Script:
```javascript
if (pm.response.json().data.accessToken) {
  pm.environment.set("accessToken", pm.response.json().data.accessToken);
}
```

---

## 📝 Testing Checklist

Complete testing checklist:

- [ ] Health check endpoint works
- [ ] Register new user successfully
- [ ] Login with correct credentials
- [ ] Get user profile with valid token
- [ ] Update profile (name, bio, avatar)
- [ ] Update password successfully
- [ ] Refresh access token works
- [ ] Logout clears tokens
- [ ] Test invalid credentials (401 error)
- [ ] Test duplicate email (400 error)
- [ ] Test validation errors (missing fields)
- [ ] Test without authorization header (401)
- [ ] Verify user in MongoDB Atlas
- [ ] Password is hashed in database
- [ ] Avatar auto-generated correctly

---

**Authentication system is fully working! 🎉**

Proceed to build Tool, Bookmark, Review, and Collection features!
