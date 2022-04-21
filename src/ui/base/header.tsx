import { useViewportScroll } from "framer-motion";
import React, { FC, useEffect, useState } from "react";

import { ComponentStyleProps, px, s } from "@/common/ui/utils";

import { useModalState } from "./modal";

export const useScrolledShadow = () => {
  const isModalOpen = useModalState();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useViewportScroll();

  const scrolled = isModalOpen || isScrolled;

  useEffect(() => {
    setIsScrolled(scrollY.get() >= 1);
    return scrollY.onChange((v) => setIsScrolled(v >= 1));
  }, [scrollY, setIsScrolled]);

  return {
    scrolled,
    shadow: s({
      boxShadow: scrolled ? "rgba(0, 0, 0, 0.09) 0px 2px 24px 0px" : "none",
      transition: "box-shadow ease-out 300ms",
    }),
  };
};

const Header: FC<ComponentStyleProps> = ({ _css = {}, children, ...rest }) => {
  const { shadow } = useScrolledShadow();

  return (
    <header
      css={s(
        shadow,
        (t) => ({
          ...px([
            t.spacing.xs,
            t.spacing.xs,
            t.spacing.sm,
            t.spacing.lg,
            t.spacing.xl,
          ]),
          backgroundColor: t.color.background.base,
          fontColor: t.color.text.dark.base,
          height: [t.height.nav.mobile, null, t.height.nav.desktop],
          left: 0,
          position: "fixed",
          top: 0,
          width: "100vw", // Use `vw` instead of percentage to match the body width with `scroll: overlay`
          zIndex: 999,
        }),
        _css
      )}
      {...rest}
    >
      {children}
    </header>
  );
};

export default Header;
