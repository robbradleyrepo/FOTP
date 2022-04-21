import React, { FC } from "react";

import { gutter, s, Style } from "@/common/ui/utils";

import ResponsiveImage from "../responsive-image";
import { CarouselController, CarouselUI, useCarouselController } from ".";

export default {
  title: "Components/Carousel",
};

const carouselImageUrls = [
  "https://www.fillmurray.com/480/500",
  "https://www.fillmurray.com/768/572",
  "https://www.fillmurray.com/720/900",
  "https://www.fillmurray.com/480/500",
  "https://www.fillmurray.com/768/572",
  "https://www.fillmurray.com/720/900",
];

export const StandardCarousel = () => (
  <section css={s(gutter)}>
    <CarouselController
      slides={carouselImageUrls.map((src) => (
        <a key={src} href={src}>
          <ResponsiveImage
            alt=""
            width={480}
            height={480}
            sizes={{ width: "100vw" }}
            src={src}
          />
        </a>
      ))}
      slidesToShow={[1, 2, 3, 4]}
    >
      <CarouselUI
        _css={s((t) => ({ marginBottom: t.spacing.lg }))}
        gutter={(t) => t.spacing.md}
      />
      <CarouselFooter />
    </CarouselController>
  </section>
);

const CarouselFooter: FC<{ css?: Style }> = ({ css = {} }) => {
  const { currentIndex } = useCarouselController();

  return (
    <div
      css={s(
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        },
        css
      )}
    >
      <div
        css={s((t) => ({
          marginRight: t.spacing.sm,
        }))}
      >
        Current slide:
      </div>

      <div
        css={s({
          display: "inline-block",
          flexShrink: 0,
          width: [80, null, null],
        })}
      >
        <ResponsiveImage
          alt=""
          priority
          width={80}
          height={80}
          sizes={{ width: "100vw" }}
          src={carouselImageUrls[currentIndex]}
        />
      </div>
    </div>
  );
};
