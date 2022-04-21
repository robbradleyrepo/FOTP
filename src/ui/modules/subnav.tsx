import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";

import { belt, px, py, s, size, Style } from "@/common/ui/utils";

import { Grid, Item } from "../base/grid";
import Icon from "../base/icon";
import { callToActionText } from "../base/typography";
import chevronDown from "../icons/chevronDown";
import chevronLeft from "../icons/chevronLeft";
import chevronRight from "../icons/chevronRight";
import cross from "../icons/cross";
import { height } from "../styles/variables";

export interface SubNavItem {
  // i18nKey
  key: string;
  // URL path
  path: string;
}

interface SubNavFooterProps {
  items: SubNavItem[];
}
interface SubNavProps extends SubNavFooterProps {
  _css: Style;
}

const SubNav: FC<SubNavProps> = ({ _css, items }) => {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const currentRoute = router.pathname;
  const itemsCount = items.length - 1;
  const subMenuHeight = itemsCount * 40 + height.subnav.mobile + 20;

  return (
    <div css={s(_css, { position: "relative" })}>
      <nav
        css={s(belt, {
          display: ["none", null, "block"],
        })}
        id="desktop"
      >
        <ul
          css={s((t) => ({
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            ...py(t.spacing.md),
            ...px(t.spacing.lg),
            margin: "auto",
            maxWidth: 820,
            textAlign: "center",
          }))}
        >
          {items.map(({ key, path }) => (
            <li key={key}>
              {currentRoute === path ? (
                <Link
                  css={s(callToActionText, {
                    fontSize: 12,
                  })}
                  to={path}
                >
                  {t(key)}
                </Link>
              ) : (
                <Link
                  css={s(callToActionText, {
                    "&:hover": {
                      opacity: "1",
                    },
                    display: ["none", "none", "inline-block"],
                    fontSize: 12,
                    opacity: "0.6",
                    transition: "all .3s ease",
                  })}
                  to={path}
                >
                  {t(key)}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <nav
        aria-hidden="true"
        css={s(belt, {
          ariaHidden: ["false", null, "true"],
          display: [null, null, "none"],
        })}
        id="mobile"
      >
        {isOpen ? (
          <button
            css={s({
              padding: 20,
              position: "absolute",
              right: 5,
              top: 0,
              zIndex: 10000,
            })}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icon _css={s({ ...size(20) })} path={cross} />
          </button>
        ) : null}
        <motion.ul
          animate={isOpen ? "expanded" : "collapsed"}
          css={s({
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: "auto",
            textAlign: "center",
          })}
          initial="collapsed"
          variants={{
            collapsed: {
              height: height.subnav.mobile,
              transition: { duration: 0.4, type: "backIn" },
              y: 0,
            },
            expanded: {
              height: subMenuHeight,
              y: 0,
            },
          }}
        >
          {items.map(({ path, key }) => (
            <motion.li
              css={s({
                width: "100%",
              })}
              key={path}
              animate={currentRoute === path ? "expanded" : undefined}
              variants={{
                collapsed: {
                  height: 0,
                  opacity: 0,
                  transition: { duration: 0.3, type: "backIn" },
                },
                expanded: {
                  height: "auto",
                  opacity: 1,
                },
              }}
            >
              {currentRoute === path ? (
                <div
                  css={s((t) => ({
                    paddingTop: -t.spacing.md,
                    position: "relative",
                  }))}
                >
                  <button
                    css={s({
                      "&:active, &:focus": {
                        outline: "none",
                      },
                      display: "block",
                      fontSize: [10, null, "inherit"],
                      fontWeight: "700",
                      letterSpacing: "1.5px",
                      lineHeight: "20px",
                      margin: "auto",
                      outline: "none",
                      ...py("10px"),
                      textTransform: "uppercase",
                    })}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {t(key)}
                    {isOpen ? null : (
                      <Icon
                        _css={s({ marginLeft: 7, ...size(10) })}
                        path={chevronDown}
                      />
                    )}
                  </button>
                </div>
              ) : (
                <div css={s({ paddingTop: 0 })}>
                  <Link
                    to={path}
                    css={s({
                      display: "block",
                      fontSize: [10, null, "inherit"],
                      fontWeight: "700",
                      letterSpacing: "1.5px",
                      lineHeight: "20px",
                      opacity: isOpen ? 0.6 : 1,
                      ...py("10px"),
                      textTransform: "uppercase",
                    })}
                  >
                    {t(key)}
                  </Link>
                </div>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </nav>
    </div>
  );
};

const SubNavFooter: FC<SubNavFooterProps> = ({ items }) => {
  const { t } = useLocale();
  const router = useRouter();
  const currentRoute = router.pathname;

  const dataLength = items.length;

  const currentIndex = items.findIndex(({ path }) => path === currentRoute);

  if (currentIndex < 0) {
    return null;
  }

  const nextIndex = (currentIndex + 1) % dataLength;
  const prevIndex = (currentIndex + dataLength - 1) % dataLength;

  const prev = items[prevIndex];
  const next = items[nextIndex];

  return (
    <nav>
      <Grid
        itemWidth={"50%"}
        innerCss={s((t) => ({
          alignItems: "center",
          borderBottom: `1px solid ${t.color.border.light}`,
          borderTop: `1px solid ${t.color.border.light}`,
          justifyContent: "center",
          textAlign: "center",
        }))}
      >
        {[prev, next].map(({ key, path }, index) => {
          const isFirst = index === 0;

          return (
            <Item
              key={key}
              _css={s(
                isFirst
                  ? (t) => ({
                      borderRight: `1px solid ${t.color.border.light}`,
                    })
                  : {}
              )}
            >
              <div
                css={s((t) => ({
                  ...py([t.spacing.md, t.spacing.lg, t.spacing.xl]),
                }))}
              >
                <Link
                  css={s(callToActionText, {
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "all 0.2s ease-in-out",
                    },
                    display: "inline-block",
                    fontSize: 12,
                    transform: "scale(1)",
                    transition: "all 0.2s ease-in-out",
                    width: "fit-content",
                  })}
                  to={path}
                >
                  <div
                    css={s({
                      alignItems: "center",
                      display: "flex",
                      flexDirection: isFirst ? "row" : "row-reverse",
                      justifyContent: "center",
                    })}
                  >
                    <div
                      css={s((t) => ({
                        border: `1px solid ${t.color.border.light}`,
                        borderRadius: "50%",
                        display: "inline-block",
                        marginLeft: isFirst
                          ? null
                          : [t.spacing.xs, null, t.spacing.md],
                        marginRight: isFirst
                          ? [t.spacing.xs, null, t.spacing.md]
                          : null,
                        padding: [10, null, t.spacing.sm],
                      }))}
                    >
                      <Icon
                        _css={s({
                          ...size([12, null, 16]),
                        })}
                        path={isFirst ? chevronLeft : chevronRight}
                      />
                    </div>
                    <span>{isFirst ? t(prev.key) : t(next.key)}</span>
                  </div>
                </Link>
              </div>
            </Item>
          );
        })}
      </Grid>
    </nav>
  );
};

export { SubNav, SubNavFooter };
