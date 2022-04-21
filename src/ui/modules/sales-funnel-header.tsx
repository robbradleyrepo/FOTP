import { useLocale } from "@sss/i18n";
import { Link as NavigationLink } from "@sss/next";
import { motion, Variants } from "framer-motion";
import React, { FC, ReactNode } from "react";
import { Link as ScrollLink } from "react-scroll";

import { ComponentStyleProps, px, py, s } from "@/common/ui/utils";

import Logo from "../../ui/base/logo";
import Header from "../base/header";
import Icon from "../base/icon";
import Modal, { ModalType, useModalController } from "../base/modal";
import { callToActionText, headingBravo } from "../base/typography";
import burgerMenu from "../icons/burgerMenu";
import drawerClose from "../icons/drawerClose";
import Contact from "../nav/contact";
import SocialIcons from "./social-icons";

const DRAWER_ID = "sales-funnel-nav";

const enUsResource = {
  link: {
    contact: "Contact",
    faqs: "FAQs",
    shop: "Shop",
  },
};

const menuContainer: Variants = {
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  visible: {
    transition: { delayChildren: 0.05, staggerChildren: 0.08 },
  },
};

const items: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      x: { stiffness: 1000 },
    },
    x: -50,
  },
  visible: {
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
    x: 0,
  },
};

const desktopLinkStyle = s(callToActionText, (t) => ({
  display: "inline-block",
  fontSize: 12,
  padding: t.spacing.sm,
}));

const Link: typeof NavigationLink = ({ children, className, to, ...rest }) => {
  const { setIsOpen } = useModalController(DRAWER_ID);

  return to.startsWith("#") ? (
    <ScrollLink
      className={className}
      duration={500}
      href={to}
      offset={-60}
      onClick={() => setIsOpen(false)}
      smooth={true}
      to={to.substring(1)}
    >
      {children}
    </ScrollLink>
  ) : (
    <NavigationLink {...rest} className={className} to={to}>
      {children}
    </NavigationLink>
  );
};

interface NavDrawerProps {
  faqsPath?: string | null;
  shopPath?: string | null;
}

const NavDrawer: FC<NavDrawerProps> = ({ faqsPath, shopPath }) => {
  const { t } = useLocale();
  const { open, setIsOpen } = useModalController(DRAWER_ID);

  return (
    <Modal
      _css={s((t) => ({
        backgroundColor: t.color.background.dark,
        color: t.color.text.light.base,
        maxWidth: [null, 500, null, 640, 720],
        minWidth: "40%",
      }))}
      label={t<string>("common:navigation.menu")}
      open={open}
      onClose={() => setIsOpen(false)}
      type={ModalType.DRAWER}
    >
      <button
        css={s((t) => ({
          padding: t.spacing.md,
          position: "absolute",
          right: 0,
          top: 0,
        }))}
        onClick={() => setIsOpen(false)}
      >
        <Icon
          _css={s({ width: 32 })}
          path={drawerClose}
          title={t("common:close")}
          viewBox="0 0 32 32"
        />
      </button>
      <nav
        css={s({
          display: "flex",
          flexDirection: "column",
          height: "100%",
        })}
      >
        <div
          css={s((t) => ({
            flexGrow: 1,
            marginTop: t.spacing.xxl,
            paddingBottom: t.spacing.lg,
          }))}
        >
          <motion.ul
            animate={open ? "visible" : "hidden"}
            initial="hidden"
            variants={menuContainer}
          >
            {[
              { key: "shop", to: shopPath },
              { key: "contact", to: "/help/contact" },
              { key: "faqs", to: faqsPath },
            ].map(
              ({ key, to }, index) =>
                to && (
                  <motion.li
                    key={key}
                    css={s((t) => ({
                      marginTop: index !== 0 ? t.spacing.sm : null,
                    }))}
                    variants={items}
                  >
                    <Link
                      css={s(headingBravo, (t) => ({
                        display: "block",
                        fontSize: [36, null, null, 42, 48],
                        ...px([
                          t.spacing.lg,
                          null,
                          t.spacing.xl,
                          t.spacing.xxl,
                        ]),
                        ...py(t.spacing.xs),
                      }))}
                      to={to}
                    >
                      {t(`salesFunnelHeader:link.${key}`)}
                    </Link>
                  </motion.li>
                )
            )}
          </motion.ul>
        </div>
        <motion.div
          animate={{ opacity: 1 }}
          css={s({ flexShrink: 1, opacity: 0 })}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SocialIcons
            _css={s((t) => ({
              paddingBottom: t.spacing.xl,
              ...px([t.spacing.lg, null, t.spacing.xl, t.spacing.xxl]),
            }))}
          />
        </motion.div>
      </nav>
    </Modal>
  );
};

