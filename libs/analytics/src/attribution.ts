import store from "store/dist/store.modern";

const CAPTURE_LIST = [
  "fbclid", // Facebook
  "gclid", // Google Click Ads
  "dclid", // Google Display Ads
  "msclickid", // Bing Ads
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
  "irclickid", // Impact Radius
  "tduid", // TradeDoubler
] as const;

const STORE_KEY = "attribution";

export const getCapturedTrackingParams = (): Record<string, string> => {
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Unsupported store usage");
    }
    return {};
  }

  return store.get(STORE_KEY, {});
};

const setCapturedTrackingParams = (captured: Record<string, string>) => {
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Unsupported store usage");
    }
    return;
  }

  store.set(STORE_KEY, captured);
};

export const captureTrackingParams = (search: string) => {
  if (typeof window === "undefined") {
    // Server side, skip.
    return;
  }

  const captured = getCapturedTrackingParams();

  const params = new URLSearchParams(search);
  for (const key of CAPTURE_LIST) {
    const value = params.get(key);
    if (value !== null) {
      captured[key] = value;
    }
  }

  setCapturedTrackingParams(captured);
};
