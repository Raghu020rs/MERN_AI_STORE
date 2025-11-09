const express = require('express');
const {
  addBookmark,
  removeBookmark,
  getBookmarks
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/bookmarks
// @desc    Get user bookmarks
// @access  Private
router.get('/', getBookmarks);

// @route   POST /api/bookmarks
// @desc    Add bookmark
// @access  Private
router.post('/', addBookmark);

// @route   DELETE /api/bookmarks/:toolId
// @desc    Remove bookmark
// @access  Private
router.delete('/:toolId', removeBookmark);

module.exports = router;
