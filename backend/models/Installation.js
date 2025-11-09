const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema({
  // References
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Null for anonymous users
  },
  tool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool',
    required: true
  },
  
  // Tracking Info
  sessionId: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['search', 'featured', 'category', 'comparison', 'collection', 'direct'],
    default: 'direct'
  },
  referrer: {
    type: String,
    default: null
  },
  
  // Device & Location
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  },
  browser: String,
  os: String,
  country: String,
  ip: String,
  
  // Metadata
  installedAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

// ==================== INDEXES ====================
installationSchema.index({ tool: 1, installedAt: -1 });
installationSchema.index({ user: 1, installedAt: -1 });
installationSchema.index({ sessionId: 1 });
installationSchema.index({ installedAt: -1 });

// ==================== MIDDLEWARE ====================

// Update tool install count after save
installationSchema.post('save', async function() {
  try {
    const Tool = mongoose.model('Tool');
    await Tool.findByIdAndUpdate(this.tool, {
      $inc: { installCount: 1 }
    });
    
    // Update user stats if user exists
    if (this.user) {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(this.user, {
        $inc: { 'stats.totalInstallations': 1 },
        $addToSet: { installedTools: this.tool }
      });
    }
  } catch (error) {
    console.error('Error updating install count:', error);
  }
});

module.exports = mongoose.model('Installation', installationSchema);
