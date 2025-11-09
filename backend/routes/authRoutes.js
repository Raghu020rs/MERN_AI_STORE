const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  updateProfile,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  handleValidationErrors,
  sanitizeUserInput
} = require('../middleware/validation');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', 
  registerLimiter,
  sanitizeUserInput,
  registerValidation, 
  handleValidationErrors, 
  register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', 
  authLimiter,
  sanitizeUserInput,
  loginValidation, 
  handleValidationErrors, 
  login
);

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post('/refresh-token', refreshToken);

// ==================== PRIVATE ROUTES ====================

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

// @route   PUT /api/auth/updateprofile
// @desc    Update user profile
// @access  Private
router.put('/updateprofile', 
  protect, 
  sanitizeUserInput,
  updateProfileValidation, 
  handleValidationErrors, 
  updateProfile
);

// @route   PUT /api/auth/updatepassword
// @desc    Update password
// @access  Private
router.put('/updatepassword', 
  protect, 
  sanitizeUserInput,
  changePasswordValidation, 
  handleValidationErrors, 
  updatePassword
);

module.exports = router;
