import { createApolloClient } from "@sss/apollo/testing";

import { fetchPages, PRISMIC_PAGES_SITEMAP } from "../cms-sitemap";

describe("fetchPages", () => {
  it("should fetch the first article", async () => {
    const client = createApolloClient([
      {
        request: {
          query: PRISMIC_PAGES_SITEMAP,
          variables: {
            first: 20,
            types: ["article_page"],
          },
        },
        result: {
          data: {
            pages: {
              __typename: "_DocumentConnection",
              edges: [
                {
                  __typename: "_DocumentEdge",
                  node: {
                    __typename: "PArticlePage",
                    _meta: {
                      __typename: "PMeta",
                      id: "1",
                      lang: "en-us",
                      lastPublicationDate: "2021-01-02T03:04:05.000Z",
                      tags: ["Blog"],
                      type: "article_page",
                      uid: "blog-1",
                    },
                  },
                },
              ],
              pageInfo: {
                __typename: "PPageInfo",
                endCursor: "1",
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: "1",
              },
            },
          },
        },
      },
    ]);

    const result = await fetchPages(client, ["article_page"]);

    expect(result).toEqual([
      {
        lastmod: "2021-01-02T03:04:05.000Z",
        loc: "https://fotp.test/blog/blog-1",
      },
    ]);
  });

  it("should paginate pages", async () => {
    const client = createApolloClient([
      {
        request: {
          query: PRISMIC_PAGES_SITEMAP,
          variables: {
            first: 20,
            types: ["article_page"],
          },
        },
        result: {
          data: {
            pages: {
              __typename: "_DocumentConnection",
              edges: [
                {
                  __typename: "_DocumentEdge",
                  node: {
                    __typename: "PArticlePage",
                    _meta: {
                      __typename: "PMeta",
                      id: "1",
                      lang: "en-us",
                      lastPublicationDate: "2021-01-02T03:04:05.000Z",
                      tags: ["Blog"],
                      type: "article_page",
                      uid: "blog-1",
                    },
                  },
                },
              ],
              pageInfo: {
                __typename: "PPageInfo",
                endCursor: "1",
                hasNextPage: true,
                hasPreviousPage: false,
                startCursor: "1",
              },
            },
          },
        },
      },
      {
        request: {
          query: PRISMIC_PAGES_SITEMAP,
          variables: {
            after: "1",
            first: 20,
            types: ["article_page"],
          },
        },
        result: {
          data: {
            pages: {
              __typename: "_DocumentConnection",
              edges: [
                {
                  __typename: "_DocumentEdge",
                  node: {
                    __typename: "PArticlePage",
                    _meta: {
                      __typename: "PMeta",
                      id: "2",
                      lang: "en-us",
                      lastPublicationDate: "2021-02-03T04:05:06.000Z",
                      tags: ["Blog"],
                      type: "article_page",
                      uid: "blog-2",
                    },
                  },
                },
              ],
              pageInfo: {
                __typename: "PPageInfo",
                endCursor: "2",
                hasNextPage: false,
                hasPreviousPage: true,
                startCursor: "2",
              },
            },
          },
        },
      },
    ]);

    const result = await fetchPages(client, ["article_page"]);

    expect(result).toEqual([
      {
        lastmod: "2021-01-02T03:04:05.000Z",
        loc: "https://fotp.test/blog/blog-1",
      },
      {
        lastmod: "2021-02-03T04:05:06.000Z",
        loc: "https://fotp.test/blog/blog-2",
      },
    ]);
  });
});
