require('dotenv').config();

// Initialize Sentry FIRST - before any other code (only if DSN is provided)
let Sentry = null;
if (process.env.SENTRY_DSN) {
  Sentry = require("@sentry/node");
  const { nodeProfilingIntegration } = require("@sentry/profiling-node");

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    environment: process.env.NODE_ENV || 'development',
    enabled: true,
  });
  console.log('✅ Sentry initialized successfully');
} else {
  console.log('ℹ️  Sentry not initialized (SENTRY_DSN not set)');
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// ==================== VALIDATE ENVIRONMENT VARIABLES ====================
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'NODE_ENV'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ ERROR: Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\n💡 Please create a .env file based on .env.example');
  process.exit(1);
}

// Validate JWT secrets are not default values
if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
  console.warn('⚠️  WARNING: Using default JWT_SECRET! Change this in production!');
}

if (process.env.JWT_REFRESH_SECRET === 'your_super_secret_refresh_key_change_this_in_production') {
  console.warn('⚠️  WARNING: Using default JWT_REFRESH_SECRET! Change this in production!');
}

// ==================== INITIALIZE APP ====================
const app = express();

// ==================== CONNECT TO DATABASE ====================
connectDB();

// ==================== MIDDLEWARE ====================

// Sentry request handler must be first (after body parser) - only if DSN is set
if (Sentry) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Security headers
app.use(helmet());

// CORS - Get allowed origins from environment variable
const getAllowedOrigins = () => {
  if (process.env.CLIENT_URL) {
    // Split comma-separated URLs and trim whitespace
    return process.env.CLIENT_URL.split(',').map(url => url.trim());
  }
  // Default to localhost origins for development
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173'
  ];
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (Cross-Site Scripting)
app.use(xss());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting - import from middleware
const { generalLimiter } = require('./middleware/rateLimiter');
app.use('/api', generalLimiter);

// ==================== ROUTES ====================

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Tools Marketplace API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tools: '/api/tools',
      bookmarks: '/api/bookmarks',
      reviews: '/api/reviews',
      installations: '/api/installations',
      collections: '/api/collections',
      admin: '/api/admin',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tools', require('./routes/toolRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/installations', require('./routes/installationRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ==================== SENTRY ERROR HANDLING ====================
// The Sentry request handler must be the first middleware
// (Already initialized at top of file)

// Sentry error handler must be before any other error middleware - only if DSN is set
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture 4xx and 5xx errors
      if (error.status >= 400) {
        return true;
      }
      return false;
    },
  }));
}

// ==================== ERROR HANDLER ====================
app.use(errorHandler);

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔐 API: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});
