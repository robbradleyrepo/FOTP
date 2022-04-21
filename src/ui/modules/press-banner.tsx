import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import React, { FC } from "react";

import {
  belt,
  ComponentStyleProps,
  greedy,
  mx,
  px,
  py,
  ratio,
  s,
} from "@/common/ui/utils";

import COMMON_PRESS_MODERN_LIVING_IMG from "../../assets/images/common/press/MODERN_LIVING.png";
import ResponsiveImage from "../base/responsive-image";
import { bodyText } from "../base/typography";
import Stars from "../modules/reviews/stars";

const enUsResource = {
  label: "As Seen On",
  reviews: "Rated “Excellent” By Dog Parents",
};

interface LogoAttributes {
  containerHeight: (number | null)[];
  height: number;
  relativeHeight?: number;
  width: number;
}

const getWidth = ({
  containerHeight,
  height,
  relativeHeight = 1,
  width,
}: LogoAttributes) =>
  containerHeight.map(
    (value) => value && (relativeHeight * value * width) / height
  );

const listItemStyles = ({
  containerHeight,
  height,
  relativeHeight,
  width,
}: LogoAttributes) =>
  s(ratio(height / width), {
    display: "block",
    opacity: 0.8,
    width: getWidth({ containerHeight, height, relativeHeight, width }),
  });
const svgStyles = s(greedy, {
  overflow: "visible !important", // Prevent cropping due to sub-pixel rendering
});

type ItemProps = MaybeLinkProps & Pick<LogoAttributes, "containerHeight">;

