import { useLocale } from "@sss/i18n";
import { useRouter } from "next/router";
import React, { createContext, FC, ReactNode, useContext } from "react";

import {
  CSSValue,
  px,
  ResponsiveCSSValue,
  s,
  Style,
  visuallyHidden,
} from "@/common/ui/utils";

import bannerStyle from "../base/banner";
import Header from "../base/header";
import { ToastRack } from "../base/toast";
import Footer from "../modules/footer";
import GorgiasWidget from "../modules/gorgias";
import SiteHeader from "../modules/site-header";
import { SubNav, SubNavFooter } from "../modules/subnav";
import SubNavs from "../nav/subnav";
import { height } from "../styles/variables";

interface StandardProps {
  banner?: ReactNode;
  bannerCss?: Style;
  gorgiasDelay?: number | false;
}

interface HeaderContextProps {
  headerHeights: CSSValue[];
}

const enUsResource = {
  skip: "Skip to main content",
};

const HeaderHeightsContext = createContext<HeaderContextProps | null>(null);

const HeaderHeightsProvider: FC<HeaderContextProps> = ({
  children,
  ...context
}) => {
  return (
    <HeaderHeightsContext.Provider value={context}>
      {children}
    </HeaderHeightsContext.Provider>
  );
};

export const useHeaderHeights = () => {
  const context = useContext(HeaderHeightsContext);

  if (!context) {
    throw new Error(
      "`useHeaderHeights` must be used inside a `HeaderHeightsProvider`"
    );
  }

  return context;
};

const Standard: FC<StandardProps> = ({
  banner,
  bannerCss = {},
  children,
  gorgiasDelay,
}) => {
  const router = useRouter();
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "templateStandard", enUsResource);
  const hasBanner = !!banner || i18n.exists("templateStandard:banner");

  const subNav = SubNavs.find(({ items, predicate }) =>
    predicate(router.pathname, items)
  );
  const hasSubnav = !!subNav;

  const headerHeights: ResponsiveCSSValue = [
    height.nav.mobile +
      (hasSubnav ? height.subnav.mobile : 0) +
      (hasBanner ? height.banner.mobile : 0),
    null,
    height.nav.desktop +
      (hasSubnav ? height.subnav.desktop : 0) +
      (hasBanner ? height.banner.desktop : 0),
  ];

  return (
    <HeaderHeightsProvider headerHeights={headerHeights}>
      <a css={s(visuallyHidden)} href="#main-content">
        {t("templateStandard:skip")}
      </a>
      {hasBanner && (
        <div css={s(bannerStyle, bannerCss)}>
          {banner || t("templateStandard:banner")}
        </div>
      )}
      <Header
        _css={s(
          (t) => ({
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            top: hasBanner
              ? [t.height.banner.mobile, null, t.height.banner.desktop]
              : 0,
          }),
          // XXX: We're having to overide the standard header behaviour here to remove
          // padding and set the heights to include the subnav.
          {
            height: "auto",
            minHeight: [
              height.nav.mobile + (hasSubnav ? height.subnav.mobile : 0),
              null,
              height.nav.desktop + (hasSubnav ? height.subnav.desktop : 0),
            ],
            ...px(0),
          }
        )}
      >
        <SiteHeader
          _css={s((t) => ({
            height: [height.nav.mobile, null, height.nav.desktop],
            // XXX: We've needed to move padding from the `Header` to here for the sub nav border
            ...px([
              t.spacing.xs,
              t.spacing.xs,
              t.spacing.sm,
              t.spacing.lg,
              t.spacing.xl,
            ]),
          }))}
        />
        {subNav && (
          <SubNav
            _css={s((t) => ({
              borderTop: `solid 1px ${t.color.border.mid}`,
              height: "auto",
              width: "100vw",
            }))}
            items={subNav.items}
          />
        )}
      </Header>

      <div css={s({ marginTop: headerHeights })} id="main-content">
        {children}
      </div>
      {subNav && <SubNavFooter items={subNav.items} />}
      <Footer />
      <GorgiasWidget delay={gorgiasDelay} />
      <ToastRack
        _css={s({
          height: 0,
          position: "fixed",
          right: 0,
          top: headerHeights,
          zIndex: 99999,
        })}
      />
    </HeaderHeightsProvider>
  );
};

export default Standard;
