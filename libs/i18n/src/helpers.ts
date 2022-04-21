import { ParsedUrlQuery } from "querystring";

import { getConfig } from "./config";
import { Locale } from "./types";

const findLocaleByNextLocale = ({
  locale,
  defaultLocale,
}: {
  locale?: string;
  defaultLocale?: string;
}): Locale | undefined => {
  const langtag = locale ?? defaultLocale;
  return langtag ? findLocaleByLangtag(langtag) : undefined;
};

const findLocaleByLangtag = (langtag: string) => {
  const { supportedLocales } = getConfig();

  return supportedLocales.find(
    (locale) => locale.langtag.toLowerCase() === langtag.toLowerCase()
  );
};

// In most cases we'll want to use the locale value provided by Next's page
// or app context, but we'll still need to use this for the API as it doesn't
// have access to either of these.
const findLocaleByQuery = (query: ParsedUrlQuery) => {
  const { supportedLocales } = getConfig();

  return supportedLocales.find(
    ({ language, region }) =>
      language === query.language && region === query.region
  );
};

const getOpenGraphLocale = ({
  language,
  region,
}: Pick<Locale, "language" | "region">) =>
  `${language.toLowerCase()}_${region.toUpperCase()}`;

export {
  findLocaleByLangtag,
  findLocaleByNextLocale,
  findLocaleByQuery,
  getOpenGraphLocale,
};
