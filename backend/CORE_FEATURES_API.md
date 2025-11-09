# 🎯 Complete API Documentation

Full API reference for all core features: Bookmarks, Reviews, Installations, Collections, and Admin Panel.

---

## 📚 Table of Contents

1. [Bookmarks API](#bookmarks-api)
2. [Reviews API](#reviews-api)
3. [Installations API](#installations-api)
4. [Collections API](#collections-api)
5. [Admin API](#admin-api)
6. [Testing Examples](#testing-examples)

---

## 🔖 Bookmarks API

### Add Bookmark

**Endpoint**: `POST /api/bookmarks`  
**Authentication**: Required  
**Description**: Add a tool to user's bookmarks

**Request Body**:
```json
{
  "toolId": "67129abc123def456789"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Bookmark added successfully",
  "data": {
    "bookmarks": ["67129abc123def456789", "..."]
  }
}
```

---

### Remove Bookmark

**Endpoint**: `DELETE /api/bookmarks/:toolId`  
**Authentication**: Required  
**Description**: Remove a tool from user's bookmarks

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Bookmark removed successfully",
  "data": {
    "bookmarks": ["..."]
  }
}
```

---

### Get User Bookmarks

**Endpoint**: `GET /api/bookmarks`  
**Authentication**: Required  
**Description**: Get all bookmarked tools for current user

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "bookmarks": [
      {
        "_id": "67129abc123def456789",
        "id": "chatgpt",
        "name": "ChatGPT",
        "description": "AI-powered chatbot...",
        "icon": "https://...",
        "category": "text-generation",
        "price": "Freemium",
        "rating": 4.8,
        "developer": "OpenAI",
        "website": "https://chat.openai.com"
      }
    ],
    "count": 12
  }
}
```

---

## 📝 Reviews API

### Create Review

**Endpoint**: `POST /api/reviews`  
**Authentication**: Required  
**Description**: Submit a review for a tool

**Request Body**:
```json
{
  "toolId": "67129abc123def456789",
  "rating": 5,
  "title": "Amazing AI tool!",
  "comment": "ChatGPT has completely revolutionized my workflow. The AI responses are incredibly accurate and helpful.",
  "pros": ["Easy to use", "Powerful", "Fast responses"],
  "cons": ["Can be expensive for heavy use"]
}
```

**Validation Rules**:
- `rating`: 1-5 (integer)
- `title`: Max 100 characters
- `comment`: 20-2000 characters
- `pros` & `cons`: Optional arrays

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "review": {
      "_id": "review123",
      "user": {
        "_id": "user123",
        "name": "John Doe",
        "avatar": "https://..."
      },
      "tool": "67129abc123def456789",
      "rating": 5,
      "title": "Amazing AI tool!",
      "comment": "ChatGPT has completely...",
      "pros": ["Easy to use", "Powerful", "Fast responses"],
      "cons": ["Can be expensive for heavy use"],
      "helpful": 0,
      "status": "published",
      "createdAt": "2025-10-18T12:00:00Z"
    }
  }
}
```

---

### Get Tool Reviews

**Endpoint**: `GET /api/reviews/tool/:toolId`  
**Authentication**: Public  
**Description**: Get all published reviews for a tool

**Query Parameters**:
- `sort`: `-createdAt` (newest), `helpful` (most helpful), `rating` (highest rated)
- `status`: `published` (default), `pending`, `rejected`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "review123",
        "user": {
          "name": "John Doe",
          "avatar": "https://..."
        },
        "rating": 5,
        "title": "Amazing AI tool!",
        "comment": "ChatGPT has...",
        "pros": ["..."],
        "cons": ["..."],
        "helpful": 15,
        "createdAt": "2025-10-18T12:00:00Z"
      }
    ],
    "count": 42
  }
}
```

---

### Get User Reviews

**Endpoint**: `GET /api/reviews/user/:userId`  
**Authentication**: Public  
**Description**: Get all reviews written by a user

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "review123",
        "tool": {
          "name": "ChatGPT",
          "icon": "https://...",
          "category": "text-generation"
        },
        "rating": 5,
        "title": "Amazing AI tool!",
        "comment": "...",
        "createdAt": "2025-10-18T12:00:00Z"
      }
    ],
    "count": 8
  }
}
```

---

### Update Review

**Endpoint**: `PUT /api/reviews/:id`  
**Authentication**: Required (Owner only)  
**Description**: Edit your own review

**Request Body** (All fields optional):
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment with more details...",
  "pros": ["New pro"],
  "cons": ["New con"]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "review": {
      "_id": "review123",
      "rating": 4,
      "title": "Updated title",
      "isEdited": true,
      "editedAt": "2025-10-18T13:00:00Z"
    }
  }
}
```

