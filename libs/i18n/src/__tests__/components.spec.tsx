import { RouterContext } from "next/dist/shared/lib/router-context";
import { Router } from "next/router";
import React from "react";
import { create } from "react-test-renderer";

import { I18nSwitch, I18nSwitcher } from "../components";
import { configureI18n } from "../config";
import { Locale } from "../types";

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

describe("<I18nSwitch />", () => {
  const getSwitchProps = (asPath: string, locale: Locale) => {
    const router = ({
      asPath,
    } as unknown) as Router;

    const renderer = create(
      <RouterContext.Provider value={router}>
        <I18nSwitch locale={locale}>{locale.label}</I18nSwitch>
      </RouterContext.Provider>
    );

    const { props } = renderer.root.findByType("a");

    return props;
  };

  it("should render a link that renders the localised version of the current route", () => {
    const props = getSwitchProps("/foo/bar", supportedLocales[0]);
    expect(props.href).toBe("/en-US/foo/bar");
  });
});

describe("<I18nSwitcher />", () => {
  const getSwitchPropsList = (region: string, language: string) => {
    const router = ({
      query: {
        language,
        region,
      },
      route: "/[region]/[language]",
    } as unknown) as Router;

    const renderer = create(
      <RouterContext.Provider value={router}>
        <I18nSwitcher />
      </RouterContext.Provider>
    );

    return renderer.root.findAllByType(I18nSwitch).map(({ props }) => props);
  };

  it.skip("should render the first available locale that isn’t the current one", () => {
    supportedLocales.forEach(({ language, region }, index) => {
      const alternativeLocal =
        supportedLocales[(index + 1) % supportedLocales.length];

      const propsList = getSwitchPropsList(region, language);

      expect(propsList.length).toBe(1);

      propsList.forEach((props) => {
        expect(props.locale).toBe(alternativeLocal);
        expect(props.children).toBe(alternativeLocal.label);
      });
    });
  });
});
