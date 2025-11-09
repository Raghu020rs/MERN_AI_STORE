// Sentry Configuration for Backend
// Copy this code to the TOP of backend/server.js (before any other imports)

const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

// Initialize Sentry - should be the first thing in your app
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance Monitoring
  integrations: [
    nodeProfilingIntegration(),
  ],
  
  // Performance Monitoring - adjust sample rate for production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Profiling - adjust sample rate for production
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Release tracking (optional - useful for tracking which version has issues)
  // release: `ai-marketplace-backend@${require('./package.json').version}`,
  
  // Only enable in production or when SENTRY_DSN is set
  enabled: process.env.NODE_ENV === 'production' || !!process.env.SENTRY_DSN,
  
  // Error filtering - don't send certain errors to Sentry
  beforeSend(event, hint) {
    // Filter out errors we don't want to track
    const error = hint.originalException;
    
    if (error && error.message) {
      // Don't send validation errors to Sentry (they're expected)
      if (error.message.includes('validation') || 
          error.message.includes('Validation')) {
        return null;
      }
      
      // Don't send authentication errors (they're expected)
      if (error.message.includes('Invalid credentials') ||
          error.message.includes('Not authorized')) {
        return null;
      }
      
      // Don't send rate limiting errors (they're expected)
      if (error.message.includes('Too many')) {
        return null;
      }
    }
    
    return event;
  },
});

// Export for use in routes
module.exports = { Sentry };
