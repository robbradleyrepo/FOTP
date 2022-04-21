import React from "react";

import { s } from "@/common/ui/utils";
import { gutter } from "@/common/ui/utils";

import { bodyText } from "../typography";
import { orderedList, orderedListItem } from ".";

export default {
  title: "Styles/Lists",
};

export const Ordered = () => (
  <div css={s(gutter)}>
    <ol
      css={s(bodyText, orderedList, (t) => ({
        marginTop: t.spacing.xl,
      }))}
    >
      <li
        css={s(orderedListItem, (t) => ({
          marginTop: t.spacing.md,
        }))}
      >
        item
      </li>
      <li
        css={s(orderedListItem, (t) => ({
          marginTop: t.spacing.md,
        }))}
      >
        item
      </li>
      <li
        css={s(orderedListItem, (t) => ({
          marginTop: t.spacing.md,
        }))}
      >
        item
      </li>
    </ol>
  </div>
);
