import React, { FC } from "react";

import { px, s } from "@/common/ui/utils";

import { bodyText, headingCharlie } from "../../base/typography";
import Rating from "../reviews/rating";
import { useCartOfferLayout } from "./layout";

interface CartOfferTheOneProps {
  strapline: string;
  title: string;
}

export const CartOfferHeader: FC<CartOfferTheOneProps> = ({
  strapline,
  title,
}) => {
  const {
    components: { Image },
    products,
  } = useCartOfferLayout();

  const bottomline = products.length === 1 ? products[0].bottomline : null;

  return (
    <header
      css={s((t) => ({
        marginBottom: [t.spacing.md, null, null, t.spacing.lg],
        textAlign: ["center", null, null, "left"],
      }))}
    >
      <h1 css={s(headingCharlie, (t) => px([t.spacing.sm, null, null, 0]))}>
        {title}
      </h1>
      <p
        css={s(bodyText, (t) => ({
          display: [null, null, null, "inline-block"],
          marginTop: [t.spacing.xs, null, t.spacing.sm],
        }))}
      >
        {strapline}
      </p>
      <Image
        _css={s((t) => ({
          display: ["block", null, null, "none"],
          marginTop: t.spacing.md,
        }))}
      />
      {bottomline && (
        <Rating
          _css={s((t) => ({
            marginTop: t.spacing.sm,
          }))}
          {...bottomline}
        />
      )}
    </header>
  );
};

export default CartOfferHeader;