const MenuButton: FC = () => {
  const { t } = useLocale();
  const { setIsOpen } = useModalController(DRAWER_ID);

  return (
    <button
      css={s((t) => ({
        display: ["flex", null, "none"],
        outline: "none",
        padding: t.spacing.sm,
      }))}
      onClick={() => setIsOpen(true)}
    >
      <Icon
        _css={s({ width: 22 })}
        path={burgerMenu}
        title={t("common:navigation.menu")}
        viewBox="0 0 20 14"
      />
    </button>
  );
};

interface SalesFunnelHeaderProps extends ComponentStyleProps, NavDrawerProps {
  cta?: ReactNode;
  showContact?: boolean;
  showLinks?: boolean;
}

const SalesFunnelHeader: FC<SalesFunnelHeaderProps> = ({
  _css = {},
  cta,
  faqsPath,
  shopPath,
  showContact = true,
  showLinks = true,
  ...rest
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "salesFunnelHeader", enUsResource);

  const hasRighthandCta = !!cta && (showLinks || !showContact);
  const hasLefthandCta = !!cta && !hasRighthandCta;

  return (
    <>
      <Header
        _css={s(
          {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          },
          _css
        )}
      >
        {showLinks && <MenuButton />}

        {showLinks && (
          <nav
            css={s({
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            })}
          >
            <ul
              css={s({
                display: ["none", null, "flex"],
                flexDirection: "row",
              })}
            >
              {shopPath && (
                <li>
                  <Link css={desktopLinkStyle} to={shopPath}>
                    {t("salesFunnelHeader:link.shop")}
                  </Link>
                </li>
              )}
              <li css={s((t) => ({ marginLeft: t.spacing.sm }))}>
                <Link css={desktopLinkStyle} to="/help/contact">
                  {t("salesFunnelHeader:link.contact")}
                </Link>
              </li>
              {faqsPath && (
                <li css={s((t) => ({ marginLeft: t.spacing.sm }))}>
                  <Link css={desktopLinkStyle} to={faqsPath}>
                    {t("salesFunnelHeader:link.faqs")}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        {hasLefthandCta && (
          <div css={s({ display: ["none", null, "block"] })}>{cta}</div>
        )}

        <Link
          css={s({
            left: "50%",
            position: "absolute",
            transform: "translateX(-50%)",
          })}
          prefetch={false}
          to="/"
        >
          <Logo
            _css={s({
              height: [48, null, 60],
              width: "auto",
            })}
            fill="currentColor"
          />
        </Link>

        {(hasRighthandCta || showContact) && (
          <ul css={s({ marginLeft: "auto" })}>
            {hasRighthandCta && (
              <li css={s({ display: ["none", null, "block"] })}>{cta}</li>
            )}
            {showContact && (
              <li>
                <Contact
                  _css={s((t) => ({
                    display: hasRighthandCta
                      ? ["block", null, "none"]
                      : "block",
                    fontSize: [12, null, 14],
                    lineHeight: 1.4,
                    paddingRight: t.spacing.xs,
                    textAlign: "right",
                  }))}
                />
              </li>
            )}
          </ul>
        )}
      </Header>
      {showLinks && (
        <NavDrawer {...rest} faqsPath={faqsPath} shopPath={shopPath} />
      )}
    </>
  );
};

export default SalesFunnelHeader;