const Forbes: FC<ItemProps> = ({
  _css = {},
  containerHeight,
  href,
  showLink,
}) => {
  const height = 380;
  const relativeHeight = 0.5;
  const width = 1391;

  return (
    <li
      css={s(
        listItemStyles({ containerHeight, height, relativeHeight, width }),
        _css
      )}
    >
      <MaybeLink href={href} showLink={showLink}>
        <svg
          css={s(svgStyles)}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Forbes</title>
          <path d="M345.6 362.9c-24.2-3.5-45.5-13.8-61.7-29.8-13.5-13.4-22.3-28.1-28.7-48.3-10.1-31.5-10.1-72 0-102.8 9.8-29.9 31.7-55.9 58.7-69.4 37.3-18.7 89.7-17.5 124.2 2.8 31.1 18.3 49.9 50.8 55.1 95.1 1.6 13.6.6 42.2-2 54-10.3 48.4-40.3 82.1-84.3 94.9-4.7 1.4-12.1 3-16.3 3.6-8.9 1.2-36.3 1.2-45-.1zm36.3-19.4c7.1-2.1 15.8-10.3 20.5-19.2 9.6-18.4 13.9-45.6 14-88.8.1-54.1-8.4-88.6-26.3-106.6-7.5-7.6-12.9-9.9-22.5-9.9-21.3 0-34.9 22.3-40.2 66.2-2.5 20.2-2.5 68.2 0 85.8 7.6 54.6 27.1 80.6 54.5 72.5zm393.2 19.4c-9.9-1-40.2-6.1-50.8-8.5l-7.3-1.7.6-39.1c1.4-94.2 1.5-145.6.7-195.6-.9-49-1.1-54.2-3-61.4-2.4-9.2-5.8-15.6-10-18.5-1.6-1.1-6-2.8-9.7-3.6-12.5-2.8-11.8-2.3-12.1-8-.2-3.3.2-5.4 1-6.1.9-1 103-20.5 106.3-20.4.9 0 1.1 13.1.6 58-.3 31.9-.4 58-.1 58 .3 0 4-1.6 8.3-3.6 12.9-6 24.8-8.5 42-9.1 11.5-.4 16.8-.1 22.7 1.1 38.5 8 67 39.5 77 85.2 2.6 11.9 3.6 41.5 1.8 56.3-1.5 12.6-5.7 29.7-10 40.7-16.5 41.7-51.8 68.9-98.7 76-10.8 1.6-44.8 1.8-59.3.3zm40.1-19.9c7.3-1.4 12.9-4.3 19-9.7 15.2-13.7 26.6-41.8 31.1-76.8 1.8-14.2 1.6-46.6-.4-58.5-5.5-32.1-17.3-53.2-34.5-61.7-7.1-3.5-8.2-3.8-16.7-3.8-6 0-11.3.6-15.7 2l-6.6 2-.5 36.5c-.6 46.8.9 164 2.2 167.4.8 2.1 1.7 2.6 5.8 2.9 9.4.7 11 .7 16.3-.3zm247.4 19.4c-49.6-8.9-85.1-44.1-96.7-95.9-1.5-6.7-2.2-14.1-2.5-28.5-.6-22.8 1.3-36.9 7.1-54.5 11.3-33.8 31.5-57.7 60.9-72 31-15.1 73.5-16.1 100.9-2.4 30.9 15.5 49.1 46.4 53.7 91.4.6 6.1 1 13.2.8 16l-.3 5-74 .3-74 .3.3 8.7c.7 20.3 5 38.2 13.1 53.7 3.7 7.1 6.6 10.9 13.7 18.1 16 16.1 31.9 22.4 57 22.4 18.2 0 31.3-3.6 45-12.5 3.8-2.5 7.7-4.5 8.6-4.5 2.1 0 6.9 6.2 6.9 8.9 0 4.4-14.3 18.6-28.3 28.1-11.5 7.7-29.6 14.8-45.4 17.5-11.1 1.9-35.9 1.9-46.8-.1zm31.4-163l17.4-.6-.6-12.4c-2.2-43.6-12.9-67.4-30.2-67.4-18.8 0-33.8 24.2-40.1 64.5-.8 4.9-1.4 10.8-1.4 13v4l18.8-.3c10.2-.1 26.5-.5 36.1-.8zm168.6 164c-17.8-1.9-46.2-8.1-55.6-12.2l-4.6-2-.6-22.8-.9-37.3-.3-14.5 2.8-1.3a22 22 0 016.8-1.5l4.1-.2 3.5 8.5c13.5 33.2 29.3 51 49.9 56.5 7.9 2.1 22.6 2.1 28.5 0 16.3-5.8 25.3-18.1 25.4-35 .1-20-10.9-29.6-52.4-45.8-25.7-10.1-34.7-15.2-45.4-26.2-11.5-11.8-17.1-25.2-18.1-43.9-1.3-22.6 5.8-41.7 21.5-57.9 15.8-16.3 36.3-25.2 64.2-27.7 24.6-2.2 62.3 3 82 11.3l3.6 1.5.6 20.4c.4 11.2.7 26.2.8 33.4l.2 13-4.8 1.8c-7.7 2.8-8.2 2.5-12.4-8.8-11.9-31.6-25.8-46.6-47.4-51.2-13.2-2.8-24.2.2-32.2 8.8-6.2 6.7-8.7 12.6-9.3 22.5-.6 10.8 1.3 16.6 7.9 23.8 8.1 8.9 21.4 16.5 47.9 27.6 32.4 13.6 47.9 25.1 56.3 41.9 5.5 10.9 7 19.6 6.5 36.4-.4 12.6-.8 15.2-3.7 23.6-9.3 27.6-30.4 45.7-63 54.3-11 2.9-12.6 3-34.6 3.3-12.9 0-25-.1-27.2-.3zm-1261.3-6c-.8-.3-1.2-2.8-1.2-7.4 0-8.3-.5-7.9 15.5-10.9 12.3-2.3 16.7-4.6 22.1-11.7 10.5-13.8 12.8-40.4 12.8-149.8 0-102.7-2-124.4-12.8-140.2-4.8-7-13-10.9-26.6-12.5L.6 23.5l-.3-8.2L0 7.1l3.3-.6c1.8-.3 65.4-.5 141.3-.3l138 .3.6 4c.4 2.2.9 24.8 1.3 50.1l.7 46.1-7.2 2.3c-10.7 3.3-10.6 3.3-15.5-9.5-11.8-31.3-25.4-49.3-44-58.5-12.8-6.3-18.7-7-54.9-7h-31.5l-.5 5.2c-1 9.8-2.6 73.2-2.6 103V172l9.2-.1c5.1 0 15.1-.4 22.3-.8 10.8-.6 14-1.2 18.5-3.3 11.1-5.1 18.6-16.4 23.2-34.8l2.4-9.5 8.2-.3 8.2-.3v120.2l-8.2-.3-8.2-.3-2.3-9.5c-4.4-17.8-12.7-30.6-23.1-35.2-4.8-2.1-16.6-3.3-39.5-4l-10.8-.3V216c0 24.6 1.4 57.9 3.1 75.9 2.4 25.2 8.8 39.1 20.4 44.1 2.2 1 9.2 2.5 15.5 3.5 6.3.9 12.3 2.1 13.2 2.6 2.4 1.3 2.6 14.3.2 15.2-1.7.8-178.2.8-180 .1zm493-.2c-.9-.6-1.2-2.9-1-7.7l.3-6.9 3.5-.7c1.9-.4 6.1-1.2 9.2-1.8 9.7-1.8 15.2-7.1 18.4-17.4 2.6-8.4 3.7-35.2 3.7-89.1.1-65.9-1.3-81.4-8-90.3-3.6-4.8-6.2-6.1-15-7.8-4.3-.8-8.9-1.7-10.1-2-2-.4-2.2-1.1-2.2-6 0-4.8.3-5.6 2.2-6.4 3-1.2 102.1-21 105.2-21h2.5l-.5 14.8c-.3 8.1-.7 19.9-.9 26.2l-.5 11.5 3.6-6.5c11.5-20.7 24.4-33.6 41.5-41.4 9.4-4.3 15.7-5.6 27.3-5.6 13.8 0 27.6 4.5 27.6 9 0 3-24.3 67.2-25.6 67.7-.7.3-5.4-1.6-10.5-4-10.7-5.1-20.8-7.7-30.5-7.6-12.2 0-25.7 4.5-31.1 10.3-2.3 2.5-2.3 2.6-2.9 39.3-.6 36.4.6 80.8 2.7 98.6 1.7 15.2 5.8 22.7 14.1 26.2 2.8 1.2 20.4 3.6 26.1 3.6.4 0 .7 3.5.5 7.8l-.3 7.8-74 .2c-40.7-.1-74.6-.4-75.3-.8z" />
        </svg>
      </MaybeLink>
    </li>
  );
};

