const Tool = require('../models/Tool');

// ==================== @route   GET /api/tools ====================
// @desc    Get all tools with pagination, filters, and sorting
// @access  Public
exports.getAllTools = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      price,
      minRating,
      sort = '-rating',
      search
    } = req.query;

    // Build query
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price
    if (price) {
      query.price = price;
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Search in name, description, tags
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { developer: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const tools = await Tool.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    // Get total count for pagination
    const count = await Tool.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tools,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalTools: count,
          perPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get all tools error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/tools/:id ====================
// @desc    Get single tool by ID
// @access  Public
exports.getToolById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tool = await Tool.findOne({ id });

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { tool }
    });

  } catch (error) {
    console.error('❌ Get tool by ID error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/tools/search ====================
// @desc    Search tools
// @access  Public
exports.searchTools = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const tools = await Tool.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { developer: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    })
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        tools,
        count: tools.length
      }
    });

  } catch (error) {
    console.error('❌ Search tools error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/tools/category/:category ====================
// @desc    Get tools by category
// @access  Public
exports.getToolsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 20, sort = '-rating' } = req.query;

    const tools = await Tool.find({ category })
      .sort(sort)
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        tools,
        count: tools.length,
        category
      }
    });

  } catch (error) {
    console.error('❌ Get tools by category error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/tools/featured ====================
// @desc    Get featured tools
// @access  Public
exports.getFeaturedTools = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const tools = await Tool.find({ featured: true })
      .sort('-rating')
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        tools,
        count: tools.length
      }
    });

  } catch (error) {
    console.error('❌ Get featured tools error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/tools/trending ====================
// @desc    Get trending tools
// @access  Public
exports.getTrendingTools = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const tools = await Tool.find({ trending: { $exists: true, $ne: null } })
      .sort('-viewCount -rating')
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        tools,
        count: tools.length
      }
    });

  } catch (error) {
    console.error('❌ Get trending tools error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/tools/top-rated ====================
// @desc    Get top rated tools
// @access  Public
exports.getTopRatedTools = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const tools = await Tool.find({ rating: { $gte: 4.5 } })
      .sort('-rating -totalRatings')
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      data: {
        tools,
        count: tools.length
      }
    });

  } catch (error) {
    console.error('❌ Get top rated tools error:', error);
    next(error);
  }
};

// ==================== @route   POST /api/tools/submit ====================
// @desc    Submit a new tool (requires authentication)
// @access  Private
exports.submitTool = async (req, res, next) => {
  try {
    const {
      name,
      description,
      longDescription,
      category,
      developer,
      website,
      demoUrl,
      features,
      integrations,
      price,
      actualPrice
    } = req.body;

    // Generate unique ID from name
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if tool already exists
    const existingTool = await Tool.findOne({ id });
    if (existingTool) {
      return res.status(400).json({
        success: false,
        message: 'A tool with this name already exists'
      });
    }

    // Create tool
    const tool = await Tool.create({
      id,
      name,
      description,
      longDescription,
      category,
      developer,
      website,
      demoUrl,
      features: features || [],
      integrations: integrations || [],
      price: price || 'Freemium',
      actualPrice,
      icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${id}`, // Default icon
      rating: 0,
      totalRatings: 0,
      downloadCount: '0+',
      viewCount: 0,
      submittedBy: req.user.id,
      status: 'pending' // Admin approval required
    });

    console.log('✅ Tool submitted:', tool.id);

    res.status(201).json({
      success: true,
      message: 'Tool submitted successfully. It will be reviewed by our team.',
      data: { tool }
    });

  } catch (error) {
    console.error('❌ Submit tool error:', error);
    next(error);
  }
};

// ==================== @route   PUT /api/tools/:id ====================
// @desc    Update tool (admin only)
// @access  Private/Admin
exports.updateTool = async (req, res, next) => {
  try {
    const { id } = req.params;

    let tool = await Tool.findOne({ id });

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Update tool
    tool = await Tool.findOneAndUpdate(
      { id },
      req.body,
      { new: true, runValidators: true }
    );

    console.log('✅ Tool updated:', tool.id);

    res.status(200).json({
      success: true,
      message: 'Tool updated successfully',
      data: { tool }
    });

  } catch (error) {
    console.error('❌ Update tool error:', error);
    next(error);
  }
};

// ==================== @route   DELETE /api/tools/:id ====================
// @desc    Delete tool (admin only)
// @access  Private/Admin
exports.deleteTool = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tool = await Tool.findOne({ id });

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    await tool.deleteOne();

    console.log('✅ Tool deleted:', id);

    res.status(200).json({
      success: true,
      message: 'Tool deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete tool error:', error);
    next(error);
  }
};

// ==================== @route   POST /api/tools/:id/view ====================
// @desc    Increment tool view count
// @access  Public
exports.incrementViews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tool = await Tool.findOneAndUpdate(
      { id },
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { viewCount: tool.viewCount }
    });

  } catch (error) {
    console.error('❌ Increment views error:', error);
    next(error);
  }
};

// ==================== @route   POST /api/tools/:id/download ====================
// @desc    Increment tool download count
// @access  Public
exports.incrementDownloads = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tool = await Tool.findOneAndUpdate(
      { id },
      { $inc: { actualDownloads: 1 } },
      { new: true }
    );

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Update download count display
    const downloads = tool.actualDownloads;
    let downloadCount = '0+';
    if (downloads >= 1000000) downloadCount = Math.floor(downloads / 1000000) + 'M+';
    else if (downloads >= 1000) downloadCount = Math.floor(downloads / 1000) + 'K+';
    else downloadCount = downloads + '+';

    tool.downloadCount = downloadCount;
    await tool.save();

    res.status(200).json({
      success: true,
      data: { 
        actualDownloads: tool.actualDownloads,
        downloadCount: tool.downloadCount
      }
    });

  } catch (error) {
    console.error('❌ Increment downloads error:', error);
    next(error);
  }
};
