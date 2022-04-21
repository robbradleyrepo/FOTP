import { captureException } from "@sentry/nextjs";
import { Link as InternalLink } from "@sss/next";
import React, { AnchorHTMLAttributes, ComponentType, FC } from "react";

import {
  ArticlePageTag,
  HyperlinkData,
  HyperlinkType,
  Link,
  LinkType,
  Meta,
  PrismicDocument,
} from "./types";

const baseUrl = process.env.PRISMIC_BASE_URL;

const interpolatePath = (path: string, { id, type, uid }: Meta) => {
  if (!uid) {
    throw new Error(
      `Missing UID for document type "${type}" on document ID "${id}"`
    );
  }

  return path.replace(/\{{2}\s?handle\s?\}{2}/gi, uid);
};

const getArticlePath = (_meta: Meta) => {
  const getBasePath = (tag: string) => {
    switch (tag) {
      case ArticlePageTag.BLOG:
        return "/blog";
      case ArticlePageTag.CONDITION:
        return "/condition";
      case ArticlePageTag.EVIDENCE:
        return "/science/evidence";
      case ArticlePageTag.INGREDIENT:
        return "/ingredient";
      case ArticlePageTag.SUPPLEMENT:
        return "/supplement";
      default:
        return null;
    }
  };

  let basePath: string | null = null;

  for (const tag of _meta.tags) {
    basePath = getBasePath(tag);

    if (basePath) {
      break;
    }
  }

  if (!basePath) {
    throw new Error(`Missing tags on article page "${_meta.uid}"`);
  }

  return interpolatePath(`${basePath}/{{ handle }}`, _meta);
};

const getEducationVideoPath = ({ type, tags, uid }: Meta) => {
  const isEducationVideo = type === "education_video";
  const courseNameSpace = "course:";
  const courseTag = tags.find((i) => i.includes(courseNameSpace));

  if (isEducationVideo && !courseTag) {
    throw new Error(
      `Missing valid tags on education course episode page "${uid}"`
    );
  }

  return `/learn/${courseTag?.replace(courseNameSpace, "")}/${uid}`;
};

export const documentResolver = (
  { _meta }: PrismicDocument,
  fallback?: string
): string => {
  switch (_meta.type) {
    case "article_page":
      return getArticlePath(_meta);
    case "batch_result":
      return interpolatePath(
        "/science/testing-and-transparency/{{ handle }}",
        _meta
      );
    case "education_course":
      return interpolatePath("/learn/{{ handle }}", _meta);
    case "education_video":
      return getEducationVideoPath(_meta);
    case "evidence_page":
      return "science/evidence";
    case "expert":
      return interpolatePath("/science/experts/{{ handle }}", _meta);
    case "faq_page":
      return "/help/faq";
    case "home_page":
      return "/";
    case "ingredient":
      return interpolatePath("/science/ingredients/{{ handle }}", _meta);
    case "ingredients_page":
      return "/science/ingredients";
    case "landing_page":
      return interpolatePath("/landing/{{ handle }}", _meta);
    case "product":
      return interpolatePath("/products/{{ handle }}", _meta);
    case "product_page":
      return interpolatePath("/products/{{ handle }}", _meta);
    case "experts_page":
      return "/science/experts";
    case "testing_page":
      return "/science/testing-and-transparency";
    default:
      if (!fallback) {
        throw new Error(
          `Unable to resolve document with type "${_meta.type}" and ID "${_meta.id}"`
        );
      }
      return fallback;
  }
};

export const linkNormalizer = (link: HyperlinkData): Link => {
  let normalized: Link | null = null;

  if (link.link_type === HyperlinkType.document) {
    normalized = {
      _linkType: LinkType.document,
      _meta: {
        id: link.id,
        lang: link.lang,
        tags: link.tags,
        type: link.type,
        uid: link.uid,
      },
    };
  }

  if (link.link_type === HyperlinkType.media) {
    if (link.kind === "document") {
      normalized = {
        _linkType: LinkType.file,
        name: link.name,
        size: Number(link.size),
        url: link.url,
      };
    }

    if (link.kind === "image") {
      normalized = {
        _linkType: LinkType.image,
        height: Number(link.height),
        name: link.name,
        size: Number(link.size),
        url: link.url,
        width: Number(link.width),
      };
    }
  }

  if (link.link_type === HyperlinkType.web) {
    normalized = {
      _linkType: LinkType.web,
      url: link.url,
    };
  }

  if (!normalized) {
    throw new Error(
      `Invalid link type supplied: expected "${HyperlinkType.document}" | "${HyperlinkType.media}" | "${HyperlinkType.web}", got "${link.link_type}"`
    );
  }

  return normalized;
};

export const linkResolver = (link: Link): string => {
  if (link._linkType === LinkType.document) {
    return documentResolver(link);
  }

  if (link._linkType === LinkType.web) {
    let path = link.url;

    // Handle internal links that don't have Prismic documents
    if (path.startsWith(baseUrl)) {
      path = path.substring(baseUrl.length);

      // Remove legacy locale prefix
      const LEGACY_PREFIX = "/us/en";
      if (path.startsWith(LEGACY_PREFIX)) {
        path = path.substring(LEGACY_PREFIX.length);
      }

      if (path === "") {
        return "/";
      }
    }

    return path;
  }

  return link.url;
};

type LinkResolverComponentProps = Omit<JSX.IntrinsicElements["a"], "href">;

interface LinkResolverProps extends LinkResolverComponentProps {
  components?: Partial<{
    external: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>;
    fallback:
      | keyof JSX.IntrinsicElements
      | ComponentType<LinkResolverComponentProps>;
    internal: typeof InternalLink;
  }>;
  link?: Link;
}

export const LinkResolver: FC<LinkResolverProps> = ({
  children,
  className,
  download,
  components,
  hrefLang,
  link,
  media,
  onBlur,
  onClick,
  onFocus,
  ping,
  rel,
  target,
  type,
  referrerPolicy,
  ...rest
}) => {
  const renderComponents = {
    external: "a",
    fallback: "span",
    internal: InternalLink,
    ...components,
  };
  let url: string | null = null;

  try {
    if (!link) {
      throw new Error("Missing `link` data");
    }
    url = linkResolver(link);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      captureException(error, { extra: { link } });
    } else {
      throw error;
    }
  }

  const baseProps = { children, className };
  const anchorProps = {
    ...baseProps,
    download,
    hrefLang,
    media,
    onBlur,
    onClick,
    onFocus,
    ping,
    referrerPolicy,
    rel,
    target,
    type,
  };
  const extendedProps = { ...rest, ...anchorProps };

  if (!url) {
    return (
      <renderComponents.fallback
        {...(typeof renderComponents.fallback === "string"
          ? baseProps
          : extendedProps)} // Pass only `baseProps` to intrinsic elements, but pass all props to components
      />
    );
  }

  return url.match(/^\/(\w|$)/) ? (
    <renderComponents.internal {...extendedProps} to={url} />
  ) : (
    <renderComponents.external {...anchorProps} href={url} />
  );
};
