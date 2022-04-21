import { AnalyticsConfig } from "./types";

const ANALYTICS: AnalyticsConfig = {
  integrations: {
    googleOptimize: process.env.GOOGLE_OPTIMIZE_KEY
      ? { key: process.env.GOOGLE_OPTIMIZE_KEY }
      : undefined,
    googleTagManager: process.env.GOOGLE_TAG_MANAGER
      ? {
          key: process.env.GOOGLE_TAG_MANAGER,
          proxyUrl: process.env.GOOGLE_TAG_MANAGER_PROXY_URL,
        }
      : undefined,
  },
};

export default ANALYTICS;
