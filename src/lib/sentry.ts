// Sentry Configuration for Frontend
// File: src/lib/sentry.ts

import * as Sentry from "@sentry/react";

export function initSentry() {
  // Only initialize Sentry if DSN is provided
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.log('ℹ️ Sentry not initialized (VITE_SENTRY_DSN not set)');
    return;
  }

  try {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      
      // Performance Monitoring
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      
      // Performance Monitoring - adjust sample rate for production
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      
      // Session Replay - adjust sample rate for production
      replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
      
      // Environment
      environment: import.meta.env.MODE || 'development',
      
      // Release tracking (optional)
      // release: `ai-marketplace-frontend@${import.meta.env.VITE_APP_VERSION}`,
      
      // Explicitly enable
      enabled: true,
    
      // Error filtering
      beforeSend(event, hint) {
        const error = hint.originalException;
        
        if (error && error instanceof Error) {
          // Don't send network errors (user's connection issues)
          if (error.message.includes('NetworkError') ||
              error.message.includes('Failed to fetch')) {
            return null;
          }
          
          // Don't send expected validation errors
          if (error.message.includes('validation')) {
            return null;
          }
        }
        
        return event;
      },
      
      // Ignore certain errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        'chrome-extension://',
        'moz-extension://',
        
        // Network errors
        'NetworkError',
        'Failed to fetch',
        'Load failed',
        
        // Random plugins/extensions
        'Can\'t find variable: InstallTrigger',
      ],
    });
    
    console.log('✅ Sentry initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error);
  }
}

// Helper function to capture errors manually
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Helper function to capture messages
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

// Helper function to set user context
export function setUser(user: { id: string; email?: string; name?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    });
  } else {
    Sentry.setUser(null);
  }
}

// Helper to add breadcrumb for debugging
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}
