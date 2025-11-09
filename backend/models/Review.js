const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // References
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool',
    required: true
  },
  
  // Review Content
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please provide a review title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    minlength: [20, 'Comment must be at least 20 characters'],
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },
  
  // User Avatar (cached at review creation time)
  userAvatar: {
    type: String,
    default: ''
  },
  pros: [{
    type: String,
    maxlength: [200, 'Pro cannot exceed 200 characters']
  }],
  cons: [{
    type: String,
    maxlength: [200, 'Con cannot exceed 200 characters']
  }],
  
  // Engagement
  helpful: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected'],
    default: 'published'
  },
  verified: {
    type: Boolean,
    default: false
  },
  
  // Moderation
  reported: {
    type: Boolean,
    default: false
  },
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reportReasons: [{
    type: String
  }],
  
  // Edit tracking
  editedAt: Date,
  isEdited: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================
reviewSchema.index({ tool: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ user: 1, tool: 1 }, { unique: true }); // One review per user per tool

// ==================== METHODS ====================

// Update tool rating when review is saved/updated
reviewSchema.statics.calculateAverageRating = async function(toolId) {
  const stats = await this.aggregate([
    {
      $match: { 
        tool: toolId,
        status: 'published'
      }
    },
    {
      $group: {
        _id: '$tool',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    const Tool = mongoose.model('Tool');
    if (stats.length > 0) {
      await Tool.findByIdAndUpdate(toolId, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].reviewCount
      });
    } else {
      await Tool.findByIdAndUpdate(toolId, {
        rating: 0,
        reviewCount: 0
      });
    }
  } catch (error) {
    console.error('Error updating tool rating:', error);
  }
};

// ==================== MIDDLEWARE ====================

// Update tool rating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.tool);
});

// Update tool rating after remove
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.tool);
});

module.exports = mongoose.model('Review', reviewSchema);
