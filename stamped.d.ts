export declare global {
  interface Window {
    StampedFn?: {
      init: (options: { apiKey: string; storeUrl: string }) => void;
    };
  }
}
