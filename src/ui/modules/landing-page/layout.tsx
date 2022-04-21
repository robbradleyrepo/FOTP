import { useViewportScroll } from "framer-motion";
import React, { FC, useEffect, useState } from "react";

import { belt as _belt, gutterX, px, s, StyleFn } from "@/common/ui/utils";

import { LandingPage } from "../../../cms/landing-page";
import { CtaClickEventHandler } from "../../../cms/landing-page/slices";
import {
  CmsLayoutMaxWidth,
  CmsLayoutProvider,
  CmsLayoutStyles,
  useCmsLayout,
} from "../../../cms/layout";
import Cta from "./cta";
import Header from "./header";

interface LandingPageLayoutProps extends LandingPage {
  onCtaClick?: CtaClickEventHandler;
  publicationDate: string | null;
}

const mb: StyleFn = (t) => ({
  marginBottom: [t.spacing.lg, null, t.spacing.xl],
});

const singleColumnMaxWidth: CmsLayoutMaxWidth = {
  primary: 940,
  secondary: 940,
};

const singleColumnStyles: CmsLayoutStyles = {
  belt: s(_belt, { maxWidth: singleColumnMaxWidth.primary }),
  gutterX,
  mb,
  paddingX: gutterX,
};

const twoColumnMaxWidth: CmsLayoutMaxWidth = {
  primary: [940, null, null, 732],
  secondary: [940, null, null, 300],
};

const twoColumnStyles: CmsLayoutStyles = {
  ...singleColumnStyles,
  belt: s(_belt, { maxWidth: [940, null, null, 1080] }),
  gutterX: (t) => px([t.spacing.md, null, t.spacing.lg, 0]),
  paddingX: (t) => px([t.spacing.md, null, t.spacing.lg]),
};

const TwoColumnLeftLayout: FC<LandingPageLayoutProps> = ({
  children,
  ...landingPage
}) => {
  const {
    maxWidth,
    styles: { belt },
  } = useCmsLayout();
  const [showCta, setShowCta] = useState(false);
  const { scrollYProgress } = useViewportScroll();

  // Show the CTA at 30% scroll depth
  useEffect(() => scrollYProgress.onChange((v) => setShowCta(v >= 0.3)), [
    scrollYProgress,
  ]);

  return (
    <>
      {landingPage.headerImageHero && <Header {...landingPage} />}
      <div
        css={s(belt, {
          alignItems: "stretch",
          display: "flex",
          flexWrap: ["wrap", null, null, "nowrap"],
        })}
      >
        <div
          css={s((t) => ({
            flexShrink: 1,
            marginRight: [null, null, null, t.spacing.xl],
            maxWidth: maxWidth.primary,
            width: "100%",
          }))}
        >
          {!landingPage.headerImageHero && <Header {...landingPage} />}
          {children}
        </div>
        <aside css={s({ maxWidth: maxWidth.secondary, width: "100%" })}>
          <Cta
            _css={s({
              opacity: [showCta ? 1 : 0, null, null, 1],
              pointerEvents: [showCta ? null : "none", null, null, "auto"],
              transition: "opacity ease-out 500ms",
            })}
            {...landingPage}
          />
        </aside>
      </div>
    </>
  );
};

const LandingPageLayout: FC<LandingPageLayoutProps> = ({
  children,
  ...landingPage
}) => {
  const { ctaLink, ctaText } = landingPage;

  let maxWidth = singleColumnMaxWidth;
  let styles = singleColumnStyles;

  let contentFragment = (
    <>
      <Header {...landingPage} />
      {children}
    </>
  );

  const hasCta = !!ctaLink && !!ctaText;

  if (hasCta) {
    maxWidth = twoColumnMaxWidth;
    styles = twoColumnStyles;

    contentFragment = (
      <TwoColumnLeftLayout {...landingPage}>{children}</TwoColumnLeftLayout>
    );
  }

  return (
    <CmsLayoutProvider maxWidth={maxWidth} styles={styles}>
      {contentFragment}
    </CmsLayoutProvider>
  );
};

export default LandingPageLayout;
