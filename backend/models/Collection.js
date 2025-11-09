const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  // Owner
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Basic Info
  name: {
    type: String,
    required: [true, 'Please provide a collection name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  icon: {
    type: String,
    default: '📁'
  },
  
  // Tools
  tools: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool'
  }],
  
  // Settings
  isPublic: {
    type: Boolean,
    default: false
  },
  isCollaborative: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  clones: {
    type: Number,
    default: 0
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // SEO
  slug: {
    type: String,
    lowercase: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================
collectionSchema.index({ user: 1 });
collectionSchema.index({ isPublic: 1, views: -1 });
collectionSchema.index({ slug: 1 });
collectionSchema.index({ createdAt: -1 });

// ==================== MIDDLEWARE ====================

// Generate slug before saving
collectionSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + this._id.toString().slice(-6);
  }
  next();
});

// ==================== VIRTUALS ====================

// Virtual for tool count
collectionSchema.virtual('toolCount').get(function() {
  return this.tools.length;
});

// Virtual for follower count
collectionSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

module.exports = mongoose.model('Collection', collectionSchema);