---

### Delete Review

**Endpoint**: `DELETE /api/reviews/:id`  
**Authentication**: Required (Owner or Admin)  
**Description**: Delete a review

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": {}
}
```

---

### Mark Review Helpful

**Endpoint**: `POST /api/reviews/:id/helpful`  
**Authentication**: Required  
**Description**: Mark review as helpful (toggle on/off)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Review helpful status updated",
  "data": {
    "helpful": 16,
    "isHelpful": true
  }
}
```

---

### Report Review

**Endpoint**: `POST /api/reviews/:id/report`  
**Authentication**: Required  
**Description**: Report inappropriate review

**Request Body**:
```json
{
  "reason": "Spam content"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Review reported successfully",
  "data": {}
}
```

---

## 📊 Installations API

### Track Installation

**Endpoint**: `POST /api/installations`  
**Authentication**: Optional (works for anonymous users too)  
**Description**: Track when a user installs/clicks on a tool

**Request Body**:
```json
{
  "toolId": "67129abc123def456789",
  "sessionId": "session-uuid-12345",
  "source": "search",
  "referrer": "https://google.com",
  "device": "desktop",
  "browser": "Chrome 118",
  "os": "Windows 11",
  "country": "US",
  "ip": "192.168.1.1"
}
```

**Fields**:
- `toolId` (required): Tool being installed
- `sessionId` (required): Unique session identifier
- `source`: `search`, `featured`, `category`, `comparison`, `collection`, `direct`
- `device`: `desktop`, `mobile`, `tablet`
- Other fields optional

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Installation tracked successfully",
  "data": {
    "installation": {
      "_id": "install123",
      "tool": "67129abc123def456789",
      "sessionId": "session-uuid-12345",
      "source": "search",
      "installedAt": "2025-10-18T12:00:00Z"
    }
  }
}
```

---

### Get User Installations

**Endpoint**: `GET /api/installations/user`  
**Authentication**: Required  
**Description**: Get current user's installation history

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "installations": [
      {
        "_id": "install123",
        "tool": {
          "name": "ChatGPT",
          "icon": "https://...",
          "category": "text-generation",
          "developer": "OpenAI"
        },
        "source": "search",
        "device": "desktop",
        "installedAt": "2025-10-18T12:00:00Z"
      }
    ],
    "count": 15
  }
}
```

---

### Get Tool Installation Stats

**Endpoint**: `GET /api/installations/tool/:toolId`  
**Authentication**: Required (Admin only)  
**Description**: Get installation statistics for a specific tool

**Query Parameters**:
- `startDate`: Filter from date (ISO format)
- `endDate`: Filter to date (ISO format)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "installations": [...],
    "count": 150,
    "stats": {
      "total": 150,
      "bySource": ["search", "featured", "search", ...],
      "byDevice": ["desktop", "mobile", "desktop", ...]
    }
  }
}
```

---

### Get Overall Installation Stats

**Endpoint**: `GET /api/installations/stats`  
**Authentication**: Required (Admin only)  
**Description**: Get overall installation statistics

**Query Parameters**:
- `period`: `24h`, `7d` (default), `30d`, `90d`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "period": "7d",
    "stats": {
      "total": [{ "count": 1234 }],
      "bySource": [
        { "_id": "search", "count": 450 },
        { "_id": "featured", "count": 300 },
        { "_id": "category", "count": 200 }
      ],
      "byDevice": [
        { "_id": "desktop", "count": 800 },
        { "_id": "mobile", "count": 400 }
      ],
      "byDate": [
        { "_id": "2025-10-12", "count": 150 },
        { "_id": "2025-10-13", "count": 180 }
      ],
      "topTools": [...]
    }
  }
}
```

