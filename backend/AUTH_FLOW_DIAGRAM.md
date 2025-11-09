# 🔐 Authentication Flow Diagram

Visual representation of how JWT authentication works in your AI Tools Marketplace.

---

## 📊 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AI TOOLS MARKETPLACE                                 │
│                     Authentication System                                │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐                                              ┌──────────────┐
│              │                                              │              │
│   FRONTEND   │                                              │   BACKEND    │
│  (React App) │                                              │  (Express)   │
│              │                                              │              │
└──────────────┘                                              └──────────────┘
       │                                                              │
       │  1. User Registration                                       │
       ├────────────────────────────────────────────────────────────>│
       │     POST /api/auth/register                                 │
       │     {                                                        │
       │       name: "Raghu",                                        │
       │       email: "raghu@example.com",                          │
       │       password: "password123"                              │
       │     }                                                        │
       │                                                              │
       │                                            2. Validate Input │
       │                                            ─────────────────>│
       │                                                              │
       │                                            3. Hash Password  │
       │                                               (bcrypt)       │
       │                                            ─────────────────>│
       │                                                              │
       │                                            4. Save to DB     │
       │                                            ─────────────────>│
       │                                                      ┌───────┴──────┐
       │                                                      │   MongoDB    │
       │                                                      │   Database   │
       │                                                      └───────┬──────┘
       │                                            5. Create JWT     │
       │                                               Tokens         │
       │                                            <─────────────────│
       │                                                              │
       │  6. Send Response                                           │
       │<────────────────────────────────────────────────────────────│
       │     {                                                        │
       │       user: {...},                                          │
       │       accessToken: "eyJ...",  // Valid 15 minutes          │
       │       refreshToken: "eyJ..."  // Valid 7 days              │
       │     }                                                        │
       │                                                              │
       │  7. Store Tokens                                            │
       │     localStorage.setItem('accessToken', ...)                │
       │     localStorage.setItem('refreshToken', ...)               │
       │                                                              │
       │                                                              │
       │  ═══════════════════════════════════════════════════════   │
       │                                                              │
       │  8. User Login                                              │
       ├────────────────────────────────────────────────────────────>│
       │     POST /api/auth/login                                    │
       │     {                                                        │
       │       email: "raghu@example.com",                          │
       │       password: "password123"                              │
       │     }                                                        │
       │                                                              │
       │                                            9. Find User      │
       │                                            ─────────────────>│
       │                                                      ┌───────┴──────┐
       │                                                      │   MongoDB    │
       │                                                      └───────┬──────┘
       │                                            10. Compare Pass  │
       │                                                (bcrypt)      │
       │                                            <─────────────────│
       │                                                              │
       │                                            11. Generate JWT  │
       │                                                Tokens        │
       │                                                              │
       │  12. Send Response                                          │
       │<────────────────────────────────────────────────────────────│
       │     {                                                        │
       │       user: {...},                                          │
       │       accessToken: "eyJ...",                               │
       │       refreshToken: "eyJ..."                               │
       │     }                                                        │
       │                                                              │
       │                                                              │
       │  ═══════════════════════════════════════════════════════   │
       │                                                              │
       │  13. Access Protected Route                                 │
       ├────────────────────────────────────────────────────────────>│
       │     GET /api/auth/me                                        │
       │     Headers:                                                │
       │       Authorization: Bearer eyJ...                          │
       │                                                              │
       │                                            14. Verify Token  │
       │                                                (JWT)         │
       │                                            ─────────────────>│
       │                                                              │
       │                                            15. Get User Data │
       │                                            ─────────────────>│
       │                                                      ┌───────┴──────┐
       │                                                      │   MongoDB    │
       │                                                      └───────┬──────┘
       │                                            16. Return Data   │
       │                                            <─────────────────│
       │                                                              │
       │  17. Send Response                                          │
       │<────────────────────────────────────────────────────────────│
       │     {                                                        │
       │       user: {                                               │
       │         name, email, avatar,                               │
       │         bookmarks, stats, ...                              │
       │       }                                                      │
       │     }                                                        │
       │                                                              │
       │                                                              │
       │  ═══════════════════════════════════════════════════════   │
       │                                                              │
       │  18. Token Expired (After 15 minutes)                       │
       ├────────────────────────────────────────────────────────────>│
       │     GET /api/auth/me                                        │
       │     Headers: Authorization: Bearer <expired_token>          │
       │                                                              │
       │  19. Error Response                                         │
       │<────────────────────────────────────────────────────────────│
       │     {                                                        │
       │       success: false,                                       │
       │       message: "Token expired"                             │
       │     }                                                        │
       │                                                              │
       │  20. Refresh Access Token                                   │
       ├────────────────────────────────────────────────────────────>│
       │     POST /api/auth/refresh                                  │
       │     {                                                        │
       │       refreshToken: "eyJ..."                               │
       │     }                                                        │
       │                                                              │
       │                                            21. Verify Refresh│
       │                                                   Token      │
       │                                            ─────────────────>│
       │                                                              │
       │                                            22. Generate New  │
       │                                                Access Token  │
       │                                                              │
       │  23. Send New Token                                         │
       │<────────────────────────────────────────────────────────────│
       │     {                                                        │
       │       accessToken: "eyJ..."  // New token                  │
       │     }                                                        │
       │                                                              │
       │  24. Update localStorage                                    │
       │     localStorage.setItem('accessToken', newToken)           │
       │                                                              │
       │                                                              │
       │  ═══════════════════════════════════════════════════════   │
       │                                                              │
       │  25. Logout                                                 │
       ├────────────────────────────────────────────────────────────>│
       │     POST /api/auth/logout                                   │
       │     Headers: Authorization: Bearer eyJ...                   │
       │                                                              │
       │                                            26. Clear Refresh │
       │                                                   Token      │
       │                                            ─────────────────>│
       │                                                      ┌───────┴──────┐
       │                                                      │   MongoDB    │
       │                                                      │   (Update)   │
       │                                                      └───────┬──────┘
       │                                            27. Clear Cookie  │
       │                                            <─────────────────│
       │                                                              │
       │  28. Success Response                                       │
       │<────────────────────────────────────────────────────────────│
       │     {                                                        │
       │       success: true,                                        │
       │       message: "Logged out"                                │
       │     }                                                        │
       │                                                              │
       │  29. Clear localStorage                                     │
       │     localStorage.removeItem('accessToken')                  │
       │     localStorage.removeItem('refreshToken')                 │
       │                                                              │
       │  30. Redirect to Login Page                                 │
       │                                                              │
