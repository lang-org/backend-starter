import * as Sentry from "@sentry/node";

function isProd() {
  return process.env.ENVIRONMENT === "production";
}

Sentry.init({
  dsn: "https://7551d5a837004c6daa169f9cf30a0f00@sentry.io/1483288",
  environment: process.env.ENVIRONMENT,
});

type SentryContext = {
  user: any;
};

export function captureException(e: any, context?: SentryContext) {
  if (!isProd()) {
    // throw the error
    console.error(e);
  }
  // capture the excpetion
  if (typeof context === "object") {
    Sentry.withScope((scope) => {
      if (context.user) {
        scope.setUser(context.user);
      }
      Sentry.captureException(e);
    });
  } else {
    Sentry.captureException(e);
  }
}

export default Sentry;
