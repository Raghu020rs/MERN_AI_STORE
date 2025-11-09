# 🏗️ Backend Architecture Diagram

Visual overview of the AI Tools Marketplace backend architecture.

---

## 🌐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                               │
│              React + TypeScript + Vite                      │
│                  (localhost:5173)                           │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP Requests
                     │ (Authorization: Bearer <JWT>)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                              │
│              Node.js + Express.js                           │
│                  (localhost:5000)                           │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              MIDDLEWARE LAYER                         │ │
│  │                                                       │ │
│  │  [CORS] → [Helmet] → [Rate Limit] → [Body Parser]  │ │
│  │          → [Cookie Parser] → [Morgan Logs]          │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 ROUTE LAYER                          │ │
│  │                                                       │ │
│  │  /api/auth          → authRoutes.js                 │ │
│  │  /api/bookmarks     → bookmarkRoutes.js             │ │
│  │  /api/reviews       → reviewRoutes.js               │ │
│  │  /api/installations → installationRoutes.js         │ │
│  │  /api/collections   → collectionRoutes.js           │ │
│  │  /api/admin         → adminRoutes.js                │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │           AUTHENTICATION MIDDLEWARE                  │ │
│  │                                                       │ │
│  │  • protect() - Verify JWT token                     │ │
│  │  • authorize('admin') - Check roles                 │ │
│  │  • optionalAuth() - Allow anonymous                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │            VALIDATION MIDDLEWARE                     │ │
│  │                                                       │ │
│  │  • express-validator rules                          │ │
│  │  • validationResult() - Check errors                │ │
│  │  • Sanitize inputs                                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              CONTROLLER LAYER                        │ │
│  │                                                       │ │
│  │  authController.js        → 8 functions             │ │
│  │  bookmarkController.js    → 3 functions             │ │
│  │  reviewController.js      → 7 functions             │ │
│  │  installationController.js→ 4 functions             │ │
│  │  collectionController.js  → 10 functions            │ │
│  │  adminController.js       → 10 functions            │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 MODEL LAYER                          │ │
│  │                   (Mongoose)                         │ │
│  │                                                       │ │
│  │  User.js         - Authentication & profiles        │ │
│  │  Tool.js         - 128 AI tools data                │ │
│  │  Review.js       - Ratings & feedback               │ │
│  │  Collection.js   - User collections                 │ │
│  │  Installation.js - Analytics tracking               │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │            ERROR HANDLER MIDDLEWARE                  │ │
│  │                                                       │ │
│  │  • Catch all errors                                  │ │
│  │  • Format error responses                           │ │
│  │  • Log errors                                       │ │
│  │  • Return JSON error                                │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │ MongoDB Queries
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB ATLAS                             │
│                Database: ai-marketplace                     │
│                                                             │
│  Collections:                                               │
│  ┌────────────┬────────────┬────────────┬────────────────┐ │
│  │   users    │   tools    │  reviews   │  collections   │ │
│  │            │            │            │                │ │
│  │ • _id      │ • _id      │ • _id      │ • _id          │ │
│  │ • email    │ • name     │ • user     │ • user         │ │
│  │ • password │ • category │ • tool     │ • name         │ │
│  │ • role     │ • price    │ • rating   │ • tools[]      │ │
│  │ • bookmarks│ • rating   │ • comment  │ • followers[]  │ │
│  └────────────┴────────────┴────────────┴────────────────┘ │
│                                                             │
│  ┌────────────────────────┐                                │
│  │   installations        │                                │
│  │                        │                                │
│  │ • _id                  │                                │
│  │ • user (nullable)      │                                │
│  │ • tool                 │                                │
│  │ • sessionId            │                                │
│  │ • source               │                                │
│  │ • device               │                                │
│  └────────────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example

### Example: User adds a bookmark

