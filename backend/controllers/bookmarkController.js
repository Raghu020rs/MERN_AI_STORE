const User = require('../models/User');
const Tool = require('../models/Tool');

// ==================== @route   POST /api/bookmarks ====================
// @desc    Add bookmark
// @access  Private
exports.addBookmark = async (req, res, next) => {
  try {
    const { toolId } = req.body;

    // Check if tool exists
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Check if already bookmarked
    if (req.user.bookmarks.includes(toolId)) {
      return res.status(400).json({
        success: false,
        message: 'Tool already bookmarked'
      });
    }

    // Add bookmark
    req.user.bookmarks.push(toolId);
    req.user.stats.totalBookmarks += 1;
    await req.user.save();

    // Increment tool bookmark count
    tool.bookmarkCount += 1;
    await tool.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark added successfully',
      data: {
        bookmarks: req.user.bookmarks
      }
    });

  } catch (error) {
    console.error('❌ Add bookmark error:', error);
    next(error);
  }
};

// ==================== @route   DELETE /api/bookmarks/:toolId ====================
// @desc    Remove bookmark
// @access  Private
exports.removeBookmark = async (req, res, next) => {
  try {
    const { toolId } = req.params;

    // Check if tool exists
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Check if bookmarked
    if (!req.user.bookmarks.includes(toolId)) {
      return res.status(400).json({
        success: false,
        message: 'Tool not bookmarked'
      });
    }

    // Remove bookmark
    req.user.bookmarks = req.user.bookmarks.filter(
      id => id.toString() !== toolId
    );
    req.user.stats.totalBookmarks -= 1;
    await req.user.save();

    // Decrement tool bookmark count
    tool.bookmarkCount = Math.max(0, tool.bookmarkCount - 1);
    await tool.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully',
      data: {
        bookmarks: req.user.bookmarks
      }
    });

  } catch (error) {
    console.error('❌ Remove bookmark error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/bookmarks ====================
// @desc    Get user bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'bookmarks',
        select: 'id name description icon category price rating developer website'
      });

    res.status(200).json({
      success: true,
      data: {
        bookmarks: user.bookmarks,
        count: user.bookmarks.length
      }
    });

  } catch (error) {
    console.error('❌ Get bookmarks error:', error);
    next(error);
  }
};
