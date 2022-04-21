import { I18nConfig, Locale } from "@sss/i18n";

import enUsResource from "./en-us.json";

const supportedLocales: readonly Locale[] = [
  {
    countryCode: "US",
    label: "Looking for our US store?",
    langtag: "en-US",
    language: "en",
    region: "us",
    resource: enUsResource,
    timeZone: "America/Los_Angeles",
  },
];

const fallbackLocale = supportedLocales[0];

export const I18N: I18nConfig = {
  fallbackLocale,
  supportedLocales,
};

export const ORIGIN = process.env.ORIGIN;

export const SOCIAL = {
  facebook: {
    appId: process.env.FB_APP_ID,
    handle: process.env.FB_HANDLE,
    url: `https://www.facebook.com/${process.env.FB_HANDLE}`,
  },
  instagram: {
    handle: process.env.INSTAGRAM_HANDLE,
    url: `https://www.instagram.com/${process.env.INSTAGRAM_HANDLE}/`,
  },
  pinterest: {
    handle: "fotpdotcom",
    url: `https://www.pinterest.com/fotpdotcom/`,
  },
  twitter: {
    handle: process.env.TWITTER_HANDLE,
    url: `https://www.twitter.com/${process.env.TWITTER_HANDLE}`,
  },
  youtube: {
    handle: `youtube`,
    url: `https://www.youtube.com/channel/UCjfrM1jSY4JGGNEB09U9tIA`,
  },
};

export const SHOPIFY_US_PRIMARY_ORIGIN = `https://${process.env.SHOPIFY_US_PRIMARY_DOMAIN}`;
export const THEMES_ENGINE = {
  urls: {
    account: `${SHOPIFY_US_PRIMARY_ORIGIN}/account`,
    login: `${SHOPIFY_US_PRIMARY_ORIGIN}/account/login`,
    recover: `${SHOPIFY_US_PRIMARY_ORIGIN}/account/login#recover`,
    register: `${SHOPIFY_US_PRIMARY_ORIGIN}/account/register`,
  },
};
