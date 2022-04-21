import { initializeApollo, runServerSideQuery } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { Elements, Image, RichText, RichTextBlock } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import React, { FC } from "react";
import { Trans } from "react-i18next";

import { belt, gutterX, s, size, visuallyHidden } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import { OpinionatedRichText } from "../../cms/prismic";
import { primaryButton } from "../../ui/base/button";
import Icon from "../../ui/base/icon";
import LazyAnimation from "../../ui/base/lazy-animation";
import ResponsiveImage from "../../ui/base/responsive-image";
import {
  bodyText,
  bodyTextSmall,
  headingBravo,
  headingDelta,
  headingDeltaStatic,
} from "../../ui/base/typography";
import clock from "../../ui/icons/clock";
import play from "../../ui/icons/play";
import LeadFormEducation from "../../ui/modules/lead-form-education";
import Standard from "../../ui/templates/standard";
import {
  EducationCourseDataType,
  EducationCoursesDataType,
  Video,
} from "./education-course-types";

export type Description = RichTextBlock[] | null;

const enUsResource = {
  banner: {
    courseTitle: "What you’ll get from this course",
    episodePlay: "Play episode 1",
    episodeTitle: "EP 1 - {{title}}",
    superTitle: "Front of the pack course",
    totalVideoLength: "{{ time }} min",
    videoLength: "{{ count }} videos",
  },
  courseListing: {
    episodeCount: "Episode {{ count }}",
    title: "{{title}} Course list",
    videoLength: "{{ duration }} min",
    watchVideo: "Watch Video",
  },
};

interface EducationCoursePageProps {
  courseHandle: string;
  courseHighlights: Description;
  description: Description;
  heroImage: Image;
  klaviyoId: string;
  seoDescription: string;
  seoTitle: string;
  socialMediaDescription: string;
  socialMediaTitle: string;
  title: string;
  videos: { video: Video }[];
  youtubePlaylistUrl: string;
}

interface CourseListingProps {
  videos: { video: Video }[];
  courseHandle: string;
  title: string;
}
interface BannerProps {
  courseHandle: string;
  courseHighlights: Description | null;
  description: Description | null;
  image: Image;
  title: string;
  videos: { video: Video }[];
}

const calculateTotalVideoLength = (videos: { video: Video }[]): string => {
  let totalDuration = 0;
  videos.forEach((i) => {
    totalDuration += i.video.duration;
  });
  return Math.round(totalDuration).toString();
};

