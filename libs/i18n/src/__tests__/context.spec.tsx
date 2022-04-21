import { render } from "@testing-library/react";
import i18n from "i18next";
import React from "react";

import { configureI18n } from "../config";
import { LocaleProvider } from "../context";
import { Locale } from "../types";

const supportedLocales = [
  {
    countryCode: "US",
    label: "Looking for our US store?",
    langtag: "en-US",
    language: "en",
    region: "us",
    resource: {
      key: "Translation goes here",
    },
    timeZone: "America/Los_Angeles",
  },
];

const fallbackLocale = supportedLocales[0];

configureI18n({ fallbackLocale, supportedLocales });

const mockLocale: Locale = {
  countryCode: "FOO",
  label: "Foo",
  langtag: "mk-FOO",
  language: "mk",
  region: "foo",
  resource: {},
  timeZone: "America/Los_Angeles",
};

describe("<LocaleProvider />", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Manually "reset" `i18n`, as it's difficult to reset ES6 imports with
    // TypeScript. Note that this assumes that `language` is the only property
    // that will affect our functions.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (i18n as any).language;
  });

  it("should call `changeLanguage` with the `langtag` of the provided locale whenever it changes", async () => {
    jest.spyOn(i18n, "changeLanguage");

    expect(i18n.changeLanguage).not.toHaveBeenCalled();

    const { rerender } = render(<LocaleProvider locale={fallbackLocale} />);

    expect(i18n.changeLanguage).toHaveBeenCalledWith(fallbackLocale.langtag);

    jest.clearAllMocks();

    rerender(<LocaleProvider locale={fallbackLocale} />);

    expect(i18n.changeLanguage).not.toHaveBeenCalled();

    rerender(<LocaleProvider locale={mockLocale} />);

    expect(i18n.changeLanguage).toHaveBeenCalledWith(mockLocale.langtag);
  });
});
