import React, { FC } from "react";

import {
  ComponentStyleProps,
  ResponsiveCSSValue,
  s,
  size,
} from "@/common/ui/utils";

import { SOCIAL } from "../../config";
import Icon from "../base/icon";
import facebook from "../icons/facebook";
import instagram from "../icons/instagram";
import twitter from "../icons/twitter";
import youtube from "../icons/youtube";
import { spacing } from "../styles/variables";

enum SocialType {
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  TWITTER = "twitter",
  YOUTUBE = "youtube",
}

const ICONS = [
  {
    href: SOCIAL.instagram.url,
    key: SocialType.INSTAGRAM,
    path: instagram,
    title: "Instgram",
  },
  {
    href: SOCIAL.facebook.url,
    key: SocialType.FACEBOOK,
    path: facebook,
    title: "Facebook",
  },
  {
    href: SOCIAL.twitter.url,
    key: SocialType.TWITTER,
    path: twitter,
    title: "Twitter",
  },
  {
    href: SOCIAL.youtube.url,
    key: SocialType.YOUTUBE,
    path: youtube,
    title: "YouTube",
  },
];

type SocialIconsProps = ComponentStyleProps &
  Partial<Record<SocialType, boolean>> & {
    size?: ResponsiveCSSValue;
    spacing?: ResponsiveCSSValue;
  };

const SocialIcons: FC<SocialIconsProps> = ({
  _css = {},
  size: iconSize = 32,
  spacing: iconSpacing = spacing.lg,
  ...rest
}) => (
  <ul css={s(_css)}>
    {ICONS.map(({ href, key, path, title }, idx) => {
      const enabled = !(key in rest) || rest[key];

      return enabled ? (
        <li
          css={s({
            display: "inline-block",
            paddingLeft: idx > 0 ? iconSpacing : undefined,
          })}
          key={key}
        >
          <a href={href} target="_blank" rel="noreferrer">
            <Icon
              _css={s(size(iconSize))}
              path={path}
              title={title}
              viewBox="0 0 100 100"
            />
          </a>
        </li>
      ) : null;
    })}
  </ul>
);

export default SocialIcons;