---

## 📁 Collections API

### Create Collection

**Endpoint**: `POST /api/collections`  
**Authentication**: Required  
**Description**: Create a new tool collection

**Request Body**:
```json
{
  "name": "Best AI Tools for Startups",
  "description": "Curated list of essential AI tools for startup founders",
  "icon": "🚀",
  "isPublic": true,
  "tools": ["tool1", "tool2", "tool3"]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Collection created successfully",
  "data": {
    "collection": {
      "_id": "collection123",
      "user": "user123",
      "name": "Best AI Tools for Startups",
      "description": "Curated list...",
      "icon": "🚀",
      "isPublic": true,
      "tools": [...],
      "views": 0,
      "slug": "best-ai-tools-for-startups-abc123",
      "createdAt": "2025-10-18T12:00:00Z"
    }
  }
}
```

---

### Get Public Collections

**Endpoint**: `GET /api/collections`  
**Authentication**: Public  
**Description**: Get all public collections

**Query Parameters**:
- `sort`: `-views` (most viewed), `-createdAt` (newest), `name` (alphabetical)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "collections": [
      {
        "_id": "collection123",
        "user": {
          "name": "John Doe",
          "avatar": "https://..."
        },
        "name": "Best AI Tools for Startups",
        "description": "...",
        "icon": "🚀",
        "tools": [...],
        "views": 1500,
        "followerCount": 45,
        "toolCount": 12,
        "createdAt": "2025-10-18T12:00:00Z"
      }
    ],
    "count": 25
  }
}
```

---

### Get User Collections

**Endpoint**: `GET /api/collections/user/:userId`  
**Authentication**: Optional  
**Description**: Get collections created by a user

**Note**: Shows all collections if viewing own profile, only public if viewing others

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "collections": [...],
    "count": 8
  }
}
```

---

### Get Collection Details

**Endpoint**: `GET /api/collections/:id`  
**Authentication**: Optional  
**Description**: Get full details of a collection

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "collection": {
      "_id": "collection123",
      "user": {
        "name": "John Doe",
        "avatar": "https://..."
      },
      "name": "Best AI Tools for Startups",
      "description": "...",
      "icon": "🚀",
      "tools": [
        {
          "name": "ChatGPT",
          "description": "...",
          "icon": "https://...",
          "category": "text-generation",
          "price": "Freemium",
          "rating": 4.8,
          "developer": "OpenAI"
        }
      ],
      "isPublic": true,
      "views": 1501,
      "followers": [...],
      "collaborators": [...],
      "createdAt": "2025-10-18T12:00:00Z"
    }
  }
}
```

---

### Update Collection

**Endpoint**: `PUT /api/collections/:id`  
**Authentication**: Required (Owner only)  
**Description**: Update collection details

**Request Body** (All fields optional):
```json
{
  "name": "Updated Collection Name",
  "description": "Updated description",
  "icon": "📚",
  "isPublic": false
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Collection updated successfully",
  "data": {
    "collection": {...}
  }
}
```

---

### Delete Collection

**Endpoint**: `DELETE /api/collections/:id`  
**Authentication**: Required (Owner only)  
**Description**: Delete a collection

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Collection deleted successfully",
  "data": {}
}
```

---

### Add Tool to Collection

**Endpoint**: `POST /api/collections/:id/tools`  
**Authentication**: Required (Owner or Collaborator)  
**Description**: Add a tool to collection

