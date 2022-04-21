import CLOUDINARY, { CLOUDINARY_ORIGIN } from "./config";
import {
  CloudinaryFetchedImageSrcSetParams,
  CloudinaryFetchedImageUrlParams,
  CloudinaryMedia,
  CloudinaryUploadSrcSetParams,
  CloudinaryUploadUrlParams,
  CloudinaryUrlParams,
} from "./types";

const getParamsString = ({
  flags = [],
  format = "auto",
  quality = "auto",
  width = "auto",
}: CloudinaryUrlParams) =>
  [
    `f_${format}`,
    ...flags.map((flag) => `fl_${flag}`),
    `q_${quality}`,
    `w_${width}`,
  ]
    .sort() // Use consistent sorting for improved caching
    .join(",");

export const getFetchedImageUrl = (params: CloudinaryFetchedImageUrlParams) =>
  [
    CLOUDINARY_ORIGIN,
    params.cloudName ?? CLOUDINARY.defaultCloudName,
    params.type ?? CloudinaryMedia.IMAGE,
    "fetch",
    getParamsString(params),
    encodeURIComponent(params.url),
  ].join("/");

export const getUploadedImageUrl = (params: CloudinaryUploadUrlParams) =>
  [
    CLOUDINARY_ORIGIN,
    params.cloudName ?? CLOUDINARY.defaultCloudName,
    params.type ?? CloudinaryMedia.IMAGE,
    "upload",
    getParamsString(params),
    `${params.version}${CLOUDINARY.prefix ?? ""}${params.publicId}`,
  ].join("/");

type SrcSetFactory = {
  (fn: typeof getFetchedImageUrl): (
    params: CloudinaryFetchedImageSrcSetParams
  ) => string;
  (fn: typeof getUploadedImageUrl): (
    params: CloudinaryUploadSrcSetParams
  ) => string;
};
type SrcSetParams =
  | CloudinaryFetchedImageSrcSetParams
  | CloudinaryUploadSrcSetParams;

const srcSetFactory: SrcSetFactory = (
  fn: any //eslint-disable-line @typescript-eslint/no-explicit-any
) => ({ widths, ...rest }: SrcSetParams) =>
  widths
    .map(
      (width) =>
        `${fn({
          ...rest,
          width,
        })} ${width}w`
    )
    .join(",");

/** @deprecated Use `ResponsiveImage` instead */
export const getFetchedImageSrcSet = srcSetFactory(getFetchedImageUrl);

/** @deprecated Use `ResponsiveImage` instead */
export const getUploadedImageSrcSet = srcSetFactory(getUploadedImageUrl);
