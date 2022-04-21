export interface AnalyticsConfig {
  integrations?: {
    googleTagManager?: {
      key: string;
      proxyUrl?: string;
    };
    googleOptimize?: {
      key: string;
    };
  };
}
