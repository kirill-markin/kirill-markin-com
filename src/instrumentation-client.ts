// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Patterns indicating browser extension interference
const EXTENSION_ERROR_PATTERNS = [
  // Extension URLs in stack traces
  /chrome-extension:\/\//,
  /moz-extension:\/\//,
  /safari-extension:\/\//,
  /safari-web-extension:\/\//,
  // Common extension function names that intercept fetch/XHR
  /will_log_call/,
  /log_call/,
  // Anonymous scripts injected by extensions
  /<anonymous>:\d+:\d+.*(?:fetch|clone)/,
];

// Error messages typically caused by extensions or external scripts
const EXTENSION_ERROR_MESSAGES = [
  'req.clone is not a function',
  'Request.clone',
  'ResizeObserver loop', // Often caused by extensions observing DOM
];

function isExtensionError(event: Sentry.ErrorEvent): boolean {
  const message = event.message || '';
  const exceptionValues = event.exception?.values || [];

  // Check error message
  for (const pattern of EXTENSION_ERROR_MESSAGES) {
    if (message.includes(pattern)) {
      return true;
    }
    for (const exc of exceptionValues) {
      if (exc.value?.includes(pattern)) {
        return true;
      }
    }
  }

  // Check stack traces for extension patterns
  for (const exc of exceptionValues) {
    const frames = exc.stacktrace?.frames || [];
    for (const frame of frames) {
      const filename = frame.filename || '';
      const functionName = frame.function || '';
      
      for (const pattern of EXTENSION_ERROR_PATTERNS) {
        if (pattern.test(filename) || pattern.test(functionName)) {
          return true;
        }
      }
    }
  }

  return false;
}

Sentry.init({
  dsn: "https://03518ee8632d2e31dfd1e99510c0723a@o4510646197288960.ingest.de.sentry.io/4510646198272080",

  // Sample 10% of traces in production to stay within free tier limits
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Capture console.error and console.warn calls
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ['error', 'warn'],
    }),
  ],

  // Filter out errors caused by browser extensions
  beforeSend(event) {
    if (isExtensionError(event)) {
      return null; // Drop the event
    }
    return event;
  },

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
