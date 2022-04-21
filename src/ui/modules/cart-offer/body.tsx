import React, { FC } from "react";
import { Trans } from "react-i18next";

import { ComponentStyleProps, s, size } from "@/common/ui/utils";

import { headingDelta } from "../../base/typography";
import paw from "../../icons/paw";
import { dataUriFromPath } from "../../styles/utils";

const listItem = s((t) => ({
  "& + &": {
    marginTop: t.spacing.xs,
  },
  "&:before": {
    ...size("1em"),
    content: `url(${dataUriFromPath({
      fill: t.color.tint.pistachio,
      path: paw,
    })})`,
    display: "block",
    left: 0,
    position: "absolute",
    transform: "rotate(-30deg)",
  },
  "&:nth-child(even):before": {
    transform: "rotate(30deg)",
  },
  paddingLeft: "2em",
  position: "relative",
}));

interface CartOfferBodyProps extends ComponentStyleProps {
  i18nKey: string;
}

export const CartOfferBody: FC<CartOfferBodyProps> = ({
  _css = {},
  i18nKey,
}) => (
  <div css={s(_css)}>
    <Trans
      components={{
        Item: <li css={s(listItem)} />,
        List: (
          <ul
            css={s((t) => ({
              columnCount: [null, null, 2],
              columnGap: t.spacing.md,
              marginBottom: t.spacing.lg,
            }))}
          />
        ),
        NoWrap: <span css={s({ whiteSpace: "nowrap" })} />,
        Paragraph: <p css={s((t) => ({ marginBottom: t.spacing.sm }))} />,
        Title: (
          <h2
            css={s(headingDelta, (t) => ({
              lineHeight: "24px",
              marginBottom: [t.spacing.md, null, t.spacing.lg],
            }))}
          />
        ),
      }}
      i18nKey={i18nKey}
    />
  </div>
);

export default CartOfferBody;
