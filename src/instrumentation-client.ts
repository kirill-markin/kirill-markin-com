// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Patterns indicating browser extension interference
const EXTENSION_ERROR_PATTERNS: readonly RegExp[] = [
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

const NEXT_RSC_PAYLOAD_ERROR_MESSAGE = 'Failed to fetch RSC payload';
const CHROME_EXTENSION_ASYNC_RESPONSE_ERROR_MESSAGE = 'A listener indicated an asynchronous response by returning true';
const GLOBAL_UNHANDLED_REJECTION_MECHANISM = 'auto.browser.global_handlers.onunhandledrejection';
const CHROME_BROWSER_PATTERN = /chrome|chromium/i;
const SERIALIZED_ERROR_TEXT_FIELDS: readonly string[] = ['message', 'name', 'stack'];

// Error messages typically caused by extensions, external scripts, or noisy framework fallbacks
const IGNORED_CLIENT_ERROR_MESSAGES: readonly string[] = [
  'req.clone is not a function',
  'Request.clone',
  'ResizeObserver loop', // Often caused by extensions observing DOM
  // React hydration errors when extensions modify DOM before/during hydration
  "Failed to execute 'removeChild' on 'Node'",
  "Failed to execute 'insertBefore' on 'Node'",
  "Failed to execute 'appendChild' on 'Node'",
  // Next.js RSC prefetch failures (network issues, user navigating away, etc.)
  NEXT_RSC_PAYLOAD_ERROR_MESSAGE,
  'Failed to fetch',
  'Load failed',
  // Non-Error promise rejections (usually from third-party scripts)
  'Non-Error promise rejection captured',
];

function getObjectStringField(value: object, fieldName: string): string | null {
  if (!(fieldName in value)) {
    return null;
  }

  const fieldValue = value[fieldName as keyof typeof value];
  return typeof fieldValue === 'string' ? fieldValue : null;
}

function getStringFragmentsFromUnknown(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (value instanceof Error) {
    return [value.message, value.stack].filter((fragment): fragment is string => typeof fragment === 'string');
  }

  if (Array.isArray(value)) {
    return value.flatMap(getStringFragmentsFromUnknown);
  }

  if (value !== null && typeof value === 'object') {
    return SERIALIZED_ERROR_TEXT_FIELDS
      .map((fieldName) => getObjectStringField(value, fieldName))
      .filter((fragment): fragment is string => fragment !== null);
  }

  return [];
}

function getEventOwnedTextFragments(event: Sentry.ErrorEvent): string[] {
  const exceptionValues = event.exception?.values || [];

  return [
    event.message,
    event.logentry?.message,
    ...exceptionValues.flatMap((exc) => [exc.type, exc.value]),
    ...getStringFragmentsFromUnknown(event.extra?.arguments),
    ...getStringFragmentsFromUnknown(event.extra?.__serialized__),
  ].filter((fragment): fragment is string => typeof fragment === 'string');
}

function hasExceptionStackFrames(event: Sentry.ErrorEvent): boolean {
  const exceptionValues = event.exception?.values || [];

  return exceptionValues.some((exc) => (exc.stacktrace?.frames?.length || 0) > 0);
}

function getBrowserTextFragments(event: Sentry.ErrorEvent): string[] {
  const browserContext = event.contexts?.browser;
  const requestUserAgent = event.request?.headers?.['User-Agent'] ?? null;

  if (browserContext === undefined) {
    return [requestUserAgent].filter((fragment): fragment is string => fragment !== null);
  }

  return [
    getObjectStringField(browserContext, 'name'),
    getObjectStringField(browserContext, 'browser'),
    requestUserAgent,
  ].filter((fragment): fragment is string => fragment !== null);
}

function isChromeExtensionMessagingNoise(event: Sentry.ErrorEvent): boolean {
  const exceptionValues = event.exception?.values || [];
  const hasUnhandledRejectionMechanism = exceptionValues.some(
    (exc) => exc.mechanism?.type === GLOBAL_UNHANDLED_REJECTION_MECHANISM,
  );

  if (!hasUnhandledRejectionMechanism || hasExceptionStackFrames(event)) {
    return false;
  }

  const isChromeBrowser = getBrowserTextFragments(event).some((fragment) => CHROME_BROWSER_PATTERN.test(fragment));

  return isChromeBrowser
    && getEventOwnedTextFragments(event).some((fragment) => (
      fragment.includes(CHROME_EXTENSION_ASYNC_RESPONSE_ERROR_MESSAGE)
    ));
}

function isIgnoredClientError(event: Sentry.ErrorEvent): boolean {
  const message = event.message || '';
  const exceptionValues = event.exception?.values || [];
  const eventOwnedTextFragments = getEventOwnedTextFragments(event);

  if (isChromeExtensionMessagingNoise(event)) {
    return true;
  }

  // Check error message
  for (const pattern of IGNORED_CLIENT_ERROR_MESSAGES) {
    if (message.includes(pattern)) {
      return true;
    }
    const isNextRscPayloadError = pattern === NEXT_RSC_PAYLOAD_ERROR_MESSAGE
      && eventOwnedTextFragments.some((fragment) => fragment.includes(pattern));
    if (isNextRscPayloadError) {
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

  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,

  // Sample 10% of traces in production to stay within free tier limits
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  integrations: (integrations) => [
    ...integrations,
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: ['kirill-markin-com'],
      behaviour: 'drop-error-if-contains-third-party-frames',
    }),
  ],

  // Filter out known noisy client-side errors
  beforeSend(event) {
    if (isIgnoredClientError(event)) {
      return null; // Drop the event
    }
    return event;
  },

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
