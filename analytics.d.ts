declare global {
  interface Window {
    dataLayer?: Record<string, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