**Request Body**:
```json
{
  "toolId": "67129abc123def456789"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Tool added to collection",
  "data": {
    "collection": {...}
  }
}
```

---

### Remove Tool from Collection

**Endpoint**: `DELETE /api/collections/:id/tools/:toolId`  
**Authentication**: Required (Owner or Collaborator)  
**Description**: Remove a tool from collection

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Tool removed from collection",
  "data": {
    "collection": {...}
  }
}
```

---

### Clone Collection

**Endpoint**: `POST /api/collections/:id/clone`  
**Authentication**: Required  
**Description**: Clone a public collection to your account

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Collection cloned successfully",
  "data": {
    "collection": {
      "_id": "newCollection123",
      "name": "Best AI Tools for Startups (Copy)",
      "user": "currentUser123",
      "tools": [...],
      "isPublic": false
    }
  }
}
```

---

### Follow/Unfollow Collection

**Endpoint**: `POST /api/collections/:id/follow`  
**Authentication**: Required  
**Description**: Toggle follow status on a collection

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Following collection",
  "data": {
    "isFollowing": true,
    "followerCount": 46
  }
}
```

---

## 👨‍💼 Admin API

### Get Dashboard Stats

**Endpoint**: `GET /api/admin/stats`  
**Authentication**: Required (Admin/Moderator)  
**Description**: Get overall dashboard statistics

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalTools": 128,
      "totalReviews": 3842,
      "totalCollections": 567,
      "totalInstallations": 15230
    },
    "recentActivity": {
      "newUsers": 45,
      "newReviews": 23,
      "newInstallations": 456
    },
    "topTools": [
      {
        "name": "ChatGPT",
        "rating": 4.8,
        "installCount": 5000,
        "reviewCount": 230
      }
    ],
    "recentReviews": [...],
    "moderation": {
      "pendingReviews": 5,
      "reportedReviews": 2
    }
  }
}
```

---

### Get All Users

**Endpoint**: `GET /api/admin/users`  
**Authentication**: Required (Admin only)  
**Description**: Get all users with pagination

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `role`: Filter by role (`user`, `admin`, `moderator`)
- `search`: Search by name or email

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": true,
        "stats": {
          "totalReviews": 5,
          "totalBookmarks": 12
        },
        "createdAt": "2025-10-01T12:00:00Z"
      }
    ],
    "totalPages": 63,
    "currentPage": 1,
    "total": 1250
  }
}
```

---

### Update User Role

**Endpoint**: `PUT /api/admin/users/:id/role`  
**Authentication**: Required (Admin only)  
**Description**: Change user's role

**Request Body**:
```json
{
  "role": "moderator"
}
```

**Allowed roles**: `user`, `admin`, `moderator`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": {
      "_id": "user123",
      "email": "john@example.com",
      "role": "moderator"
    }
  }
}
```

---

### Toggle User Status

**Endpoint**: `PUT /api/admin/users/:id/status`  
**Authentication**: Required (Admin only)  
**Description**: Activate/deactivate user account

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "user": {
      "_id": "user123",
      "isActive": false
    }
  }
}
```

---

### Delete User

**Endpoint**: `DELETE /api/admin/users/:id`  
**Authentication**: Required (Admin only)  
**Description**: Permanently delete user and all their data

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User and all associated data deleted successfully",
  "data": {}
}
```

---

### Get Pending Reviews

**Endpoint**: `GET /api/admin/reviews/pending`  
**Authentication**: Required (Admin/Moderator)  
**Description**: Get all reviews pending approval

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "review123",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "tool": {
          "name": "ChatGPT"
        },
        "rating": 5,
        "title": "Amazing!",
        "comment": "...",
        "status": "pending",
        "createdAt": "2025-10-18T12:00:00Z"
      }
    ],
    "count": 5
  }
}
```

---

### Get Reported Reviews

**Endpoint**: `GET /api/admin/reviews/reported`  
**Authentication**: Required (Admin/Moderator)  
**Description**: Get all reported reviews

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "review123",
        "user": {...},
        "tool": {...},
        "comment": "...",
        "reported": true,
        "reportedBy": [...],
        "reportReasons": ["Spam content", "Inappropriate language"],
        "createdAt": "2025-10-18T12:00:00Z"
      }
    ],
    "count": 2
  }
}
```

