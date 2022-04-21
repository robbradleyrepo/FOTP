import React from "react";

import { s, StyleFn } from "@/common/ui/utils";

import { headingCharlie } from "../typography";

const listItemStyle: StyleFn = (t) => ({
  padding: t.spacing.md,
});

export default {
  title: "Styles/Colors",
};

export const Backgrounds = () => (
  <section>
    <h2
      css={s(headingCharlie, (t) => ({
        marginBottom: t.spacing.md,
      }))}
    >
      Backgrounds
    </h2>
    <ul
      css={s((t) => ({
        "& li": {
          color: t.color.text.dark.base,
          fontWeight: t.font.secondary.weight.bold,
          textTransform: "uppercase",
        },
      }))}
    >
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.base,
        }))}
      >
        base
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.dark,
          color: "white !important",
        }))}
      >
        forest
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.feature1,
        }))}
      >
        peppermint
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.feature2,
        }))}
      >
        mushroom
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.feature3,
        }))}
      >
        moss
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.feature4,
        }))}
      >
        sage
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.feature5,
        }))}
      >
        pistachio
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.feature6,
        }))}
      >
        sand
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.light,
        }))}
      >
        light
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.background.light2,
        }))}
      >
        light2
      </li>
    </ul>
  </section>
);

export const Borders = () => (
  <section>
    <h2
      css={s(headingCharlie, (t) => ({
        marginBottom: t.spacing.md,
      }))}
    >
      Borders
    </h2>
    <ul
      css={s((t) => ({
        "& li": {
          backgroundColor: t.color.background.base,
          color: t.color.text.dark.base,
          fontWeight: t.font.secondary.weight.bold,
          marginBottom: t.spacing.md,
          textTransform: "uppercase",
          width: 200,
        },
      }))}
    >
      <li
        css={s(listItemStyle, (t) => ({
          border: "5px solid",
          borderColor: t.color.border.dark,
        }))}
      >
        dark
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          border: "5px solid",
          borderColor: t.color.border.error,
        }))}
      >
        error
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          border: "5px solid",
          borderColor: t.color.border.light,
        }))}
      >
        light
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          border: "5px solid",
          borderColor: t.color.border.mid,
        }))}
      >
        mid
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          border: "5px solid",
          borderColor: t.color.border.selected,
        }))}
      >
        selected
      </li>
    </ul>
  </section>
);

export const States = () => (
  <section>
    <h2
      css={s(headingCharlie, (t) => ({
        marginBottom: t.spacing.md,
      }))}
    >
      States
    </h2>
    <ul
      css={s((t) => ({
        "& li": {
          color: t.color.text.dark.base,
          fontWeight: t.font.secondary.weight.bold,
          marginBottom: t.spacing.md,
          textTransform: "uppercase",
          width: 200,
        },
      }))}
    >
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.state.alt,
        }))}
      >
        alt
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.state.error,
        }))}
      >
        error
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.state.selected,
        }))}
      >
        selected
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.state.success,
        }))}
      >
        success
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.state.warning,
        }))}
      >
        warning
      </li>
    </ul>
  </section>
);

export const Accents = () => (
  <section>
    <h2
      css={s(headingCharlie, (t) => ({
        marginBottom: t.spacing.md,
      }))}
    >
      Accents
    </h2>
    <ul
      css={s((t) => ({
        "& li": {
          color: t.color.text.dark.base,
          fontWeight: t.font.secondary.weight.bold,
          marginBottom: t.spacing.md,
          textTransform: "uppercase",
          width: 200,
        },
      }))}
    >
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.accent.dark,
        }))}
      >
        dark
      </li>
      <li
        css={s(listItemStyle, (t) => ({
          backgroundColor: t.color.accent.light,
        }))}
      >
        light
      </li>
    </ul>
  </section>
);
