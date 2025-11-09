const Installation = require('../models/Installation');
const Tool = require('../models/Tool');

// ==================== @route   POST /api/installations ====================
// @desc    Track installation
// @access  Public (with optional auth)
exports.trackInstallation = async (req, res, next) => {
  try {
    const {
      toolId,
      sessionId,
      source,
      referrer,
      device,
      browser,
      os,
      country,
      ip
    } = req.body;

    // Check if tool exists
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Create installation record
    const installation = await Installation.create({
      user: req.user ? req.user.id : null,
      tool: toolId,
      sessionId,
      source: source || 'direct',
      referrer,
      device: device || 'desktop',
      browser,
      os,
      country,
      ip
    });

    console.log('✅ Installation tracked:', installation._id);

    res.status(201).json({
      success: true,
      message: 'Installation tracked successfully',
      data: { installation }
    });

  } catch (error) {
    console.error('❌ Track installation error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/installations/tool/:toolId ====================
// @desc    Get installation stats for a tool
// @access  Private (Admin only)
exports.getToolInstallations = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { tool: toolId };

    // Date filter
    if (startDate || endDate) {
      query.installedAt = {};
      if (startDate) query.installedAt.$gte = new Date(startDate);
      if (endDate) query.installedAt.$lte = new Date(endDate);
    }

    const installations = await Installation.find(query)
      .sort('-installedAt')
      .limit(100);

    // Get statistics
    const stats = await Installation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          bySource: {
            $push: '$source'
          },
          byDevice: {
            $push: '$device'
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        installations,
        count: installations.length,
        stats: stats[0] || {}
      }
    });

  } catch (error) {
    console.error('❌ Get tool installations error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/installations/user ====================
// @desc    Get user's installations
// @access  Private
exports.getUserInstallations = async (req, res, next) => {
  try {
    const installations = await Installation.find({ user: req.user.id })
      .populate('tool', 'name icon category developer')
      .sort('-installedAt');

    res.status(200).json({
      success: true,
      data: {
        installations,
        count: installations.length
      }
    });

  } catch (error) {
    console.error('❌ Get user installations error:', error);
    next(error);
  }
};

// ==================== @route   GET /api/installations/stats ====================
// @desc    Get overall installation statistics
// @access  Private (Admin only)
exports.getInstallationStats = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch(period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get statistics
    const stats = await Installation.aggregate([
      {
        $match: {
          installedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $facet: {
          total: [
            { $count: 'count' }
          ],
          bySource: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          byDevice: [
            { $group: { _id: '$device', count: { $sum: 1 } } }
          ],
          byDate: [
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$installedAt' } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],
          topTools: [
            {
              $group: {
                _id: '$tool',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'tools',
                localField: '_id',
                foreignField: '_id',
                as: 'tool'
              }
            },
            { $unwind: '$tool' }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        stats: stats[0]
      }
    });

  } catch (error) {
    console.error('❌ Get installation stats error:', error);
    next(error);
  }
};
