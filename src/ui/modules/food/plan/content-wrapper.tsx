import { AnimatePresence, motion, Variant, Variants } from "framer-motion";
import { TargetResolver } from "framer-motion/types/types";
import React, { FC } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { theme } from "../../../styles/theme";

export enum FoodPlanNavigationDirection {
  BACK = "BACK",
  FORWARD = "FORWARD",
}

const hidden: Variant = {
  opacity: 0,
  scale: 0.8,
  zIndex: 0,
};
const visible: Variant = {
  opacity: 1,
  scale: 1,
  zIndex: 1,
};

const makeDesktopOnlyVariant = (variant: Variant): TargetResolver => (
  ...args
) => {
  if (window.matchMedia(`(min-width: ${theme.breakpoint.md}px)`).matches) {
    return typeof variant === "function" ? variant(...args) : variant;
  }

  return {};
};

const variants: Variants = {
  animate: makeDesktopOnlyVariant({ ...visible, x: 0 }),
  exit: makeDesktopOnlyVariant((direction: FoodPlanNavigationDirection) => ({
    ...hidden,
    x: direction === FoodPlanNavigationDirection.BACK ? 480 : -480,
  })),
  initial: makeDesktopOnlyVariant((direction: FoodPlanNavigationDirection) => ({
    ...hidden,
    x: direction === FoodPlanNavigationDirection.BACK ? -480 : 480,
  })),
};

interface FoodPlanContentWrapperProps extends ComponentStyleProps {
  direction?: FoodPlanNavigationDirection;
  id: string;
}

const FoodPlanContentWrapper: FC<FoodPlanContentWrapperProps> = ({
  _css = {},
  children,
  direction,
  id,
}) => (
  <div
    css={s(
      {
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        position: "relative",
      },
      _css
    )}
  >
    <AnimatePresence initial={false}>
      <motion.div
        key={id}
        css={s({
          // We'll use a negative margin instead of absolute positioning to
          // ensure the height of the parent element matches the tallest child
          marginRight: "-100%",
          width: "100%",
        })}
        custom={direction}
        {...variants}
        transition={{
          default: { bounce: 0, type: "spring" },
          opacity: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  </div>
);

export default FoodPlanContentWrapper;
