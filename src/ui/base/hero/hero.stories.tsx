import { motion } from "framer-motion";
import React from "react";

import { belt, greedy, gutter, gutterX, px, py, s } from "@/common/ui/utils";

import LazyAnimation from "../lazy-animation";
import {
  bodyText,
  bodyTextStatic,
  headingAlpha,
  headingBravo,
} from "../typography";
import Hero from "./index";

export default {
  title: "Components/Hero",
};

export const HeroLarge = () => (
  <header
    css={s(gutter, (t) => ({
      color: t.color.text.light.base,
      height: [500, 572, "100vh"],
      maxHeight: ["none", null, 720, 800, 900],
      overflow: "hidden",
      position: "relative",
      ...py([t.spacing.xxl, t.spacing.xxxl]),
    }))}
  >
    <Hero
      _css={s(greedy, {
        "& > *": { ...greedy, objectFit: "cover" },
        zIndex: -1,
      })}
      priority
      quality={60}
      urls={[
        "https://www.fillmurray.com/480/500",
        "https://www.fillmurray.com/768/572",
        "https://www.fillmurray.com/720/900",
      ]}
      // Everywhere that the Next.js Image component is used, images are served from a /_next-prefixed path.
      // We want to utilize Next Image's prop APIs and attributes, but we don't want to require that the
      // Next.js dev server be running. We can do exactly this with the unoptimized prop.
      unoptimized
    />
    <motion.div
      animate={{
        opacity: 1,
        transition: { delay: 0.5, duration: 0.5 },
      }}
      css={s({
        backgroundColor: "rgba(38,26,3,0.25)",
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: -1,
      })}
      initial={{ opacity: 0 }}
    />
    <div css={s(belt, { height: "100%", zIndex: 5 })}>
      <motion.div
        animate={{
          opacity: 1,
          transition: { delay: 0.25, duration: 0.5 },
          x: 0,
          y: 0,
        }}
        css={s({
          alignItems: ["flex-start", null, "center"],
          display: "flex",
          height: "100%",
          textAlign: "center",
        })}
        initial={{ opacity: 0, y: 20 }}
      >
        <div
          css={s((t) => ({
            ...px([t.spacing.xs, t.spacing.lg, t.spacing.md, 0]),
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: "100%",
          }))}
        >
          <h1
            css={s(headingAlpha, (t) => ({
              fontSize: [40, 48, 54, 72],
              lineHeight: 1,
              marginBottom: [t.spacing.sm, null, null, t.spacing.lg],
            }))}
          >
            Title
          </h1>
          <p
            css={s(bodyText, (t) => ({
              fontFamily: t.font.secondary.family,
              fontSize: [18, 22, 25],
              fontStyle: "italic",
              fontWeight: t.font.secondary.weight.book,
              marginBottom: [t.spacing.xxl, null, t.spacing.xl],
            }))}
          >
            Strapline
          </p>
        </div>
      </motion.div>
    </div>
  </header>
);

export const HeroStandard = () => (
  <header
    css={s(gutter, (t) => ({
      backgroundColor: t.color.background.feature4,
      height: ["auto", null, "100vh"],
      marginBottom: [0, null, 96, t.spacing.xxxl],
      maxHeight: ["none", null, 360, 400],
      position: "relative",
      ...py([140, null, 0]),
    }))}
  >
    <Hero
      _css={s(greedy, {
        "& > *": {
          ...greedy,
          objectFit: "cover",
          objectPosition: ["center center", null, null],
        },
        zIndex: 1,
      })}
      priority
      quality={60}
      urls={[
        "https://www.fillmurray.com/480/500",
        "https://www.fillmurray.com/768/572",
        "https://www.fillmurray.com/720/900",
      ]}
      unoptimized
    />
    <div
      css={s(belt, {
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        maxWidth: 820,
        textAlign: "center",
      })}
    >
      <div>
        <p
          css={s((t) => ({
            fontFamily: t.font.secondary.family,
            fontSize: [16],
            fontStyle: "italic",
            letterSpacing: "0.25em",
            marginBottom: [t.spacing.sm, null, t.spacing.md],
            textTransform: "uppercase",
          }))}
        >
          Title
        </p>
        <h1 css={s(headingBravo)}>Caption</h1>
      </div>
    </div>
  </header>
);

export const HeroAligned = () => (
  <header
    css={s({
      height: [528, null, "50vw", 500],
      position: "relative",
      width: "auto",
    })}
  >
    <Hero
      _css={s(greedy, {
        "& > *": { ...greedy, objectFit: "cover" },
        zIndex: -1,
      })}
      priority
      quality={60}
      urls={[
        "https://www.fillmurray.com/480/500",
        "https://www.fillmurray.com/768/572",
        "https://www.fillmurray.com/720/900",
      ]}
      unoptimized
    />

    {/* content */}
    <div
      css={s(belt, gutterX, greedy, {
        alignItems: ["flex-start", null, null, "center"],
        display: "flex",
        justifyContent: ["center", null, "flex-start"],
        textAlign: ["center", null, "left"],
      })}
    >
      <div css={s({ maxWidth: [500, null, 400, 500] })}>
        <LazyAnimation>
          <h1
            css={s(headingAlpha, (t) => ({
              marginBottom: [t.spacing.md],
              marginTop: [t.spacing.xl, null, "10vw", 0],
            }))}
          >
            Title
          </h1>
          <p css={s(bodyTextStatic)}>Description</p>
        </LazyAnimation>
      </div>
    </div>
  </header>
);
