require("@testing-library/jest-dom/extend-expect");

// Make sure Apollo is correctly mocked
require("@sss/apollo/testing");

jest.mock("next/dynamic", () => {
  return jest.fn(() => "Dynamic");
});

jest.mock("@sentry/browser");

jest.mock("@sentry/nextjs", () => ({
  ...jest.requireActual("@sentry/nextjs"),
  flush: jest.fn(),
}));

const SUPPRESSED_LOGS = [
  "WARNING: heuristic fragment matching going on!",
  "You are using the simple (heuristic) fragment matcher, but your queries contain union or interface types. Apollo Client will not be able to accurately map fragments. To make this error go away, use the `IntrospectionFragmentMatcher` as described in the docs: https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher",
  // /.*inside a test was not wrapped in act.*/
];

const consoleError = global.console.error;

global.console.error = (msg, ...rest) => {
  for (const suppressed of SUPPRESSED_LOGS) {
    if (
      (typeof suppressed === "string" && msg.startsWith(suppressed)) ||
      msg.match(suppressed)
    ) {
      return;
    }
  }
  consoleError(msg, ...rest);
};
