import Head from "next/head";
import { useRouter } from "next/router";
import qs from "querystring";
import React, { FC, Fragment } from "react";

import { getConfig } from "./config";
import { useLocale } from "./context";
import { getOpenGraphLocale } from "./helpers";
import { Locale } from "./types";

interface I18nHeadProps {
  origin: string;
}

const I18nHead: FC<I18nHeadProps> = ({ origin }) => {
  const { supportedLocales } = getConfig();
  const { locale } = useLocale();
  const { asPath, defaultLocale: defaultLocaleLangTag } = useRouter();

  return (
    <Head>
      <meta content={getOpenGraphLocale(locale)} property="og:locale" />
      {supportedLocales.map((supportedLocale) => (
        <Fragment key={supportedLocale.langtag}>
          {/* Include `rel="alternate" links for all locales */}
          <link
            href={`${origin}${
              defaultLocaleLangTag === locale.langtag
                ? ""
                : "/" + locale.langtag
            }${asPath}`}
            hrefLang={supportedLocale.langtag}
            rel="alternate"
          />
          {/* Include `og:locale:alternative` for all locales except the current one */}
          {supportedLocale !== locale && (
            <meta
              content={getOpenGraphLocale(supportedLocale)}
              property="og:locale:alternative"
            />
          )}
        </Fragment>
      ))}
    </Head>
  );
};

interface I18nSwitchProps {
  locale: Locale;
}

const I18nSwitch: FC<I18nSwitchProps & JSX.IntrinsicElements["a"]> = ({
  locale,
  ...rest
}) => {
  const { query, asPath } = useRouter();

  let href = `/${locale.langtag}${asPath}`;
  const querystring = qs.stringify(query);
  if (querystring) {
    href += "?" + querystring;
  }

  // Note: This is not a NextLink as we need to force a full reload of the
  //       client for the Apollo etc.
  return <a {...rest} href={href} />;
};

const I18nSwitcher: FC<JSX.IntrinsicElements["a"]> = (props) => {
  const { supportedLocales } = getConfig();
  const { locale } = useLocale();
  const alternativeLocal = supportedLocales.find(
    (supportedLocale) => supportedLocale !== locale
  );

  return alternativeLocal ? (
    <I18nSwitch locale={alternativeLocal} {...props}>
      {alternativeLocal.label}
    </I18nSwitch>
  ) : null;
};

export { I18nHead, I18nSwitch, I18nSwitcher };
