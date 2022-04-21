import { getFetchedImageUrl } from "@sss/cloudinary";
import { getProductImages, Image, Product } from "@sss/ecommerce/product";
import React, { FC } from "react";

import {
  ComponentStyleProps,
  mx,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import Carousel, { DotControl } from "../../base/carousel";

const DotContainer: FC = ({ children }) => (
  <div
    css={s((t) => ({
      bottom: ["5%", null, t.spacing.xl],
      display: "flex",
      flexDirection: ["row", null, "column"],
      justifyContent: "center",
      left: [0, null, t.spacing.xl],
      position: "absolute",
      width: ["100%", null, "auto"],
    }))}
  >
    {children}
  </div>
);

export interface ProductImageCarouselRenderProps {
  image: Image;
  images: Image[];
  index: number;
}

interface ProductImageCarouselProps extends ComponentStyleProps {
  children: (props: ProductImageCarouselRenderProps) => JSX.Element;
  product: Product;
}

const ProductImageCarousel = ({
  _css = {},
  children,
  product,
}: ProductImageCarouselProps) => {
  // Don't use `product.images` directly, as it includes variant images
  const images = getProductImages(product);

  const Dot: DotControl = ({ active, index, onClick, selected, title }) => {
    const image = images[index];

    if (!image) {
      return null;
    }

    return (
      <button
        css={s((t) => ({
          backgroundClip: "padding-box",
          backgroundColor: [
            selected ? "currentColor" : "transparent",
            null,
            "transparent",
          ],
          backgroundImage: [
            null,
            null,
            `url(${getFetchedImageUrl({
              url: image.url,
              width: 184,
            })})`,
          ],
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderColor: [
            "currentColor",
            null,
            selected ? t.color.background.dark : t.color.background.base,
          ],
          borderRadius: t.spacing.xxl,
          borderStyle: "solid",
          borderWidth: [1, null, 2],
          marginTop: index !== 0 ? [null, null, t.spacing.sm] : null,
          ...mx([t.spacing.xs, null, 0]),
          opacity: active ? 1 : 0,
          overflow: "hidden",
          ...size([10, null, 40]),
          transition: "background 300ms, border 300ms, opacity 300ms",
        }))}
        disabled={!active}
        onClick={onClick}
      >
        <span css={s(visuallyHidden)}>{title}</span>
      </button>
    );
  };

  return (
    <Carousel
      _css={s(_css)}
      controls={{
        Dot,
        DotContainer,
        Next: null,
        Prev: null,
      }}
      slidesToShow={1}
    >
      {images.map((image, index) => children({ image, images, index }))}
    </Carousel>
  );
};

export default ProductImageCarousel;
