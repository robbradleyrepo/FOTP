import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { useRouter } from "next/router";
import React, { FC, Fragment } from "react";
import { Trans } from "react-i18next";

import {
  belt,
  ComponentStyleProps,
  mx,
  px,
  py,
  s,
  size,
} from "@/common/ui/utils";

import { bodyTextSmallStatic } from "../../../ui/base/typography";
import heart from "../../../ui/icons/heart";
import Icon from "../../base/icon";
import Logo from "../../base/logo";

const enUsResource = {
  address: "6060 Center Dr, Ste 69, Fl 10, Los Angeles, CA 90045",
  copyright: "© 2020 FOTP US Inc.",
  disclaimer:
    "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.",
  love: "love",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
  transcript: "Transcript",
  unconditional: "Made with unconditional <Love />  in California",
};

interface VideoSalesLetterFooterProps extends ComponentStyleProps {
  transcript?: boolean;
}

const VideoSalesLetterFooter: FC<VideoSalesLetterFooterProps> = ({
  _css,
  transcript,
}) => {
  const { i18n, t } = useLocale();
  const { asPath } = useRouter();

  i18n.addResourceBundle("en-US", "VideoSalesLetterFooter", enUsResource);

  let links = [
    {
      key: "terms",
      path: "/terms-of-service",
    },
    {
      key: "privacy",
      path: "/privacy",
    },
  ];

  if (transcript) {
    links = [
      ...links,
      { key: "transcript", path: `${asPath.split("?")[0]}/transcript` },
    ];
  }

  return (
    <footer
      css={s(
        bodyTextSmallStatic,
        (t) => ({
          backgroundColor: t.color.background.dark,
          color: t.color.text.light.base,
          ...px(t.spacing.md),
          ...py(t.spacing.xl),
          textAlign: "center",
        }),
        _css ?? {}
      )}
    >
      <div css={s(belt)}>
        <Logo
          _css={s((t) => ({
            marginBottom: [t.spacing.lg, null, t.spacing.md],
            width: 80,
          }))}
        />
        <div
          css={s({
            display: [null, null, null, "flex"],
            justifyContent: "center",
          })}
        >
          <ul>
            {[
              <Fragment key="address">
                {t("VideoSalesLetterFooter:address")}
              </Fragment>,
              <Trans
                key="unconditional"
                components={{
                  Love: (
                    <Icon
                      _css={s((t) => ({
                        color: t.color.background.feature5,
                        ...mx(2),
                        ...size(14),
                      }))}
                      path={heart}
                      title={t("VideoSalesLetterFooter:love")}
                      viewBox="0 0 14 12"
                    />
                  ),
                }}
                i18nKey="VideoSalesLetterFooter:unconditional"
              />,
              <Fragment key="copyright">
                {t("VideoSalesLetterFooter:copyright")}
              </Fragment>,
            ].map((item) => (
              <li
                key={item.key}
                css={s((t) => ({
                  "& + &": {
                    "&:before": {
                      content: [null, null, null, "'•'"],
                      ...mx(t.spacing.xs),
                    },
                    marginTop: [t.spacing.sm, null, null, 0],
                  },
                  display: [null, null, null, "inline-block"],
                  ...mx([-t.spacing.xs, 0]), // Reduce likelihood of line wrapping on mobile
                }))}
              >
                {item}
              </li>
            ))}
          </ul>
          <ul
            css={s((t) => ({
              marginLeft: [null, null, null, t.spacing.sm],
              marginTop: [t.spacing.md, null, t.spacing.sm, 0],
            }))}
          >
            {links.map(({ key, path }) => (
              <li
                key={key}
                css={s((t) => ({
                  "& + &": {
                    marginLeft: t.spacing.sm,
                  },
                  display: "inline-block",
                  textDecoration: "underline",
                }))}
              >
                <Link
                  css={s({
                    textDecoration: "underline",
                  })}
                  to={path}
                >
                  {t(`VideoSalesLetterFooter:${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p
          css={s((t) => ({
            before: { content: "'*'" },
            fontSize: 12,
            lineHeight: 1.5,
            marginTop: [t.spacing.lg, null, t.spacing.sm],
            opacity: "0.6",
          }))}
        >
          {t("VideoSalesLetterFooter:disclaimer")}
        </p>
      </div>
    </footer>
  );
};

export default VideoSalesLetterFooter;