```

---

## 🔑 Token Details

### Access Token (15 minutes)
```javascript
{
  id: "67129abc123def456789",
  email: "raghu@example.com",
  role: "user",
  iat: 1697625600,  // Issued at
  exp: 1697626500   // Expires (15 min later)
}
```

**Used for**: Every API request requiring authentication

**Location**: 
- `Authorization: Bearer <token>` header
- Or `localStorage.getItem('accessToken')`

### Refresh Token (7 days)
```javascript
{
  id: "67129abc123def456789",
  iat: 1697625600,  // Issued at
  exp: 1698230400   // Expires (7 days later)
}
```

**Used for**: Getting new access token when expired

**Location**: 
- HTTP-only cookie (more secure)
- Or `localStorage.getItem('refreshToken')`

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────┐
│  1. HTTPS (Production)                          │
│     Encrypt all data in transit                 │
└─────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│  2. CORS Protection                             │
│     Only allow requests from CLIENT_URL         │
└─────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│  3. Rate Limiting                               │
│     Max 100 requests per 15 minutes per IP      │
└─────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│  4. Helmet.js                                   │
│     Security headers (XSS, clickjacking, etc)   │
└─────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│  5. Input Validation                            │
│     Validate all user inputs (email, password)  │
└─────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│  6. Password Hashing                            │
│     bcrypt with 10 salt rounds                  │
└─────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│  7. JWT Tokens                                  │
│     Signed with secret keys                     │
└─────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│  8. HTTP-only Cookies                           │
│     XSS protection for refresh tokens           │
└─────────────────────────────────────────────────┘
```

---

## 📁 Database Structure

### Users Collection

```javascript
{
  _id: ObjectId("67129abc123def456789"),
  
  // Basic Info
  name: "Raghu Kumar",
  email: "raghu@example.com",
  password: "$2a$10$xyz...",  // Hashed, never plain text
  
  // Profile
  avatar: "https://api.dicebear.com/...",
  bio: "Full Stack Developer | AI Enthusiast",
  
  // Authentication
  role: "user",  // user | admin | moderator
  isVerified: false,
  isActive: true,
  lastLogin: ISODate("2025-10-18T10:30:00Z"),
  refreshToken: "eyJ...",
  
  // Relations
  bookmarks: [
    ObjectId("tool1"),
    ObjectId("tool2"),
    ObjectId("tool3")
  ],
  collections: [
    ObjectId("collection1"),
    ObjectId("collection2")
  ],
  
  // Statistics
  stats: {
    totalReviews: 5,
    totalBookmarks: 12,
    totalCollections: 3,
    totalInstallations: 8
  },
  
  // Timestamps
  createdAt: ISODate("2025-10-18T10:00:00Z"),
  updatedAt: ISODate("2025-10-18T10:30:00Z")
}
```

---

## 🔄 Middleware Chain

Every protected route goes through:

```
Request
   │
   ▼
┌──────────────────┐
│  CORS Middleware │ ← Check origin is allowed
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Rate Limiter    │ ← Check request limit
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Body Parser     │ ← Parse JSON body
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Cookie Parser   │ ← Parse cookies
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Auth Middleware │ ← Verify JWT token
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Validation      │ ← Validate input
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Controller      │ ← Execute business logic
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Database        │ ← Query MongoDB
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Error Handler   │ ← Catch any errors
└────────┬─────────┘
         ▼
     Response
```

---

## 🎯 API Endpoints Summary

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Login to account |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/health` | Server health check |

### Private Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/logout` | Logout user |
| `PUT` | `/api/auth/updateprofile` | Update profile |
| `PUT` | `/api/auth/updatepassword` | Change password |

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token is invalid or has expired. Please login again."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Route not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Detailed error info (development only)"
}
```

---

## 🎓 How to Use in Frontend

### 1. Register User
```javascript
const register = async (name, email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
};
```

### 2. Login User
```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
};
```

### 3. Get User Profile
```javascript
const getProfile = async () => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:5000/api/auth/me', {
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
  
  const data = await response.json();
  return data.data;
};
```

### 4. Logout User
```javascript
const logout = async () => {
  const token = localStorage.getItem('accessToken');
  
  await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}` 
    }
  });
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
```

---

**Authentication system is production-ready! 🎉**
