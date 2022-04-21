import { Person, RichTextFragment } from "@sss/prismic";
import React, { FC } from "react";

import {
  ComponentStyleProps,
  ResponsiveImageProperties,
  s,
  size,
} from "@/common/ui/utils";

import { ExpertCore } from "../../cms/common";
import ResponsiveImage from "../base/responsive-image";

type AuthorProps = Pick<Person, "image" | "name"> &
  Partial<Person> &
  Partial<ExpertCore> &
  ComponentStyleProps & {
    imageCss?: ComponentStyleProps["_css"];
    sizes?: ResponsiveImageProperties | string;
  };

const Author: FC<AuthorProps> = ({
  _css = {},
  children,
  image,
  imageCss = {},
  name,
  postNominal,
  role,
  sizes = { width: [48, null, 64] },
}) => {
  return (
    <div css={s({ display: "flex" }, _css)}>
      {image && (
        <div
          css={s(
            (t) => ({
              ...size([48, null, 64]),
              borderRadius: t.radius.xxl,
              flexGrow: 0,
              flexShrink: 0,
              marginRight: [t.spacing.sm, null, t.spacing.md],
              overflow: "hidden",
            }),
            imageCss
          )}
        >
          <ResponsiveImage
            alt=""
            height={256}
            loading="lazy"
            src={image.url}
            sizes={sizes}
            width={256}
          />
        </div>
      )}
      {(children || name) && (
        <div>
          {name && (
            <p css={s((t) => ({ fontWeight: t.font.primary.weight.medium }))}>
              <RichTextFragment render={name} />
            </p>
          )}
          {(role || postNominal) && (
            <p css={s({ fontStyle: "italic" })}>
              {postNominal && (
                <>
                  <RichTextFragment render={postNominal} />,{" "}
                </>
              )}
              {role && <RichTextFragment render={role} />}
            </p>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

export default Author;
