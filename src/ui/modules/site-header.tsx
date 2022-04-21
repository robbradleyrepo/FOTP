import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";
import { MergeExclusive } from "type-fest";

import { ComponentStyleProps, s, size } from "@/common/ui/utils";

import { THEMES_ENGINE } from "../../config";
import Icon from "../base/icon";
import Logo from "../base/logo";
import { callToActionText } from "../base/typography";
import chevronDown from "../icons/chevronDown";
import {
  MenuButton,
  MenuDrawer,
  MenuGroup,
  useMenuController,
} from "../nav/menu";
import CartDrawer from "./cart/drawer";
import CartToggle from "./cart/toggle";

type NavItem = {
  i18nKey: string;
} & MergeExclusive<
  {
    // External link
    href: string;
    rel?: string;
    target?: string;
  },
  {
    to: string;
  }
>;

const SiteHeader: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { setIsOpen } = useMenuController();

  const { t } = useLocale();

  return (
    <>
      <div
        css={s(
          {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          },
          _css
        )}
      >
        <MenuButton />

        <div
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
            {(["shop", "science", "about", "learn"] as MenuGroup[]).map(
              (menu) => (
                <li
                  css={s((t) => ({
                    "& + &": {
                      marginLeft: t.spacing.sm,
                    },
                  }))}
                  key={menu}
                >
                  <button
                    css={s(callToActionText, (t) => ({
                      fontSize: 12,
                      padding: [t.spacing.sm, null, "1vw", t.spacing.sm],
                    }))}
                    onClick={() => setIsOpen(true, menu)}
                  >
                    {t(`common:navigation.${menu}`)}{" "}
                    <Icon
                      _css={s({
                        display: ["none", null, null, "inline"],
                        marginLeft: 3,
                        ...size(10),
                      })}
                      path={chevronDown}
                    />
                  </button>
                </li>
              )
            )}
          </ul>
        </div>

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

        <ul
          css={s({
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
          })}
        >
          {([
            {
              i18nKey: "common:navigation.giveGet",
              to: "/work-with-us/refer",
            },
            {
              href: THEMES_ENGINE.urls.account,
              i18nKey: "common:navigation.account",
            },
          ] as NavItem[]).map(({ i18nKey, ...props }, idx) => (
            <li
              css={s((t) => ({
                display: ["none", null, "flex"],
                marginRight: t.spacing.lg,
              }))}
              key={idx}
            >
              {"to" in props && props.to ? (
                <Link
                  css={s(callToActionText, {
                    fontSize: 12,
                  })}
                  {...props}
                  prefetch={false}
                >
                  {t(i18nKey)}
                </Link>
              ) : (
                <a
                  css={s(callToActionText, {
                    fontSize: 12,
                  })}
                  {...props}
                >
                  {t(i18nKey)}
                </a>
              )}
            </li>
          ))}
          <li>
            <CartToggle />
          </li>
        </ul>
      </div>
      <MenuDrawer />
      <CartDrawer />
    </>
  );
};

export default SiteHeader;