```
1. FRONTEND
   ↓
   User clicks "Bookmark" button on ChatGPT tool card
   ↓
   
2. API REQUEST
   POST http://localhost:5000/api/bookmarks
   Headers: {
     Authorization: "Bearer eyJhbGciOiJIUzI1NiIs...",
     Content-Type: "application/json"
   }
   Body: {
     "toolId": "67129abc123def456789"
   }
   ↓
   
3. MIDDLEWARE CHAIN
   ✅ CORS - Allow request from localhost:5173
   ✅ Helmet - Set security headers
   ✅ Rate Limit - Check request count (OK: 45/100)
   ✅ Body Parser - Parse JSON body
   ↓
   
4. ROUTE MATCHING
   → POST /api/bookmarks matched in server.js
   → Route to bookmarkRoutes.js
   ↓
   
5. AUTHENTICATION
   → protect() middleware extracts JWT
   → Verify token signature
   → Decode payload: { userId: "user123" }
   → Find user in database
   → Attach user to req.user
   ✅ Authenticated
   ↓
   
6. VALIDATION
   → Check toolId is provided
   → Validate toolId is valid MongoDB ObjectId
   ✅ Valid
   ↓
   
7. CONTROLLER
   → bookmarkController.addBookmark()
   → Check if tool exists in database
   → Check if already bookmarked
   → Add toolId to user.bookmarks array
   → Increment tool.bookmarkCount by 1
   → Save both documents
   ↓
   
8. DATABASE OPERATIONS
   MongoDB queries:
   
   await Tool.findById(toolId)
   → Found: { _id: "...", name: "ChatGPT", bookmarkCount: 524 }
   
   await User.findByIdAndUpdate(userId, {
     $addToSet: { bookmarks: toolId }
   })
   → Updated user bookmarks
   
   await Tool.findByIdAndUpdate(toolId, {
     $inc: { bookmarkCount: 1 }
   })
   → Updated tool.bookmarkCount: 524 → 525
   ↓
   
9. RESPONSE
   res.status(200).json({
     success: true,
     message: "Bookmark added successfully",
     data: {
       bookmarks: ["67129abc123def456789", "..."]
     }
   })
   ↓
   
10. FRONTEND
    → Update UI state
    → Show bookmark icon as filled
    → Update bookmark count: 524 → 525
    → Show success toast notification
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
    POST /api/auth/register
    {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123!"
    }
                         │
                         ▼
    ┌──────────────────────────────────────┐
    │  Validate input (express-validator)  │
    │  • Email format                      │
    │  • Password strength (8+ chars)      │
    │  • Confirm password match            │
    └──────────────────────────────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────┐
    │  Check if email already exists       │
    └──────────────────────────────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────┐
    │  Hash password with bcrypt           │
    │  Salt rounds: 10                     │
    │  "Password123!" → "$2a$10$xY7z..."  │
    └──────────────────────────────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────┐
    │  Create user in database             │
    │  • name, email, hashedPassword       │
    │  • role: "user" (default)            │
    │  • isActive: true                    │
    └──────────────────────────────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────┐
    │  Generate JWT tokens                 │
    │                                      │
    │  Access Token (15 min):              │
    │  jwt.sign({ id: user._id },          │
    │           JWT_ACCESS_SECRET,         │
    │           { expiresIn: '15m' })      │
    │                                      │
    │  Refresh Token (7 days):             │
    │  jwt.sign({ id: user._id },          │
    │           JWT_REFRESH_SECRET,        │
    │           { expiresIn: '7d' })       │
    └──────────────────────────────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────┐
    │  Set HTTP-only cookie                │
    │  • refreshToken                      │
    │  • httpOnly: true                    │
    │  • secure: true (production)         │
    │  • maxAge: 7 days                    │
    └──────────────────────────────────────┘
                         │
                         ▼
    Return response:
    {
      success: true,
      message: "User registered successfully",
      data: {
        user: { id, name, email, role },
        accessToken: "eyJhbGciOiJIUzI1NiIs..."
      }
    }
```

---

## 🔄 Token Refresh Flow

```
Access Token Expired (401 Unauthorized)
                │
                ▼
    Frontend detects 401 error
                │
                ▼
    POST /api/auth/refresh-token
    Cookies: { refreshToken: "..." }
                │
                ▼
    ┌──────────────────────────────────────┐
    │  Extract refresh token from cookie   │
    └──────────────────────────────────────┘
                │
                ▼
    ┌──────────────────────────────────────┐
    │  Verify refresh token signature      │
    │  jwt.verify(token, JWT_REFRESH_SECRET)│
    └──────────────────────────────────────┘
                │
                ▼
    ┌──────────────────────────────────────┐
    │  Find user by decoded ID             │
    │  Check if user still active          │
    └──────────────────────────────────────┘
                │
                ▼
    ┌──────────────────────────────────────┐
    │  Generate new access token           │
    │  Expires in: 15 minutes              │
    └──────────────────────────────────────┘
                │
                ▼
    Return new access token
    {
      success: true,
      data: {
        accessToken: "eyJhbGciOiJIUzI1NiIs..."
      }
    }
                │
                ▼
    Frontend stores new token
    Retry original failed request
```

---

## 📊 Database Relationships