const ModernLiving: FC<ItemProps> = ({
  _css = {},
  containerHeight,
  href,
  showLink,
}) => {
  const height = COMMON_PRESS_MODERN_LIVING_IMG.height;
  const relativeHeight = 0.9;
  const width = COMMON_PRESS_MODERN_LIVING_IMG.width;

  return (
    <li
      css={s(
        listItemStyles({ containerHeight, height, relativeHeight, width }),
        _css
      )}
    >
      <MaybeLink href={href} showLink={showLink}>
        <ResponsiveImage
          _css={s({ imageRendering: "crisp-edges" })}
          alt="Modern Living with Kathy Ireland"
          src={COMMON_PRESS_MODERN_LIVING_IMG}
          sizes="100vw"
        />
      </MaybeLink>
    </li>
  );
};

const USAToday: FC<ItemProps> = ({
  _css = {},
  containerHeight,
  href,
  showLink,
}) => {
  const height = 32;
  const relativeHeight = 1;
  const width = 78;

  return (
    <li
      css={s(
        listItemStyles({ containerHeight, height, relativeHeight, width }),
        _css
      )}
    >
      <MaybeLink href={href} showLink={showLink}>
        <svg
          css={s(svgStyles)}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>PetVet Magazine</title>
          <path d="M36 12.75a1.53 1.53 0 001.18-.45 1.82 1.82 0 00.38-1.3V5.43h2.53V11A3.7 3.7 0 0139 13.85a4.29 4.29 0 01-3 1 4.28 4.28 0 01-3-1A3.7 3.7 0 0131.84 11V5.43h2.53V11a1.81 1.81 0 00.42 1.28 1.52 1.52 0 001.21.47zM45.14 14.86a6.09 6.09 0 01-2.14-.39 5.26 5.26 0 01-1.8-1.11l1.22-1.54a4.17 4.17 0 001.22.77 3.89 3.89 0 001.5.28 1.64 1.64 0 00.86-.19.63.63 0 00.31-.57.67.67 0 00-.37-.59 5.35 5.35 0 00-1.3-.52l-.57-.15a4 4 0 01-1.9-1 2.35 2.35 0 01-.65-1.71 2.65 2.65 0 01.48-1.5 3 3 0 011.28-1 4.64 4.64 0 011.89-.36 5.38 5.38 0 012 .39 5.82 5.82 0 011.71 1.03l-1.26 1.59a5.07 5.07 0 00-1.15-.73 3 3 0 00-1.31-.31 1.58 1.58 0 00-.84.18A.6.6 0 0044 8a.7.7 0 00.31.56 3.15 3.15 0 001.08.44l.69.19a4.25 4.25 0 012.11 1.12 2.42 2.42 0 01.62 1.65 2.65 2.65 0 01-.46 1.54 3 3 0 01-1.29 1 4.73 4.73 0 01-1.92.36zM56.46 14.68L55.87 13h-3.46l-.58 1.73h-2.5l3.39-9.25h2.94l3.34 9.2zM53 11.08h2.19l-1.04-3.24zM34.59 26.53v-7.21h-2.75v-2h8v2h-2.72v7.21zM45.16 26.71a4.92 4.92 0 01-2.47-.61A4.49 4.49 0 0141 24.4a4.87 4.87 0 01-.63-2.48 5.15 5.15 0 01.34-1.92 4.48 4.48 0 011-1.52 4.61 4.61 0 011.52-1 5.38 5.38 0 013.83 0 4.62 4.62 0 011.52 1 4.47 4.47 0 011 1.52 5.13 5.13 0 01.42 1.92 4.87 4.87 0 01-.62 2.48 4.49 4.49 0 01-1.71 1.69 4.92 4.92 0 01-2.51.62zm0-2.09a2 2 0 001.16-.34 2.3 2.3 0 00.78-.95 3.26 3.26 0 00.29-1.41 3.31 3.31 0 00-.29-1.41 2.35 2.35 0 00-.78-1 2.12 2.12 0 00-2.33 0 2.35 2.35 0 00-.78 1 3.31 3.31 0 00-.29 1.41 3.26 3.26 0 00.29 1.41 2.3 2.3 0 00.78.95 2 2 0 001.17.33zM51.41 26.53v-9.25h3.65a4.88 4.88 0 012.43.59 4.31 4.31 0 011.65 1.63 5.12 5.12 0 010 4.8 4.31 4.31 0 01-1.65 1.63 4.88 4.88 0 01-2.43.59zm2.49-2h1.16a1.91 1.91 0 001.57-.72 3 3 0 00.58-1.9 3 3 0 00-.58-1.9 1.91 1.91 0 00-1.57-.72H53.9zM67.2 26.53l-.58-1.73h-3.47l-.58 1.73h-2.5l3.39-9.25h2.94l3.39 9.25zm-3.41-3.6H66l-1.09-3.24zM74.67 23.2v3.33H72.1V23.2l-3.28-5.92h2.86L73.39 21l1.7-3.67h2.86z" />
          <circle cx="14" cy="16" r="14" />
        </svg>
      </MaybeLink>
    </li>
  );
};

