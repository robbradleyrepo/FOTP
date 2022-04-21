import { getFetchedImageUrl } from "@sss/cloudinary";
import { useLocale } from "@sss/i18n";
import {
  Image,
  Person,
  renderAsString,
  RichTextBlock,
  StrictMeta,
} from "@sss/prismic";
import { Metadata } from "@sss/seo";
import React, { FC } from "react";
import { JsonLd } from "react-schemaorg";
import {
  Blog,
  BlogPosting,
  BreadcrumbList,
  Organization,
  Person as SchemaPerson,
} from "schema-dts";

import { isDefined } from "@/common/filters";

import { Expert } from "../../cms/common";
import { mapPersonToSchema } from "../../cms/experts";
import { ArticlePageSlice } from "./slices";

export interface ArticlePage extends ArticlePageCore {
  approver: Expert | null;
  body: ArticlePageSlice[] | null;
  seoDescription: string | null;
  seoTitle: string | null;
  socialMediaDescription: string | null;
  socialMediaImage: Image | null;
  socialMediaTitle: string | null;
}

export interface ArticlePageCore {
  _meta: StrictMeta;
  author: Expert | Person | null;
  approver: Expert | null;
  publicationDate: string | null;
  summary: string | null;
  thumbnail: Image | null;
  title: RichTextBlock[] | null;
}

export const ArticlePageMetadata: FC<ArticlePage> = ({
  seoDescription,
  seoTitle,
  socialMediaDescription,
  socialMediaImage,
  socialMediaTitle,
  summary,
  title,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ArticlePageMetadata", {
    fallbackTitle: "{{ title }} | FOTP",
  });

  const fallbackTitle =
    title &&
    t("ArticlePageMetadata:fallbackTitle", {
      title: renderAsString(title),
    });
  const openGraphImage =
    socialMediaImage?.url &&
    getFetchedImageUrl({ url: socialMediaImage?.url, width: 1200 });

  return (
    <Metadata
      description={seoDescription ?? summary}
      openGraph={{
        description: socialMediaDescription ?? seoDescription ?? summary,
        image: openGraphImage,
        title: socialMediaTitle ?? seoTitle ?? fallbackTitle,
      }}
      title={seoTitle ?? fallbackTitle}
    />
  );
};

const baseUrl = process.env.ORIGIN;
const blogUrl = `${baseUrl}/blog`;

const getBlogPostData = (
  {
    _meta,
    author,
    approver,
    publicationDate,
    thumbnail,
    title,
  }: ArticlePageCore,
  publisher: Organization
): BlogPosting => {
  const url = `${blogUrl}/${_meta.uid}`;

  const headline = title ? renderAsString(title) : undefined;

  const authors: SchemaPerson[] = ([author, approver] as (
    | Expert
    | Person
    | null
  )[])
    .filter(isDefined)
    .filter((person) => person?.name)
    .map(mapPersonToSchema);

  return {
    "@type": "BlogPosting",
    author:
      authors.length > 1
        ? authors
        : authors.length === 1
        ? authors[0]
        : publisher,
    datePublished: publicationDate ?? undefined,
    headline,
    image:
      thumbnail?.url &&
      getFetchedImageUrl({ url: thumbnail?.url, width: 1920 }),
    publisher,
    url,
  };
};

interface BlogSchemaProps {
  articles: ArticlePageCore[];
}

export const BlogSchema: FC<BlogSchemaProps> = ({ articles }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "BlogSchema", {
    title: "Blog",
  });

  const publisher: Organization = {
    "@type": "Organization",
    name: t("common:fotp"),
    url: baseUrl,
  };

  return (
    <>
      <JsonLd<Blog>
        item={{
          "@context": "https://schema.org",
          "@type": "Blog",
          blogPost: articles.map((article) =>
            getBlogPostData(article, publisher)
          ),
          publisher,
        }}
      />
      <JsonLd<BreadcrumbList>
        item={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              item: baseUrl,
              name: t("common:fotp"),
              position: 1,
            },
            {
              "@type": "ListItem",
              item: blogUrl,
              name: t("BlogSchema:title"),
              position: 2,
            },
          ],
        }}
      />
    </>
  );
};

export const BlogPostingSchema: FC<ArticlePageCore> = (article) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "BlogPostingSchema", {
    blog: { title: "Blog" },
  });

  const data = getBlogPostData(article, {
    "@type": "Organization",
    name: t("common:fotp"),
    url: baseUrl,
  });

  return (
    <>
      <JsonLd<BlogPosting>
        item={{
          "@context": "https://schema.org",
          ...data,
        }}
      />
      <JsonLd<BreadcrumbList>
        item={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              item: baseUrl,
              name: t("common:fotp"),
              position: 1,
            },
            {
              "@type": "ListItem",
              item: blogUrl,
              name: t("BlogPostingSchema:blog.title"),
              position: 2,
            },
            {
              "@type": "ListItem",
              item: data.url,
              name: data.headline,
              position: 3,
            },
          ],
        }}
      />
    </>
  );
};
