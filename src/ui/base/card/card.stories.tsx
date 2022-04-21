import React from "react";

import { s } from "@/common/ui/utils";

import { card, interactiveCard } from "./index";

export default {
  title: "Components/Card",
};

export const AllCards = () => (
  <div
    css={s({
      div: {
        marginRight: "1rem",
      },
    })}
  >
    <div css={s(card)}>Card</div>
    <div css={s(interactiveCard)}>Interactive Card</div>
  </div>
);

export const Card = () => <div css={s(card)}>Card</div>;

export const InteractiveCard = () => (
  <div css={s(interactiveCard)}>Interactive Card</div>
);
