export interface CloudinaryConfig {
  defaultCloudName: string;
  prefix?: string;
}

// https://cloudinary.com/documentation/image_transformation_reference#flags_parameter
export enum CloudinaryFlag {
  ANY_FORMAT = "any_format",
  ATTACHMENT = "attachment",
  APNG = "apng",
  AWEBP = "awebp",
  CLIP = "clip",
  CLIP_EVENODD = "clip_evenodd",
  CUTTER = "cutter",
  FORCE_STRIP = "force_strip",
  FORCE_ICC = "force_icc",
  GETINFO = "getinfo",
  IGNORE_ASPECT_RATIO = "ignore_aspect_ratio",
  IGNORE_MASK_CHANNELS = "ignore_mask_channels",
  IMMUTABLE_CACHE = "immutable_cache",
  KEEP_ATTRIBUTION = "keep_attribution",
  KEEP_IPTC = "keep_iptc",
  LAYER_APPLY = "layer_apply",
  LOSSY = "lossy",
  NO_OVERFLOW = "no_overflow",
  PRESERVE_TRANSPARENCY = "preserve_transparency",
  PNG8 = "png8",
  PNG24 = "png24",
  PNG32 = "png32",
  PROGRESSIVE = "progressive",
  PROGRESSIVE_SEMI = "progressive:semi",
  PROGRESSIVE_STEEP = "progressive:steep",
  PROGRESSIVE_NONE = "progressive:none",
  RASTERIZE = "rasterize",
  REGION_RELATIVE = "region_relative",
  RELATIVE = "relative",
  REPLACE_IMAGE = "replace_image",
  SANITIZE = "sanitize",
  STRIP_PROFILE = "strip_profile",
  TEXT_NO_TRIM = "text_no_trim",
  TEXT_DISALLOW_OVERFLOW = "text_disallow_overflow",
  TIFF8_LZW = "tiff8_lzw",
  TILED = "tiled",
}

export enum CloudinaryMedia {
  IMAGE = "image",
  VIDEO = "video",
}

export interface CloudinaryUrlParams {
  cloudName?: string;
  flags?: CloudinaryFlag[];
  format?: string;
  quality?: number | "auto";
  type?: CloudinaryMedia;
  width?: number | "auto";
}

export type CloudinaryFetchedImageSrcSetParams = Omit<
  CloudinaryFetchedImageUrlParams,
  "width"
> &
  Record<"widths", number[]>;

export interface CloudinaryFetchedImageUrlParams extends CloudinaryUrlParams {
  url: string;
}

export type CloudinaryUploadSrcSetParams = Omit<
  CloudinaryUploadUrlParams,
  "width"
> &
  Record<"widths", number[]>;

export interface CloudinaryUploadUrlParams extends CloudinaryUrlParams {
  publicId: string;
  version: string;
}