```
┌──────────────────────────────────────────────────────────┐
│                    RELATIONSHIPS                         │
└──────────────────────────────────────────────────────────┘

USER                    TOOL                    REVIEW
┌────────┐             ┌────────┐             ┌────────┐
│ _id    │◄───┐        │ _id    │◄───┐        │ _id    │
│ name   │    │        │ name   │    │        │ user   │───┐
│ email  │    │        │ rating │    │        │ tool   │───┤
│ role   │    │        │ install│    │        │ rating │   │
│bookmarks│──┐│        │bookmark│    │        │ comment│   │
└────────┘  ││        └────────┘    │        └────────┘   │
            ││             ▲         │             ▲       │
            ││             │         │             │       │
            ││        ┌────────┐    │        ┌────────┐  │
            ││        │BOOKMARK│    │        │ REVIEW │  │
            │└────────┤RELATION│────┘        │RELATION│──┘
            │         └────────┘             └────────┘
            │         User.bookmarks[]       Review.user
            │         Tool.bookmarkCount     Review.tool
            │
            │         COLLECTION             INSTALLATION
            │        ┌────────┐             ┌────────┐
            │        │ _id    │             │ _id    │
            └────────┤ user   │             │ user   │───┐
                     │ name   │        ┌────┤ tool   │   │
                     │ tools[]│────┐   │    │ session│   │
                     │followers│    │   │    │ source │   │
                     └────────┘    │   │    └────────┘   │
                          ▲        │   │         ▲       │
                          │        │   │         │       │
                     ┌────────┐    │   │    ┌────────┐  │
                     │COLLECTION   │   │    │INSTALL │  │
                     │RELATION │───┘   │    │RELATION│──┘
                     └────────┘        │    └────────┘
                     Collection.user   │    Installation.user
                     Collection.tools[]└───►Installation.tool
```

---

## 🎯 API Endpoint Map

```
┌─────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS (43 total)                 │
└─────────────────────────────────────────────────────────────┘

/api/auth (8 endpoints)
├── POST   /register              → Create account
├── POST   /login                 → Login user
├── GET    /me                    → Get profile (🔒)
├── POST   /logout                → Logout (🔒)
├── POST   /refresh-token         → Refresh JWT
├── PUT    /profile               → Update profile (🔒)
├── PUT    /password              → Change password (🔒)
└── POST   /forgot-password       → Reset password

/api/bookmarks (3 endpoints)
├── POST   /                      → Add bookmark (🔒)
├── DELETE /:toolId               → Remove bookmark (🔒)
└── GET    /                      → Get bookmarks (🔒)

/api/reviews (7 endpoints)
├── POST   /                      → Create review (🔒)
├── GET    /tool/:toolId          → Get tool reviews
├── GET    /user/:userId          → Get user reviews
├── PUT    /:id                   → Update review (🔒 Owner)
├── DELETE /:id                   → Delete review (🔒 Owner/Admin)
├── POST   /:id/helpful           → Mark helpful (🔒)
└── POST   /:id/report            → Report review (🔒)

/api/installations (4 endpoints)
├── POST   /                      → Track installation
├── GET    /user                  → User history (🔒)
├── GET    /tool/:toolId          → Tool stats (🔒 Admin)
└── GET    /stats                 → Overall stats (🔒 Admin)

/api/collections (11 endpoints)
├── POST   /                      → Create collection (🔒)
├── GET    /                      → Public collections
├── GET    /user/:userId          → User collections
├── GET    /:id                   → Collection details
├── PUT    /:id                   → Update collection (🔒 Owner)
├── DELETE /:id                   → Delete collection (🔒 Owner)
├── POST   /:id/tools             → Add tool (🔒 Owner)
├── DELETE /:id/tools/:toolId     → Remove tool (🔒 Owner)
├── POST   /:id/clone             → Clone collection (🔒)
├── POST   /:id/follow            → Follow/unfollow (🔒)
└── GET    /:id/stats             → Collection stats

/api/admin (10 endpoints)
├── GET    /stats                 → Dashboard (🔒 Admin/Mod)
├── GET    /users                 → All users (🔒 Admin)
├── PUT    /users/:id/role        → Update role (🔒 Admin)
├── PUT    /users/:id/status      → Toggle status (🔒 Admin)
├── DELETE /users/:id             → Delete user (🔒 Admin)
├── GET    /reviews/pending       → Pending reviews (🔒 Admin/Mod)
├── GET    /reviews/reported      → Reported reviews (🔒 Admin/Mod)
├── PUT    /reviews/:id/moderate  → Moderate review (🔒 Admin/Mod)
├── GET    /tools                 → All tools (🔒 Admin)
└── PUT    /tools/:id/featured    → Toggle featured (🔒 Admin)

Legend:
🔒 = Authentication required
Owner = User who created the resource
Admin = Admin role required
Mod = Moderator role required
```

---

## 🔄 Data Flow Diagrams

### Creating a Review

