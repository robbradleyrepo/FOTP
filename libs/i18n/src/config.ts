import { captureException } from "@sentry/nextjs";
import { Extras } from "@sentry/types";
import i18n, { Callback, Resource } from "i18next";
import { initReactI18next } from "react-i18next";

import { I18nConfig } from "./types";

let config: I18nConfig;

export const getConfig = () => {
  if (!config) {
    throw new Error("i18n must be initialized before use");
  }

  return config;
};

const handleMissing = (message: string, extra: Extras) => {
  const error = new Error(message);

  if (process.env.NODE_ENV !== "production") {
    console.error(message, extra);
    throw error;
  }

  captureException(error, { extra });
};

export const configureI18n = ({
  supportedLocales,
  fallbackLocale,
}: I18nConfig) => {
  if (config) {
    throw new Error("i18n is already initialised");
  }

  config = {
    fallbackLocale,
    supportedLocales,
  };

  const resources: Resource = supportedLocales.reduce(
    (accum, { langtag, resource }) => ({
      ...accum,
      [langtag]: resource,
    }),
    {}
  );

  return i18n.use(initReactI18next).init({
    fallbackLng: fallbackLocale.langtag,
    missingInterpolationHandler: (text, value) =>
      handleMissing("Missing i18n interpolation value", { text, value }),
    missingKeyHandler: (lngs, ns, key, fallbackValue) =>
      handleMissing("Missing i18n key", { fallbackValue, key, lngs, ns }),
    react: {
      transKeepBasicHtmlNodesFor: [
        "b",
        "br",
        "em",
        "i",
        "p",
        "sub",
        "sup",
        "strong",
      ],
    },
    resources,
    saveMissing: true,
  });
};

/**
 * Get the `i18n` instance to use for localisation.
 *
 * On the server we take a clone of the default i18n instance so that we do not
 * pollute other requests. On the client we can just use the default instance.
 *
 */
export const getI18nInstance = (callback?: Callback) => {
  if (typeof window === "undefined") {
    const serverInstance = i18n.cloneInstance(undefined, callback);
    serverInstance.init();
    return serverInstance;
  }

  return i18n;
};
