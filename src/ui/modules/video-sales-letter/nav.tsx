import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import { ComponentStyleProps, gutterX, s } from "@/common/ui/utils";

import {
  NavContactType,
  NavLogoType,
  VideoSalesLetter,
} from "../../../cms/video-sales-letter";
import { bodyTextSmallStatic } from "../../../ui/base/typography";
import Header from "../../base/header";
import Logo from "../../base/logo";
import Contact from "../../nav/contact";

const enUsResource = {
  legal: "Advertorial",
};

type VideoSalesLetterNavProps = ComponentStyleProps &
  Pick<VideoSalesLetter, "legalBannerEnabled" | "navContact" | "navLogo">;

export const getNavEnabled = ({
  legalBannerEnabled,
  navContact,
  navLogo,
}: VideoSalesLetterNavProps): boolean =>
  legalBannerEnabled ||
  navContact === NavContactType.STANDARD ||
  navLogo !== NavLogoType.NONE;

const VideoSalesLetterNav: FC<VideoSalesLetterNavProps> = ({
  _css,
  legalBannerEnabled,
  navContact,
  navLogo,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "VideoSalesLetterNav", enUsResource);

  const contactEnabled = navContact !== NavContactType.NONE;
  const logoEnabled = navLogo !== NavLogoType.NONE;

  return (
    <>
      <Header
        _css={s(
          gutterX,
          {
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          },
          _css ?? {}
        )}
      >
        {logoEnabled && (
          <Link prefetch={false} to="/">
            <Logo
              _css={s({
                height: [48, null, 60],
                width: "auto",
              })}
              fill="currentColor"
            />
          </Link>
        )}

        {legalBannerEnabled && (
          <span
            css={s(bodyTextSmallStatic, {
              ...(contactEnabled === logoEnabled && {
                left: "50%",
                position: "absolute",
                transform: "translateX(-50%)",
              }),
              textTransform: "uppercase",
            })}
          >
            {t("VideoSalesLetterNav:legal")}
          </span>
        )}

        {contactEnabled && (
          <Contact
            _css={s((t) => ({
              display: "block",
              fontSize: [12, null, 14],
              lineHeight: 1.4,
              marginRight: legalBannerEnabled ? [-t.spacing.xs, 0] : null,
              textAlign: "right",
            }))}
          />
        )}
      </Header>
    </>
  );
};

export default VideoSalesLetterNav;
