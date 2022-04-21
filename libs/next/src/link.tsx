import NextLink, { LinkProps as NextLinkProps } from "next/link";
import React, { AnchorHTMLAttributes, FC } from "react";

interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Pick<NextLinkProps, "prefetch" | "replace"> {
  className?: string;
  to: string;
}

const Link: FC<LinkProps> = ({
  children,
  className,
  download,
  hrefLang,
  media,
  onBlur,
  onClick,
  onFocus,
  ping,
  prefetch,
  rel,
  replace,
  target,
  type,
  referrerPolicy,
  to,
}) => (
  <NextLink href={to} prefetch={prefetch} replace={replace}>
    <a
      className={className}
      download={download}
      hrefLang={hrefLang}
      media={media}
      onBlur={onBlur}
      onClick={onClick}
      onFocus={onFocus}
      ping={ping}
      rel={rel}
      target={target}
      type={type}
      referrerPolicy={referrerPolicy}
    >
      {children}
    </a>
  </NextLink>
);

export default Link;