---

### Moderate Review

**Endpoint**: `PUT /api/admin/reviews/:id/moderate`  
**Authentication**: Required (Admin/Moderator)  
**Description**: Approve or reject a review

**Request Body**:
```json
{
  "status": "published"
}
```

**Allowed statuses**: `published`, `rejected`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Review published successfully",
  "data": {
    "review": {
      "_id": "review123",
      "status": "published",
      "reported": false
    }
  }
}
```

---

### Get All Tools

**Endpoint**: `GET /api/admin/tools`  
**Authentication**: Required (Admin only)  
**Description**: Get all tools with admin info

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `category`: Filter by category
- `status`: Filter by status

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "tools": [
      {
        "_id": "tool123",
        "name": "ChatGPT",
        "category": "text-generation",
        "status": "active",
        "featured": true,
        "rating": 4.8,
        "installCount": 5000,
        "addedBy": {
          "name": "Admin",
          "email": "admin@example.com"
        },
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "totalPages": 7,
    "currentPage": 1,
    "total": 128
  }
}
```

---

### Toggle Tool Featured Status

**Endpoint**: `PUT /api/admin/tools/:id/featured`  
**Authentication**: Required (Admin only)  
**Description**: Feature/unfeature a tool

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Tool featured successfully",
  "data": {
    "tool": {
      "_id": "tool123",
      "name": "ChatGPT",
      "featured": true
    }
  }
}
```

---

## 🧪 Testing Examples

### Postman Collection Structure

```
AI Tools Marketplace API/
├── Auth/
│   ├── Register
│   ├── Login
│   ├── Get Profile
│   └── Logout
├── Bookmarks/
│   ├── Add Bookmark
│   ├── Remove Bookmark
│   └── Get Bookmarks
├── Reviews/
│   ├── Create Review
│   ├── Get Tool Reviews
│   ├── Update Review
│   ├── Delete Review
│   ├── Mark Helpful
│   └── Report Review
├── Installations/
│   ├── Track Installation
│   ├── Get User Installations
│   └── Get Stats (Admin)
├── Collections/
│   ├── Create Collection
│   ├── Get Public Collections
│   ├── Add Tool
│   ├── Remove Tool
│   ├── Clone Collection
│   └── Follow Collection
└── Admin/
    ├── Dashboard Stats
    ├── Get Users
    ├── Update User Role
    ├── Moderate Reviews
    └── Toggle Featured
```

---

## 🎯 Complete Testing Flow

### 1. Setup
```bash
# Start backend server
cd backend
npm run dev
```

### 2. Register & Login
```http
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
# Copy accessToken
```

### 3. Test Bookmarks
```http
POST http://localhost:5000/api/bookmarks
GET http://localhost:5000/api/bookmarks
DELETE http://localhost:5000/api/bookmarks/:toolId
```

### 4. Test Reviews
```http
POST http://localhost:5000/api/reviews
GET http://localhost:5000/api/reviews/tool/:toolId
POST http://localhost:5000/api/reviews/:id/helpful
```

### 5. Test Collections
```http
POST http://localhost:5000/api/collections
POST http://localhost:5000/api/collections/:id/tools
POST http://localhost:5000/api/collections/:id/clone
```

### 6. Test Admin (create admin user first)
```http
GET http://localhost:5000/api/admin/stats
GET http://localhost:5000/api/admin/users
PUT http://localhost:5000/api/admin/tools/:id/featured
```

---

**All core features are now ready! 🎉**

Proceed to setup MongoDB and test all endpoints!
