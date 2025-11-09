const Collection = require('../models/Collection');
const User = require('../models/User');
const Tool = require('../models/Tool');

// ==================== @route   POST /api/collections ====================
// @desc    Create collection
// @access  Private
exports.createCollection = async (req, res, next) => {
  try {
    const { name, description, icon, isPublic, tools } = req.body;

    const collection = await Collection.create({
      user: req.user.id,
      name,
      description,
      icon: icon || '📁',
      isPublic: isPublic || false,
      tools: tools || []
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.totalCollections': 1 },
      $push: { collections: collection._id }
    });

    await collection.populate('tools', 'name icon category');

    console.log('✅ Collection created:', collection._id);

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: { collection }
    });

  } catch (error) {
    console.error('❌ Create collection error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/collections ====================
// @desc    Get all public collections
// @access  Public
exports.getPublicCollections = async (req, res, next) => {
  try {
    const { sort = '-views' } = req.query;

    const collections = await Collection.find({ isPublic: true })
      .populate('user', 'name avatar')
      .populate('tools', 'name icon category')
      .sort(sort);

    res.status(200).json({
      success: true,
      data: {
        collections,
        count: collections.length
      }
    });

  } catch (error) {
    console.error('❌ Get public collections error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/collections/user/:userId ====================
// @desc    Get user's collections
// @access  Public
exports.getUserCollections = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // If viewing own collections, show all. Otherwise, only public
    const query = { user: userId };
    if (!req.user || req.user.id !== userId) {
      query.isPublic = true;
    }

    const collections = await Collection.find(query)
      .populate('tools', 'name icon category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        collections,
        count: collections.length
      }
    });

  } catch (error) {
    console.error('❌ Get user collections error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/collections/:id ====================
// @desc    Get collection by ID
// @access  Public
exports.getCollection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id)
      .populate('user', 'name avatar')
      .populate('tools', 'name description icon category price rating developer')
      .populate('collaborators', 'name avatar');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check if user can view this collection
    if (!collection.isPublic) {
      if (!req.user || (
        req.user.id !== collection.user._id.toString() &&
        !collection.collaborators.some(c => c._id.toString() === req.user.id)
      )) {
        return res.status(403).json({
          success: false,
          message: 'This collection is private'
        });
      }
    }

    // Increment view count
    collection.views += 1;
    await collection.save();

    res.status(200).json({
      success: true,
      data: { collection }
    });

  } catch (error) {
    console.error('❌ Get collection error:', error);
    next(error);
  }
};

// ==================== @route   PUT /api/collections/:id ====================
// @desc    Update collection
// @access  Private
exports.updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isPublic } = req.body;

    let collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check ownership
    if (collection.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this collection'
      });
    }

    // Update fields
    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (icon) collection.icon = icon;
    if (isPublic !== undefined) collection.isPublic = isPublic;

    await collection.save();

    res.status(200).json({
      success: true,
      message: 'Collection updated successfully',
      data: { collection }
    });

  } catch (error) {
    console.error('❌ Update collection error:', error);
    next(error);
  }
};

// ==================== @route   DELETE /api/collections/:id ====================
// @desc    Delete collection
// @access  Private
exports.deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check ownership
    if (collection.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this collection'
      });
    }

    await collection.remove();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.totalCollections': -1 },
      $pull: { collections: id }
    });

    res.status(200).json({
      success: true,
      message: 'Collection deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('❌ Delete collection error:', error);
    next(error);
  }
};

// ==================== @route   POST /api/collections/:id/tools ====================
// @desc    Add tool to collection
// @access  Private
exports.addTool = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { toolId } = req.body;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check ownership or collaborator
    if (collection.user.toString() !== req.user.id &&
        !collection.collaborators.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this collection'
      });
    }

    // Check if tool exists
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Check if already in collection
    if (collection.tools.includes(toolId)) {
      return res.status(400).json({
        success: false,
        message: 'Tool already in collection'
      });
    }

    // Add tool
    collection.tools.push(toolId);
    await collection.save();

    res.status(200).json({
      success: true,
      message: 'Tool added to collection',
      data: { collection }
    });

  } catch (error) {
    console.error('❌ Add tool error:', error);
    next(error);
  }
};

// ==================== @route   DELETE /api/collections/:id/tools/:toolId ====================
// @desc    Remove tool from collection
// @access  Private
exports.removeTool = async (req, res, next) => {
  try {
    const { id, toolId } = req.params;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check ownership or collaborator
    if (collection.user.toString() !== req.user.id &&
        !collection.collaborators.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this collection'
      });
    }

    // Remove tool
    collection.tools = collection.tools.filter(
      t => t.toString() !== toolId
    );
    await collection.save();

    res.status(200).json({
      success: true,
      message: 'Tool removed from collection',
      data: { collection }
    });

  } catch (error) {
    console.error('❌ Remove tool error:', error);
    next(error);
  }
};

// ==================== @route   POST /api/collections/:id/clone ====================
// @desc    Clone collection
// @access  Private
exports.cloneCollection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const originalCollection = await Collection.findById(id);

    if (!originalCollection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check if collection is public
    if (!originalCollection.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Cannot clone private collection'
      });
    }

    // Create clone
    const clonedCollection = await Collection.create({
      user: req.user.id,
      name: `${originalCollection.name} (Copy)`,
      description: originalCollection.description,
      icon: originalCollection.icon,
      tools: originalCollection.tools,
      isPublic: false
    });

    // Increment clone count
    originalCollection.clones += 1;
    await originalCollection.save();

    res.status(201).json({
      success: true,
      message: 'Collection cloned successfully',
      data: { collection: clonedCollection }
    });

  } catch (error) {
    console.error('❌ Clone collection error:', error);
    next(error);
  }
};

// ==================== @route   POST /api/collections/:id/follow ====================
// @desc    Follow/unfollow collection
// @access  Private
exports.toggleFollow = async (req, res, next) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check if already following
    const isFollowing = collection.followers.includes(req.user.id);

    if (isFollowing) {
      // Unfollow
      collection.followers = collection.followers.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      // Follow
      collection.followers.push(req.user.id);
    }

    await collection.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? 'Unfollowed collection' : 'Following collection',
      data: {
        isFollowing: !isFollowing,
        followerCount: collection.followers.length
      }
    });

  } catch (error) {
    console.error('❌ Toggle follow error:', error);
    next(error);
  }
};
