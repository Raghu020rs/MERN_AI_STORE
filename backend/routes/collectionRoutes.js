const express = require('express');
const { body } = require('express-validator');
const {
  createCollection,
  getPublicCollections,
  getUserCollections,
  getCollection,
  updateCollection,
  deleteCollection,
  addTool,
  removeTool,
  cloneCollection,
  toggleFollow
} = require('../controllers/collectionController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ==================== VALIDATION RULES ====================

const createCollectionValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Collection name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('icon')
    .optional()
    .trim(),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean'),
  body('tools')
    .optional()
    .isArray().withMessage('Tools must be an array')
];

const updateCollectionValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
];

const addToolValidation = [
  body('toolId')
    .notEmpty().withMessage('Tool ID is required')
];

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/collections
// @desc    Get all public collections
// @access  Public
router.get('/', getPublicCollections);

// @route   GET /api/collections/user/:userId
// @desc    Get user's collections
// @access  Public
router.get('/user/:userId', optionalAuth, getUserCollections);

// @route   GET /api/collections/:id
// @desc    Get collection by ID
// @access  Public (with optional auth for private collections)
router.get('/:id', optionalAuth, getCollection);

// ==================== PRIVATE ROUTES ====================

// @route   POST /api/collections
// @desc    Create collection
// @access  Private
router.post('/', protect, createCollectionValidation, validate, createCollection);

// @route   PUT /api/collections/:id
// @desc    Update collection
// @access  Private
router.put('/:id', protect, updateCollectionValidation, validate, updateCollection);

// @route   DELETE /api/collections/:id
// @desc    Delete collection
// @access  Private
router.delete('/:id', protect, deleteCollection);

// @route   POST /api/collections/:id/tools
// @desc    Add tool to collection
// @access  Private
router.post('/:id/tools', protect, addToolValidation, validate, addTool);

// @route   DELETE /api/collections/:id/tools/:toolId
// @desc    Remove tool from collection
// @access  Private
router.delete('/:id/tools/:toolId', protect, removeTool);

// @route   POST /api/collections/:id/clone
// @desc    Clone collection
// @access  Private
router.post('/:id/clone', protect, cloneCollection);

// @route   POST /api/collections/:id/follow
// @desc    Follow/unfollow collection
// @access  Private
router.post('/:id/follow', protect, toggleFollow);

module.exports = router;
