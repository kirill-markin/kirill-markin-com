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
const GLOBAL_UNHANDLED_REJECTION_MECHANISM = 'auto.browser.global_handlers.onunhandledrejection';
const SENTRY_APPLICATION_KEY = 'kirill-markin-com';
const SENTRY_BUNDLER_PLUGIN_APP_KEY_PREFIX = '_sentryBundlerPluginAppKey:';
const SERIALIZED_ERROR_TEXT_FIELDS: readonly string[] = ['message', 'name', 'stack'];
const EXTENSION_MESSAGING_API_PATTERNS: readonly RegExp[] = [
  /runtime\.sendMessage/i,
  /chrome\.runtime/i,
  /browser\.runtime/i,
];
const CHROME_EXTENSION_ASYNC_RESPONSE_ERROR_MESSAGE = 'A listener indicated an asynchronous response by returning true';
const FIRST_PARTY_FRAME_PATTERNS: readonly RegExp[] = [
  /webpack-internal:\/\/\/(?:\([^)]+\)\/)?\.\/src\//,
];

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
  // Object/ErrorEvent rejections — Sentry SDK eventbuilder wording
  // ("Object captured as promise rejection with keys: ..."); covers crypto-wallet
  // and other browser-extension providers that reject with a plain object.
  'captured as promise rejection',
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
  return [
    event.message,
    event.logentry?.message,
    ...getExceptionValues(event).flatMap((exc) => [exc.type, exc.value]),
    ...getStringFragmentsFromUnknown(event.extra?.arguments),
    ...getStringFragmentsFromUnknown(event.extra?.__serialized__),
  ].filter((fragment): fragment is string => typeof fragment === 'string');
}

type SentryException = NonNullable<NonNullable<Sentry.ErrorEvent['exception']>['values']>[number];
type SentryStackFrame = NonNullable<NonNullable<SentryException['stacktrace']>['frames']>[number];

function getExceptionValues(event: Sentry.ErrorEvent): SentryException[] {
  return event.exception?.values || [];
}

function getExceptionStackFrames(event: Sentry.ErrorEvent): SentryStackFrame[] {
  return getExceptionValues(event).flatMap((exc) => exc.stacktrace?.frames || []);
}

function hasExceptionStackFrames(event: Sentry.ErrorEvent): boolean {
  return getExceptionStackFrames(event).length > 0;
}

function getObjectKeys(value: unknown): string[] {
  if (value === null || typeof value !== 'object') {
    return [];
  }

  return Object.keys(value);
}

function hasApplicationKeyFrame(event: Sentry.ErrorEvent): boolean {
  const applicationKeyMetadataName = `${SENTRY_BUNDLER_PLUGIN_APP_KEY_PREFIX}${SENTRY_APPLICATION_KEY}`;

  return getExceptionStackFrames(event).some((frame) => (
    getObjectKeys(frame.module_metadata).includes(applicationKeyMetadataName)
  ));
}

function hasFirstPartyFrame(event: Sentry.ErrorEvent): boolean {
  return getExceptionStackFrames(event).some((frame) => (
    [frame.filename, frame.abs_path, frame.module]
      .filter((fragment): fragment is string => typeof fragment === 'string')
      .some((fragment) => FIRST_PARTY_FRAME_PATTERNS.some((pattern) => pattern.test(fragment)))
  ));
}

function getAppErrorOrigin(event: Sentry.ErrorEvent): string | null {
  const origin = event.tags?.app_error_origin;
  return typeof origin === 'string' && origin.length > 0 ? origin : null;
}

function isTrueTagValue(value: unknown): boolean {
  return value === true || value === 'true' || value === 'True';
}

function hasAppErrorTag(event: Sentry.ErrorEvent): boolean {
  return isTrueTagValue(event.tags?.app_error);
}

function hasThirdPartyCodeTag(event: Sentry.ErrorEvent): boolean {
  return isTrueTagValue(event.tags?.third_party_code);
}

function withAppOriginTags(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  const appErrorOrigin = getAppErrorOrigin(event);

  if (appErrorOrigin !== null) {
    return {
      ...event,
      tags: {
        ...event.tags,
        app_error: true,
      },
    };
  }

  if (hasAppErrorTag(event)) {
    return {
      ...event,
      tags: {
        ...event.tags,
        app_error: true,
        app_error_origin: 'explicit_capture',
      },
    };
  }

  if (hasApplicationKeyFrame(event) || hasFirstPartyFrame(event)) {
    return {
      ...event,
      tags: {
        ...event.tags,
        app_error: true,
        app_error_origin: 'first_party_stack',
      },
    };
  }

  if (!hasExceptionStackFrames(event)) {
    return {
      ...event,
      tags: {
        ...event.tags,
        app_error_origin: 'stackless_unknown',
      },
    };
  }

  return event;
}

function isExtensionMessagingNoise(event: Sentry.ErrorEvent): boolean {
  const hasUnhandledRejectionMechanism = getExceptionValues(event).some(
    (exc) => exc.mechanism?.type === GLOBAL_UNHANDLED_REJECTION_MECHANISM,
  );

  if (!hasUnhandledRejectionMechanism || hasExceptionStackFrames(event)) {
    return false;
  }

  return getEventOwnedTextFragments(event).some((fragment) => (
    EXTENSION_MESSAGING_API_PATTERNS.some((pattern) => pattern.test(fragment))
    || fragment.includes(CHROME_EXTENSION_ASYNC_RESPONSE_ERROR_MESSAGE)
  ));
}

function isIgnoredClientError(event: Sentry.ErrorEvent): boolean {
  const message = event.message || '';
  const exceptionValues = event.exception?.values || [];
  const eventOwnedTextFragments = getEventOwnedTextFragments(event);

  if (isExtensionMessagingNoise(event)) {
    return true;
  }

  if (hasThirdPartyCodeTag(event) && !hasAppErrorTag(event)) {
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

  if (!hasAppErrorTag(event)) {
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
      behaviour: 'apply-tag-if-exclusively-contains-third-party-frames',
    }),
  ],

  // Filter out known noisy client-side errors
  beforeSend(event) {
    const taggedEvent = withAppOriginTags(event);

    if (isIgnoredClientError(taggedEvent)) {
      return null; // Drop the event
    }
    return taggedEvent;
  },

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
