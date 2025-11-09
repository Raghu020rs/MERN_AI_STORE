const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllTools,
  getToolById,
  searchTools,
  getToolsByCategory,
  getFeaturedTools,
  getTrendingTools,
  getTopRatedTools,
  submitTool,
  updateTool,
  deleteTool,
  incrementViews,
  incrementDownloads
} = require('../controllers/toolController');

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/tools
// @desc    Get all tools with pagination and filters
// @access  Public
router.get('/', getAllTools);

// @route   GET /api/tools/search
// @desc    Search tools by query
// @access  Public
router.get('/search', searchTools);

// @route   GET /api/tools/featured
// @desc    Get featured tools
// @access  Public
router.get('/featured', getFeaturedTools);

// @route   GET /api/tools/trending
// @desc    Get trending tools
// @access  Public
router.get('/trending', getTrendingTools);

// @route   GET /api/tools/top-rated
// @desc    Get top rated tools
// @access  Public
router.get('/top-rated', getTopRatedTools);

// @route   GET /api/tools/category/:category
// @desc    Get tools by category
// @access  Public
router.get('/category/:category', getToolsByCategory);

// @route   GET /api/tools/:id
// @desc    Get single tool by ID
// @access  Public
router.get('/:id', getToolById);

// @route   POST /api/tools/:id/view
// @desc    Increment tool view count
// @access  Public
router.post('/:id/view', incrementViews);

// @route   POST /api/tools/:id/download
// @desc    Increment tool download count
// @access  Public
router.post('/:id/download', incrementDownloads);

// ==================== PROTECTED ROUTES ====================

// @route   POST /api/tools/submit
// @desc    Submit a new tool (requires authentication)
// @access  Private
router.post('/submit', protect, submitTool);

// ==================== ADMIN ROUTES ====================

// @route   PUT /api/tools/:id
// @desc    Update tool (admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin', 'moderator'), updateTool);

// @route   DELETE /api/tools/:id
// @desc    Delete tool (admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteTool);

module.exports = router;
