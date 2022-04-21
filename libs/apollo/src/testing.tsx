import { MockedResponse, MockLink } from "@apollo/react-testing";
import { ApolloClientType, NextPageWithApollo } from "@sss/apollo";
import { Locale } from "@sss/i18n";
import { getMockedRouter } from "@sss/next/testing";
import {
  act,
  render,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import {
  InMemoryCache,
  InMemoryCacheConfig,
  IntrospectionFragmentMatcher,
  IntrospectionResultData,
} from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
} from "next";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { Router } from "next/router";
import { ParsedUrlQuery, stringify } from "querystring";
import React, { ComponentType } from "react";

import { initializeApollo } from "./client";
jest.mock("./client");

interface BaseSandbox {
  // The global mocks to apply
  globalMocks?: MockedResponse[];
  // Additional mocks under test
  mocks?: MockedResponse[];
  renderOptions?: Omit<RenderOptions, "queries">;
  pathname?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: { [key: string]: any };
}

interface PageSandbox extends BaseSandbox {
  NextPage: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: React.ComponentType<any>;
    getStaticProps?: GetStaticProps;
    getServerSideProps?: GetServerSideProps;
  };
}

interface PageResult {
  mockLink: MockLink;
  redirect?: { permanent: boolean; destination: string };
  notFound?: boolean;
  page: RenderResult;
  router: Router;
}

interface ComponentSandbox extends BaseSandbox {
  Component: React.ReactNode;
}

interface ComponentResult {
  mockLink: MockLink;
  component: RenderResult;
  router: Router;
}

interface SandboxInit {
  globalMocks?: MockedResponse[];
  introspectionResultData?: IntrospectionResultData;
  locale: Locale;
  Wrapper: ComponentType<{
    apolloClient: ApolloClientType;
    locale: Locale;
  }>;
}

export const createApolloClient = (
  mocks: MockedResponse[],
  introspectionQueryResultData?: IntrospectionResultData
) => {
  const cacheConfig: InMemoryCacheConfig = { addTypename: true };

  // `InMemoryCache` doesn't like `fragmentMatcher: undefined`. We must omit it.
  if (introspectionQueryResultData) {
    cacheConfig.fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    });
  }

  return new ApolloClient({
    cache: new InMemoryCache(cacheConfig),
    link: new MockLink(mocks, true),
  });
};

export default class Sandbox {
  public constructor(private opts: SandboxInit) {}

  protected createApolloClient(
    mocks: MockedResponse[] = [],
    globalMocks: MockedResponse[] = this.opts.globalMocks ?? []
  ) {
    return createApolloClient(
      [...globalMocks, ...mocks],
      this.opts.introspectionResultData
    );
  }

  public async page({
    NextPage: NextPageBundle,
    globalMocks,
    mocks,
    renderOptions,
    pathname = "/",
    params = {},
  }: PageSandbox): Promise<PageResult> {
    const router = getMockedRouter(pathname, params);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        href: `https://localhost${router.asPath}`,
        pathname: router.asPath,
        search: params ? stringify(params) : "",
      },
      writable: true,
    });

    const apolloClient = this.createApolloClient(mocks, globalMocks);

    (initializeApollo as jest.Mock).mockReturnValueOnce(apolloClient);

    const { default: PageComponent } = NextPageBundle;

    const pageData = NextPageBundle.getStaticProps
      ? await NextPageBundle.getStaticProps({ locale: "en-US", params })
      : NextPageBundle.getServerSideProps
      ? await NextPageBundle.getServerSideProps(
          // `getServerSideProps` context argument also requires
          // `req: IncomingMessage` and `res: ServerResponse`. Cast
          // this for testing purposes.
          ({
            locale: "en-US",
            params,
            req: {},
            res: {
              setHeader: jest.fn(),
              statusCode: null,
            },
          } as unknown) as GetServerSidePropsContext<ParsedUrlQuery>
        )
      : { props: {} };

    let page;

    act(() => {
      const Wrapper = this.opts.Wrapper;
      page = render(
        "props" in pageData &&
          !("notFound" in pageData) &&
          !("redirect" in pageData) ? (
          <RouterContext.Provider value={router}>
            <Wrapper apolloClient={apolloClient} locale={this.opts.locale}>
              <PageComponent {...pageData.props} />
            </Wrapper>
          </RouterContext.Provider>
        ) : (
          <div />
        ),
        {
          ...renderOptions,
        }
      );
    });

    return {
      link: apolloClient.link,
      notFound: "notFound" in pageData && pageData.notFound,
      page,
      redirect: "redirect" in pageData && pageData.redirect,
      router,
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  public async component({
    Component,
    ...options
  }: ComponentSandbox): Promise<ComponentResult> {
    const NextPageComponent: NextPageWithApollo = () => {
      return <>{Component}</>;
    };

    const { page: component, ...rest } = await this.page({
      NextPage: { default: NextPageComponent },
      ...options,
    });

    return {
      component,
      ...rest,
    };
  }
}
