import "sanitize.css";
import "../public/fonts/fonts.css";

import {
  captureException,
  ErrorBoundary,
  flush as flushSentry,
} from "@sentry/nextjs";
import {
  captureTrackingParams,
  GoogleOptimize,
  GoogleOptimizeActivateEvents,
  GoogleTagManager,
  TrackPageEvents,
} from "@sss/analytics";
import {
  ApolloClientType,
  initializeApollo,
  isApolloError,
  stringifyApolloError,
  useApollo,
} from "@sss/apollo";
import { CloudinaryHead } from "@sss/cloudinary";
import { TrackCustomerEvent } from "@sss/customer";
import { configureI18n, findLocaleByNextLocale, I18nHead } from "@sss/i18n";
import { captureDetailedException } from "@sss/sentry";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { shim } from "string.prototype.matchall";

import { I18N } from "../src/config";
import Favicons from "../src/document/favicons";
import { DefaultMetadata } from "../src/document/metadata";
import PageProviders from "../src/ui/providers";
import GlobalStyles from "../src/ui/styles/global";

const GenericError = dynamic(() => import("../src/pages/error/generic"));
const PrismicPreview = dynamic(() => import("../src/cms/preview"));

shim();

configureI18n(I18N);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { initialApolloState, previewToken } = pageProps;

  const locale = findLocaleByNextLocale(router);
  // Configuration problem — fail fast and early.
  if (!locale) throw new Error("Locale not configured correctly.");

  const apolloClient = useApollo({
    initialState: initialApolloState,
    previewToken,
  });

  return (
    <PageProviders
      apolloClient={apolloClient as ApolloClientType}
      locale={locale}
    >
      <Head>
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          name="viewport"
        />
        <meta content="ie=edge" httpEquiv="x-ua-compatible" />
      </Head>
      <GoogleOptimize />
      <CloudinaryHead />
      <GlobalStyles />
      <I18nHead origin={process.env.ORIGIN} />
      <DefaultMetadata />
      <Favicons />
      <Head>
        {/* Pinterest Domain verification */}
        <meta
          name="p:domain_verify"
          content="836ab5021b2dfec2c909756635d2baf5"
        />
      </Head>
      <ErrorBoundary
        fallback={({ resetError }) => <ErrorScreen resetError={resetError} />}
      >
        <Component {...pageProps} />
      </ErrorBoundary>
      <TrackCustomerEvent />
      <TrackPageEvents />
      <GoogleOptimizeActivateEvents />
      <GoogleTagManager />
      {previewToken && <PrismicPreview />}
    </PageProviders>
  );
}

const ErrorScreen: FC<{ resetError(): void }> = ({ resetError }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeComplete = () => resetError();
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () =>
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
  }, [resetError, router]);

  return <GenericError />;
};

// Thin layers to enforce types at call sites

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface StaticPropsGetter<TProps = Record<string, any>> {
  (
    context: GetStaticPropsContext,
    common: { apolloClient: ApolloClientType }
  ): Promise<GetStaticPropsResult<TProps>>;
}

export const makeStaticPropsGetter = <
  TProps extends Record<string, any> = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  propGetter: StaticPropsGetter<TProps>
): GetStaticProps<TProps> => makePropsGetter(propGetter);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ServerSidePropsGetter<TProps = Record<string, any>> {
  (
    context: GetServerSidePropsContext,
    common: { apolloClient: ApolloClientType }
  ): Promise<GetServerSidePropsResult<TProps>>;
}

export const makeServerSidePropsGetter = <
  TProps extends Record<string, any> = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  propGetter: ServerSidePropsGetter
): GetServerSideProps<TProps> => makePropsGetter(propGetter);

const makePropsGetter = (
  propGetter: (
    context: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    common: { apolloClient: ApolloClientType }
  ) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
): any => // eslint-disable-line @typescript-eslint/no-explicit-any
  // WARNING: entering loosely-typed zone.
  async (context: GetServerSidePropsContext | GetStaticPropsContext) => {
    try {
      const previewToken = (context?.previewData as { token?: string })?.token;

      const apolloClient = initializeApollo({
        previewToken,
      });

      const COLLECTION_NAVIGATION = (await import("@sss/ecommerce/collection"))
        .COLLECTION_NAVIGATION;

      const [, res] = await Promise.all([
        apolloClient.query({ query: COLLECTION_NAVIGATION }),
        propGetter(context, { apolloClient }),
      ]);

      return {
        ...res,
        props:
          "props" in res
            ? {
                ...res.props,
                initialApolloState: apolloClient.cache.extract(),
                ...(previewToken ? { previewToken } : undefined),
              }
            : undefined,
      };
    } catch (error) {
      if (isApolloError(error) && !error.networkError) {
        // Apollo errors might be better caught at the apollo-link level since
        // that will take care of client-side errors as well
        // (https://www.apollographql.com/docs/react/v2.5/advanced/network-layer/#afterware)

        captureDetailedException(error, {
          apolloError: stringifyApolloError(error),
        });
      } else if (error.statusCode !== 404) {
        captureException(error);
      }

      // Flushing before returning is necessary if deploying to Vercel, see
      // https://vercel.com/docs/platform/limits#streaming-responses
      await flushSentry(2000);

      throw error;
    }
  };

if (typeof window !== "undefined") {
  captureTrackingParams(window.location.search);
}
