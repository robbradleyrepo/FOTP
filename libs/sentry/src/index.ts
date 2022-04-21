import * as Sentry from "@sentry/nextjs";

export const captureDetailedException = (
  error: Error,
  details: Record<string, unknown>
) => {
  Sentry.withScope((scope: Sentry.Scope) => {
    Object.entries(details).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });

    Sentry.captureException(error);
  });
};
