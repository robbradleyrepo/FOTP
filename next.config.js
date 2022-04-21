const { resolve } = require("path");
const { createSecureHeaders } = require("next-secure-headers");
const { withSentryConfig } = require("@sentry/nextjs");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: resolve(__dirname, ".env") });
}

const analyze = process.env.ANALYZE === "true";

if (analyze) {
  console.info(
    "Creating and analyzing an optimized production build - this might take a while..."
  );
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: analyze,
});

const ENV_CONFIG = [
  { key: "BACKEND_URL", required: true },
  { key: "CLOUDINARY_CLOUD_NAME", required: true },
  { key: "DEFAULT_DISCOUNT_CODE", required: false },
  { key: "DISABLED_DISCOUNT_CODES", required: false },
  { key: "ENVIRONMENT", required: true },
  { key: "FB_APP_ID", required: true },
  { key: "FB_HANDLE", required: true },
  { key: "FEATURE_SHOPIFY_CHECKOUT", required: false },
  { key: "GOOGLE_OPTIMIZE_KEY", required: false },
  { key: "GOOGLE_TAG_MANAGER", required: false },
  { key: "GOOGLE_TAG_MANAGER_PROXY_URL", required: false },
  { key: "GORGIAS_CHAT_APP_ID", required: false },
  { key: "INSTAGRAM_HANDLE", required: true },
  { key: "MAPBOX_KEY", required: true },
  { key: "MAPBOX_STYLE_ID", required: true },
  { key: "MAPBOX_USERNAME", required: true },
  { key: "ORIGIN", required: true },
  { key: "PRISMIC_BASE_URL", required: true },
  { key: "PURPLE_DOT_API_KEY", required: true },
  { key: "SENTRY_AUTH_TOKEN", required: false },
  { key: "SENTRY_DSN", required: false },
  { key: "SHOPIFY_US_ACCESS_TOKEN", required: true },
  { key: "SHOPIFY_US_PRIMARY_DOMAIN", required: true },
  { key: "SHOPPING_GIVES_STORE_ID", required: false },
  { key: "STAMPED_API_KEY", required: false },
  { key: "STAMPED_STORE_URL", required: false },
  { key: "STRIPE_PUBLISHABLE_KEY", required: true },
  { key: "TWITTER_HANDLE", required: false },
  { key: "VIDALYTICS_CUSTOMER_ID", required: true },
  { key: "VIMEO_ACCESS_TOKEN", required: true },
];

const getEnv = () => {
  const env = {};
  const errors = [];

  ENV_CONFIG.forEach(({ key, required }) => {
    const value = process.env[key] || "";

    if (required && !value) {
      errors.push(key);
    }

    env[key] = value;
  });

  if (errors.length > 0) {
    throw new Error(
      `Missing environment variables:\n${errors
        .map((key) => `  * ${key}`)
        .join("\n")}`
    );
  }

  return env;
};

