const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  getToolReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview
} = require('../controllers/reviewController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ==================== VALIDATION RULES ====================

const createReviewValidation = [
  body('toolId')
    .notEmpty().withMessage('Tool ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 20, max: 2000 }).withMessage('Comment must be between 20-2000 characters'),
  body('pros')
    .optional()
    .isArray().withMessage('Pros must be an array'),
  body('cons')
    .optional()
    .isArray().withMessage('Cons must be an array')
];

const updateReviewValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 }).withMessage('Comment must be between 20-2000 characters')
];

const reportReviewValidation = [
  body('reason')
    .trim()
    .notEmpty().withMessage('Report reason is required')
    .isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
];

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/reviews/tool/:toolId
// @desc    Get reviews for a tool
// @access  Public
router.get('/tool/:toolId', getToolReviews);

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews by user
// @access  Public
router.get('/user/:userId', getUserReviews);

// ==================== PRIVATE ROUTES ====================

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', protect, createReviewValidation, validate, createReview);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', protect, updateReviewValidation, validate, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', protect, deleteReview);

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', protect, markHelpful);

// @route   POST /api/reviews/:id/report
// @desc    Report review
// @access  Private
router.post('/:id/report', protect, reportReviewValidation, validate, reportReview);

module.exports = router;
