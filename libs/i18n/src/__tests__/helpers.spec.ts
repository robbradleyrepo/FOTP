import { configureI18n } from "../config";
import { findLocaleByLangtag, findLocaleByQuery } from "../helpers";
import { Locale } from "../types";

const mockLocale: Locale = {
  countryCode: "FOO",
  label: "Foo",
  langtag: "mk-FOO",
  language: "mk",
  region: "foo",
  resource: {},
  timeZone: "Continent/City",
};

const supportedLocales = [
  {
    countryCode: "US",
    label: "Looking for our US store?",
    langtag: "en-US",
    language: "en",
    region: "us",
    resource: {},
    timeZone: "America/Los_Angeles",
  },
];

const fallbackLocale = supportedLocales[0];

configureI18n({ fallbackLocale, supportedLocales });

describe("findLocaleByLangtag", () => {
  it("should return the supported locale that matches the provided langtag", () => {
    supportedLocales.forEach((locale) => {
      expect(findLocaleByLangtag(locale.langtag)).toBe(locale);
    });
  });

  it("should return `undefined` if no supported locales match the query params", () => {
    expect(findLocaleByLangtag(mockLocale.langtag)).toBeUndefined();
  });
});

describe("findLocaleByQuery", () => {
  it("should return the supported locale that matches the provided region and language query params", () => {
    supportedLocales.forEach((locale) => {
      const { language, region } = locale;

      expect(
        findLocaleByQuery({
          language,
          region,
        })
      ).toBe(locale);
    });
  });

  it("should return `undefined` if no supported locales match the query params", () => {
    const { language, region } = mockLocale;

    expect(
      findLocaleByQuery({
        language,
        region,
      })
    ).toBeUndefined();
  });
});