const moduleExports = withBundleAnalyzer({
  env: getEnv(),
  experimental: {
    optimizeCss: {
      inlineThreshold: 10000,
    },
  },
  async headers() {
    return [
      {
        headers: createSecureHeaders({
          forceHTTPSRedirect: [
            true,
            {
              includeSubDomains: true,
              maxAge: 2 * 365 * 24 * 60 * 60, // 2 years in seconds
              preload: true,
            },
          ],
          frameGuard: "sameorigin",
          referrerPolicy: "no-referrer-when-downgrade",
        }),
        source: "/:path*",
      },
    ];
  },
  i18n: {
    defaultLocale: "en-US",
    locales: ["en-US"],
  },
  images: {
    domains: ["cdn.shopify.com", "i.vimeocdn.com", "images.prismic.io"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 24 * 60 * 60,
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        destination: "https://unconditionallovestories.com",
        permanent: true,
        source: "/love",
      },
      {
        destination: "https://us.fotp.com/account/register",
        permanent: true,
        source: "/us/en/activate",
      },
      {
        destination: "https://us.fotp.com/account/login#recover",
        permanent: true,
        source: "/us/en/reset",
      },
      {
        destination: "https://us.fotp.com/account/register",
        permanent: true,
        source: "/us/en/signup",
      },
      {
        destination: "https://us.fotp.com/account/login",
        permanent: true,
        source: "/us/en/login",
      },
      {
        destination: "/",
        permanent: true,
        source: "/us/en",
      },
      // Following two rules allow redirecting everything except /us/en/landing,
      // which is taken care of by rewrites above. See below for simpler rule
      // that can replace them once direct-hit /us/en/landing is no longer needed.
      {
        destination: "/:part",
        locale: false,
        permanent: true,
        source: "/us/en/:part",
        // Needed on Vercel, even if it works fine in dev without it:
      },
      {
        destination: "/:part/:rest*",
        permanent: true,
        source: "/us/en/:part((?!landing)\\w+)/:rest*",
      },
      // When landing no longer needs a direct hit, the following rule should
      // cover everything:
      // {
      //   destination: "/:slug*",
      //   locale: false,
      //   permanent: true,
      //   source: "/us/en/:slug*",
      // },
      // The following rules redirects our legacy API QR codes to the below redirects
      {
        destination: "/qr/:part",
        permanent: true,
        source: "/api/us/en/qr/:part",
      },
      {
        destination:
          "/info?utm_source=packaging&utm_medium=qr&utm_content=generic",
        permanent: false,
        source: "/qr/generic",
      },
      {
        destination:
          "/info/harmony?utm_source=packaging&utm_medium=qr&utm_content=harmony",
        permanent: true,
        source: "/qr/harmony",
      },
      {
        destination:
          "/info?utm_source=packaging&utm_medium=qr&utm_content=info",
        permanent: false,
        source: "/qr/info",
      },
      {
        destination:
          "/info/move?utm_source=packaging&utm_medium=qr&utm_content=move",
        permanent: true,
        source: "/qr/move",
      },
      {
        destination:
          "/info/the-one?utm_source=packaging&utm_medium=qr&utm_content=the-one",
        permanent: true,
        source: "/qr/the-one",
      },
      {
        destination: "/science",
        permanent: true,
        source: "/our-approach",
      },
      {
        destination: "/science/ingredients",
        permanent: true,
        source: "/ingredients",
      },
      {
        destination: "/science/ingredients/:handle",
        permanent: true,
        source: "/ingredients/:handle",
      },
      {
        destination: "/science/experts",
        permanent: true,
        source: "/science-advisory-board",
      },
      {
        destination: "/science/experts/:handle",
        permanent: true,
        source: "/science-advisory-board/:handle",
      },
      {
        destination: "/science/evidence",
        permanent: true,
        source: "/evidence",
      },
      {
        destination: "/science/evidence/studies",
        permanent: true,
        source: "/evidence/studies",
      },
      {
        destination: "/science/testing-and-transparency",
        permanent: true,
        source: "/testing",
      },
      {
        destination: "/science/testing-and-transparency/:handle",
        permanent: true,
        source: "/testing/:handle",
      },
      {
        destination: "/mission",
        permanent: true,
        source: "/about",
      },
      {
        destination: "/mission/supporting-shelters",
        permanent: true,
        source: "/supporting-shelters",
      },
      {
        destination: "/mission/sustainability",
        permanent: true,
        source: "/sustainability",
      },
      {
        destination: "/help/faq",
        permanent: true,
        source: "/faq",
      },
      {
        destination: "/help/contact",
        permanent: true,
        source: "/contact",
      },
      {
        destination: "/help/answers-for-veterinarians",
        permanent: true,
        source: "/for-veterinarians",
      },
      {
        destination: "/work-with-us/influencer",
        permanent: true,
        source: "/become-an-influencer",
      },
      {
        destination: "/work-with-us/refer",
        permanent: true,
        source: "/refer",
      },
      {
        destination: "/work-with-us/refer/claim",
        permanent: true,
        source: "/refer/claim",
      },
      {
        destination: "/food/plan/name",
        permanent: false,
        source: "/food/plan",
      },
    ];
  },
  async rewrites() {
    return [
      {
        destination: "/landing/:slug",
        source: "/us/en/landing/:slug",
      },
    ];
  },
});

const uploadSourceMaps = ["staging", "prod"].includes(process.env.ENVIRONMENT);

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.

  dryRun: !uploadSourceMaps,
  silent: !uploadSourceMaps,
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
const config = withSentryConfig(moduleExports, SentryWebpackPluginOptions);

module.exports = config;
