/* eslint-disable @typescript-eslint/no-var-requires  */
import { Locale } from "../types";

const supportedLocales: Locale[] = [
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

beforeEach(() => {
  jest.resetModules();
});

describe("getConfig", () => {
  it("should throw an error if i18n has not been initialized", () => {
    const { getConfig } = require("../config");

    expect(() => getConfig()).toThrowError();
  });

  it("should return the configuration options used for initialization", () => {
    const { configureI18n, getConfig } = require("../config");

    configureI18n({ fallbackLocale, supportedLocales });

    const config = getConfig();

    expect(config.fallbackLocale).toBe(fallbackLocale);
    expect(config.supportedLocales).toBe(supportedLocales);
  });
});

describe("getI18nInstance", () => {
  beforeEach(() => {
    const { configureI18n } = require("../config");

    configureI18n({ fallbackLocale, supportedLocales });
  });

  it("should return the same instance on the client.", () => {
    const { getI18nInstance } = require("../config");

    expect(typeof window !== "undefined");

    const i18n1 = getI18nInstance();
    const i18n2 = getI18nInstance();

    expect(i18n1).toBe(i18n2);
  });

  it("should return a new instance on the server", () => {
    const { getI18nInstance } = require("../config");

    const windowMock = window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window;

    expect(typeof window !== "undefined");

    const i18n1 = getI18nInstance();
    const i18n2 = getI18nInstance();

    expect(i18n1).not.toBe(i18n2);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = windowMock;
  });
});

describe("configureI18n", () => {
  beforeEach(() => {
    jest.mock("i18next", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const i18n: any = {
        init: jest.fn(),
        use: jest.fn(() => i18n),
      };

      return i18n;
    });
  });

  it("should set the fallback locale", () => {
    const i18n = require("i18next");
    const { configureI18n } = require("../config");

    configureI18n({ fallbackLocale, supportedLocales });

    expect(i18n.init).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLng: fallbackLocale.langtag,
      })
    );
  });

  it("should include resources for all supported locales", () => {
    const i18n = require("i18next"); //
    const { configureI18n } = require("../config");

    configureI18n({ fallbackLocale, supportedLocales });

    supportedLocales.forEach(({ langtag, resource }) => {
      expect(i18n.init).toHaveBeenCalledWith(
        expect.objectContaining({
          resources: {
            [langtag]: resource,
          },
        })
      );
    });
  });

  it("should throw an error if i18n has not been initialized", () => {
    const { configureI18n } = require("../config");

    configureI18n({ fallbackLocale, supportedLocales });

    expect(() =>
      configureI18n({ fallbackLocale, supportedLocales })
    ).toThrowError();
  });
});
