const Review = require('../models/Review');
const Tool = require('../models/Tool');
const User = require('../models/User');

// ==================== @route   POST /api/reviews ====================
// @desc    Create review
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { toolId, rating, title, comment, pros, cons, userAvatar } = req.body;

    // Check if tool exists
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Check if user already reviewed this tool
    const existingReview = await Review.findOne({
      user: req.user.id,
      tool: toolId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tool'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      tool: toolId,
      rating,
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      userAvatar: userAvatar || '' // Store avatar at review creation time
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.totalReviews': 1 }
    });

    // Populate user info
    await review.populate('user', 'name avatar');

    console.log('✅ Review created:', review._id);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });

  } catch (error) {
    console.error('❌ Create review error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/reviews/tool/:toolId ====================
// @desc    Get reviews for a tool
// @access  Public
exports.getToolReviews = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const { sort = '-createdAt', status = 'published' } = req.query;

    const reviews = await Review.find({
      tool: toolId,
      status: status
    })
      .populate('user', 'name avatar')
      .sort(sort);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        count: reviews.length
      }
    });

  } catch (error) {
    console.error('❌ Get tool reviews error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/reviews/user/:userId ====================
// @desc    Get reviews by user
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user: userId })
      .populate('tool', 'name icon category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        reviews,
        count: reviews.length
      }
    });

  } catch (error) {
    console.error('❌ Get user reviews error:', error);
    next(error);
  }
};

// ==================== @route   PUT /api/reviews/:id ====================
// @desc    Update review
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, pros, cons } = req.body;

    let review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (pros) review.pros = pros;
    if (cons) review.cons = cons;
    
    review.isEdited = true;
    review.editedAt = Date.now();

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });

  } catch (error) {
    console.error('❌ Update review error:', error);
    next(error);
  }
};

// ==================== @route   DELETE /api/reviews/:id ====================
// @desc    Delete review
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.remove();

    // Update user stats
    await User.findByIdAndUpdate(review.user, {
      $inc: { 'stats.totalReviews': -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('❌ Delete review error:', error);
    next(error);
  }
};

// ==================== @route   POST /api/reviews/:id/helpful ====================
// @desc    Mark review as helpful
// @access  Private
exports.markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already marked helpful
    if (review.helpfulBy.includes(req.user.id)) {
      // Remove helpful mark
      review.helpfulBy = review.helpfulBy.filter(
        userId => userId.toString() !== req.user.id
      );
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // Add helpful mark
      review.helpfulBy.push(req.user.id);
      review.helpful += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review helpful status updated',
      data: {
        helpful: review.helpful,
        isHelpful: review.helpfulBy.includes(req.user.id)
      }
    });

  } catch (error) {
    console.error('❌ Mark helpful error:', error);
    next(error);
  }
};

// ==================== @route   POST /api/reviews/:id/report ====================
// @desc    Report review
// @access  Private
exports.reportReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already reported by this user
    if (review.reportedBy.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    // Add report
    review.reported = true;
    review.reportedBy.push(req.user.id);
    review.reportReasons.push(reason);

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review reported successfully',
      data: {}
    });

  } catch (error) {
    console.error('❌ Report review error:', error);
    next(error);
  }
};