interface MaybeLinkProps extends ComponentStyleProps {
  href: string;
  showLink: boolean;
}

const MaybeLink: FC<MaybeLinkProps> = ({ children, href, showLink }) =>
  showLink ? (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );

interface PressBannerProps extends ComponentStyleProps {
  fullWidth?: boolean;
  showLinks: boolean;
  showRating?: boolean;
}

const PressBanner: FC<PressBannerProps> = ({
  _css,
  fullWidth = true,
  showLinks,
  showRating = true,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "pressBanner", enUsResource);

  const listHeight = [32, 48, 56];

  return (
    <div
      css={s(
        (t) => ({
          alignItems: "center",
          display: "flex",
          flexDirection: fullWidth ? ["column", null, null, "row"] : "column",
          justifyContent: fullWidth
            ? ["center", null, null, "stretch"]
            : "center",
          ...px([t.spacing.sm, null, t.spacing.md]),
          ...py(fullWidth ? [t.spacing.sm, null, t.spacing.xl] : t.spacing.sm),
        }),
        _css ?? {}
      )}
    >
      {showRating && (
        <span
          css={s(bodyText, (t) => ({
            display: fullWidth ? ["block", null, null, "none"] : "block",
            fontFamily: t.font.secondary.family,
            letterSpacing: "-0.025em",
            textAlign: "center",
            whiteSpace: "nowrap",
          }))}
        >
          <span css={s({ display: "block" })}>{t("pressBanner:reviews")}</span>
          <Stars
            _css={s((t) => ({
              height: 24,
              marginTop: t.spacing.xxs,
              width: 137,
            }))}
            value={5}
          />
        </span>
      )}
      <ul
        css={s(belt, (t) => ({
          "& > *": {
            marginTop: fullWidth ? [t.spacing.md, null, null, 0] : t.spacing.md,
            ...mx(
              fullWidth
                ? [t.spacing.xs, t.spacing.sm, null, t.spacing.md]
                : [t.spacing.xs, t.spacing.sm]
            ),
          },
          alignItems: "center",
          display: "flex",
          flexWrap: ["wrap", null, "nowrap"],
          justifyContent: fullWidth
            ? ["center", null, null, "space-evenly"]
            : "center",
          marginTop: showRating
            ? null
            : fullWidth
            ? [-t.spacing.md, null, null, 0]
            : -t.spacing.md,
          maxWidth: [320, 400, "unset"],
          width: "100%",
        }))}
      >
        <ModernLiving
          _css={s((t) => ({ marginLeft: [t.spacing.sm] }))}
          containerHeight={listHeight}
          href="https://modernlivingtv.com/"
          showLink={showLinks}
        />
        <Forbes
          containerHeight={listHeight}
          href="https://www.forbes.com/"
          showLink={showLinks}
        />
        {fullWidth && showRating && (
          <li
            css={s(bodyText, (t) => ({
              display: ["none", null, null, "block"],
              fontFamily: t.font.secondary.family,
              letterSpacing: "-0.025em",
              opacity: 1,
              ...px(t.spacing.sm),
              textAlign: "center",
              whiteSpace: "nowrap",
            }))}
          >
            <span css={s({ display: "block" })}>
              {t("pressBanner:reviews")}
            </span>
            <Stars
              _css={s((t) => ({
                height: 24,
                marginTop: t.spacing.xxs,
                width: 137,
              }))}
              value={5}
            />
          </li>
        )}
        <USAToday
          containerHeight={listHeight}
          href="https://usatoday.com"
          showLink={showLinks}
        />
        <li css={s({ width: [142, null, null, 160] })}>
          <Link
            to="https://www.honestbrandreviews.com/reviews/front-of-the-pack-review/"
            rel="noreferrer"
            target="_blank"
            css={s({
              alignItems: "center",
              display: "flex",
              fontFamily: "Arial, sans-serif",
              fontSize: [16, 18, null, null, 20, 23],
              fontWeight: "700",
              letterSpacing: "normal",
              lineHeight: "0.95em",
              opacity: 0.8,
            })}
          >
            Honest Brand Reviews
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PressBanner;
