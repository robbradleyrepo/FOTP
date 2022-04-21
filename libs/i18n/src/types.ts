import { ResourceLanguage } from "i18next";

export interface I18nConfig {
  fallbackLocale: Locale;
  supportedLocales: readonly Locale[];
}

export interface Locale {
  readonly countryCode: string;
  readonly label: string;
  readonly langtag: string;
  readonly language: string;
  readonly region: string;
  readonly resource: ResourceLanguage;
  readonly timeZone: string;
}
