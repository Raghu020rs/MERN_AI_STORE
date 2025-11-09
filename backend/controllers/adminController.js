const User = require('../models/User');
const Tool = require('../models/Tool');
const Review = require('../models/Review');
const Collection = require('../models/Collection');
const Installation = require('../models/Installation');

// ==================== @route   GET /api/admin/stats ====================
// @desc    Get dashboard statistics
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const [
      totalUsers,
      totalTools,
      totalReviews,
      totalCollections,
      totalInstallations
    ] = await Promise.all([
      User.countDocuments(),
      Tool.countDocuments(),
      Review.countDocuments(),
      Collection.countDocuments(),
      Installation.countDocuments()
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      newUsers,
      newReviews,
      newInstallations
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Review.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Installation.countDocuments({ installedAt: { $gte: sevenDaysAgo } })
    ]);

    // Get top tools
    const topTools = await Tool.find()
      .sort('-rating -installCount')
      .limit(10)
      .select('name icon rating installCount reviewCount');

    // Get recent reviews
    const recentReviews = await Review.find()
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'name avatar')
      .populate('tool', 'name icon');

    // Get pending reviews
    const pendingReviews = await Review.countDocuments({ status: 'pending' });

    // Get reported reviews
    const reportedReviews = await Review.countDocuments({ reported: true });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTools,
          totalReviews,
          totalCollections,
          totalInstallations
        },
        recentActivity: {
          newUsers,
          newReviews,
          newInstallations
        },
        topTools,
        recentReviews,
        moderation: {
          pendingReviews,
          reportedReviews
        }
      }
    });

  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/admin/users ====================
// @desc    Get all users with pagination
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });

  } catch (error) {
    console.error('❌ Get all users error:', error);
    next(error);
  }
};

// ==================== @route   PUT /api/admin/users/:id/role ====================
// @desc    Update user role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`✅ User role updated: ${user.email} -> ${role}`);

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('❌ Update user role error:', error);
    next(error);
  }
};

// ==================== @route   PUT /api/admin/users/:id/status ====================
// @desc    Activate/deactivate user
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-deactivation
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    console.log(`✅ User status updated: ${user.email} -> ${user.isActive ? 'Active' : 'Inactive'}`);

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });

  } catch (error) {
    console.error('❌ Toggle user status error:', error);
    next(error);
  }
};

// ==================== @route   DELETE /api/admin/users/:id ====================
// @desc    Delete user
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete user's reviews, collections, etc.
    await Promise.all([
      Review.deleteMany({ user: id }),
      Collection.deleteMany({ user: id }),
      Installation.deleteMany({ user: id })
    ]);

    await user.remove();

    console.log(`✅ User deleted: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/admin/reviews/pending ====================
// @desc    Get pending reviews
// @access  Private/Admin/Moderator
exports.getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user', 'name avatar email')
      .populate('tool', 'name icon')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        reviews,
        count: reviews.length
      }
    });

  } catch (error) {
    console.error('❌ Get pending reviews error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/admin/reviews/reported ====================
// @desc    Get reported reviews
// @access  Private/Admin/Moderator
exports.getReportedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reported: true })
      .populate('user', 'name avatar email')
      .populate('tool', 'name icon')
      .populate('reportedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        reviews,
        count: reviews.length
      }
    });

  } catch (error) {
    console.error('❌ Get reported reviews error:', error);
    next(error);
  }
};

// ==================== @route   PUT /api/admin/reviews/:id/approve ====================
// @desc    Approve/reject review
// @access  Private/Admin/Moderator
exports.moderateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['published', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use "published" or "rejected"'
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { status, reported: false },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    console.log(`✅ Review moderated: ${id} -> ${status}`);

    res.status(200).json({
      success: true,
      message: `Review ${status} successfully`,
      data: { review }
    });

  } catch (error) {
    console.error('❌ Moderate review error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/admin/tools ====================
// @desc    Get all tools with admin info
// @access  Private/Admin
exports.getAllTools = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, status } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const tools = await Tool.find(query)
      .populate('addedBy', 'name email')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Tool.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tools,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });

  } catch (error) {
    console.error('❌ Get all tools error:', error);
    next(error);
  }
};

// ==================== @route   PUT /api/admin/tools/:id/featured ====================
// @desc    Toggle tool featured status
// @access  Private/Admin
exports.toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tool = await Tool.findById(id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    tool.featured = !tool.featured;
    await tool.save();

    console.log(`✅ Tool featured status updated: ${tool.name} -> ${tool.featured}`);

    res.status(200).json({
      success: true,
      message: `Tool ${tool.featured ? 'featured' : 'unfeatured'} successfully`,
      data: { tool }
    });

  } catch (error) {
    console.error('❌ Toggle featured error:', error);
    next(error);
  }
};
