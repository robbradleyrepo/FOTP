import { getFetchedImageUrl } from "@sss/cloudinary";
import { useDateTimeFormatter, useLocale } from "@sss/i18n";
import { Elements, hasContent, RichTextFragment } from "@sss/prismic";
import { LinkResolver } from "@sss/prismic";
import React, { FC, Fragment } from "react";

import {
  belt,
  ComponentStyleProps,
  gutter,
  my,
  px,
  py,
  s,
  Style,
  visuallyHidden,
} from "@/common/ui/utils";

import {
  LandingPage,
  LandingPageHeaderPublicationDateType,
  LandingPageHeaderSponsoredByType,
} from "../../../cms/landing-page";
import { useCmsLayout } from "../../../cms/layout";
import { PrismicImage, RichText } from "../../../cms/prismic";
import {
  bodyText,
  bodyTextSmall,
  headingAlpha,
  headingCharlieStatic,
} from "../../base/typography";
import BaseAuthor from "../author";
import LandingPagePressBanner from "./press-banner";

type LandingPageHeaderProps = ComponentStyleProps &
  LandingPage & { publicationDate: string | null };

const LandingPageHeader: FC<LandingPageHeaderProps> = ({
  _css = {},
  author,
  headerImage,
  headerImageHero,
  headerNote,
  headerPressBanner,
  headerPromoBanner,
  headerPublicationDate,
  headerSponsoredBy,
  headerStrapline,
  headerTitle,
  publicationDate,
}) => {
  const { maxWidth, styles } = useCmsLayout();
  const formatDateTime = useDateTimeFormatter();
  const { t, i18n } = useLocale();

  i18n.addResourceBundle("en-US", "LandingPageHeader", {
    info: {
      publicationDate: "Publication date",
      sponsoredBy: "Sponsored by",
    },
  });

  const infoBannerData = [
    {
      css: {
        dt: visuallyHidden,
      },
      key: "publicationDate",
      value:
        publicationDate &&
        headerPublicationDate &&
        headerPublicationDate !== LandingPageHeaderPublicationDateType.NONE
          ? formatDateTime(publicationDate, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : null,
    },
    {
      key: "sponsoredBy",
      value:
        headerSponsoredBy &&
        headerSponsoredBy !== LandingPageHeaderSponsoredByType.NONE
          ? headerSponsoredBy
          : null,
    },
  ].filter(({ value }) => !!value);

  const InfoBanner: FC<ComponentStyleProps> | null =
    infoBannerData.length > 0
      ? ({ _css = {} }) => (
          <dl
            css={s(
              styles.belt,
              styles.gutterX,
              bodyTextSmall,
              (t) => ({
                "& > *": { display: "inline-block", marginRight: "0.3em" },
                fontWeight: t.font.primary.weight.medium,
              }),
              _css
            )}
          >
            {infoBannerData.map(
              ({ css, key, value }, index) =>
                value && (
                  <Fragment key={key}>
                    <dt
                      css={s(
                        index !== 0
                          ? {
                              "&:before": {
                                content: "'|'",
                                marginRight: "0.3em",
                              },
                            }
                          : {},
                        css?.dt ?? {}
                      )}
                    >
                      {t(`LandingPageHeader:info.${key}`)}
                    </dt>
                    <dd>{value}</dd>
                  </Fragment>
                )
            )}
          </dl>
        )
      : null;

  const Note: FC<ComponentStyleProps> | null = hasContent(headerNote)
    ? ({ _css = {} }) => (
        <aside
          css={s(
            styles.belt,
            styles.gutterX,
            bodyTextSmall,
            (t) => ({
              fontStyle: "italic",
              fontWeight: t.font.primary.weight.medium,
            }),
            _css
          )}
        >
          <div
            css={s((t) => ({
              backgroundColor: t.color.background.feature1,
              borderLeftColor: t.color.background.feature4,
              borderLeftStyle: "solid",
              borderLeftWidth: 4,
              maxWidth: maxWidth.primary,
              ...px([t.spacing.sm, null, t.spacing.md]),
              ...py([t.spacing.xs, null, t.spacing.sm]),
            }))}
          >
            <div
              css={s({
                position: "relative",
                top: "0.1em", // Compensate for wonky leading
              })}
            >
              <RichText render={headerNote} />
            </div>
          </div>
        </aside>
      )
    : null;

  const PressBanner: FC<ComponentStyleProps> | null = [
    "Logos",
    "Logos With Links",
  ].includes(headerPressBanner ?? "")
    ? ({ _css = {} }) => (
        <div
          css={s(
            styles.paddingX,
            (t) => ({
              backgroundColor: t.color.background.feature3,
              ...py([t.spacing.xs, t.spacing.sm]),
            }),
            _css
          )}
        >
          <LandingPagePressBanner
            _css={s(styles.belt)}
            showLinks={headerPressBanner === "Logos With Links"}
          />
        </div>
      )
    : null;

  const PromoBanner: FC<ComponentStyleProps> | null =
    headerPromoBanner && hasContent(headerPromoBanner)
      ? ({ _css = {} }) => (
          <p
            css={s(
              headingCharlieStatic,
              (t) => ({
                backgroundColor: t.color.background.feature5,
                lineHeight: "24px",
                ...py(t.spacing.xs),
                textAlign: "center",
              }),
              _css
            )}
          >
            <RichTextFragment
              components={{
                [Elements.hyperlink]: (
                  <LinkResolver css={s({ textDecoration: "underline" })} />
                ),
              }}
              render={headerPromoBanner}
            />
          </p>
        )
      : null;

  const Author: FC<ComponentStyleProps & { authorCss?: Style }> | null = author
    ? ({ _css = {}, authorCss = {} }) => (
        <div
          css={s(
            bodyText,
            styles.gutterX,
            styles.belt,
            (t) => ({
              marginTop: [t.spacing.xl, null, t.spacing.xxl],
            }),
            _css
          )}
        >
          <BaseAuthor
            _css={s(
              (t) => ({
                borderColor: t.color.border.light,
                borderStyle: "solid",
                borderWidth: 0,
                borderBottomWidth: 1, // eslint-disable-line sort-keys
                paddingBottom: [t.spacing.md, null, t.spacing.lg],
              }),
              authorCss
            )}
            {...author}
          />
        </div>
      )
    : null;

  if (headerImageHero) {
    return (
      <header
        css={s((t) => ({ marginBottom: [t.spacing.xl, null, t.spacing.xxl] }))}
      >
        {PromoBanner && <PromoBanner />}
        <div
          css={s(
            gutter,
            (t) => ({
              backgroundColor: t.color.background.feature1,
              backgroundImage: [
                headerImageHero?.mobile
                  ? `url(${getFetchedImageUrl({
                      url: headerImageHero.mobile.url,
                      width: 1000,
                    })})`
                  : null,
                null,
                `url(${getFetchedImageUrl({
                  url: headerImageHero.url,
                  width: 2560,
                })})`,
              ],
              backgroundPosition: [
                "bottom center",
                null,
                "45% center",
                "55% center",
                "70% center",
              ],
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              color: t.color.text.dark.base,
              display: "flex",
              height: ["auto", null, "100vh"],
              justifyContent: [null, null, "middle"],
              maxHeight: ["none", null, 560, 600, 680],
            }),
            _css
          )}
        >
          {headerTitle && (
            <div
              css={s(belt, { paddingBottom: ["80%", null, 0], width: "100%" })}
            >
              <div css={s({ maxWidth: [null, null, "50%", 522] })}>
                <h1 css={s(headingAlpha)}>
                  <RichTextFragment render={headerTitle} />
                </h1>
                {headerStrapline && (
                  <div
                    css={s(bodyText, (t) => ({
                      fontSize: [18, null, 20],
                      marginTop: [t.spacing.sm, null, t.spacing.md],
                    }))}
                  >
                    <RichText render={headerStrapline} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {PressBanner && <PressBanner />}
        {InfoBanner && (
          <InfoBanner
            _css={s((t) => ({
              marginTop: t.spacing.md,
            }))}
          />
        )}
        {Note && (
          <Note
            _css={s((t) => ({
              marginTop: t.spacing.md,
            }))}
          />
        )}
        {Author && (
          <Author
            _css={s((t) => ({
              marginTop:
                InfoBanner || Note
                  ? t.spacing.md
                  : [t.spacing.xl, null, t.spacing.xxl],
            }))}
            authorCss={s(
              InfoBanner || Note
                ? (t) => ({
                    borderTopWidth: 1,
                    paddingTop: [t.spacing.md, null, t.spacing.lg],
                  })
                : {}
            )}
          />
        )}
      </header>
    );
  }

  if (headerTitle) {
    return (
      <header
        css={s(
          styles.belt,
          (t) => my([t.spacing.xl, null, t.spacing.xxl]),
          _css
        )}
      >
        <div css={s(styles.gutterX)}>
          <h1 css={s(headingAlpha)}>
            <RichTextFragment render={headerTitle} />
          </h1>
          {headerStrapline && (
            <div
              css={s(bodyText, (t) => ({
                marginTop: [t.spacing.sm, null, t.spacing.md],
              }))}
            >
              <RichText render={headerStrapline} />
            </div>
          )}
        </div>
        {InfoBanner && (
          <InfoBanner _css={s((t) => ({ marginTop: t.spacing.md }))} />
        )}
        {headerImage && (
          <div
            css={s((t) => ({
              marginTop: InfoBanner
                ? [t.spacing.lg, null, t.spacing.xl]
                : [t.spacing.xl, null, t.spacing.xxl],
            }))}
          >
            {PromoBanner && <PromoBanner />}
            <PrismicImage
              image={headerImage}
              sizes={{ maxWidth: maxWidth.primary }}
              priority
            />
          </div>
        )}
        {PressBanner && <PressBanner />}
        {Note && (
          <Note
            _css={s((t) => ({
              marginTop: t.spacing.md,
            }))}
          />
        )}
        {Author && (
          <Author
            _css={s((t) => ({
              marginTop: Note
                ? t.spacing.md
                : [t.spacing.xl, null, t.spacing.xxl],
            }))}
            authorCss={s(
              Note
                ? (t) => ({
                    borderTopWidth: 1,
                    paddingTop: [t.spacing.md, null, t.spacing.lg],
                  })
                : {}
            )}
          />
        )}
      </header>
    );
  }

  return null;
};

export default LandingPageHeader;
