import Head from "next/head";
import React, { FC } from "react";

export interface FacebookProps {
  appId?: string | null;
}

const Facebook: FC<FacebookProps> = ({ appId }) => (
  <Head>
    {appId && <meta key="fb:app_id" content={appId} property="fb:app_id" />}
  </Head>
);

export interface OpenGraphImage {
  height: number;
  type: string;
  url: string;
  width: number;
}

export interface OpenGraphProps {
  description?: string | null;
  title?: string | null;
  image?: OpenGraphImage | string | null;
  siteName?: string | null;
  type?: string | null;
  url?: string | null;
}

const OpenGraph: FC<OpenGraphProps> = ({
  description,
  image,
  siteName,
  title,
  type,
  url,
}) => {
  let imageData: OpenGraphImage | null = null;

  if (image) {
    imageData =
      typeof image === "string"
        ? {
            height: 630,
            type: "image/jpeg",
            url: image,
            width: 1200,
          }
        : image;
  }

  return (
    <Head>
      {title && <meta key="og:title" content={title} property="og:title" />}
      {imageData && (
        <>
          <meta key="og:image" content={imageData.url} property="og:image" />
          <meta
            key="og:image:type"
            content={imageData.type}
            property="og:image:type"
          />
          <meta
            key="og:image:width"
            content={imageData.width.toFixed()}
            property="og:image:width"
          />
          <meta
            key="og:image:height"
            content={imageData.height.toFixed()}
            property="og:image:height"
          />
        </>
      )}
      {description && (
        <meta
          key="og:description"
          content={description}
          property="og:description"
        />
      )}
      {siteName && (
        <meta key="og:site_name" content={siteName} property="og:site_name" />
      )}
      {url && <meta key="og:url" content={url} property="og:url" />}
      {type && <meta key="og:type" content={type} property="og:type" />}
    </Head>
  );
};
export interface TwitterProps {
  cardType?: string | null;
  site?: string | null;
}

const Twitter: FC<TwitterProps> = ({ cardType, site }) => (
  <Head>
    {cardType && (
      <meta key="twitter:card" name="twitter:card" content={cardType} />
    )}
    {site && <meta key="twitter:site" name="twitter:site" content={site} />}
  </Head>
);

export interface MetadataProps {
  canonical?: string | null;
  description?: string | null;
  facebook?: FacebookProps;
  noindex?: boolean;
  openGraph?: OpenGraphProps;
  title?: string | null;
  twitter?: TwitterProps;
}

export const Metadata: FC<MetadataProps> = ({
  canonical,
  description,
  facebook,
  noindex,
  openGraph = {},
  title,
  twitter = {},
}) => (
  <>
    <Head>
      {title && <title key="meta:title">{title}</title>}
      {description && (
        <meta key="meta:description" content={description} name="description" />
      )}
      {noindex && <meta key="meta:robots" content="noindex" name="robots" />}
      {canonical && <link href={canonical} rel="canonical" />}
    </Head>
    <OpenGraph {...openGraph} />
    <Facebook {...facebook} />
    <Twitter {...twitter} />
  </>
);