```
User writes review on frontend
        │
        ▼
    Validate form
    (rating, title, comment)
        │
        ▼
POST /api/reviews
{
  toolId: "...",
  rating: 5,
  title: "Great tool!",
  comment: "...",
  pros: ["Easy to use"],
  cons: ["Expensive"]
}
        │
        ▼
    Auth Middleware
    ✅ User authenticated
        │
        ▼
    Validation Middleware
    ✅ Rating 1-5
    ✅ Title < 100 chars
    ✅ Comment 20-2000 chars
        │
        ▼
    reviewController.createReview()
        │
        ├── Check tool exists
        │   ✅ Tool found
        │
        ├── Check existing review
        │   ✅ User hasn't reviewed this tool
        │
        ├── Create review document
        │   → status: "published"
        │   → helpful: 0
        │
        ├── Save review to database
        │   ✅ Saved
        │
        ├── Calculate new average rating
        │   → Review.calculateAverageRating(toolId)
        │   → (4.5 * 100 + 5) / 101 = 4.51
        │
        ├── Update tool rating
        │   → tool.rating = 4.51
        │   → tool.reviewCount = 101
        │
        ├── Update user stats
        │   → user.stats.totalReviews++
        │
        └── Return response
            {
              success: true,
              message: "Review created",
              data: { review: {...} }
            }
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│              SECURITY IMPLEMENTATION                        │
└─────────────────────────────────────────────────────────────┘

LAYER 1: Network Security
├── CORS (cors package)
│   ├── Allow: http://localhost:5173 (dev)
│   ├── Allow: https://yourapp.com (prod)
│   ├── Credentials: true
│   └── Methods: GET, POST, PUT, DELETE
│
└── Rate Limiting (express-rate-limit)
    ├── Window: 15 minutes
    ├── Max requests: 100
    └── Message: "Too many requests"

LAYER 2: HTTP Security Headers
└── Helmet.js
    ├── X-Content-Type-Options: nosniff
    ├── X-Frame-Options: DENY
    ├── X-XSS-Protection: 1; mode=block
    ├── Strict-Transport-Security: max-age=31536000
    └── Content-Security-Policy: default-src 'self'

LAYER 3: Authentication
├── Password Hashing (bcrypt)
│   ├── Salt rounds: 10
│   ├── Algorithm: bcrypt
│   └── Time: ~100ms per hash
│
└── JWT Tokens (jsonwebtoken)
    ├── Access Token
    │   ├── Expires: 15 minutes
    │   ├── Payload: { id, role }
    │   └── Secret: JWT_ACCESS_SECRET
    │
    └── Refresh Token
        ├── Expires: 7 days
        ├── Payload: { id }
        ├── Secret: JWT_REFRESH_SECRET
        └── Storage: HTTP-only cookie

LAYER 4: Input Validation
└── express-validator
    ├── Email format
    ├── Password strength
    ├── String length limits
    ├── Type validation
    ├── Sanitization
    └── XSS prevention

LAYER 5: Authorization
└── Role-Based Access Control
    ├── User: Basic access
    ├── Moderator: Review moderation
    └── Admin: Full access

LAYER 6: Database Security
└── Mongoose
    ├── Parameterized queries (prevents SQL injection)
    ├── Schema validation
    ├── Unique indexes
    └── No sensitive data in logs

LAYER 7: Error Handling
└── Custom Error Handler
    ├── Never expose stack traces
    ├── Log errors securely
    ├── Generic error messages
    └── Consistent error format
```

---

## 📈 Performance Optimizations

```
┌─────────────────────────────────────────────────────────────┐
│              PERFORMANCE FEATURES                           │
└─────────────────────────────────────────────────────────────┘

DATABASE LEVEL
├── Indexes
│   ├── User: email (unique)
│   ├── Tool: id, slug, category
│   ├── Review: [user, tool] (compound, unique)
│   ├── Collection: slug (unique)
│   └── Installation: tool, sessionId
│
├── Query Optimization
│   ├── Lean queries (skip Mongoose overhead)
│   ├── Field selection (only fetch needed fields)
│   ├── Population limits
│   └── Aggregation pipelines
│
└── Connection Pooling
    └── MongoDB driver default pool

APPLICATION LEVEL
├── Caching
│   ├── Slug generation cached
│   ├── Stats calculations batched
│   └── Populated fields selected
│
├── Async/Await
│   ├── Non-blocking operations
│   ├── Parallel Promise.all()
│   └── Error handling with try/catch
│
└── Middleware Order
    ├── Fast checks first (CORS)
    ├── Rate limiting early
    └── Heavy operations last (DB queries)

CODE LEVEL
├── Efficient Algorithms
│   ├── Single DB queries where possible
│   ├── Batch updates
│   └── Conditional updates only
│
└── Memory Management
    ├── No memory leaks
    ├── Proper error handling
    └── Clean up connections
```

---

This architecture provides a solid, scalable, and secure foundation for your AI Tools Marketplace! 🚀
