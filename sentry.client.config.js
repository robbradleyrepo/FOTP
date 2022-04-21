// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { ExtraErrorData } from "@sentry/integrations";
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.ENVIRONMENT,
  integrations: [new ExtraErrorData({ depth: 4 })],
  normalizeDepth: 5, // Required to make `depth` option on `ExtraErrorData` work - see https://github.com/getsentry/sentry-javascript/issues/2539#issuecomment-616638746

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
