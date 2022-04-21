import { ApolloClientType, runServerSideQuery } from "@sss/apollo";
import {
  documentResolver,
  metaFragment,
  PageInfo,
  pageInfoFragment,
  PrismicDocument,
} from "@sss/prismic";
import gql from "graphql-tag";
import type { GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";

import { isDefined } from "@/common/filters";
import { QUERY_EDUCATION_COURSES } from "@/modules/education/education-course-queries";
import type { EducationCoursesDataType } from "@/modules/education/education-course-types";

import { makeServerSidePropsGetter } from "../../pages/_app";
import {
  INGREDIENTS_PAGE,
  IngredientsPageData,
} from "../../src/cms/ingredients-page";

interface PrismicPages {
  pages: {
    edges: {
      node: PrismicDocument;
    }[];
    pageInfo: PageInfo;
  };
}

// Note: We query the all documents endpoint for added flexibility
export const PRISMIC_PAGES_SITEMAP = gql`
  query PRISMIC_PAGES(
    $after: String
    $first: Int = 20
    $tags: [String!]
    $types: [String!]!
  ) {
    pages: pDocuments(
      after: $after
      first: $first
      tags_in: $tags
      type_in: $types
      sortBy: meta_lastPublicationDate_DESC
    ) {
      edges {
        node {
          ...meta
        }
      }
      pageInfo {
        ...pageInfo
      }
    }
  }
  ${metaFragment}
  ${pageInfoFragment}
`;

const prismicDocumentToSitemapField = (
  document: PrismicDocument
): ISitemapField | undefined => {
  const loc = documentResolver(document);
  if (loc) {
    return {
      lastmod: document._meta.lastPublicationDate,
      loc: process.env.ORIGIN + loc,
    };
  }
};

export const fetchFeaturedIngredientPages = async (
  client: ApolloClientType
): Promise<ISitemapField[]> => {
  const result = await runServerSideQuery<IngredientsPageData>(
    client,
    INGREDIENTS_PAGE
  );

  if (!result.data) {
    throw new Error(
      "PrismicPage data is unexpectedly missing from the API response"
    );
  }

  return (
    result.data.ingredientsPage.ingredients
      ?.map(({ ingredient }) => prismicDocumentToSitemapField(ingredient))
      .filter(isDefined) ?? []
  );
};

const fetchEducationCoursePages = async (
  client: ApolloClientType
): Promise<ISitemapField[]> => {
  const { data } = await runServerSideQuery<EducationCoursesDataType>(client, {
    query: QUERY_EDUCATION_COURSES,
  });

  const paths: ISitemapField[] = [];

  for (const { node: course } of data.educationCourses.edges) {
    const path = prismicDocumentToSitemapField(course);
    if (path) {
      paths.push(path);
    }

    for (const { video: video } of course.videos) {
      const path = prismicDocumentToSitemapField(video);
      if (path) {
        paths.push(path);
      }
    }
  }

  return paths;
};

export const fetchPages = async (
  client: ApolloClientType,
  types: string[],
  tags?: string[]
): Promise<ISitemapField[]> => {
  let after: string | undefined;
  let hasNextPage = true;

  const fields: ISitemapField[] = [];

  do {
    const result = await runServerSideQuery<PrismicPages>(client, {
      fetchPolicy: "no-cache",
      query: PRISMIC_PAGES_SITEMAP,
      // Prismic max per page is 20
      variables: { after, first: 20, tags, types },
    });

    if (!result.data) {
      throw new Error(
        "PrismicPage data is unexpectedly missing from the API response"
      );
    }

    for (const { node } of result.data.pages.edges ?? []) {
      const field = prismicDocumentToSitemapField(node);
      if (field) {
        fields.push(field);
      }
    }

    hasNextPage = result.data.pages.pageInfo.hasNextPage;
    after = result.data.pages.pageInfo.endCursor;
  } while (hasNextPage && after);

  return fields;
};

// Google will apparently timeout after 120 seconds. We could bump this if we start to get time outs
const FETCH_PAGES_TIMEOUT_DURATION_SECS = 30;

export const fetchAllPages = async (
  client: ApolloClientType
): Promise<ISitemapField[]> => {
  const doFetchAllPages = async () => {
    const results = await Promise.all([
      fetchEducationCoursePages(client),
      fetchFeaturedIngredientPages(client),
      // Note: we can parallelise here across types and tags if it gets slow.
      fetchPages(client, ["article_page"]),
    ]);

    return results.reduce((accum, item) => [...accum, ...item]);
  };

  // Wrap our fetcher with a timeout.
  let handle: NodeJS.Timeout;
  const timeout = new Promise<never>((_resolve, reject) => {
    handle = setTimeout(
      () =>
        reject(
          new Error(
            `Timed out fetchAllPages(). Took > ${FETCH_PAGES_TIMEOUT_DURATION_SECS}s`
          )
        ),
      FETCH_PAGES_TIMEOUT_DURATION_SECS * 1000
    );
  });
  return Promise.race([doFetchAllPages(), timeout]).then((result) => {
    clearTimeout(handle);
    return result;
  });
};

export const getServerSideProps: GetServerSideProps = makeServerSidePropsGetter(
  async (ctx, { apolloClient }) => {
    const fields = await fetchAllPages(apolloClient);

    ctx.res.setHeader(
      "Cache-Control",
      `s-maxage=${15 * 60}, stale-while-revalidate`
    );

    return getServerSideSitemap(ctx, fields);
  }
);

const ServerSitemapPage = () => null;

export default ServerSitemapPage;
