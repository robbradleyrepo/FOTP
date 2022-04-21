import { initializeApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { RichText } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { Trans } from "react-i18next";
import { JsonLd } from "react-schemaorg";
import { BreadcrumbList } from "schema-dts";

import {
  FacebookShareLink,
  TwitterShareLink,
  WhatsAppShareLink,
} from "@/common/share-links";
import { belt, gutterX, linkReverse, ratio, s, size } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import { OpinionatedRichText } from "../../cms/prismic";
import { textButton } from "../../ui/base/button";
import Icon from "../../ui/base/icon";
import ResponsiveImage from "../../ui/base/responsive-image";
import {
  bodyTextExtraSmall,
  bodyTextSmall,
  bodyTextSmallStatic,
  headingBravo,
  headingDelta,
  headingDeltaStatic,
} from "../../ui/base/typography";
import facebook from "../../ui/icons/facebook";
import nextArrow from "../../ui/icons/nextArrow";
import twitter from "../../ui/icons/twitter";
import whatsapp from "../../ui/icons/whatsapp";
import LeadFormEducation from "../../ui/modules/lead-form-education";
import Standard from "../../ui/templates/standard";
import {
  EducationCourseDataType,
  EducationCoursesDataType,
  Expert,
  Video,
} from "./education-course-types";

interface Props {
  courseHandle: string;
  courseTitle: string;
  episode: Video;
  episodeCount: number;
  episodeNumber: number;
  expert: Expert;
  klaviyoId: string;
  nextEpisode: Video | null;
  youtubePlaylistUrl: string;
}

interface NextCourseLinkProps {
  courseStepTitle: string;
  link: string;
  nextStepTitle: string;
  isNextEpisode: boolean;
}

const enUsResource = {
  back: "Back to course overview",
  breadcrumbNext: "EP {{ episodeNumber }} - {{title}}",
  complete: "Course complete",
  episodeNumber: "Episode {{ episodeNumber }}",
  readBio: "Read Bio",
  shareWithFriends: "Share with your friends",
  step: "Episode {{episodeNumber}} of {{episodeCount}}",
  watchNext: "Watch Next",
};

interface StaticPath {
  params: { courseHandle: string; episodeHandle: string };
}

interface SocialLinksProps {
  shareText: string;
  title: string;
}

const SocialLinks: FC<SocialLinksProps> = ({ shareText, title }) => {
  const { asPath } = useRouter();

  const shareLink = `${process.env.ORIGIN}${asPath}`;
  const sharedIconSize = size(32);
  const sharedViewBox = "0 0 100 100";

  return (
    <div>
      <h2
        css={s(bodyTextSmallStatic, (t) => ({
          fontFamily: t.font.secondary.family,
          fontStyle: "italic",
          fontWeight: t.font.secondary.weight.book,
          marginBottom: t.spacing.sm,
        }))}
      >
        {title}:
      </h2>
      <ul
        css={s({
          display: "flex",
          justifyContent: "space-between",
          width: 120,
        })}
      >
        <li>
          <FacebookShareLink url={shareLink} css={s({ color: "#1877F2" })}>
            <Icon
              _css={s(sharedIconSize)}
              path={facebook}
              title="Facebook"
              viewBox={sharedViewBox}
            />
          </FacebookShareLink>
        </li>
        <li>
          <TwitterShareLink
            text={shareText}
            url={shareLink}
            css={s({ color: "#1DA1F2" })}
          >
            <Icon
              _css={s(sharedIconSize)}
              path={twitter}
              title="Twitter"
              viewBox={sharedViewBox}
            />
          </TwitterShareLink>
        </li>
        <li>
          <WhatsAppShareLink
            text={shareText + " " + shareLink}
            css={s({ color: "#25D366" })}
          >
            <Icon
              _css={s(sharedIconSize)}
              path={whatsapp}
              title="WhatsApp"
              viewBox={sharedViewBox}
            />
          </WhatsAppShareLink>
        </li>
      </ul>
    </div>
  );
};

const NextCourseLink: FC<NextCourseLinkProps> = ({
  courseStepTitle,
  link,
  nextStepTitle,
  isNextEpisode,
}) => (
  <Link
    to={link}
    css={s((t) => ({
      "&:focus, &:hover": {
        boxShadow: "0 4px 10px 0 rgba(24, 83, 65, 0.3)",
        transform: "translateY(-1px)",
      },
      border: `1px solid ${t.color.tint.algae}`,
      display: "block",
      padding: t.spacing.sm,
      transition: "box-shadow 250ms, transform 150ms",
    }))}
  >
    <i>{courseStepTitle}</i>

    <h2
      css={s(headingDeltaStatic, (t) => ({
        paddingBottom: t.spacing.sm,
        paddingTop: t.spacing.xs,
      }))}
    >
      {nextStepTitle}
    </h2>

    {isNextEpisode && (
      <div>
        <strong
          css={s(bodyTextExtraSmall, (t) => ({
            fontWeight: t.font.secondary.weight.bold,
            paddingRight: ".5rem",
          }))}
        >
          <Trans i18nKey="EducationCourseEpisode:watchNext" />
        </strong>
        <Icon
          path={nextArrow}
          viewBox="0 0 52 12"
          _css={s({
            height: 11,
            width: 50,
          })}
        />
      </div>
    )}
  </Link>
);

const baseUrl = process.env.ORIGIN;

const EducationCourseEpisodePage: FC<Props> = ({
  courseHandle,
  courseTitle,
  episode,
  episodeCount,
  episodeNumber,
  expert,
  klaviyoId,
  nextEpisode,
  youtubePlaylistUrl,
}) => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "EducationCourseEpisode", enUsResource);

  const courseLink = `/learn/${courseHandle}`;
  const fullCourseLink = `${baseUrl}/${courseLink}`;

  const nextCourseLinkProps = nextEpisode
    ? {
        courseStepTitle: t("EducationCourseEpisode:episodeNumber", {
          episodeNumber: episodeNumber + 1,
        }),
        isNextEpisode: nextEpisode !== null,
        link: `${courseLink}/${nextEpisode._meta.uid}`,
        nextStepTitle: nextEpisode.title,
      }
    : {
        courseStepTitle: t("EducationCourseEpisode:complete"),
        isNextEpisode: nextEpisode !== null,
        link: courseLink,
        nextStepTitle: t("EducationCourseEpisode:back"),
      };

  return (
    <>
      <Metadata
        title={episode.seoTitle}
        openGraph={{
          description: episode.socialMediaDescription || episode.seoDescription,
          title: episode.socialMediaTitle || episode.seoTitle,
        }}
        description={episode.seoDescription}
      />

      <JsonLd<BreadcrumbList>
        item={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              item: fullCourseLink,
              name: courseTitle,
              position: 1,
            },
            {
              "@type": "ListItem",
              item: `${fullCourseLink}/${episode._meta.uid}`,
              name: episode.title,
              position: 2,
            },
          ],
        }}
      />

      <Standard>
        <nav css={s(gutterX)}>
          <div css={s(belt)}>
            <ul
              css={s(bodyTextSmall, (t) => ({
                display: "flex",
                flexWrap: "wrap",
                justifyContent: ["center", null, null, "start"],
                marginBottom: t.spacing.xl,
                paddingTop: t.spacing.xl,
              }))}
            >
              <li css={s({ paddingRight: ".3rem" })}>
                <Link css={s(linkReverse)} to={courseLink}>
                  {courseTitle}
                </Link>
                {" /"}
              </li>
              <li>
                <strong>
                  {t("EducationCourseEpisode:breadcrumbNext", {
                    episodeNumber,
                    title: episode?.title,
                  })}
                </strong>
              </li>
            </ul>
          </div>
        </nav>

        <div>
          <article>
            <header
              css={s(gutterX, {
                flexDirection: "column-reverse",
              })}
            >
              <div css={s(belt)}>
                <p
                  css={s({
                    fontStyle: "italic",
                    textAlign: ["center", null, "left"],
                  })}
                >
                  {t("EducationCourseEpisode:step", {
                    episodeCount,
                    episodeNumber,
                  })}
                </p>

                <h1
                  css={s(headingBravo, (t) => ({
                    paddingBottom: t.spacing.md,
                    textAlign: ["center", null, "left"],
                  }))}
                >
                  {episode.title}
                </h1>
              </div>
            </header>

            <section css={s(gutterX)}>
              <div
                css={s(belt, {
                  alignItems: "flex-end",
                  display: "flex",
                  flexDirection: ["column", null, "row"],
                  justifyContent: [null, null, "space-between"],
                })}
              >
                <div css={s(ratio(9 / 16), { width: ["100%", null, "70%"] })}>
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${episode?.youtubeId}`}
                    title={courseTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <nav
                  css={s((t) => ({
                    display: "block",
                    paddingTop: [t.spacing.xl, null, null, 0],
                    width: ["100%", null, "26%"],
                  }))}
                >
                  <NextCourseLink {...nextCourseLinkProps} />
                </nav>
              </div>
            </section>

            <div
              css={s((t) => ({
                marginTop: t.spacing.xl,
              }))}
            >
              <LeadFormEducation
                event="dl_subscribe_education_episode"
                klaviyoList={klaviyoId}
                source={`education-course-${courseHandle}`}
                playlistUrl={youtubePlaylistUrl}
              />
            </div>

            <div css={s(gutterX)}>
              <div css={s(belt, { maxWidth: 900 })}>
                <OpinionatedRichText render={episode.description} />
              </div>
            </div>
          </article>

          <div css={s(gutterX)}>
            <aside
              css={s(belt, (t) => ({
                display: "flex",
                flexDirection: ["column", null, "row"],
                justifyContent: "space-between",
                marginTop: t.spacing.xl,
                maxWidth: 900,
                paddingBottom: t.spacing.xl,
              }))}
            >
              <div
                css={s((t) => ({
                  height: 300,
                  marginBottom: [t.spacing.md, null, null, 0],
                  position: "relative",
                  width: ["100%", null, "30%"],
                }))}
              >
                <ResponsiveImage
                  src={expert.image.url}
                  alt={expert.image.alt || ""}
                  sizes={{
                    width: ["100vw", null, null, "20vw"],
                  }}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top center"
                />
              </div>

              <div
                css={s({
                  width: ["100%", null, "65%"],
                })}
              >
                <header>
                  <div
                    css={s(headingDelta, (t) => ({
                      paddingBottom: t.spacing.xs,
                    }))}
                  >
                    <RichText render={expert.name} />
                  </div>

                  <i>
                    <RichText render={expert.role} />
                  </i>
                </header>

                <OpinionatedRichText render={expert.summary} />

                <Link
                  to={`/science/experts/${expert._meta.uid}`}
                  css={s(textButton())}
                >
                  <Trans i18nKey="EducationCourseEpisode:readBio" />
                </Link>
              </div>
            </aside>
          </div>

          <aside css={s(gutterX)}>
            <div
              css={s(belt, (t) => ({
                marginBottom: t.spacing.xxl,
                maxWidth: 900,
              }))}
            >
              <SocialLinks
                shareText={courseTitle}
                title={t("EducationCourseEpisode:shareWithFriends")}
              />
            </div>
          </aside>
        </div>
      </Standard>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo({});

  const { QUERY_EDUCATION_COURSES } = await import(
    "./education-course-queries"
  );

  const { data } = await runServerSideQuery<EducationCoursesDataType>(
    apolloClient,
    {
      query: QUERY_EDUCATION_COURSES,
    }
  );

  const paths: StaticPath[] = [];

  data.educationCourses.edges.forEach(
    ({
      node: {
        _meta: { uid },
        videos,
      },
    }) => {
      videos.forEach(({ video }) => {
        paths.push({
          params: {
            courseHandle: uid,
            episodeHandle: video._meta.uid,
          },
        });
      });
    }
  );

  return {
    fallback: "blocking",
    // We're only prerendering a single page to keep the build speedy.
    paths: paths.slice(0, 1) ?? [],
  };
};

export const getStaticProps = makeStaticPropsGetter<Props>(
  async ({ params }) => {
    if (!params?.courseHandle || !params.episodeHandle) {
      throw new Error('Missing "courseHandle or episodeHandle" param');
    }

    const apolloClient = initializeApollo({});
    const { QUERY_EDUCATION_COURSE } = await import(
      "./education-course-queries"
    );

    const {
      data: { educationCourse },
    } = await runServerSideQuery<EducationCourseDataType>(apolloClient, {
      query: QUERY_EDUCATION_COURSE,
      variables: {
        id: params.courseHandle,
      },
    });

    const episodeCount = educationCourse.videos.length;
    const episodeIndex = educationCourse.videos.findIndex(
      ({ video }) => video._meta.uid === params.episodeHandle
    );

    if (episodeIndex === -1) {
      return { notFound: true };
    }

    const {
      _meta: { uid },
      expert,
      klaviyoId,
      title,
      videos,
      youtubePlaylistUrl,
    } = educationCourse;

    const episode = videos[episodeIndex].video;
    const episodeNumber = episodeIndex + 1;
    const nextEpisode =
      episodeNumber !== episodeCount ? videos[episodeIndex + 1].video : null;

    return {
      props: {
        courseHandle: uid,
        courseTitle: title,
        episode,
        episodeCount,
        episodeNumber,
        expert,
        klaviyoId,
        nextEpisode,
        youtubePlaylistUrl,
      },
      revalidate: 5 * 60,
    };
  }
);

export default EducationCourseEpisodePage;
