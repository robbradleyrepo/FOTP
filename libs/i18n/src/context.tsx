import React, { createContext, FC, useContext } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";

import { getConfig, getI18nInstance } from "./config";
import { Locale } from "./types";

const LocaleContext = createContext<Locale | null>(null);

interface LocaleProviderProps {
  locale: Locale;
}

export const LocaleProvider: FC<LocaleProviderProps> = ({
  children,
  locale,
}) => {
  const i18n = getI18nInstance();

  // Make sure the correct language is set before rendering
  if (locale.langtag !== i18n.language) {
    i18n.changeLanguage(locale.langtag);
  }

  return (
    <LocaleContext.Provider value={locale}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const { fallbackLocale } = getConfig();

  const locale = useContext(LocaleContext) ?? fallbackLocale;

  return {
    ...useTranslation(),
    locale,
  };
};
