// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://03518ee8632d2e31dfd1e99510c0723a@o4510646197288960.ingest.de.sentry.io/4510646198272080",

  // Sample 10% of traces in production to stay within free tier limits
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',
});
