const express = require('express');
const { body } = require('express-validator');
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getPendingReviews,
  getReportedReviews,
  moderateReview,
  getAllTools,
  toggleFeatured
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication and admin/moderator role
router.use(protect);

// ==================== VALIDATION RULES ====================

const updateRoleValidation = [
  body('role')
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Invalid role')
];

const moderateReviewValidation = [
  body('status')
    .isIn(['published', 'rejected'])
    .withMessage('Invalid status')
];

// ==================== DASHBOARD ====================

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', authorize('admin', 'moderator'), getDashboardStats);

// ==================== USER MANAGEMENT ====================

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', authorize('admin'), getAllUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', authorize('admin'), updateRoleValidation, validate, updateUserRole);

// @route   PUT /api/admin/users/:id/status
// @desc    Activate/deactivate user
// @access  Private/Admin
router.put('/users/:id/status', authorize('admin'), toggleUserStatus);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', authorize('admin'), deleteUser);

// ==================== REVIEW MODERATION ====================

// @route   GET /api/admin/reviews/pending
// @desc    Get pending reviews
// @access  Private/Admin/Moderator
router.get('/reviews/pending', authorize('admin', 'moderator'), getPendingReviews);

// @route   GET /api/admin/reviews/reported
// @desc    Get reported reviews
// @access  Private/Admin/Moderator
router.get('/reviews/reported', authorize('admin', 'moderator'), getReportedReviews);

// @route   PUT /api/admin/reviews/:id/moderate
// @desc    Approve/reject review
// @access  Private/Admin/Moderator
router.put('/reviews/:id/moderate', authorize('admin', 'moderator'), moderateReviewValidation, validate, moderateReview);

// ==================== TOOL MANAGEMENT ====================

// @route   GET /api/admin/tools
// @desc    Get all tools
// @access  Private/Admin
router.get('/tools', authorize('admin'), getAllTools);

// @route   PUT /api/admin/tools/:id/featured
// @desc    Toggle tool featured status
// @access  Private/Admin
router.put('/tools/:id/featured', authorize('admin'), toggleFeatured);

module.exports = router;
