window.analytics = {
  identify: jest
    .fn()
    .mockImplementation(
      (_userId, _traits, _options, callback) => callback && callback()
    ),
  page: jest
    .fn()
    .mockImplementation(
      (_category, _name, _properties, _options, callback) =>
        callback && callback()
    ),
  reset: jest.fn(),
  timeout: jest.fn(),
  track: jest
    .fn()
    .mockImplementation(
      (_event, _properties, _options, callback) => callback && callback()
    ),
};

Object.defineProperty(window, "location", {
  value: {
    hash: "",
    hostname: "localhost",
    href: "https://localhost/us/en",
    origin: "https://localhost",
    pathname: "/us/en",
    port: "",
    protocol: "https:",
    reload: jest.fn(),
    search: "",
    toString() {
      return this.href;
    },
  },
  writable: true,
});

// Mock `window` methods that are not included in JSDOM
// More info: https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    addEventListener: jest.fn(),
    addListener: jest.fn(), // deprecated
    dispatchEvent: jest.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: jest.fn(),
    removeListener: jest.fn(), // deprecated
  };
});

window.scrollTo = jest.fn();

process.env = {
  ...process.env,
  ENVIRONMENT: "test",
  ORIGIN: "https://fotp.test",
  PRISMIC_BASE_URL: "https://fotp.com",
  STRIPE_PUBLISHABLE_KEY: "pub_key",
  // https://github.com/vercel/next.js/issues/18415
  __NEXT_IMAGE_OPTS: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: ["cdn.shopify.com", "images.prismic.io"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    loader: "default",
    path: "/_next/image",
  },
};
