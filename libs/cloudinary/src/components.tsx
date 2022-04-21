import Head from "next/head";
import React, { FC } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { CLOUDINARY_ORIGIN } from "./config";
import { getFetchedImageUrl, getUploadedImageUrl } from "./helpers";
import {
  CloudinaryFetchedImageUrlParams,
  CloudinaryUploadUrlParams,
} from "./types";

export const CloudinaryHead: FC = () => (
  <Head>
    <link rel="preconnect" href={CLOUDINARY_ORIGIN} />
    <link rel="dns-prefetch" href={CLOUDINARY_ORIGIN} />
  </Head>
);

interface VideoGifProps extends ComponentStyleProps {
  mp4Url: string;
  posterUrl: string;
  webmUrl: string;
}

export const VideoGif: FC<VideoGifProps> = ({
  _css = {},
  mp4Url,
  posterUrl,
  webmUrl,
}) => (
  <video
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: `css` prop has only been enabled at app level
    css={s(
      {
        display: "block",
        maxWidth: "100%",
      },
      _css
    )}
    autoPlay
    loop
    muted
    playsInline
    poster={posterUrl}
  >
    <source src={webmUrl} />
    <source src={mp4Url} />
  </video>
);

type CloudinaryFetchedAnimationProps = ComponentStyleProps &
  Omit<CloudinaryFetchedImageUrlParams, "format">;

export const CloudinaryFetchedAnimation: FC<CloudinaryFetchedAnimationProps> = ({
  _css,
  ...rest
}) => (
  <VideoGif
    _css={_css}
    posterUrl={getFetchedImageUrl({ ...rest, format: "jpg" })}
    webmUrl={getFetchedImageUrl({ ...rest, format: "webm" })}
    mp4Url={getFetchedImageUrl({ ...rest, format: "mp4" })}
  />
);

type CloudinaryUploadedAnimationProps = ComponentStyleProps &
  Omit<CloudinaryUploadUrlParams, "format">;

export const CloudinaryUploadedAnimation: FC<CloudinaryUploadedAnimationProps> = ({
  _css,
  ...rest
}) => (
  <VideoGif
    _css={_css}
    posterUrl={getUploadedImageUrl({ ...rest, format: "jpg" })}
    webmUrl={getUploadedImageUrl({ ...rest, format: "webm" })}
    mp4Url={getUploadedImageUrl({ ...rest, format: "mp4" })}
  />
);
