const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  // Basic Information
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a tool name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  longDescription: {
    type: String,
    maxlength: [5000, 'Long description cannot exceed 5000 characters'],
    default: ''
  },
  
  // Media
  icon: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String
  }],
  demoUrl: String,
  videoUrl: String,
  
  // Company Info
  developer: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  
  // Categories
  category: {
    type: String,
    required: true,
    enum: [
      'text-generation',
      'image-generation',
      'video-generation',
      'audio-generation',
      'code-generation',
      'data-analysis',
      'productivity',
      'design',
      'marketing'
    ]
  },
  categories: [{
    type: String
  }],
  
  // Pricing
  price: {
    type: String,
    enum: ['Free', 'Freemium', 'Paid'],
    default: 'Freemium'
  },
  actualPrice: String,
  pricingModel: {
    type: String,
    enum: ['free', 'freemium', 'subscription', 'one-time', 'usage-based'],
    default: 'freemium'
  },
  
  // Statistics
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  downloadCount: {
    type: String,
    default: '0+'
  },
  actualDownloads: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  installCount: {
    type: Number,
    default: 0
  },
  bookmarkCount: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Features & Tags
  features: [{
    type: String
  }],
  integrations: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  
  // Metadata
  version: String,
  size: String,
  releaseDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'deprecated', 'beta', 'coming-soon'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: String,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  
  // SEO
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  metaTitle: String,
  metaDescription: String,
  
  // Admin
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isApproved: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================
// id and slug indexes are created by unique: true in schema
// toolSchema.index({ id: 1 }); // Removed duplicate
// toolSchema.index({ slug: 1 }); // Removed duplicate
toolSchema.index({ category: 1 });
toolSchema.index({ rating: -1 });
toolSchema.index({ featured: 1, rating: -1 });
toolSchema.index({ name: 'text', description: 'text' });
toolSchema.index({ createdAt: -1 });

// ==================== MIDDLEWARE ====================

// Generate slug before saving
toolSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// ==================== VIRTUALS ====================

// Virtual for reviews
toolSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tool',
  justOne: false
});

module.exports = mongoose.model('Tool', toolSchema);
