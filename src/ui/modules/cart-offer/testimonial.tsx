import React, { FC, ReactNode } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import Blockquote from "../../base/blockquote";
import Stars from "../reviews/stars";

interface CartOfferTestimonialProps extends ComponentStyleProps {
  attribution: ReactNode;
  quote: ReactNode;
}

export const CartOfferTestimonial: FC<CartOfferTestimonialProps> = ({
  _css = {},
  attribution,
  quote,
}) => (
  <Blockquote
    _css={s(
      (t) => ({
        marginBottom: [t.spacing.lg, null, null, 0],
        marginTop: [t.spacing.md, null, t.spacing.lg],
      }),
      _css
    )}
    attribution={attribution}
    ornament={
      <Stars
        _css={s((t) => ({
          height: 20,
          marginBottom: t.spacing.sm,
          width: 120,
        }))}
        value={5}
      />
    }
  >
    {quote}
  </Blockquote>
);

export default CartOfferTestimonial;
