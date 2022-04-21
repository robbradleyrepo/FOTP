import NextImage, { ImageLoaderProps, ImageProps } from "next/image";
import React, { FC } from "react";

import {
  ComponentStyleProps,
  ResponsiveImageProperties,
  s,
  useResponsiveImageSizes,
} from "@/common/ui/utils";

import StyledComponentsHelper from "../styled-components-helper";

// Re-implement `ImageProps` as we can't exclude props without destroying the
// width/height/layout union as it's combined with an intersection
type PassthroughImageProps = Omit<
  JSX.IntrinsicElements["img"],
  | "sizes" // Exclude `sizes` so we can use `ResponsiveImageProperties`
  | "src"
  | "srcSet"
  | "ref"
  | "width"
  | "height"
  | "loading"
  | "style"
> &
  Pick<
    ImageProps,
    | "blurDataURL"
    | "height"
    | "layout"
    | "loader"
    | "loading"
    | "objectFit"
    | "objectPosition"
    | "placeholder"
    | "priority"
    | "quality"
    | "src"
    | "unoptimized"
    | "width"
  >;

type ResponsiveImageProps = ComponentStyleProps &
  PassthroughImageProps & {
    alt: string; // Make `alt` a required prop for better accessibility
    sizes: string | ResponsiveImageProperties;
  };

const ResponsiveImage: FC<ResponsiveImageProps> = ({
  _css = {},
  sizes,
  ...props
}) => {
  const getResponsiveImageSizes = useResponsiveImageSizes();
  return (
    <StyledComponentsHelper // Use `StyledComponentsHelper` to avoid passing the CSS prop to the underlying `img`
      as={NextImage}
      css={s(_css)}
      sizes={typeof sizes === "string" ? sizes : getResponsiveImageSizes(sizes)}
      {...(props as ImageProps)}
    />
  );
};

export default ResponsiveImage;

// Extract from https://github.com/vercel/next.js/blob/canary/packages/next/client/image.tsx
export const getNextImageUrl = ({
  src,
  width,
  quality,
}: ImageLoaderProps): string =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;

export const deviceSizes = [
  640,
  750,
  828,
  1080,
  1200,
  1920,
  2048,
  3840,
] as const;