const CourseListing = ({ videos, title, courseHandle }: CourseListingProps) => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "CourseListing", enUsResource.courseListing);

  return (
    <LazyAnimation>
      <div
        css={s(gutterX, (t) => ({
          display: [null, null, null, "flex"],
          paddingBottom: t.spacing.lg,
          paddingTop: t.spacing.lg,
        }))}
      >
        <h2 css={s(visuallyHidden)}>{t("CourseListing:title", { title })}</h2>

        <ol
          css={s({
            width: "100%",
          })}
        >
          {videos.map(({ video }, index) => (
            <li
              key={video._meta.uid}
              css={s(belt, (t) => ({
                "&:last-child": {
                  borderBottom: "none",
                },
                borderBottom: `2px solid #f3f3f3`,
                overflow: "hidden",
                paddingBottom: t.spacing.lg,
                paddingTop: t.spacing.lg,
              }))}
            >
              <LazyAnimation>
                <div
                  css={s({
                    alignItems: [null, null, null, "end"],
                    display: "flex",
                    flexDirection: ["column", null, null, "row"],
                    justifyContent: [null, null, "space-between"],
                  })}
                >
                  <div
                    css={s((t) => ({
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "center",
                      padding: [t.spacing.sm, null, 0],
                    }))}
                  >
                    <h3
                      css={s(headingDelta, (t) => ({
                        marginBottom: [t.spacing.sm, null, t.spacing.md],
                        marginTop: t.spacing.xs,
                      }))}
                    >
                      <i
                        css={s(bodyTextSmall, () => ({
                          display: "block",
                        }))}
                      >
                        {t("CourseListing:episodeCount", { count: index + 1 })}
                      </i>

                      <Link to={`/learn/${courseHandle}/${video._meta.uid}`}>
                        {video.title}
                      </Link>
                    </h3>

                    <div
                      css={s(bodyText, {
                        display: "flex",
                        flexDirection: ["column", null, "row"],
                        width: ["100%", null, null, "80%"],
                      })}
                    >
                      {video.thumbnail && (
                        <div
                          css={s((t) => ({
                            height: [180, null, null, 150],
                            marginBottom: [t.spacing.md, null, null, 0],
                            maxWidth: [null, null, null, 250],
                            overflow: "hidden",
                            width: "100%",
                          }))}
                        >
                          <div
                            css={s({
                              height: "100%",
                              position: "relative",
                            })}
                          >
                            <ResponsiveImage
                              src={video.thumbnail.url}
                              alt={video.thumbnail.alt || ""}
                              sizes={{
                                width: ["100vw", "30vw"],
                              }}
                              layout="fill"
                              objectFit="cover"
                              objectPosition="center top"
                            />
                          </div>
                        </div>
                      )}

                      <OpinionatedRichText
                        render={video.summary}
                        components={{
                          [Elements.list]: (
                            <ul
                              css={s({
                                listStyle: "disc",
                                marginLeft: "1rem",
                                padding: "0 1rem",
                                width: "100%",
                              })}
                            />
                          ),
                          [Elements.listItem]: (
                            <li css={s({ marginBottom: 0 })} />
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div
                    css={s((t) => ({
                      display: "flex",
                      flexDirection: ["column", null, null, "column-reverse"],
                      justifyContent: [null, null, "flex-end"],
                      padding: [t.spacing.sm, null, 0],
                    }))}
                  >
                    <Link
                      to={`/learn/${courseHandle}/${video._meta.uid}`}
                      css={s(primaryButton(), (t) => ({
                        marginBottom: [t.spacing.sm, null, null, 0],
                        width: "100%",
                      }))}
                    >
                      <Trans i18nKey="CourseListing:watchVideo" />
                    </Link>

                    <div
                      css={s((t) => ({
                        alignItems: "center",
                        display: "flex",
                        paddingBottom: [null, null, t.spacing.sm],
                        paddingLeft: t.spacing.xs,
                      }))}
                    >
                      <Icon
                        path={clock}
                        viewBox="0 0 23 23"
                        _css={s(size(23))}
                      />

                      <span
                        css={s((t) => ({
                          paddingLeft: t.spacing.xs,
                        }))}
                      >
                        {t("CourseListing:videoLength", {
                          duration: video.duration,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </LazyAnimation>
            </li>
          ))}
        </ol>
      </div>
    </LazyAnimation>
  );
};

const Banner = ({
  courseHighlights,
  description,
  videos,
  image,
  title,
  courseHandle,
}: BannerProps) => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "LearnBanner", enUsResource.banner);

  // Use the same `sizes` for desktop and mobile images as both
  // have the `priority` prop, but we don't want to download
  // multiple copies unnecessarily
  const bannerImageSize = {
    maxWidth: [400, null, null, 512],
    width: ["100vw", null, null, "40vw"],
  };

  const bannerIconSize = 23;
  const sharedListItemStyle = s(bodyTextSmall, {
    marginBottom: ".5em",
  });
  const shareListStyles = {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 700,
    padding: "0 1rem",
    textAlign: "left",
  };

  return (
    <header
      css={s((t) => ({
        backgroundColor: t.color.tint.moss,
        textAlign: ["center", null, null, "left"],
      }))}
    >
      <div css={s(gutterX)}>
        <div
          css={s(belt, (t) => ({
            display: [null, null, null, "flex"],
            justifyContent: [null, null, null, "space-between"],
            marginLeft: "auto",
            marginRight: "auto",
            paddingBottom: t.spacing.lg,
            paddingTop: t.spacing.lg,
          }))}
        >
          <div
            css={s({
              display: [null, null, null, "flex"],
              flexDirection: [null, null, "column"],
              maxWidth: [null, null, null, "55%"],
            })}
          >
            <div
              aria-hidden
              css={s((t) => ({
                fontStyle: "italic",
                paddingBottom: t.spacing.xs,
              }))}
            >
              <Trans i18nKey="LearnBanner:superTitle" />
            </div>

            <h1
              css={s(headingBravo, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              {title}
            </h1>

            {description && (
              <div
                css={s(bodyText, (t) => ({
                  marginBottom: t.spacing.sm,
                }))}
              >
                <RichText render={description} />
              </div>
            )}

            <div
              css={s({
                display: ["block", null, null, "none"],
                height: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                maxHeight: 300,
                maxWidth: [550, 300],
                overflow: "hidden",
                position: "relative",
              })}
            >
              <ResponsiveImage
                src={image.url}
                alt={image.alt || ""}
                sizes={bannerImageSize}
                height={image.dimensions.height || 100}
                width={image.dimensions.width || 100}
                priority={true}
                objectPosition="center center"
              />
            </div>

            {courseHighlights && (
              <div
                css={s(bodyText, (t) => ({
                  marginTop: t.spacing.md,
                  paddingLeft: [t.spacing.md, null, null, 0],
                  paddingRight: [t.spacing.md, null, null, 0],
                }))}
              >
                <OpinionatedRichText
                  render={courseHighlights}
                  components={{
                    [Elements.heading2]: <h2 css={s(headingDeltaStatic)} />,
                    [Elements.heading3]: <h3 css={s(headingDeltaStatic)} />,
                    [Elements.list]: (
                      <ul
                        css={s({
                          ...shareListStyles,
                          listStyle: "disc outside",
                        })}
                      />
                    ),
                    [Elements.oList]: (
                      <ol
                        css={s({
                          ...shareListStyles,
                          listStyle: "decimal outside",
                        })}
                      />
                    ),
                    [Elements.listItem]: <li css={sharedListItemStyle} />,
                    [Elements.oListItem]: <li css={sharedListItemStyle} />,
                  }}
                />
              </div>
            )}

            <div
              css={s((t) => ({
                marginTop: t.spacing.md,
              }))}
            >
              <h3
                css={s(headingDeltaStatic, (t) => ({
                  marginBottom: t.spacing.md,
                }))}
              >
                {t("LearnBanner:episodeTitle", {
                  title: videos[0].video.title,
                })}
              </h3>

              <div
                css={s({
                  alignItems: "center",
                  display: "flex",
                  flexDirection: ["column", null, null, "row"],
                })}
              >
                <Link
                  css={s(primaryButton())}
                  to={`/learn/${courseHandle}/${videos[0].video._meta.uid}`}
                >
                  {t("LearnBanner:episodePlay")}
                </Link>

                <ul
                  css={s((t) => ({
                    alignItems: [null, null, null, "center"],
                    display: "flex",
                    marginLeft: [null, null, null, t.spacing.md],
                    marginTop: [t.spacing.md, null, null, 0],
                  }))}
                >
                  <li>
                    <Icon
                      path={play}
                      viewBox="0 0 23 23"
                      _css={s(size(bannerIconSize))}
                    />
                    <span
                      css={s((t) => ({
                        paddingLeft: t.spacing.xs,
                        paddingRight: t.spacing.sm,
                      }))}
                    >
                      {t("LearnBanner:videoLength", { count: videos.length })}
                    </span>
                  </li>

                  <li
                    css={s({
                      alignItems: "center",
                      display: "flex",
                    })}
                  >
                    <Icon
                      path={clock}
                      viewBox="0 0 23 23"
                      _css={s(size(bannerIconSize))}
                    />
                    <span
                      css={s((t) => ({
                        paddingLeft: t.spacing.xs,
                      }))}
                    >
                      {t("LearnBanner:totalVideoLength", {
                        time: calculateTotalVideoLength(videos),
                      })}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <aside
            css={s({
              display: ["none", null, null, "flex"],
              width: "40%",
            })}
          >
            <div
              css={s({
                position: "relative",
                width: "100%",
              })}
            >
              <ResponsiveImage
                src={image.url}
                alt={image.alt || ""}
                sizes={bannerImageSize}
                layout="fill"
                objectFit="cover"
                priority={true}
              />
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
};

const EducationCoursePage: FC<EducationCoursePageProps> = ({
  courseHandle,
  courseHighlights,
  description,
  heroImage,
  klaviyoId,
  seoDescription,
  seoTitle,
  socialMediaDescription,
  socialMediaTitle,
  title,
  videos,
  youtubePlaylistUrl,
}) => {
  return (
    <>
      <Metadata
        title={seoTitle}
        openGraph={{
          description: socialMediaDescription || seoDescription,
          title: socialMediaTitle || seoTitle,
        }}
        description={seoDescription}
      />
      <Standard>
        <Banner
          courseHandle={courseHandle}
          courseHighlights={courseHighlights}
          description={description}
          image={heroImage}
          title={title}
          videos={videos}
        />

        <LeadFormEducation
          event="dl_subscribe_education"
          klaviyoList={klaviyoId}
          source={`education-course-${courseHandle}`}
          playlistUrl={youtubePlaylistUrl}
        />
        <CourseListing
          videos={videos}
          courseHandle={courseHandle}
          title={title}
        />
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

  const paths = data.educationCourses.edges.map(
    ({
      node: {
        _meta: { uid },
      },
    }) => ({
      params: { courseHandle: uid },
    })
  );

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps = makeStaticPropsGetter(async ({ params }) => {
  if (!params?.courseHandle) throw new Error('Missing "courseHandle" param');

  const apolloClient = initializeApollo({});
  const { QUERY_EDUCATION_COURSE } = await import("./education-course-queries");

  const {
    data: { educationCourse },
  } = await runServerSideQuery<EducationCourseDataType>(apolloClient, {
    query: QUERY_EDUCATION_COURSE,
    variables: {
      id: params.courseHandle,
    },
  });

  const {
    _meta: { uid },
    courseHighlights,
    description,
    heroImage,
    klaviyoId,
    seoDescription,
    seoTitle,
    socialMediaDescription,
    socialMediaTitle,
    title,
    videos,
    youtubePlaylistUrl,
  } = educationCourse;

  return {
    props: {
      courseHandle: uid,
      courseHighlights,
      description,
      heroImage,
      klaviyoId,
      seoDescription,
      seoTitle,
      socialMediaDescription,
      socialMediaTitle,
      title,
      videos,
      youtubePlaylistUrl,
    },
    revalidate: 5 * 60,
  };
});

export default EducationCoursePage;
