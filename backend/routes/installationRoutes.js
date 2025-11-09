const express = require('express');
const { body } = require('express-validator');
const {
  trackInstallation,
  getToolInstallations,
  getUserInstallations,
  getInstallationStats
} = require('../controllers/installationController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ==================== VALIDATION RULES ====================

const trackInstallationValidation = [
  body('toolId')
    .notEmpty().withMessage('Tool ID is required'),
  body('sessionId')
    .notEmpty().withMessage('Session ID is required'),
  body('source')
    .optional()
    .isIn(['search', 'featured', 'category', 'comparison', 'collection', 'direct'])
    .withMessage('Invalid source'),
  body('device')
    .optional()
    .isIn(['desktop', 'mobile', 'tablet'])
    .withMessage('Invalid device type')
];

// ==================== PUBLIC/OPTIONAL AUTH ROUTES ====================

// @route   POST /api/installations
// @desc    Track installation (works for both logged in and anonymous users)
// @access  Public (with optional auth)
router.post('/', optionalAuth, trackInstallationValidation, validate, trackInstallation);

// ==================== PRIVATE ROUTES ====================

// @route   GET /api/installations/user
// @desc    Get user's installations
// @access  Private
router.get('/user', protect, getUserInstallations);

// @route   GET /api/installations/stats
// @desc    Get overall installation statistics
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), getInstallationStats);

// @route   GET /api/installations/tool/:toolId
// @desc    Get installation stats for a tool
// @access  Private/Admin
router.get('/tool/:toolId', protect, authorize('admin'), getToolInstallations);

module.exports = router;
